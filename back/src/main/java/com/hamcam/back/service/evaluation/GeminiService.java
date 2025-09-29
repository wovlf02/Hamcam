package com.hamcam.back.service.evaluation;

import com.hamcam.back.entity.evaluation.UnitEvaluation;
import com.hamcam.back.entity.evaluation.EvaluationAnswer;
import com.hamcam.back.entity.auth.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/**
 * Gemini AI 서비스 - 학습 피드백 및 맞춤형 학습계획 생성
 */
@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;
    
    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent}")
    private String geminiApiUrl;
    
    private final RestTemplate restTemplate;
    
    public GeminiService() {
        this.restTemplate = new RestTemplate();
    }

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

            // 실제 Gemini API 호출
            String aiResponse = callGeminiAPI(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return aiResponse;
            }
            
            // API 호출 실패 시 fallback
            log.warn("Gemini API 호출 실패, 기본 피드백 사용");
            return generateMockFeedback(subject, unit, score, wrongCount);

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
     * 등급별 맞춤형 학습계획 생성
     */
    public String generatePersonalizedStudyPlan(User user, UnitEvaluation evaluation, List<EvaluationAnswer> wrongAnswers) {
        log.info("등급별 맞춤형 학습계획 생성 시작 - 사용자: {}, 등급: {}", user.getId(), user.getGrade());

        try {
            // 사용자 정보 및 평가 결과 분석
            String subject = evaluation.getUnit().getSubject();
            String unit = evaluation.getUnit().getUnit();
            int userGrade = user.getGrade() != null ? user.getGrade() : 5;
            double score = evaluation.getScore();
            int wrongCount = wrongAnswers.size();

            // 틀린 문제들의 난이도 분석
            Map<String, Integer> difficultyAnalysis = analyzeDifficultyDistribution(wrongAnswers);
            
            // 약점 영역 분석
            String weaknessAnalysis = analyzeWeakAreas(wrongAnswers, userGrade);

            // 맞춤형 학습계획 프롬프트 생성
            String prompt = buildPersonalizedStudyPlanPrompt(
                subject, unit, userGrade, score, wrongCount, 
                difficultyAnalysis, weaknessAnalysis
            );

            // 실제 Gemini API 호출
            String aiResponse = callGeminiAPI(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return aiResponse;
            }
            
            // API 호출 실패 시 fallback
            log.warn("Gemini API 호출 실패, 기본 학습계획 사용");
            return generateMockPersonalizedPlan(userGrade, subject, unit, score, wrongCount);

        } catch (Exception e) {
            log.error("맞춤형 학습계획 생성 중 오류 발생", e);
            return generateDefaultStudyPlan();
        }
    }

    /**
     * 틀린 문제들의 난이도 분포 분석
     */
    private Map<String, Integer> analyzeDifficultyDistribution(List<EvaluationAnswer> wrongAnswers) {
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put("easy", 0);
        distribution.put("medium", 0);
        distribution.put("hard", 0);

        for (EvaluationAnswer answer : wrongAnswers) {
            String difficulty = answer.getDifficulty();
            distribution.put(difficulty, distribution.get(difficulty) + 1);
        }

        return distribution;
    }

    /**
     * 등급에 따른 약점 영역 상세 분석
     */
    private String analyzeWeakAreas(List<EvaluationAnswer> wrongAnswers, int userGrade) {
        StringBuilder analysis = new StringBuilder();
        
        Map<String, Integer> difficultyCount = analyzeDifficultyDistribution(wrongAnswers);
        
        // 등급별 맞춤 분석
        switch (userGrade) {
            case 1, 2 -> {
                if (difficultyCount.get("easy") > 0) {
                    analysis.append("기본 개념에서도 실수가 발생하고 있어 주의가 필요합니다. ");
                }
                if (difficultyCount.get("hard") > 2) {
                    analysis.append("고난도 문제에서 정확성을 높이는 연습이 필요합니다. ");
                }
            }
            case 3, 4 -> {
                if (difficultyCount.get("easy") > 1) {
                    analysis.append("기본기 다지기가 우선입니다. ");
                }
                if (difficultyCount.get("medium") > 2) {
                    analysis.append("중간 난이도 문제 해결 능력 향상이 필요합니다. ");
                }
            }
            case 5 -> {
                analysis.append("기초 개념부터 차근차근 다시 학습하는 것이 중요합니다. ");
            }
        }
        
        return analysis.toString();
    }

    /**
     * 맞춤형 학습계획 프롬프트 생성
     */
    private String buildPersonalizedStudyPlanPrompt(String subject, String unit, int userGrade, 
                                                   double score, int wrongCount, 
                                                   Map<String, Integer> difficultyAnalysis, 
                                                   String weaknessAnalysis) {
        return String.format("""
            학생의 등급과 평가 결과를 바탕으로 개인별 맞춤 학습계획을 생성해주세요.

            **학생 정보:**
            - 현재 등급: %d등급
            - 과목: %s
            - 단원: %s
            - 점수: %.1f점 (틀린 문제: %d개)

            **난이도별 틀린 문제 분포:**
            - 쉬움: %d개
            - 보통: %d개
            - 어려움: %d개

            **약점 분석:**
            %s

            **요청사항:**
            1. %d등급 학생에게 적합한 학습 전략 제시
            2. 약점 보완을 위한 단계별 학습 계획 (2-3주)
            3. 구체적인 문제 유형별 연습 방법
            4. 학습 시간 배분 및 우선순위
            5. 다음 평가를 위한 목표 설정

            **답변 형식:**
            - 친근하고 격려하는 톤으로 작성
            - 실현 가능한 구체적인 계획 제시
            - 등급 향상을 위한 실질적 조언 포함
            """, 
            userGrade, subject, unit, score, wrongCount,
            difficultyAnalysis.get("easy"), difficultyAnalysis.get("medium"), difficultyAnalysis.get("hard"),
            weaknessAnalysis, userGrade);
    }

    /**
     * 등급별 맞춤 학습계획 목 생성 (학원선생님 스타일)
     */
    private String generateMockPersonalizedPlan(int userGrade, String subject, String unit, double score, int wrongCount) {
        StringBuilder plan = new StringBuilder();

        plan.append(String.format("🎯 **%d등급을 위한 개인별 맞춤 학습계획**\n\n", userGrade));
        
        // 현재 상태 분석
        plan.append("**📊 현재 상태 진단**\n");
        plan.append(String.format("• 현재 점수: %.1f점 (틀린 문제: %d개)\n", score, wrongCount));
        plan.append(String.format("• %s 단원 이해도: ", unit != null ? unit : "수학"));
        
        if (score >= 90) {
            plan.append("매우 우수 ✨\n");
        } else if (score >= 80) {
            plan.append("우수 👍\n");
        } else if (score >= 70) {
            plan.append("양호 📈\n");
        } else if (score >= 60) {
            plan.append("보통 📝\n");
        } else {
            plan.append("부족 (개선 필요) 💪\n");
        }
        
        // 학원선생님 스타일 조언
        plan.append("\n**👨‍🏫 선생님의 조언**\n");
        switch (userGrade) {
            case 1, 2 -> {
                plan.append("상위권답게 전반적으로 잘하고 있어요! 하지만 1-2등급에서는 작은 실수도 큰 차이를 만들어요.\n");
                if (wrongCount > 2) {
                    plan.append("틀린 문제들을 보니, 개념은 알고 있는데 문제 해석이나 계산에서 실수가 보여요.\n");
                    plan.append("시험에서는 '아는 문제'를 '맞는 문제'로 바꾸는 것이 핵심이에요!\n");
                } else {
                    plan.append("현재 수준을 잘 유지하고 있어요. 더 어려운 문제에 도전해보세요!\n");
                }
            }
            case 3, 4 -> {
                plan.append("중위권에서 상위권으로 올라갈 수 있는 중요한 시기예요!\n");
                if (wrongCount > 5) {
                    plan.append("기본 개념이 완전히 정착되지 않은 것 같아요. 무작정 어려운 문제보다는 기본기를 확실히 해야 해요.\n");
                    plan.append("기본 개념 → 기본 유형 문제 → 응용 문제 순서로 차근차근 올라가세요.\n");
                } else {
                    plan.append("기본기는 어느 정도 되어 있어요. 이제 응용력을 키우는 단계예요!\n");
                }
            }
            case 5 -> {
                plan.append("아직 기초가 부족한 상태예요. 하지만 걱정하지 마세요! 기초부터 차근차근 쌓아가면 반드시 향상돼요.\n");
                plan.append("지금은 '많이 푸는 것'보다 '확실히 이해하는 것'이 더 중요해요.\n");
                plan.append("쉬운 문제부터 천천히, 그리고 확실하게 이해하고 넘어가세요.\n");
            }
        }

        // 등급별 맞춤 전략
        plan.append("\n**� 맞춤형 학습 전략**\n");
        switch (userGrade) {
            case 1, 2 -> {
                plan.append("🔥 **상위권 완성 전략**\n")
                    .append("• 실수 제로 프로젝트: 틀린 문제 3번씩 재풀이\n")
                    .append("• 시간 단축 훈련: 아는 문제는 빠르게, 어려운 문제는 정확하게\n")
                    .append("• 새로운 유형 도전: 최신 기출 문제 및 심화 문제집 활용\n")
                    .append("• 멘탈 관리: 시험장에서의 실수 방지 루틴 만들기\n\n");
            }
            case 3, 4 -> {
                plan.append("🚀 **중위권 탈출 전략**\n")
                    .append("• 개념 완성: 모르는 개념 0개 만들기 프로젝트\n")
                    .append("• 유형별 마스터: 자주 나오는 문제 유형 완전 정복\n")
                    .append("• 오답노트 활용: 틀린 이유 분석하고 비슷한 문제 추가 연습\n")
                    .append("• 속도와 정확성: 시간 내에 정확하게 푸는 연습\n\n");
            }
            case 5 -> {
                plan.append("💪 **기초 탄탄 전략**\n")
                    .append("• 개념부터 다시: 교과서 기본 개념 완전 이해\n")
                    .append("• 기본 유형 정복: 쉬운 문제 100% 정답 목표\n")
                    .append("• 자신감 회복: 매일 작은 성취감 쌓기\n")
                    .append("• 기초 체력: 꾸준한 학습 습관 만들기\n\n");
            }
        }
        
        // 구체적인 주차별 계획
        plan.append("**� 3주 집중 학습 계획**\n");
        switch (userGrade) {
            case 1, 2 -> {
                plan.append("**1주차** (실수 분석 및 보완)\n")
                    .append("• 매일 90분: 틀린 문제 완전 분석 + 유사 문제 3개씩\n")
                    .append("• 실수 패턴 찾기: 계산 실수 vs 개념 오류 vs 문제 해석 오류\n")
                    .append("• 검산 루틴 연습\n\n")
                    .append("**2주차** (고난도 적응 훈련)\n")
                    .append("• 매일 120분: 고난도 문제 도전 + 시간 관리 연습\n")
                    .append("• 어려운 문제 접근법 연습: 문제 분해 → 단계별 해결\n")
                    .append("• 모르는 문제 넘어가는 판단력 기르기\n\n")
                    .append("**3주차** (실전 완성)\n")
                    .append("• 매일 150분: 실전 모의고사 + 문제 분석\n")
                    .append("• 시간 배분 연습: 쉬운 문제 빠르게, 어려운 문제 신중하게\n")
                    .append("• 실수 체크리스트 만들어서 활용\n");
            }
            case 3, 4 -> {
                plan.append("**1주차** (기본 개념 완성)\n")
                    .append("• 매일 90분: 개념 정리 + 기본 문제 완전 정복\n")
                    .append("• 모르는 개념 0개 만들기: 이해 안 되면 즉시 질문\n")
                    .append("• 기본 유형 문제 반복 연습\n\n")
                    .append("**2주차** (응용력 향상)\n")
                    .append("• 매일 120분: 중간 난이도 문제 집중 연습\n")
                    .append("• 문제 해결 과정 단계별 정리하기\n")
                    .append("• 비슷한 유형 문제 여러 개 풀어보기\n\n")
                    .append("**3주차** (종합 정리)\n")
                    .append("• 매일 120분: 단원별 종합 문제 + 실전 연습\n")
                    .append("• 약점 영역 집중 보완\n")
                    .append("• 실전 감각 기르기\n");
            }
            case 5 -> {
                plan.append("**1주차** (기초 개념 다지기)\n")
                    .append("• 매일 60분: 기본 개념 이해 + 쉬운 예제 문제\n")
                    .append("• 공식 암기보다는 원리 이해에 집중\n")
                    .append("• 하루에 한 개념씩 확실하게\n\n")
                    .append("**2주차** (기본 문제 정복)\n")
                    .append("• 매일 90분: 기본 유형 문제 반복 연습\n")
                    .append("• 틀린 문제는 이해할 때까지 반복\n")
                    .append("• 쉬운 문제 100% 정답 목표\n\n")
                    .append("**3주차** (자신감 확장)\n")
                    .append("• 매일 90분: 조금 어려운 문제에 도전\n")
                    .append("• 성취감 쌓기: 매일 푼 문제 개수 기록\n")
                    .append("• 기본기 점검: 이전 내용 복습\n");
            }
        }

        // 성공을 위한 핵심 조언
        plan.append("\n**🎯 성공을 위한 핵심 조언**\n");
        plan.append("1. **꾸준함**: 매일 조금씩이라도 반드시 하기\n");
        plan.append("2. **정확성**: 빠르게 푸는 것보다 정확하게 푸는 것이 우선\n");
        plan.append("3. **메타인지**: 내가 뭘 모르는지 정확히 파악하기\n");
        plan.append("4. **질문하기**: 모르는 건 절대 넘어가지 말고 꼭 질문\n");
        plan.append("5. **자신감**: 작은 성취도 인정하고 격려하기\n");

        // 다음 평가 목표 설정
        plan.append("\n**📊 다음 평가 목표**\n");
        if (userGrade <= 2) {
            plan.append(String.format("• 현재 등급 유지 + 실수 최소화\n"));
            plan.append("• 목표 점수: 95점 이상 안정적 달성\n");
            plan.append("• 도전 과제: 만점에 도전해보기\n");
        } else if (userGrade <= 4) {
            plan.append(String.format("• %d등급 달성을 목표로!\n", userGrade - 1));
            plan.append("• 목표 점수: 현재보다 15-20점 향상\n");
            plan.append("• 도전 과제: 어려운 문제 도전해보기\n");
        } else {
            plan.append("• 우선 4등급 안정적 달성\n");
            plan.append("• 목표 점수: 60점 이상 꾸준히\n");
            plan.append("• 도전 과제: 기본 문제 완전 정복\n");
        }

        plan.append("\n� **선생님의 마지막 한마디**\n");
        plan.append("수학은 단거리가 아니라 마라톤이에요. 조급해하지 말고 자신의 페이스로 꾸준히 해나가세요.\n");
        plan.append("틀린 문제는 실패가 아니라 성장의 기회입니다. 오늘 틀린 문제가 내일의 실력을 만들어요!\n");
        plan.append("믿고 따라와 주세요. 분명히 좋은 결과가 있을 거예요! 화이팅! 🔥✨");

        return plan.toString();
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

    /**
     * 기본 학습계획 (오류 시 사용)
     */
    private String generateDefaultStudyPlan() {
        return """
            📚 **기본 학습계획**
            
            1주차: 기본 개념 복습
            - 교과서 기본 개념 정리
            - 쉬운 문제부터 단계적 접근
            
            2주차: 문제 유형별 연습
            - 틀린 문제 유형 집중 학습
            - 비슷한 문제 반복 연습
            
            3주차: 종합 정리 및 실전 연습
            - 전체 범위 종합 정리
            - 모의 평가 실시
            
            꾸준한 학습으로 실력 향상을 이뤄보세요!
            """;
    }

    /**
     * 수학 평가 결과 상세 분석 (과목, 개념별 분석 포함)
     */
    public String generateMathEvaluationAnalysis(int userGrade, double score, int correctCount, int totalCount, 
                                                Map<String, Object> difficultyScores, List<Map<String, Object>> wrongAnswers,
                                                String unitName) {
        log.info("수학 평가 결과 실시간 분석 시작 - 등급: {}, 점수: {}, 단원: {}", userGrade, score, unitName);

        try {
            // 틀린 문제들의 상세 정보 분석
            String detailedWrongAnalysis = analyzeWrongProblemsInDetail(wrongAnswers);
            
            // 과목별, 개념별 약점 분석
            String subjectWeakness = analyzeSubjectWeakness(wrongAnswers);
            
            // 향상된 프롬프트 생성 (기존 + 상세 분석)
            String prompt = buildEnhancedMathAnalysisPrompt(
                userGrade, score, correctCount, totalCount, 
                difficultyScores, wrongAnswers, unitName,
                detailedWrongAnalysis, subjectWeakness
            );
            
            // 실제 Gemini API 호출
            String aiResponse = callGeminiAPI(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return aiResponse;
            }
            
            // API 호출 실패 시 fallback
            log.warn("Gemini API 호출 실패, 상세 분석 fallback 사용");
            return generateEnhancedMockAnalysis(userGrade, score, wrongAnswers, subjectWeakness);

        } catch (Exception e) {
            log.error("수학 평가 결과 분석 실패", e);
            return generateDefaultMathAnalysis(score);
        }
    }

    /**
     * 수학 평가 결과 분석용 프롬프트 생성
     */
    private String buildMathAnalysisPrompt(int userGrade, double score, int correctCount, int totalCount,
                                          Map<String, Object> difficultyScores, List<Map<String, Object>> wrongAnswers,
                                          String unitName) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("수학 단원평가 결과를 종합적으로 분석하여 학생에게 맞춤형 피드백을 제공해주세요.\n\n");
        
        prompt.append("**학생 정보:**\n");
        prompt.append(String.format("- 현재 등급: %d등급\n", userGrade));
        prompt.append(String.format("- 총점: %.1f점 (%d/%d 정답)\n", score, correctCount, totalCount));
        
        prompt.append("\n**난이도별 성과:**\n");
        if (difficultyScores.containsKey("easy")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> easy = (Map<String, Integer>) difficultyScores.get("easy");
            prompt.append(String.format("- 쉬운 문제: %d/%d 정답\n", easy.get("correct"), easy.get("total")));
        }
        if (difficultyScores.containsKey("medium")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> medium = (Map<String, Integer>) difficultyScores.get("medium");
            prompt.append(String.format("- 보통 문제: %d/%d 정답\n", medium.get("correct"), medium.get("total")));
        }
        if (difficultyScores.containsKey("hard")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> hard = (Map<String, Integer>) difficultyScores.get("hard");
            prompt.append(String.format("- 어려운 문제: %d/%d 정답\n", hard.get("correct"), hard.get("total")));
        }
        
        if (!wrongAnswers.isEmpty()) {
            prompt.append("\n**틀린 문제 분석:**\n");
            for (int i = 0; i < Math.min(wrongAnswers.size(), 5); i++) {
                Map<String, Object> wrong = wrongAnswers.get(i);
                prompt.append(String.format("- 문제 %d: %s 난이도, 정답: %s, 학생답안: %s\n", 
                    i + 1, wrong.get("difficulty"), wrong.get("correctAnswer"), wrong.get("userAnswer")));
            }
        }
        
        prompt.append("\n**요청사항:**\n");
        prompt.append("1. 현재 실력 수준에 대한 정확한 진단\n");
        prompt.append("2. 강점과 약점 영역 구체적 분석\n");
        prompt.append("3. 등급 향상을 위한 실질적 학습 전략\n");
        prompt.append("4. 다음 목표 점수와 달성 방법\n");
        prompt.append("5. 격려와 동기부여 메시지\n\n");
        
        prompt.append("**답변 형식:**\n");
        prompt.append("- 친근하고 격려하는 톤으로 작성\n");
        prompt.append("- 구체적이고 실행 가능한 조언 제공\n");
        prompt.append("- 600자 내외로 핵심 내용 포함\n");
        
        return prompt.toString();
    }

    /**
     * 수학 평가 결과 분석 목 응답 생성
     */
    private String generateMockMathAnalysis(int userGrade, double score, int correctCount, int totalCount,
                                          Map<String, Object> difficultyScores, List<Map<String, Object>> wrongAnswers,
                                          String unitName) {
        StringBuilder analysis = new StringBuilder();
        
        // 성과 평가
        analysis.append("🎯 **종합 성과 분석**\n");
        if (score >= 90) {
            analysis.append("우수한 성과입니다! 수학적 사고력과 문제 해결 능력이 뛰어납니다.\n\n");
        } else if (score >= 70) {
            analysis.append("양호한 성과를 보였습니다. 기본기가 탄탄하고 꾸준한 발전이 보입니다.\n\n");
        } else if (score >= 50) {
            analysis.append("기본적인 이해는 되어 있지만, 좀 더 체계적인 학습이 필요합니다.\n\n");
        } else {
            analysis.append("기초부터 차근차근 다시 정리하면 충분히 향상 가능합니다.\n\n");
        }
        
        // 등급별 맞춤 분석
        analysis.append("📊 **등급별 맞춤 분석**\n");
        switch (userGrade) {
            case 1, 2 -> {
                analysis.append("상위권답게 어려운 문제도 잘 해결하고 있습니다. ");
                if (score < 95) {
                    analysis.append("실수를 줄이는 것이 관건입니다.\n");
                } else {
                    analysis.append("현재 수준을 유지하며 새로운 문제 유형에 도전해보세요.\n");
                }
            }
            case 3, 4 -> {
                analysis.append("중위권에서 상위권으로 도약할 수 있는 잠재력이 보입니다. ");
                if (wrongAnswers.size() > 5) {
                    analysis.append("기본 개념 정리를 먼저 하고 응용 문제를 연습하세요.\n");
                } else {
                    analysis.append("꾸준히 연습하면 곧 상위권에 진입할 수 있을 것입니다.\n");
                }
            }
            case 5 -> {
                analysis.append("기초 실력 향상에 집중하는 것이 좋겠습니다. ");
                analysis.append("쉬운 문제부터 확실히 정복하고 단계적으로 올라가세요.\n");
            }
        }
        
        // 난이도별 분석
        analysis.append("\n🔍 **세부 영역 분석**\n");
        
        @SuppressWarnings("unchecked")
        Map<String, Integer> easy = (Map<String, Integer>) difficultyScores.get("easy");
        @SuppressWarnings("unchecked")
        Map<String, Integer> medium = (Map<String, Integer>) difficultyScores.get("medium");
        @SuppressWarnings("unchecked")
        Map<String, Integer> hard = (Map<String, Integer>) difficultyScores.get("hard");
        
        if (easy != null && easy.get("correct") < easy.get("total") - 1) {
            analysis.append("• 기본 문제에서 실수가 보입니다. 개념 정리를 다시 한번 해보세요.\n");
        } else if (easy != null) {
            analysis.append("• 기본 개념은 잘 이해하고 있습니다. 👍\n");
        }
        
        if (medium != null && medium.get("correct") < medium.get("total") / 2) {
            analysis.append("• 응용 문제 해결 능력을 키워야 합니다. 유형별 연습을 늘려보세요.\n");
        } else if (medium != null && medium.get("correct") >= medium.get("total") * 0.7) {
            analysis.append("• 응용 문제 해결 능력이 좋습니다. 👍\n");
        }
        
        if (hard != null && hard.get("correct") >= hard.get("total") / 2) {
            analysis.append("• 고난도 문제도 잘 해결하고 있습니다. 훌륭해요! 👍\n");
        } else if (hard != null && userGrade <= 3) {
            analysis.append("• 고난도 문제에 더 도전해보세요. 충분히 풀 수 있을 것 같습니다.\n");
        }
        
        // 구체적인 문제 분석 (틀린 문제 기반)
        if (!wrongAnswers.isEmpty()) {
            analysis.append("\n📋 **틀린 문제 상세 분석**\n");
            for (Map<String, Object> wrongAnswer : wrongAnswers) {
                String examMonthYear = (String) wrongAnswer.get("examMonthYear");
                Integer problemNumber = (Integer) wrongAnswer.get("problemNumber");
                String difficulty = (String) wrongAnswer.get("difficulty");
                String subjectDetail = (String) wrongAnswer.get("subjectDetail");
                
                if (examMonthYear != null && problemNumber != null) {
                    String[] yearMonth = examMonthYear.split("_");
                    if (yearMonth.length == 2) {
                        String year = yearMonth[0];
                        String month = yearMonth[1];
                        
                        analysis.append(String.format("• %s년 %s월 모의고사 %d번 문제 (%s)\n", 
                            year, month, problemNumber, getDifficultyText(difficulty)));
                        
                        if (subjectDetail != null && !subjectDetail.isEmpty()) {
                            analysis.append(String.format("  → 약점 영역: %s\n", subjectDetail));
                        }
                        
                        // 난이도별 학습 조언
                        if ("easy".equals(difficulty)) {
                            analysis.append("  → 기본 개념을 다시 한 번 정리하고 비슷한 유형의 쉬운 문제부터 연습하세요.\n");
                        } else if ("medium".equals(difficulty)) {
                            analysis.append("  → 응용 문제 해결 방법을 익히고 단계별로 접근하는 연습을 해보세요.\n");
                        } else if ("hard".equals(difficulty)) {
                            analysis.append("  → 고난도 문제는 여러 개념이 복합된 경우가 많으니 차근차근 분석해보세요.\n");
                        }
                    }
                }
            }
        }
        
        // 학습 전략 제안 (단원 맞춤형)
        analysis.append(String.format("\n🚀 **%s 단원 집중 학습 전략**\n", unitName != null ? unitName : "수학"));
        
        if (userGrade >= 4) {
            analysis.append(String.format("목표: %d등급 달성을 위해 기본기 완전 정착에 집중하세요.\n", userGrade - 1));
            analysis.append("• 매일 30분씩 기본 개념 복습\n");
            analysis.append("• 틀린 문제 유형별 집중 연습\n");
        } else if (userGrade == 3) {
            analysis.append("목표: 2등급 진입을 위해 응용력 향상에 집중하세요.\n");
            analysis.append("• 중간 난이도 문제 완전 정복\n");
            analysis.append("• 고난도 문제 도전 시작\n");
        } else {
            analysis.append("목표: 현재 등급 유지하며 실수 최소화에 집중하세요.\n");
            analysis.append("• 시간 관리 능력 향상\n");
            analysis.append("• 새로운 문제 유형 도전\n");
        }
        
        analysis.append("\n💪 오늘도 수고했어요! 꾸준한 노력이 최고의 실력 향상 비결입니다. 화이팅! 🎉");
        
        return analysis.toString();
    }

    /**
     * 난이도 텍스트 변환
     */
    private String getDifficultyText(String difficulty) {
        return switch (difficulty) {
            case "easy" -> "쉬움";
            case "medium" -> "보통";
            case "hard" -> "어려움";
            default -> "일반";
        };
    }

    /**
     * 기본 수학 분석 (오류 시 사용)
     */
    private String generateDefaultMathAnalysis(double score) {
        return String.format("""
            🎯 **평가 완료!**
            
            점수: %.1f점으로 평가를 마치셨습니다.
            
            **학습 포인트:**
            • 틀린 문제들을 다시 한번 검토해보세요
            • 비슷한 유형의 문제를 더 연습해보세요
            • 꾸준한 학습으로 실력을 향상시켜 나가세요
            
            **다음 목표:**
            • 기본 개념 정리하기
            • 약점 영역 집중 학습하기
            • 정기적인 평가로 실력 점검하기
            
            화이팅! 다음에는 더 좋은 결과를 얻을 수 있을 거예요! 💪
            """, score);
    }

    /**
     * 실제 Gemini API 호출 메서드
     */
    private String callGeminiAPI(String prompt) {
        try {
            if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
                log.warn("Gemini API 키가 설정되지 않았습니다.");
                return null;
            }

            // API 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // API 요청 바디 생성
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> contents = new HashMap<>();
            Map<String, Object> partData = new HashMap<>();
            partData.put("text", prompt);
            contents.put("parts", List.of(partData));
            requestBody.put("contents", List.of(contents));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // API 호출
            String url = geminiApiUrl + "?key=" + geminiApiKey;
            log.info("Gemini API 호출: {}", url);
            
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                @SuppressWarnings("unchecked")
                Map<String, Object> responseBody = response.getBody();
                
                // 응답에서 텍스트 추출
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> responseParts = (List<Map<String, Object>>) content.get("parts");
                        if (responseParts != null && !responseParts.isEmpty()) {
                            String text = (String) responseParts.get(0).get("text");
                            log.info("Gemini API 응답 성공");
                            return text;
                        }
                    }
                }
            }
            
            log.warn("Gemini API 응답 형식이 예상과 다릅니다: {}", response.getBody());
            return null;
            
        } catch (Exception e) {
            log.error("Gemini API 호출 중 오류 발생", e);
            return null;
        }
    }

    /**
     * 틀린 문제들의 상세 정보 분석 (과목, 개념, 난이도 포함)
     */
    private String analyzeWrongProblemsInDetail(List<Map<String, Object>> wrongAnswers) {
        if (wrongAnswers == null || wrongAnswers.isEmpty()) {
            return "모든 문제를 정답으로 맞혔습니다!";
        }

        StringBuilder analysis = new StringBuilder();
        
        for (Map<String, Object> answer : wrongAnswers) {
            String subject = (String) answer.getOrDefault("subject", "공통");
            String subjectDetail = (String) answer.getOrDefault("subjectDetail", "기본 개념");
            String difficulty = (String) answer.getOrDefault("difficulty", "medium");
            String correctAnswer = (String) answer.getOrDefault("correctAnswer", "");
            String userAnswer = (String) answer.getOrDefault("userAnswer", "");
            Integer problemNumber = (Integer) answer.getOrDefault("problemNumber", 0);

            analysis.append(String.format("• %d번 (%s - %s)\n", problemNumber, subject, subjectDetail));
            analysis.append(String.format("  난이도: %s, 정답: %s, 학생답안: %s\n\n", 
                getDifficultyKorean(difficulty), correctAnswer, userAnswer));
        }

        return analysis.toString();
    }

    /**
     * 과목별 약점 분석
     */
    private String analyzeSubjectWeakness(List<Map<String, Object>> wrongAnswers) {
        if (wrongAnswers == null || wrongAnswers.isEmpty()) {
            return "전 영역에서 우수한 성과를 보였습니다.";
        }

        Map<String, Integer> subjectCount = new HashMap<>();
        Map<String, Integer> conceptCount = new HashMap<>();

        for (Map<String, Object> answer : wrongAnswers) {
            String subject = (String) answer.getOrDefault("subject", "공통");
            String subjectDetail = (String) answer.getOrDefault("subjectDetail", "기본 개념");

            subjectCount.put(subject, subjectCount.getOrDefault(subject, 0) + 1);
            conceptCount.put(subjectDetail, conceptCount.getOrDefault(subjectDetail, 0) + 1);
        }

        StringBuilder weakness = new StringBuilder();
        weakness.append("**과목별 약점 분석:**\n");
        
        subjectCount.entrySet().stream()
            .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
            .forEach(entry -> weakness.append(String.format("- %s: %d개 문제\n", entry.getKey(), entry.getValue())));

        weakness.append("\n**개념별 약점 분석:**\n");
        conceptCount.entrySet().stream()
            .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
            .limit(5) // 상위 5개 개념만 표시
            .forEach(entry -> weakness.append(String.format("- %s: %d개\n", entry.getKey(), entry.getValue())));

        return weakness.toString();
    }

    /**
     * 난이도 한글 변환
     */
    private String getDifficultyKorean(String difficulty) {
        return switch (difficulty) {
            case "easy" -> "쉬움";
            case "medium" -> "보통";
            case "hard" -> "어려움";
            default -> "보통";
        };
    }

    /**
     * 향상된 수학 평가 결과 분석용 프롬프트 생성 (상세 분석 포함)
     */
    private String buildEnhancedMathAnalysisPrompt(int userGrade, double score, int correctCount, int totalCount,
                                                  Map<String, Object> difficultyScores, List<Map<String, Object>> wrongAnswers,
                                                  String unitName, String detailedWrongAnalysis, String subjectWeakness) {
        
        return String.format("""
            고등학교 수학 선생님 역할로 학생의 평가 결과를 상세히 분석하고 구체적인 학습 가이드를 제공해주세요.

            **학생 기본 정보:**
            - 현재 등급: %d등급
            - 단원: %s
            - 전체 점수: %.1f점 (%d/%d 문제 정답)

            **난이도별 성과:**
            %s

            **틀린 문제 상세 분석:**
            %s

            %s

            **분석 요청사항:**
            1. 틀린 문제들의 공통점과 패턴 분석
            2. 부족한 개념들의 우선순위 제시 (어떤 개념부터 먼저 공부해야 하는지)
            3. 각 개념별 구체적인 학습 방법과 추천 문제 유형
            4. 현재 등급에서 한 등급 상승하기 위한 구체적인 로드맵
            5. 다음 2-3주간 실행 가능한 학습 계획

            **답변 스타일:**
            - 수학 선생님이 직접 상담해주는 듯한 친근하고 전문적인 톤
            - 학생이 바로 실행할 수 있는 구체적이고 실용적인 조언
            - 격려와 동기부여를 포함한 따뜻한 피드백
            - 600자 내외로 핵심만 간결하게 정리
            """, 
            userGrade, unitName, score, correctCount, totalCount,
            buildDifficultyAnalysisText(difficultyScores),
            detailedWrongAnalysis, subjectWeakness);
    }

    /**
     * 난이도별 성과 텍스트 생성
     */
    private String buildDifficultyAnalysisText(Map<String, Object> difficultyScores) {
        StringBuilder analysis = new StringBuilder();
        
        if (difficultyScores.containsKey("easy")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> easy = (Map<String, Integer>) difficultyScores.get("easy");
            int correct = easy.getOrDefault("correct", 0);
            int total = easy.getOrDefault("total", 0);
            analysis.append(String.format("- 쉬움: %d/%d (%.1f%%)\n", correct, total, total > 0 ? (correct * 100.0 / total) : 0));
        }
        if (difficultyScores.containsKey("medium")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> medium = (Map<String, Integer>) difficultyScores.get("medium");
            int correct = medium.getOrDefault("correct", 0);
            int total = medium.getOrDefault("total", 0);
            analysis.append(String.format("- 보통: %d/%d (%.1f%%)\n", correct, total, total > 0 ? (correct * 100.0 / total) : 0));
        }
        if (difficultyScores.containsKey("hard")) {
            @SuppressWarnings("unchecked")
            Map<String, Integer> hard = (Map<String, Integer>) difficultyScores.get("hard");
            int correct = hard.getOrDefault("correct", 0);
            int total = hard.getOrDefault("total", 0);
            analysis.append(String.format("- 어려움: %d/%d (%.1f%%)\n", correct, total, total > 0 ? (correct * 100.0 / total) : 0));
        }
        
        return analysis.toString();
    }

    /**
     * 향상된 모의 분석 생성
     */
    private String generateEnhancedMockAnalysis(int userGrade, double score, List<Map<String, Object>> wrongAnswers, String subjectWeakness) {
        StringBuilder analysis = new StringBuilder();

        analysis.append(String.format("📊 **%d등급 학생을 위한 맞춤 분석**\n\n", userGrade));

        // 전반적인 성과 평가
        if (score >= 80) {
            analysis.append("🎉 우수한 성적입니다! 기본기가 탄탄하네요.\n");
        } else if (score >= 60) {
            analysis.append("👍 준수한 성적이에요. 조금만 더 노력하면 큰 향상이 있을 것 같습니다.\n");
        } else {
            analysis.append("💪 아직 갈 길이 있지만 포기하지 마세요. 체계적으로 공부하면 반드시 향상됩니다.\n");
        }

        analysis.append("\n").append(subjectWeakness).append("\n");

        // 등급별 맞춤 조언
        analysis.append("**등급 향상을 위한 핵심 전략:**\n");
        switch (userGrade) {
            case 1, 2 -> analysis.append("- 실수 줄이기에 집중하세요\n- 고난도 문제 정확도 향상이 관건입니다\n");
            case 3, 4 -> analysis.append("- 중간 난이도 문제 완전 정복이 우선입니다\n- 기본 개념 복습으로 실수를 줄여보세요\n");
            case 5 -> analysis.append("- 기본 개념부터 차근차근 다시 시작하세요\n- 쉬운 문제부터 확실히 맞히는 연습이 필요합니다\n");
        }

        analysis.append("\n**추천 학습 순서:**\n");
        analysis.append("1주차: 틀린 문제 유형 집중 복습\n");
        analysis.append("2주차: 비슷한 문제 반복 연습\n");
        analysis.append("3주차: 종합 문제 풀이 및 실전 연습\n");

        return analysis.toString();
    }

    /**
     * 상세한 학습 로드맵 생성 (개념별 우선순위 및 주차별 계획 포함)
     */
    public String generateDetailedLearningRoadmap(int userGrade, double score, int correctCount, int totalCount,
                                                 Map<String, Object> difficultyScores, List<Map<String, Object>> wrongAnswers,
                                                 String unitName) {
        log.info("상세 학습 로드맵 생성 시작 - 등급: {}, 점수: {}", userGrade, score);

        try {
            // 개념별 우선순위 분석
            String conceptPriority = analyzeConceptPriority(wrongAnswers, userGrade);
            
            // 주차별 학습 계획 생성
            String weeklyPlan = generateWeeklyStudyPlan(wrongAnswers, userGrade, score);
            
            // 추천 문제 유형 및 학습 자료 제안
            String recommendedResources = generateRecommendedResources(wrongAnswers, userGrade);

            // 상세 로드맵 프롬프트 생성
            String prompt = buildDetailedRoadmapPrompt(
                userGrade, score, correctCount, totalCount, unitName,
                conceptPriority, weeklyPlan, recommendedResources
            );

            // 실제 Gemini API 호출
            String aiResponse = callGeminiAPI(prompt);
            if (aiResponse != null && !aiResponse.trim().isEmpty()) {
                return aiResponse;
            }
            
            // API 호출 실패 시 fallback
            log.warn("Gemini API 호출 실패, 상세 로드맵 fallback 사용");
            return generateDetailedRoadmapFallback(userGrade, score, conceptPriority, weeklyPlan, recommendedResources);

        } catch (Exception e) {
            log.error("상세 학습 로드맵 생성 중 오류 발생", e);
            return generateDefaultRoadmap(userGrade);
        }
    }

    /**
     * 개념별 우선순위 분석
     */
    private String analyzeConceptPriority(List<Map<String, Object>> wrongAnswers, int userGrade) {
        if (wrongAnswers == null || wrongAnswers.isEmpty()) {
            return "전체적으로 우수한 성과를 보여 특별히 보완이 필요한 개념이 없습니다.";
        }

        // 개념별 빈도수 계산
        Map<String, Integer> conceptFrequency = new HashMap<>();
        Map<String, String> conceptDifficulty = new HashMap<>();

        for (Map<String, Object> answer : wrongAnswers) {
            String concept = (String) answer.getOrDefault("subjectDetail", "기본 개념");
            String difficulty = (String) answer.getOrDefault("difficulty", "medium");
            
            conceptFrequency.put(concept, conceptFrequency.getOrDefault(concept, 0) + 1);
            conceptDifficulty.put(concept, difficulty);
        }

        StringBuilder priority = new StringBuilder();
        priority.append("**개념별 학습 우선순위:**\n");

        // 빈도순으로 정렬하여 우선순위 결정
        conceptFrequency.entrySet().stream()
            .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
            .forEach(entry -> {
                String concept = entry.getKey();
                int frequency = entry.getValue();
                String difficulty = conceptDifficulty.get(concept);
                
                priority.append(String.format("🔴 %s (%d개 문제, %s 난이도)\n", 
                    concept, frequency, getDifficultyKorean(difficulty)));
            });

        return priority.toString();
    }

    /**
     * 주차별 학습 계획 생성
     */
    private String generateWeeklyStudyPlan(List<Map<String, Object>> wrongAnswers, int userGrade, double score) {
        StringBuilder plan = new StringBuilder();
        plan.append("**3주간 집중 학습 계획:**\n\n");

        // 1주차: 기본 개념 정리
        plan.append("📅 **1주차 (기본 개념 정리)**\n");
        plan.append("- 틀린 문제의 기본 개념 복습 (1일 1-2시간)\n");
        plan.append("- 교과서 관련 단원 정독\n");
        plan.append("- 기본 예제 문제 풀이\n\n");

        // 2주차: 유형별 문제 풀이
        plan.append("📅 **2주차 (유형별 문제 연습)**\n");
        plan.append("- 틀린 문제와 같은 유형 집중 연습\n");
        plan.append("- 문제집 해당 단원 완전 정복\n");
        plan.append("- 오답노트 작성 및 복습\n\n");

        // 3주차: 종합 및 실전 연습
        plan.append("📅 **3주차 (종합 정리 및 실전)**\n");
        plan.append("- 모의고사 형태의 종합 문제 풀이\n");
        plan.append("- 시간 제한 내 문제 해결 연습\n");
        plan.append("- 최종 점검 및 약점 보완\n");

        return plan.toString();
    }

    /**
     * 추천 학습 자료 및 문제 유형 제안
     */
    private String generateRecommendedResources(List<Map<String, Object>> wrongAnswers, int userGrade) {
        StringBuilder resources = new StringBuilder();
        resources.append("**추천 학습 자료 및 방법:**\n\n");

        // 등급별 맞춤 자료 추천
        switch (userGrade) {
            case 1, 2 -> {
                resources.append("📚 **고난도 문제집**\n");
                resources.append("- 실력정석, 쎈 B단계 이상\n");
                resources.append("- 기출문제 변형 문제\n");
                resources.append("- 심화 개념서 참고\n\n");
            }
            case 3, 4 -> {
                resources.append("📚 **표준 문제집**\n");
                resources.append("- 개념원리, 쎈 A-B단계\n");
                resources.append("- 기본 개념서 + 유형별 문제집\n");
                resources.append("- 인터넷 강의 병행\n\n");
            }
            case 5 -> {
                resources.append("📚 **기초 다지기**\n");
                resources.append("- 개념원리, 라이트쎈\n");
                resources.append("- 기본 개념서 완전 정복\n");
                resources.append("- 기초 계산 연습\n\n");
            }
        }

        resources.append("💡 **효과적인 학습 방법:**\n");
        resources.append("- 오답노트 활용으로 실수 패턴 파악\n");
        resources.append("- 개념 설명을 다른 사람에게 해보기\n");
        resources.append("- 매일 일정한 시간 꾸준히 학습\n");

        return resources.toString();
    }

    /**
     * 상세 로드맵 프롬프트 생성
     */
    private String buildDetailedRoadmapPrompt(int userGrade, double score, int correctCount, int totalCount, String unitName,
                                             String conceptPriority, String weeklyPlan, String recommendedResources) {
        return String.format("""
            경험 많은 고등학교 수학 교사로서 학생의 평가 결과를 바탕으로 구체적이고 실행 가능한 개인별 학습 로드맵을 제공해주세요.

            **학생 현황:**
            - 등급: %d등급
            - 단원: %s  
            - 성적: %.1f점 (%d/%d 정답)

            **현재 분석 결과:**
            %s

            **제안된 학습 계획:**
            %s

            **추천 자료:**
            %s

            **로드맵 작성 요청사항:**
            1. 현재 실력 진단 및 목표 등급까지의 구체적인 단계
            2. 개념별 학습 순서와 소요 시간 예상
            3. 일별/주별 구체적인 실행 계획
            4. 중간 점검 방법과 성과 측정 지표
            5. 동기부여를 위한 단기 목표 설정
            6. 학습 효과를 높이는 구체적인 방법론

            **답변 요구사항:**
            - 실무 경험이 풍부한 교사의 관점에서 작성
            - 학생이 바로 실행할 수 있는 구체적인 액션 플랜
            - 격려와 함께 현실적이고 달성 가능한 목표 제시
            - 800자 내외로 상세하면서도 핵심적인 내용 정리
            """, 
            userGrade, unitName, score, correctCount, totalCount,
            conceptPriority, weeklyPlan, recommendedResources);
    }

    /**
     * 상세 로드맵 fallback 생성
     */
    private String generateDetailedRoadmapFallback(int userGrade, double score, String conceptPriority, 
                                                  String weeklyPlan, String recommendedResources) {
        StringBuilder roadmap = new StringBuilder();

        roadmap.append(String.format("🎯 **%d등급 → %d등급 도약 로드맵**\n\n", userGrade, Math.max(1, userGrade - 1)));

        // 현재 상태 진단
        roadmap.append("📊 **현재 실력 진단**\n");
        if (score >= 80) {
            roadmap.append("우수한 기본기를 바탕으로 실수만 줄이면 상위 등급 도약이 가능합니다.\n");
        } else if (score >= 60) {
            roadmap.append("기본 개념은 이해하고 있으나 응용력 향상이 필요한 상황입니다.\n");
        } else {
            roadmap.append("기초 개념부터 차근차근 다시 정리하는 것이 최우선입니다.\n");
        }

        roadmap.append("\n").append(conceptPriority).append("\n");
        roadmap.append(weeklyPlan).append("\n");
        roadmap.append(recommendedResources).append("\n");

        roadmap.append("🎖️ **성공을 위한 핵심 포인트**\n");
        roadmap.append("- 매일 조금씩이라도 꾸준히 하는 것이 가장 중요합니다\n");
        roadmap.append("- 틀린 문제는 반드시 다시 풀어보고 완전히 이해하세요\n");
        roadmap.append("- 개념 이해 없는 단순 암기는 피하세요\n");
        roadmap.append("- 2주마다 모의고사를 통해 실력 점검을 하세요\n");

        return roadmap.toString();
    }

    /**
     * 기본 로드맵 생성 (오류 시)
     */
    private String generateDefaultRoadmap(int userGrade) {
        return String.format("""
            🎯 **%d등급 학생을 위한 기본 학습 가이드**

            **1단계: 기본 개념 정리** (1-2주)
            - 교과서 해당 단원 완전 정복
            - 기본 공식과 정리 암기
            - 간단한 예제 문제 풀이

            **2단계: 유형별 문제 연습** (2-3주)  
            - 문제집 A단계부터 순차적 학습
            - 오답노트 작성 및 복습
            - 비슷한 유형 반복 연습

            **3단계: 실전 연습** (1-2주)
            - 시간 제한 내 문제 풀이
            - 모의고사 형태 연습
            - 최종 점검 및 보완

            **핵심 포인트:**
            - 꾸준함이 가장 중요합니다
            - 이해되지 않는 부분은 반드시 질문하세요  
            - 매주 학습 진도를 점검하세요
            """, userGrade);
    }
}