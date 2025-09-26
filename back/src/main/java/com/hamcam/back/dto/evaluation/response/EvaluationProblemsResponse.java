package com.hamcam.back.dto.evaluation.response;

import com.hamcam.back.entity.study.team.Problem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 단원평가 문제 목록 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationProblemsResponse {

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
     * 문제 목록
     */
    private List<ProblemInfo> problems;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProblemInfo {
        private Long problemId;
        private String title;
        private String content;
        private String[] choices;
        private String difficulty;
        private String imagePath;
        private String passage; // 국어 지문
        
        public static ProblemInfo from(Problem problem, String difficulty) {
            return ProblemInfo.builder()
                    .problemId(problem.getProblemId())
                    .title(problem.getTitle())
                    .content(problem.getContent())
                    .choices(problem.getChoicesArray())
                    .difficulty(difficulty)
                    .imagePath(problem.getImagePath())
                    .passage(problem.getPassage() != null ? problem.getPassage().getContent() : null)
                    .build();
        }
    }
}