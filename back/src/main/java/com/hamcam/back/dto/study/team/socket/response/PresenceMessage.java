package com.hamcam.back.dto.study.team.socket.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * STOMP Presence 브로드캐스트 메시지
 * - type: JOIN | LEAVE
 * - userId, nickname 포함
 * - Redis에는 저장하지 않고 브로드캐스트만 사용
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PresenceMessage {

    /** JOIN | LEAVE */
    @NotBlank
    private String type;

    /** 사용자 식별자 */
    @NotNull
    private Long userId;

    /** 사용자 닉네임 */
    @NotBlank
    private String nickname;
}
