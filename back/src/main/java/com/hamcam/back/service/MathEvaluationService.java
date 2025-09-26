package com.hamcam.back.service;

import com.hamcam.back.entity.MathProblem;
import com.hamcam.back.entity.MathProblemAttempt;
import com.hamcam.back.entity.Student;
import com.hamcam.back.repository.MathProblemRepository;
import com.hamcam.back.repository.MathProblemAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MathEvaluationService {

    private final MathProblemRepository mathProblemRepository;
    private final MathProblemAttemptRepository attemptRepository;

    /**
     * 평가용 문제 세트 생성 (난이도별로 균등하게)
     */
    @Transactional(readOnly = true)
    public List<MathProblem> generateEvaluationProblemSet(String subject, int totalCount) {
        List<MathProblem> problems = new ArrayList<>();
        
        // 각 난이도별로 문제 배분 (5등급=쉬움, 3등급=보통, 1등급=어려움)
        int easyCount = totalCount / 3;
        int mediumCount = totalCount / 3;
        int hardCount = totalCount - easyCount - mediumCount;

        try {
            // 쉬운 문제 (5등급)
            List<MathProblem> easyProblems = mathProblemRepository
                .findRandomProblemsByDifficultyGrade(5, easyCount);
            problems.addAll(easyProblems);

            // 보통 문제 (3등급)
            List<MathProblem> mediumProblems = mathProblemRepository
                .findRandomProblemsByDifficultyGrade(3, mediumCount);
            problems.addAll(mediumProblems);

            // 어려운 문제 (1등급)
            List<MathProblem> hardProblems = mathProblemRepository
                .findRandomProblemsByDifficultyGrade(1, hardCount);
            problems.addAll(hardProblems);

            log.info("평가 문제 세트 생성 완료: 총 {}개 (쉬움: {}, 보통: {}, 어려움: {})", 
                problems.size(), easyProblems.size(), mediumProblems.size(), hardProblems.size());

        } catch (Exception e) {
            log.error("평가 문제 세트 생성 중 오류 발생: {}", e.getMessage());
            // 오류 발생 시 전체 문제에서 랜덤 선택
            problems = mathProblemRepository.findRandomProblemsByDifficultyRange(1, 5, totalCount);
        }

        return problems;
    }

    /**
     * 학생의 답안 제출 및 채점
     */
    public MathProblemAttempt submitAnswer(Student student, MathProblem problem, String submittedAnswer) {
        boolean isCorrect = problem.isCorrect(submittedAnswer);
        
        MathProblemAttempt attempt = MathProblemAttempt.builder()
            .student(student)
            .mathProblem(problem)
            .studentAnswer(submittedAnswer)
            .isCorrect(isCorrect)
            .type(MathProblemAttempt.AttemptType.EVALUATION)
            .timeSpent(0) // 기본값
            .attemptsCount(1) // 기본값
            .build();

        MathProblemAttempt savedAttempt = attemptRepository.save(attempt);
        
        log.info("답안 제출 완료 - 학생: {}, 문제: {}, 정답여부: {}", 
            student.getId(), problem.getId(), isCorrect);
            
        return savedAttempt;
    }

    /**
     * 학생의 평가 결과 조회
     */
    @Transactional(readOnly = true)
    public List<MathProblemAttempt> getEvaluationResults(Student student) {
        return attemptRepository.findByStudentAndTypeOrderByAttemptedAtDesc(
            student, MathProblemAttempt.AttemptType.EVALUATION);
    }

    /**
     * 학생의 정답률 계산
     */
    @Transactional(readOnly = true)
    public double calculateAccuracyRate(Student student) {
        Long totalAttempts = attemptRepository.countByStudent(student);
        if (totalAttempts == 0) {
            return 0.0;
        }
        
        Long correctAttempts = attemptRepository.countByStudentAndIsCorrect(student, true);
        return (correctAttempts.doubleValue() / totalAttempts.doubleValue()) * 100.0;
    }
}