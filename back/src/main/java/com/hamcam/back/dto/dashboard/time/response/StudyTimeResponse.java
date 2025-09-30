package com.hamcam.back.dto.dashboard.time.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudyTimeResponse {
    private int weeklyGoalMinutes;
    private int todayGoalMinutes;
    private int todayStudyMinutes;
}
