package com.hamcam.back.dto.dashboard.exam.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamScheduleUpdateRequest {
    private Long id;
    private String title;
    private String description;
    private LocalDate examDate;
}
