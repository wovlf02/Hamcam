package com.hamcam.back.dto.evaluation.response;

import com.hamcam.back.entity.evaluation.UnitEvaluation;
import com.hamcam.back.entity.evaluation.EvaluationAnswer;
import com.hamcam.back.entity.evaluation.AiFeedback;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 단원평가 결과 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResultResponse {

    /**
     * 평가 ID
     */
    private Long evaluationId;

    /**
     * 단원명
     */
    private String unitName;

    /**
     * 과목명
     */
    private String subject;

    /**
     * 총 문제 수
     */
    private Integer totalQuestions;

    /**
     * 정답 수
     */
    private Integer correctAnswers;

    /**
     * 점수 (백분율)
     */
    private Double score;

    /**
     * 난이도별 정답 현황
     */
    private DifficultyScores difficultyScores;

    /**
     * 틀린 문제들
     */
    private List<WrongAnswerInfo> wrongAnswers;

    /**
     * AI 피드백
     */
    private AiFeedbackInfo aiFeedback;

    /**
     * 레벨업 여부
     */
    private boolean levelUp;

    /**
     * 새로운 레벨
     */
    private String newLevel;

    /**
     * 시험 완료 시간
     */
    private LocalDateTime completedAt;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DifficultyScores {
        private Integer easyCorrect;
        private Integer easyTotal;
        private Integer mediumCorrect;
        private Integer mediumTotal;
        private Integer hardCorrect;
        private Integer hardTotal;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WrongAnswerInfo {
        private Long problemId;
        private String problemTitle;
        private String problemContent;
        private String correctAnswer;
        private String userAnswer;
        private String explanation;
        private String difficulty;

        public static WrongAnswerInfo from(EvaluationAnswer answer) {
            return WrongAnswerInfo.builder()
                    .problemId(answer.getProblem().getProblemId())
                    .problemTitle(answer.getProblem().getTitle())
                    .problemContent(answer.getProblem().getContent())
                    .correctAnswer(answer.getProblem().getAnswer())
                    .userAnswer(answer.getUserAnswer())
                    .explanation(answer.getProblem().getExplanation())
                    .difficulty(answer.getDifficulty())
                    .build();
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AiFeedbackInfo {
        private String overallAnalysis;
        private String weakConcepts;
        private String studyRecommendations;
        private String futurePlan;
        private Integer estimatedStudyTime;
        private String recommendedProblemTypes;

        public static AiFeedbackInfo from(AiFeedback feedback) {
            return AiFeedbackInfo.builder()
                    .overallAnalysis(feedback.getOverallAnalysis())
                    .weakConcepts(feedback.getWeakConcepts())
                    .studyRecommendations(feedback.getStudyRecommendations())
                    .futurePlan(feedback.getFuturePlan())
                    .estimatedStudyTime(feedback.getEstimatedStudyTime())
                    .recommendedProblemTypes(feedback.getRecommendedProblemTypes())
                    .build();
        }
    }

    public static EvaluationResultResponse from(UnitEvaluation evaluation, 
                                               List<EvaluationAnswer> wrongAnswers,
                                               AiFeedback aiFeedback,
                                               boolean levelUp,
                                               String newLevel,
                                               DifficultyScores difficultyScores) {
        return EvaluationResultResponse.builder()
                .evaluationId(evaluation.getId())
                .unitName(evaluation.getUnit().getUnit())
                .subject(evaluation.getUnit().getSubject())
                .totalQuestions(evaluation.getTotalQuestions())
                .correctAnswers(evaluation.getCorrectAnswers())
                .score(evaluation.getScore())
                .difficultyScores(difficultyScores)
                .wrongAnswers(wrongAnswers.stream().map(WrongAnswerInfo::from).toList())
                .aiFeedback(aiFeedback != null ? AiFeedbackInfo.from(aiFeedback) : null)
                .levelUp(levelUp)
                .newLevel(newLevel)
                .completedAt(evaluation.getCompletedAt())
                .build();
    }
}