package com.hamcam.back.service.evaluation;

import com.hamcam.back.dto.evaluation.request.StartEvaluationRequest;
import com.hamcam.back.dto.evaluation.request.SubmitAnswersRequest;
import com.hamcam.back.dto.evaluation.response.EvaluationProblemsResponse;
import com.hamcam.back.dto.evaluation.response.EvaluationResultResponse;
import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.evaluation.*;
import com.hamcam.back.entity.study.team.Problem;
import com.hamcam.back.entity.study.team.Unit;
import com.hamcam.back.repository.auth.UserRepository;
import com.hamcam.back.repository.evaluation.*;
import com.hamcam.back.repository.study.ProblemRepository;
import com.hamcam.back.repository.study.UnitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;

/**
 * 단원평가 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UnitEvaluationService {

    private final UnitEvaluationRepository unitEvaluationRepository;
    private final EvaluationAnswerRepository evaluationAnswerRepository;
    private final StudentLevelRepository studentLevelRepository;
    private final AiFeedbackRepository aiFeedbackRepository;
    private final UserRepository userRepository;
    private final UnitRepository unitRepository;
    private final ProblemRepository problemRepository;
    private final GeminiService geminiService;
    private final Random random = new Random();

    /**
     * 단원평가 시작
     */
    @Transactional
    public EvaluationProblemsResponse startEvaluation(Long userId, StartEvaluationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() -> new IllegalArgumentException("단원을 찾을 수 없습니다."));

        // 기존 미완료 평가가 있다면 삭제
        unitEvaluationRepository.findByUserAndIsCompletedFalse(user)
                .ifPresent(unitEvaluationRepository::delete);

        // 새 평가 생성
        UnitEvaluation evaluation = UnitEvaluation.builder()
                .user(user)
                .unit(unit)
                .totalQuestions(10)
                .startedAt(LocalDateTime.now())
                .build();

        evaluation = unitEvaluationRepository.save(evaluation);

        // 난이도별 문제 선정 (3-4-3 분배)
        List<Problem> selectedProblems = selectProblemsForEvaluation(unit, request.getSubject());
        
        List<EvaluationProblemsResponse.ProblemInfo> problemInfos = new ArrayList<>();
        
        // 쉬운 문제 3개
        for (int i = 0; i < 3 && i < selectedProblems.size(); i++) {
            problemInfos.add(EvaluationProblemsResponse.ProblemInfo.from(selectedProblems.get(i), "easy"));
        }
        
        // 중간 문제 4개
        for (int i = 3; i < 7 && i < selectedProblems.size(); i++) {
            problemInfos.add(EvaluationProblemsResponse.ProblemInfo.from(selectedProblems.get(i), "medium"));
        }
        
        // 어려운 문제 3개
        for (int i = 7; i < 10 && i < selectedProblems.size(); i++) {
            problemInfos.add(EvaluationProblemsResponse.ProblemInfo.from(selectedProblems.get(i), "hard"));
        }

        return EvaluationProblemsResponse.builder()
                .evaluationId(evaluation.getId())
                .unitName(unit.getUnit())
                .subject(unit.getSubject())
                .totalQuestions(10)
                .problems(problemInfos)
                .build();
    }

    /**
     * 평가용 문제 선정 로직
     */
    private List<Problem> selectProblemsForEvaluation(Unit unit, String subject) {
        List<Problem> allProblems = problemRepository.findBySubjectAndUnit(subject, unit);
        
        if (allProblems.size() < 10) {
            throw new IllegalStateException("해당 단원의 문제가 부족합니다.");
        }

        List<Problem> selectedProblems = new ArrayList<>();
        
        // 쉬운 문제 (정답률 80% 이상)
        List<Problem> easyProblems = allProblems.stream()
                .filter(p -> p.getCorrectRate() != null && p.getCorrectRate() >= 80.0)
                .toList();
        selectedProblems.addAll(getRandomProblems(easyProblems, 3));

        // 중간 문제 (정답률 50-80%)
        List<Problem> mediumProblems = allProblems.stream()
                .filter(p -> p.getCorrectRate() != null && p.getCorrectRate() >= 50.0 && p.getCorrectRate() < 80.0)
                .toList();
        selectedProblems.addAll(getRandomProblems(mediumProblems, 4));

        // 어려운 문제 (정답률 50% 미만)
        List<Problem> hardProblems = allProblems.stream()
                .filter(p -> p.getCorrectRate() != null && p.getCorrectRate() < 50.0)
                .toList();
        selectedProblems.addAll(getRandomProblems(hardProblems, 3));

        return selectedProblems;
    }

    private List<Problem> getRandomProblems(List<Problem> problems, int count) {
        if (problems.size() <= count) {
            return new ArrayList<>(problems);
        }

        List<Problem> shuffled = new ArrayList<>(problems);
        for (int i = shuffled.size() - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            Problem temp = shuffled.get(i);
            shuffled.set(i, shuffled.get(j));
            shuffled.set(j, temp);
        }

        return shuffled.subList(0, count);
    }

    /**
     * 답안 제출 및 평가 완료
     */
    @Transactional
    public EvaluationResultResponse submitAnswers(Long userId, SubmitAnswersRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UnitEvaluation evaluation = unitEvaluationRepository.findById(request.getEvaluationId())
                .orElseThrow(() -> new IllegalArgumentException("평가를 찾을 수 없습니다."));

        if (!evaluation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        // 답안 저장 및 채점
        List<EvaluationAnswer> answers = new ArrayList<>();
        int totalCorrect = 0;
        int easyCorrect = 0, mediumCorrect = 0, hardCorrect = 0;

        for (SubmitAnswersRequest.AnswerSubmission submission : request.getAnswers()) {
            Problem problem = problemRepository.findById(submission.getProblemId())
                    .orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));

            EvaluationAnswer answer = EvaluationAnswer.builder()
                    .evaluation(evaluation)
                    .problem(problem)
                    .userAnswer(submission.getUserAnswer())
                    .difficulty(submission.getDifficulty())
                    .isCorrect(false)
                    .build();

            answer.checkAnswer();
            answers.add(evaluationAnswerRepository.save(answer));

            if (answer.getIsCorrect()) {
                totalCorrect++;
                switch (submission.getDifficulty()) {
                    case "easy" -> easyCorrect++;
                    case "medium" -> mediumCorrect++;
                    case "hard" -> hardCorrect++;
                }
            }
        }

        // 평가 결과 업데이트
        evaluation.setCorrectAnswers(totalCorrect);
        evaluation.setEasyCorrect(easyCorrect);
        evaluation.setMediumCorrect(mediumCorrect);
        evaluation.setHardCorrect(hardCorrect);
        evaluation.complete();
        
        unitEvaluationRepository.save(evaluation);

        // 학생 레벨 업데이트
        StudentLevel studentLevel = updateStudentLevel(user, evaluation);
        boolean levelUp = studentLevel.getHardStreak() >= 3 && hardCorrect == 3;
        
        // 틀린 문제들 조회
        List<EvaluationAnswer> wrongAnswers = evaluationAnswerRepository.findByEvaluationAndIsCorrectFalse(evaluation);
        
        // AI 피드백 생성 (비동기 처리 권장)
        AiFeedback aiFeedback = null;
        if (!wrongAnswers.isEmpty()) {
            aiFeedback = generateAiFeedback(evaluation, wrongAnswers);
        }

        // 난이도별 점수 정보
        EvaluationResultResponse.DifficultyScores difficultyScores = 
            EvaluationResultResponse.DifficultyScores.builder()
                .easyCorrect(easyCorrect)
                .easyTotal(3)
                .mediumCorrect(mediumCorrect)
                .mediumTotal(4)
                .hardCorrect(hardCorrect)
                .hardTotal(3)
                .build();

        return EvaluationResultResponse.from(
            evaluation, 
            wrongAnswers, 
            aiFeedback,
            levelUp,
            studentLevel.getLevelString(),
            difficultyScores
        );
    }

    /**
     * 학생 레벨 업데이트
     */
    private StudentLevel updateStudentLevel(User user, UnitEvaluation evaluation) {
        StudentLevel studentLevel = studentLevelRepository.findByUserAndUnit(user, evaluation.getUnit())
                .orElse(StudentLevel.builder()
                        .user(user)
                        .unit(evaluation.getUnit())
                        .build());

        studentLevel.updateWithEvaluation(evaluation);
        return studentLevelRepository.save(studentLevel);
    }

    /**
     * AI 피드백 생성
     */
    private AiFeedback generateAiFeedback(UnitEvaluation evaluation, List<EvaluationAnswer> wrongAnswers) {
        try {
            String feedbackContent = geminiService.generateEvaluationFeedback(evaluation, wrongAnswers);
            
            AiFeedback feedback = AiFeedback.builder()
                    .evaluation(evaluation)
                    .overallAnalysis(feedbackContent)
                    .weakConcepts("분석된 약점 개념들")
                    .studyRecommendations("학습 권장사항")
                    .futurePlan("향후 학습 계획")
                    .estimatedStudyTime(120) // 예상 학습시간(분)
                    .build();

            return aiFeedbackRepository.save(feedback);
        } catch (Exception e) {
            log.error("AI 피드백 생성 실패", e);
            return null;
        }
    }
}