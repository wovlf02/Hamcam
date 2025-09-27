package com.hamcam.back.dto.user.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * [GradeUpdateRequest]
 *
 * 사용자 등급 수정 요청 DTO입니다.
 * - 1등급(최우수) ~ 5등급(기초) 범위로 제한됩니다.
 */
@Getter
@Setter
@NoArgsConstructor
public class GradeUpdateRequest {

    @NotNull(message = "등급은 필수입니다.")
    @Min(value = 1, message = "등급은 1등급 이상이어야 합니다.")
    @Max(value = 5, message = "등급은 5등급 이하여야 합니다.")
    private Integer grade;
}