package com.hamcam.back.controller.evaluation;

import com.hamcam.back.service.evaluation.GeminiService;
import com.hamcam.back.service.evaluation.UnitEvaluationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

/**
 * 수학 평가 분석 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/math-evaluation")
@RequiredArgsConstructor
public class MathEvaluationController {

    private final GeminiService geminiService;
    private final UnitEvaluationService unitEvaluationService;

    /**
     * Gemini API를 활용한 수학 평가 결과 실시간 분석
     */
    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeMathEvaluation(
            @RequestBody MathEvaluationAnalysisRequest request,
            HttpSession session) {
        
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            log.info("수학 평가 결과 분석 요청 - 사용자: {}, 등급: {}, 점수: {}", 
                userId, request.getUserGrade(), request.getScore());

                        // 평가 결과를 데이터베이스에 저장
            unitEvaluationService.saveEvaluationResult(
                userId,
                request.getUnitName(),
                request.getScore(),
                request.getCorrectCount(),
                request.getTotalCount(),
                request.getDifficultyScores(),
                request.getWrongAnswers()
            );

            // Gemini API를 통한 분석 생성
            String analysis = geminiService.generateMathEvaluationAnalysis(
                request.getUserGrade(),
                request.getScore(),
                request.getCorrectCount(),
                request.getTotalCount(),
                request.getDifficultyScores(),
                request.getWrongAnswers(),
                request.getUnitName()
            );

            return ResponseEntity.ok(analysis);

        } catch (Exception e) {
            log.error("수학 평가 결과 분석 실패", e);
            
            String errorMessage = "분석 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n" +
                                "기본 분석 결과를 확인해주세요.";
            
            return ResponseEntity.status(500).body(errorMessage);
        }
    }

    /**
     * 상세한 학습 로드맵 및 개념별 분석 제공
     */
    @PostMapping("/detailed-analysis")
    public ResponseEntity<String> getDetailedAnalysis(
            @RequestBody MathEvaluationAnalysisRequest request,
            HttpSession session) {
        
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            log.info("상세 수학 평가 분석 요청 - 사용자: {}, 등급: {}", userId, request.getUserGrade());

            // 더 상세한 분석 생성 (학습 로드맵, 개념별 우선순위 포함)
            String detailedAnalysis = geminiService.generateDetailedLearningRoadmap(
                request.getUserGrade(),
                request.getScore(),
                request.getCorrectCount(),
                request.getTotalCount(),
                request.getDifficultyScores(),
                request.getWrongAnswers(),
                request.getUnitName()
            );

            return ResponseEntity.ok(detailedAnalysis);

        } catch (Exception e) {
            log.error("상세 분석 생성 실패", e);
            
            String errorMessage = "상세 분석 생성 중 오류가 발생했습니다.\n\n" +
                                "기본 분석을 먼저 확인해주세요.";
            
            return ResponseEntity.status(500).body(errorMessage);
        }
    }

    /**
     * 수학 평가 분석 요청 DTO
     */
    public static class MathEvaluationAnalysisRequest {
        private int userGrade;
        private double score;
        private int correctCount;
        private int totalCount;
        private String unitName;
        private Map<String, Object> difficultyScores;
        private List<Map<String, Object>> wrongAnswers;

        // Getters and Setters
        public int getUserGrade() { return userGrade; }
        public void setUserGrade(int userGrade) { this.userGrade = userGrade; }

        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }

        public int getCorrectCount() { return correctCount; }
        public void setCorrectCount(int correctCount) { this.correctCount = correctCount; }

        public int getTotalCount() { return totalCount; }
        public void setTotalCount(int totalCount) { this.totalCount = totalCount; }

        public String getUnitName() { return unitName; }
        public void setUnitName(String unitName) { this.unitName = unitName; }

        public Map<String, Object> getDifficultyScores() { return difficultyScores; }
        public void setDifficultyScores(Map<String, Object> difficultyScores) { this.difficultyScores = difficultyScores; }

        public List<Map<String, Object>> getWrongAnswers() { return wrongAnswers; }
        public void setWrongAnswers(List<Map<String, Object>> wrongAnswers) { this.wrongAnswers = wrongAnswers; }
    }
}