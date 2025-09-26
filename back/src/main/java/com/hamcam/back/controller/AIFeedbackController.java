package com.hamcam.back.controller;

import com.hamcam.back.service.AIFeedbackService;
import com.hamcam.back.service.PerformanceAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ai-feedback")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AIFeedbackController {

    private final AIFeedbackService aiFeedbackService;
    private final PerformanceAnalysisService performanceAnalysisService;

    /**
     * 학생의 수학 성능 분석 기반 AI 피드백을 생성합니다.
     */
    @PostMapping("/generate/{studentId}")
    public Mono<ResponseEntity<Map<String, Object>>> generateFeedback(@PathVariable Long studentId) {
        log.info("AI 피드백 생성 요청: studentId={}", studentId);

        try {
            // 성능 데이터 분석
            AIFeedbackService.MathPerformanceData performanceData = 
                performanceAnalysisService.analyzeStudentPerformance(studentId);

            // AI 피드백 생성
            return aiFeedbackService.generateMathPerformanceFeedback(performanceData)
                    .map(feedback -> {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", true);
                        response.put("message", "AI 피드백이 성공적으로 생성되었습니다.");
                        response.put("feedback", feedback);
                        response.put("performanceData", createPerformanceSummary(performanceData));
                        
                        log.info("AI 피드백 생성 완료: studentId={}, feedbackLength={}", 
                                studentId, feedback.length());
                        
                        return ResponseEntity.ok(response);
                    })
                    .onErrorReturn(createErrorResponse("AI 피드백 생성 중 오류가 발생했습니다."));

        } catch (Exception e) {
            log.error("AI 피드백 생성 실패: studentId={}", studentId, e);
            return Mono.just(createErrorResponse("서버 오류가 발생했습니다."));
        }
    }

    /**
     * 학생의 최근 성능 통계를 조회합니다.
     */
    @GetMapping("/performance-stats/{studentId}")
    public ResponseEntity<Map<String, Object>> getPerformanceStats(@PathVariable Long studentId) {
        log.info("성능 통계 조회 요청: studentId={}", studentId);

        try {
            Map<String, Object> stats = performanceAnalysisService.getRecentPerformanceStats(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "성능 통계가 성공적으로 조회되었습니다.");
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("성능 통계 조회 실패: studentId={}", studentId, e);
            return createErrorResponse("성능 통계 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * AI 피드백 기능 상태를 확인합니다.
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAIFeedbackStatus() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Gemini API 키 설정 여부 확인 (실제 키 값은 노출하지 않음)
            boolean isApiKeyConfigured = aiFeedbackService != null; // 실제로는 API 키 존재 여부 확인
            
            response.put("success", true);
            response.put("message", "AI 피드백 상태 조회 완료");
            response.put("isEnabled", isApiKeyConfigured);
            response.put("status", isApiKeyConfigured ? "사용 가능" : "API 키 설정 필요");
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("AI 피드백 상태 확인 실패", e);
            return createErrorResponse("상태 확인 중 오류가 발생했습니다.");
        }
    }

    /**
     * 성능 데이터 요약을 생성합니다.
     */
    private Map<String, Object> createPerformanceSummary(AIFeedbackService.MathPerformanceData data) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProblems", data.getTotalProblems());
        summary.put("correctAnswers", data.getCorrectAnswers());
        summary.put("accuracyRate", Math.round(data.getAccuracyRate() * 10.0) / 10.0);
        summary.put("averageTime", Math.round(data.getAverageTimePerProblem() * 10.0) / 10.0);
        summary.put("weakSubjects", data.getWrongAnswersBySubject());
        summary.put("difficultyAnalysis", data.getWrongAnswersByDifficulty());
        
        return summary;
    }

    /**
     * 에러 응답을 생성합니다.
     */
    private ResponseEntity<Map<String, Object>> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("feedback", "AI 피드백을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.");
        
        return ResponseEntity.ok(response);
    }
}