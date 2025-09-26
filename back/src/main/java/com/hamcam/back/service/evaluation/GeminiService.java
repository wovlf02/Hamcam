package com.hamcam.back.service.evaluation;

import com.hamcam.back.entity.evaluation.UnitEvaluation;
import com.hamcam.back.entity.evaluation.EvaluationAnswer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Gemini AI 서비스 - 학습 피드백 생성
 */
@Slf4j
@Service
public class GeminiService {

    /**
     * 단원평가 결과를 바탕으로 학습 피드백 생성
     */
    public String generateEvaluationFeedback(UnitEvaluation evaluation, List<EvaluationAnswer> wrongAnswers) {
        log.info("단원평가 피드백 생성 시작 - 평가 ID: {}", evaluation.getId());

        try {
            // 평가 정보 수집
            String subject = evaluation.getUnit().getSubject();
            String unit = evaluation.getUnit().getUnit();
            double score = evaluation.getScore();
            int totalQuestions = evaluation.getTotalQuestions();
            int wrongCount = wrongAnswers.size();

            // 틀린 문제 분석
            String wrongProblemsAnalysis = analyzeWrongProblems(wrongAnswers);

            // AI 피드백 프롬프트 생성
            String prompt = buildFeedbackPrompt(subject, unit, score, totalQuestions, wrongCount, wrongProblemsAnalysis);

            // 실제 Gemini API 호출 대신 임시 응답 (추후 실제 API 연동)
            return generateMockFeedback(subject, unit, score, wrongCount);

            // TODO: 실제 Gemini API 호출 로직
            // return callGeminiAPI(prompt);

        } catch (Exception e) {
            log.error("피드백 생성 중 오류 발생", e);
            return generateDefaultFeedback();
        }
    }

    /**
     * 틀린 문제들을 분석하여 문자열로 반환
     */
    private String analyzeWrongProblems(List<EvaluationAnswer> wrongAnswers) {
        if (wrongAnswers.isEmpty()) {
            return "모든 문제를 정답으로 맞혔습니다.";
        }

        return wrongAnswers.stream()
                .map(answer -> String.format("- %s (난이도: %s)\n  정답: %s, 학생답안: %s",
                        answer.getProblem().getTitle() != null ? answer.getProblem().getTitle() : "문제",
                        answer.getDifficulty(),
                        answer.getProblem().getAnswer(),
                        answer.getUserAnswer()))
                .collect(Collectors.joining("\n\n"));
    }

    /**
     * AI 피드백 프롬프트 생성
     */
    private String buildFeedbackPrompt(String subject, String unit, double score, int totalQuestions, int wrongCount, String wrongProblemsAnalysis) {
        return String.format("""
            학생의 단원평가 결과를 분석하여 개인별 맞춤 학습 피드백을 제공해주세요.

            **평가 정보:**
            - 과목: %s
            - 단원: %s
            - 점수: %.1f점 (%d문제 중 %d문제 틀림)

            **틀린 문제 분석:**
            %s

            **요청사항:**
            1. 학생의 현재 실력 수준에 대한 전반적 분석
            2. 부족한 개념이나 영역 지적
            3. 구체적인 학습 방법 제안 (어떤 유형의 문제를 더 풀어야 하는지)
            4. 향후 2-3주간의 학습 계획 제안
            5. 예상 학습 시간과 우선순위 제시

            **답변 형식:**
            - 친근하고 격려하는 톤으로 작성
            - 구체적이고 실행 가능한 조언 제공
            - 500자 이내로 핵심 내용만 포함
            """, subject, unit, score, totalQuestions, wrongCount, wrongProblemsAnalysis);
    }

    /**
     * 임시 피드백 생성 (실제 AI API 연동 전까지 사용)
     */
    private String generateMockFeedback(String subject, String unit, double score, int wrongCount) {
        StringBuilder feedback = new StringBuilder();

        feedback.append("🎯 **전반적인 분석**\n");
        if (score >= 80) {
            feedback.append("우수한 성적입니다! 기본 개념은 잘 이해하고 있습니다.\n\n");
        } else if (score >= 60) {
            feedback.append("기본적인 이해는 되어 있지만 더 정확한 학습이 필요합니다.\n\n");
        } else {
            feedback.append("기초부터 차근차근 다시 학습할 필요가 있습니다.\n\n");
        }

        feedback.append("📚 **부족한 영역**\n");
        if (wrongCount > 5) {
            feedback.append(String.format("- %s %s 단원의 기본 개념 정리가 필요합니다\n", subject, unit));
            feedback.append("- 문제 해결 과정에서 실수가 자주 발생하고 있습니다\n\n");
        } else if (wrongCount > 2) {
            feedback.append("- 심화 문제 해결 능력 향상이 필요합니다\n");
            feedback.append("- 문제 유형별 접근법을 더 연습해보세요\n\n");
        } else {
            feedback.append("- 전반적으로 잘하고 있습니다. 실수만 줄이면 됩니다\n\n");
        }

        feedback.append("💡 **학습 권장사항**\n");
        feedback.append("- 기본 개념서를 다시 한 번 정독하세요\n");
        feedback.append("- 비슷한 유형의 문제를 반복해서 풀어보세요\n");
        feedback.append("- 틀린 문제는 해설을 꼼꼼히 읽고 다시 풀어보세요\n\n");

        feedback.append("📅 **향후 학습 계획**\n");
        feedback.append("1주차: 기본 개념 복습 및 정리 (1일 1시간)\n");
        feedback.append("2주차: 유형별 문제 풀이 (1일 1.5시간)\n");
        feedback.append("3주차: 심화 문제 및 모의고사 (1일 2시간)\n");

        return feedback.toString();
    }

    /**
     * 기본 피드백 (오류 시 사용)
     */
    private String generateDefaultFeedback() {
        return """
            평가를 완료하셨습니다! 
            
            틀린 문제들을 다시 한 번 확인하여 부족한 부분을 보완하세요.
            꾸준한 연습을 통해 실력을 향상시킬 수 있습니다.
            
            - 기본 개념 복습
            - 유사 문제 반복 학습
            - 정기적인 자가 점검
            
            화이팅! 다음에는 더 좋은 결과를 얻을 수 있을 거예요.
            """;
    }

    // TODO: 실제 Gemini API 호출 메서드 구현
    // private String callGeminiAPI(String prompt) {
    //     // Gemini API 호출 로직
    //     return "";
    // }
}