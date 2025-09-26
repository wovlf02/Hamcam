package com.hamcam.back.dto.livekit.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

/**
 * LiveKit 토큰 발급 응답 DTO
 * - jwt: LiveKit 접속용 토큰
 * - identity: "u:{userId}"
 * - signalUrl: SDK connect 대상 URL
 * - expiresAt: 만료 시각(epoch millis)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LivekitTokenResponse {

    /** LiveKit JWT 토큰 */
    private String jwt;

    /** 참가자 식별자 (identity = u:{userId}) */
    private String identity;

    /** Signal URL (예: http://192.168.0.2:7880) */
    private String signalUrl;

    /** 만료 시각(epoch millis) */
    private Long expiresAt;
}
