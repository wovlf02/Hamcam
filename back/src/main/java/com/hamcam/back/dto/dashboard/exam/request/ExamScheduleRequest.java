package com.hamcam.back.dto.dashboard.exam.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

/**
 * [ExamScheduleRequest]
 * 시험 일정 생성 요청 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamScheduleRequest {

    /**
     * 시험명 (예: 중간고사, 모의고사 등)
     */
    @NotBlank(message = "시험 제목은 필수입니다.")
    @Size(min = 2, max = 100, message = "시험 제목은 2자 이상 100자 이하여야 합니다.")
    @JsonProperty("title")
    private String title;

    /**
     * 시험 날짜 (예: 2025-05-30)
     */
    @NotNull(message = "시험 날짜는 필수입니다.")
    @JsonProperty("exam_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate examDate;
}

