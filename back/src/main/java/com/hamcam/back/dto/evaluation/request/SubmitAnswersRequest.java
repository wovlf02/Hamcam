package com.hamcam.back.dto.evaluation.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * 단원평가 답안 제출 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswersRequest {

    /**
     * 평가 ID
     */
    private Long evaluationId;

    /**
     * 제출된 답안들
     */
    private List<AnswerSubmission> answers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerSubmission {
        /**
         * 문제 ID
         */
        private Long problemId;

        /**
         * 학생 답안
         */
        private String userAnswer;

        /**
         * 문제 난이도
         */
        private String difficulty;
    }
}