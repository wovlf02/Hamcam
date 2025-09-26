package com.hamcam.back.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIFeedbackService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent}")
    private String geminiApiUrl;

    /**
     * 학생의 수학 성능 데이터를 분석하여 AI 피드백을 생성합니다.
     */
    public Mono<String> generateMathPerformanceFeedback(MathPerformanceData performanceData) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            log.warn("Gemini API 키가 설정되지 않았습니다.");
            return Mono.just("AI 피드백 기능을 사용하려면 Gemini API 키를 설정해주세요.");
        }

        try {
            String prompt = buildMathAnalysisPrompt(performanceData);
            Map<String, Object> requestBody = createGeminiRequest(prompt);

            WebClient webClient = webClientBuilder
                    .baseUrl(geminiApiUrl)
                    .build();

            return webClient.post()
                    .uri("?key=" + geminiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(this::extractTextFromGeminiResponse)
                    .onErrorReturn("AI 피드백 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");

        } catch (Exception e) {
            log.error("AI 피드백 생성 실패", e);
            return Mono.just("AI 피드백 생성 중 오류가 발생했습니다.");
        }
    }

    /**
     * 수학 성능 분석을 위한 프롬프트를 생성합니다.
     */
    private String buildMathAnalysisPrompt(MathPerformanceData data) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("당신은 수학 교육 전문가입니다. 다음 학생의 수학 성능 데이터를 분석하고 개선 방안을 제시해주세요.\n\n");
        
        prompt.append("=== 성능 분석 데이터 ===\n");
        prompt.append("총 문제 수: ").append(data.getTotalProblems()).append("개\n");
        prompt.append("정답 수: ").append(data.getCorrectAnswers()).append("개\n");
        prompt.append("정답률: ").append(String.format("%.1f", data.getAccuracyRate())).append("%\n");
        prompt.append("소요 시간: ").append(data.getTotalTimeSpent()).append("초\n");
        prompt.append("평균 문제당 시간: ").append(String.format("%.1f", data.getAverageTimePerProblem())).append("초\n\n");

        if (!data.getWrongAnswersBySubject().isEmpty()) {
            prompt.append("=== 과목별 오답 분석 ===\n");
            data.getWrongAnswersBySubject().forEach((subject, count) -> 
                prompt.append("- ").append(subject).append(": ").append(count).append("개 오답\n"));
            prompt.append("\n");
        }

        if (!data.getWrongAnswersByDifficulty().isEmpty()) {
            prompt.append("=== 난이도별 오답 분석 ===\n");
            data.getWrongAnswersByDifficulty().forEach((difficulty, count) -> 
                prompt.append("- ").append(difficulty).append("등급: ").append(count).append("개 오답\n"));
            prompt.append("\n");
        }

        prompt.append("=== 요청사항 ===\n");
        prompt.append("1. 학생의 강점과 약점을 분석해주세요\n");
        prompt.append("2. 구체적인 학습 개선 방안을 제시해주세요\n");
        prompt.append("3. 추천 학습 계획을 제안해주세요\n");
        prompt.append("4. 격려와 동기부여 메시지를 포함해주세요\n\n");
        prompt.append("답변은 한국어로, 친근하고 격려하는 톤으로 작성해주세요.");

        return prompt.toString();
    }

    /**
     * Gemini API 요청 본문을 생성합니다.
     */
    private Map<String, Object> createGeminiRequest(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        
        requestBody.put("contents", List.of(content));
        
        // 생성 설정
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 1024);
        requestBody.put("generationConfig", generationConfig);

        return requestBody;
    }

    /**
     * Gemini API 응답에서 텍스트를 추출합니다.
     */
    private String extractTextFromGeminiResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode candidatesNode = rootNode.path("candidates");
            
            if (candidatesNode.isArray() && candidatesNode.size() > 0) {
                JsonNode firstCandidate = candidatesNode.get(0);
                JsonNode contentNode = firstCandidate.path("content");
                JsonNode partsNode = contentNode.path("parts");
                
                if (partsNode.isArray() && partsNode.size() > 0) {
                    JsonNode firstPart = partsNode.get(0);
                    return firstPart.path("text").asText();
                }
            }
            
            log.warn("Gemini API 응답에서 텍스트를 찾을 수 없습니다: {}", response);
            return "AI 피드백을 생성할 수 없습니다.";
            
        } catch (Exception e) {
            log.error("Gemini API 응답 파싱 실패", e);
            return "AI 피드백 처리 중 오류가 발생했습니다.";
        }
    }

    /**
     * 수학 성능 데이터를 담는 DTO 클래스
     */
    public static class MathPerformanceData {
        private int totalProblems;
        private int correctAnswers;
        private double accuracyRate;
        private long totalTimeSpent;
        private double averageTimePerProblem;
        private Map<String, Integer> wrongAnswersBySubject;
        private Map<String, Integer> wrongAnswersByDifficulty;

        // 생성자
        public MathPerformanceData() {
            this.wrongAnswersBySubject = new HashMap<>();
            this.wrongAnswersByDifficulty = new HashMap<>();
        }

        // Getters and Setters
        public int getTotalProblems() { return totalProblems; }
        public void setTotalProblems(int totalProblems) { this.totalProblems = totalProblems; }

        public int getCorrectAnswers() { return correctAnswers; }
        public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

        public double getAccuracyRate() { return accuracyRate; }
        public void setAccuracyRate(double accuracyRate) { this.accuracyRate = accuracyRate; }

        public long getTotalTimeSpent() { return totalTimeSpent; }
        public void setTotalTimeSpent(long totalTimeSpent) { this.totalTimeSpent = totalTimeSpent; }

        public double getAverageTimePerProblem() { return averageTimePerProblem; }
        public void setAverageTimePerProblem(double averageTimePerProblem) { this.averageTimePerProblem = averageTimePerProblem; }

        public Map<String, Integer> getWrongAnswersBySubject() { return wrongAnswersBySubject; }
        public void setWrongAnswersBySubject(Map<String, Integer> wrongAnswersBySubject) { this.wrongAnswersBySubject = wrongAnswersBySubject; }

        public Map<String, Integer> getWrongAnswersByDifficulty() { return wrongAnswersByDifficulty; }
        public void setWrongAnswersByDifficulty(Map<String, Integer> wrongAnswersByDifficulty) { this.wrongAnswersByDifficulty = wrongAnswersByDifficulty; }
    }
}