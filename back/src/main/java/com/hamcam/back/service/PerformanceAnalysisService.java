package com.hamcam.back.service;

import com.hamcam.back.entity.MathProblemAttempt;
import com.hamcam.back.entity.StudentWrongAnswer;
import com.hamcam.back.repository.MathProblemAttemptRepository;
import com.hamcam.back.repository.StudentWrongAnswerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PerformanceAnalysisService {

    private final MathProblemAttemptRepository mathProblemAttemptRepository;
    private final StudentWrongAnswerRepository studentWrongAnswerRepository;

    /**
     * 학생의 수학 성능 데이터를 분석하여 AIFeedbackService에 전달할 데이터를 생성합니다.
     */
    public AIFeedbackService.MathPerformanceData analyzeStudentPerformance(Long studentId) {
        try {
            // 학생 시도 데이터 조회 (최근 20개)
            List<MathProblemAttempt> attempts = mathProblemAttemptRepository
                    .findTop20ByStudentIdOrderByAttemptedAtDesc(studentId);
            
            // 오답 데이터 조회 (최근 20개)
            List<StudentWrongAnswer> wrongAnswers = studentWrongAnswerRepository
                    .findTop20ByStudentIdOrderByCreatedAtDesc(studentId);

            return buildPerformanceData(attempts, wrongAnswers);

        } catch (Exception e) {
            log.error("성능 분석 중 오류 발생: studentId={}", studentId, e);
            return createEmptyPerformanceData();
        }
    }

    /**
     * 최근 시도 결과를 바탕으로 성능 데이터를 구성합니다.
     */
    private AIFeedbackService.MathPerformanceData buildPerformanceData(
            List<MathProblemAttempt> attempts, 
            List<StudentWrongAnswer> wrongAnswers) {
        
        AIFeedbackService.MathPerformanceData data = new AIFeedbackService.MathPerformanceData();

        if (attempts.isEmpty()) {
            return createEmptyPerformanceData();
        }

        // 기본 통계 계산
        int totalProblems = attempts.size();
        long correctAnswers = attempts.stream()
                .mapToLong(attempt -> attempt.getIsCorrect() ? 1 : 0)
                .sum();
        
        double accuracyRate = totalProblems > 0 ? (double) correctAnswers / totalProblems * 100 : 0;
        
        long totalTimeSpent = attempts.stream()
                .mapToLong(MathProblemAttempt::getTimeSpent)
                .sum();
        
        double averageTimePerProblem = totalProblems > 0 ? (double) totalTimeSpent / totalProblems : 0;

        // 데이터 설정
        data.setTotalProblems(totalProblems);
        data.setCorrectAnswers((int) correctAnswers);
        data.setAccuracyRate(accuracyRate);
        data.setTotalTimeSpent(totalTimeSpent);
        data.setAverageTimePerProblem(averageTimePerProblem);

        // 과목별 오답 분석
        Map<String, Integer> wrongAnswersBySubject = analyzeWrongAnswersBySubject(wrongAnswers);
        data.setWrongAnswersBySubject(wrongAnswersBySubject);

        // 난이도별 오답 분석
        Map<String, Integer> wrongAnswersByDifficulty = analyzeWrongAnswersByDifficulty(wrongAnswers);
        data.setWrongAnswersByDifficulty(wrongAnswersByDifficulty);

        return data;
    }

    /**
     * 과목별 오답 개수를 분석합니다.
     */
    private Map<String, Integer> analyzeWrongAnswersBySubject(List<StudentWrongAnswer> wrongAnswers) {
        Map<String, Integer> subjectCount = new HashMap<>();
        
        for (StudentWrongAnswer wrongAnswer : wrongAnswers) {
            String subject = wrongAnswer.getMathProblem().getSubject();
            if (subject != null && !subject.trim().isEmpty()) {
                subjectCount.put(subject, subjectCount.getOrDefault(subject, 0) + 1);
            }
        }
        
        return subjectCount;
    }

    /**
     * 난이도별 오답 개수를 분석합니다.
     */
    private Map<String, Integer> analyzeWrongAnswersByDifficulty(List<StudentWrongAnswer> wrongAnswers) {
        Map<String, Integer> difficultyCount = new HashMap<>();
        
        for (StudentWrongAnswer wrongAnswer : wrongAnswers) {
            Integer difficultyGrade = wrongAnswer.getMathProblem().getDifficultyGrade();
            if (difficultyGrade != null) {
                String difficulty = difficultyGrade + "";
                difficultyCount.put(difficulty, difficultyCount.getOrDefault(difficulty, 0) + 1);
            }
        }
        
        return difficultyCount;
    }

    /**
     * 빈 성능 데이터를 생성합니다.
     */
    private AIFeedbackService.MathPerformanceData createEmptyPerformanceData() {
        AIFeedbackService.MathPerformanceData data = new AIFeedbackService.MathPerformanceData();
        data.setTotalProblems(0);
        data.setCorrectAnswers(0);
        data.setAccuracyRate(0.0);
        data.setTotalTimeSpent(0L);
        data.setAverageTimePerProblem(0.0);
        data.setWrongAnswersBySubject(new HashMap<>());
        data.setWrongAnswersByDifficulty(new HashMap<>());
        return data;
    }

    /**
     * 최근 평가 세션의 간단한 통계를 조회합니다.
     */
    public Map<String, Object> getRecentPerformanceStats(Long studentId) {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            List<MathProblemAttempt> recentAttempts = mathProblemAttemptRepository
                    .findTop20ByStudentIdOrderByAttemptedAtDesc(studentId);
            
            if (!recentAttempts.isEmpty()) {
                int totalAttempts = recentAttempts.size();
                long correctCount = recentAttempts.stream()
                        .mapToLong(attempt -> attempt.getIsCorrect() ? 1 : 0)
                        .sum();
                
                double recentAccuracy = (double) correctCount / totalAttempts * 100;
                
                stats.put("totalAttempts", totalAttempts);
                stats.put("correctAnswers", correctCount);
                stats.put("accuracy", recentAccuracy);
                stats.put("hasData", true);
            } else {
                stats.put("hasData", false);
                stats.put("message", "아직 풀이 기록이 없습니다.");
            }
            
        } catch (Exception e) {
            log.error("최근 성능 통계 조회 실패: studentId={}", studentId, e);
            stats.put("hasData", false);
            stats.put("error", "데이터 조회 중 오류가 발생했습니다.");
        }
        
        return stats;
    }
}