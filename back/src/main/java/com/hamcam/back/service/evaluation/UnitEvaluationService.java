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
import java.util.Map;
import java.util.stream.Collectors;

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
     * AI 피드백 생성 (등급별 맞춤형 학습계획 포함)
     */
    private AiFeedback generateAiFeedback(UnitEvaluation evaluation, List<EvaluationAnswer> wrongAnswers) {
        try {
            // 기본 평가 피드백 생성
            String feedbackContent = geminiService.generateEvaluationFeedback(evaluation, wrongAnswers);
            
            // 등급별 맞춤형 학습계획 생성
            String personalizedPlan = geminiService.generatePersonalizedStudyPlan(
                evaluation.getUser(), evaluation, wrongAnswers
            );
            
            // 약점 개념 추출 (틀린 문제 기반)
            String weakConcepts = extractWeakConcepts(wrongAnswers);
            
            // 학습 권장사항 생성
            String studyRecommendations = generateStudyRecommendations(evaluation.getUser().getGrade(), wrongAnswers);
            
            // 예상 학습시간 계산 (등급별 차등)
            int estimatedTime = calculateEstimatedStudyTime(evaluation.getUser().getGrade(), wrongAnswers.size());
            
            AiFeedback feedback = AiFeedback.builder()
                    .evaluation(evaluation)
                    .overallAnalysis(feedbackContent)
                    .weakConcepts(weakConcepts)
                    .studyRecommendations(studyRecommendations)
                    .futurePlan(personalizedPlan) // 맞춤형 학습계획 적용
                    .estimatedStudyTime(estimatedTime)
                    .build();

            return aiFeedbackRepository.save(feedback);
        } catch (Exception e) {
            log.error("AI 피드백 생성 실패", e);
            return null;
        }
    }
    
    /**
     * 틀린 문제에서 약점 개념 추출
     */
    private String extractWeakConcepts(List<EvaluationAnswer> wrongAnswers) {
        if (wrongAnswers.isEmpty()) {
            return "모든 문제를 정답으로 해결했습니다.";
        }
        
        Map<String, Long> conceptCount = wrongAnswers.stream()
            .collect(Collectors.groupingBy(
                answer -> answer.getDifficulty(), 
                Collectors.counting()
            ));
            
        StringBuilder concepts = new StringBuilder();
        conceptCount.forEach((difficulty, count) -> {
            switch (difficulty) {
                case "easy" -> concepts.append(String.format("기본 개념 (%d문제), ", count));
                case "medium" -> concepts.append(String.format("응용 문제 (%d문제), ", count));
                case "hard" -> concepts.append(String.format("고난도 문제 (%d문제), ", count));
            }
        });
        
        return concepts.length() > 0 ? concepts.substring(0, concepts.length() - 2) : "분석 완료";
    }
    
    /**
     * 등급별 학습 권장사항 생성
     */
    private String generateStudyRecommendations(Integer grade, List<EvaluationAnswer> wrongAnswers) {
        int userGrade = grade != null ? grade : 5;
        int wrongCount = wrongAnswers.size();
        
        StringBuilder recommendations = new StringBuilder();
        
        if (userGrade <= 2) {
            recommendations.append("• 고난도 문제 해결 능력 강화\n")
                           .append("• 시간 내 정확도 향상 연습\n")
                           .append("• 새로운 문제 유형 도전");
        } else if (userGrade <= 4) {
            recommendations.append("• 기본 개념 완전 정착\n")
                           .append("• 중간 난이도 문제 반복 연습\n")
                           .append("• 실수 방지 습관 형성");
        } else {
            recommendations.append("• 기초 개념부터 차근차근 학습\n")
                           .append("• 쉬운 문제 완전 정복\n")
                           .append("• 꾸준한 반복 학습");
        }
        
        if (wrongCount > 5) {
            recommendations.append("\n• 기본기 다지기 집중 필요");
        }
        
        return recommendations.toString();
    }
    
    /**
     * 등급별 예상 학습시간 계산
     */
    private int calculateEstimatedStudyTime(Integer grade, int wrongCount) {
        int userGrade = grade != null ? grade : 5;
        
        // 기본 시간 (분)
        int baseTime = switch (userGrade) {
            case 1, 2 -> 90;  // 상위권: 심화 학습
            case 3, 4 -> 120; // 중위권: 개념 정리 + 연습
            case 5 -> 150;    // 하위권: 기초부터 차근차근
            default -> 120;
        };
        
        // 틀린 문제 수에 따른 추가 시간
        int additionalTime = wrongCount * 15;
        
        return Math.min(baseTime + additionalTime, 300); // 최대 5시간
    }
    
    /**
     * 평가 결과를 데이터베이스에 저장 (수학 평가용)
     */
    @Transactional
    public Long saveEvaluationResult(Long userId, String unitName, double score, 
                                   int correctCount, int totalCount,
                                   Map<String, Object> difficultyScores,
                                   List<Map<String, Object>> wrongAnswers) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Unit unit = unitRepository.findByUnit(unitName)
                .orElse(Unit.builder()
                        .unit(unitName)
                        .subject("수학")
                        .build());

        if (unit.getId() == null) {
            unit = unitRepository.save(unit);
        }

        // 평가 생성
        UnitEvaluation evaluation = UnitEvaluation.builder()
                .user(user)
                .unit(unit)
                .startedAt(LocalDateTime.now().minusMinutes(30)) // 30분 전 시작으로 가정
                .totalQuestions(totalCount)
                .correctAnswers(correctCount)
                .score((double) Math.round((correctCount / (double) totalCount) * 100))
                .completedAt(LocalDateTime.now())
                .isCompleted(true)
                .build();

        // 난이도별 점수 설정
        if (difficultyScores != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> easy = (Map<String, Object>) difficultyScores.get("easy");
            @SuppressWarnings("unchecked")
            Map<String, Object> medium = (Map<String, Object>) difficultyScores.get("medium");
            @SuppressWarnings("unchecked")
            Map<String, Object> hard = (Map<String, Object>) difficultyScores.get("hard");

            if (easy != null) evaluation.setEasyCorrect((Integer) easy.get("correct"));
            if (medium != null) evaluation.setMediumCorrect((Integer) medium.get("correct"));
            if (hard != null) evaluation.setHardCorrect((Integer) hard.get("correct"));
        }

        evaluation = unitEvaluationRepository.save(evaluation);

        // 학생 레벨 업데이트
        updateStudentLevel(user, evaluation);

        return evaluation.getId();
    }

    /**
     * 사용자의 최근 평가 기반 맞춤형 학습계획 조회
     */
    @Transactional(readOnly = true)
    public String getPersonalizedStudyPlan(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 최근 완료된 평가 조회
        List<UnitEvaluation> recentEvaluations = unitEvaluationRepository
                .findByUserAndIsCompletedTrueOrderByCompletedAtDesc(user);

        if (recentEvaluations.isEmpty()) {
            return null; // 평가 기록이 없음
        }

        // 가장 최근 평가 선택
        UnitEvaluation latestEvaluation = recentEvaluations.get(0);

        // 해당 평가의 틀린 답안들 조회
        List<EvaluationAnswer> wrongAnswers = evaluationAnswerRepository
                .findByEvaluationAndIsCorrectFalse(latestEvaluation);

        // 맞춤형 학습계획 생성
        return geminiService.generatePersonalizedStudyPlan(user, latestEvaluation, wrongAnswers);
    }
}