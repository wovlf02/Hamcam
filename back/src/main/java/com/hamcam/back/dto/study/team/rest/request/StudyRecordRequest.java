package com.hamcam.back.dto.study.team.rest.request;

import lombok.Data;
import java.util.List;

/**
 * Node.js 서버가 최종 학습 결과를 전송할 때 사용하는 DTO
 */
@Data
public class StudyRecordRequest {
    private Long roomId;
    private List<ParticipantRecord> records;

    @Data
    public static class ParticipantRecord {
        private Long userId;
        private Integer focusedSeconds;
        private Integer score;
    }
}
