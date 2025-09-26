package com.hamcam.back.dto.evaluation.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 단원평가 시작 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartEvaluationRequest {

    /**
     * 단원 ID
     */
    private Long unitId;

    /**
     * 과목명
     */
    private String subject;

    /**
     * 단원명
     */
    private String unitName;

    /**
     * 난이도 레벨 (기본: 사용자의 현재 레벨에 따라 자동 설정)
     */
    private String level;
}