package com.hamcam.back.service;

import com.hamcam.back.entity.Student;
import com.hamcam.back.repository.MathProblemRepository;
import com.hamcam.back.repository.MathProblemAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MathStatisticsService {

    private final MathProblemRepository mathProblemRepository;
    private final MathProblemAttemptRepository attemptRepository;

    /**
     * 전체 문제 통계 조회
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProblemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            Long totalProblems = mathProblemRepository.count();
            stats.put("totalProblems", totalProblems);
            
            Long easyProblems = mathProblemRepository.countByDifficultyGrade(5); // 5등급 = 쉬움
            Long mediumProblems = mathProblemRepository.countByDifficultyGrade(3); // 3등급 = 보통
            Long hardProblems = mathProblemRepository.countByDifficultyGrade(1); // 1등급 = 어려움
            
            stats.put("easyProblems", easyProblems);
            stats.put("mediumProblems", mediumProblems);
            stats.put("hardProblems", hardProblems);
            
            // 과목별 문제 수
            List<String> subjects = mathProblemRepository.findDistinctSubjects();
            Map<String, Long> subjectCounts = new HashMap<>();
            for (String subject : subjects) {
                Long count = mathProblemRepository.countBySubject(subject);
                subjectCounts.put(subject, count);
            }
            stats.put("subjectCounts", subjectCounts);
            
        } catch (Exception e) {
            log.error("Statistics error: {}", e.getMessage());
            stats.put("error", "통계 조회 중 오류가 발생했습니다.");
        }
        
        return stats;
    }

    /**
     * 학생의 학습 진도 조회
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getStudentProgress(Student student) {
        Map<String, Object> progress = new HashMap<>();
        
        try {
            // 전체 정답률
            Double overallAccuracy = attemptRepository.getAccuracyRateByStudent(student);
            progress.put("overallAccuracy", overallAccuracy != null ? overallAccuracy : 0.0);
            
            // 총 시도 횟수
            Long totalAttempts = attemptRepository.countByStudent(student);
            progress.put("totalAttempts", totalAttempts);
            
            // 정답 횟수
            Long correctAttempts = attemptRepository.countByStudentAndIsCorrect(student, true);
            progress.put("correctAttempts", correctAttempts);
            
            // 과목별 정답률
            List<Object[]> subjectAccuracy = attemptRepository.getAccuracyRateBySubjectForStudent(student);
            Map<String, Double> subjectStats = new HashMap<>();
            for (Object[] row : subjectAccuracy) {
                String subject = (String) row[0];
                Double accuracy = (Double) row[1];
                subjectStats.put(subject, accuracy != null ? accuracy : 0.0);
            }
            progress.put("subjectAccuracy", subjectStats);
            
        } catch (Exception e) {
            log.error("Student progress error: {}", e.getMessage());
            progress.put("error", "학습 진도 조회 중 오류가 발생했습니다.");
        }
        
        return progress;
    }

    /**
     * 문제별 통계 조회
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProblemStatistics(Long problemId) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // 문제 조회
            var problem = mathProblemRepository.findById(problemId);
            if (problem.isEmpty()) {
                stats.put("error", "문제를 찾을 수 없습니다.");
                return stats;
            }
            
            // 정답률
            Double accuracy = attemptRepository.getAccuracyRateByProblem(problem.get());
            stats.put("accuracy", accuracy != null ? accuracy : 0.0);
            
            // 평균 소요 시간
            Double avgTime = attemptRepository.getAverageTimeSpentByProblem(problem.get());
            stats.put("averageTimeSpent", avgTime != null ? avgTime : 0.0);
            
        } catch (Exception e) {
            log.error("Problem statistics error: {}", e.getMessage());
            stats.put("error", "문제 통계 조회 중 오류가 발생했습니다.");
        }
        
        return stats;
    }
}