package com.hamcam.back.config.livekit;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

/**
 * application.yml 의 livekit.* 값을 바인딩한다.
 * 프로토타입/로컬 시연 전제:
 *  - apiKey, apiSecret, httpUrl, wsUrl, signalUrl, ttlCap
 *  - Spring Security 없이 세션 기반 식별만 사용
 */
@Data
@Validated
@Component
@ConfigurationProperties(prefix = "livekit")
public class LivekitProperties {

    /** LiveKit API Key */
    @NotBlank
    private String apiKey;

    /** LiveKit API Secret (JWT 서명에 사용) */
    @NotBlank
    @ToString.Exclude  // 로그에 노출 방지
    private String apiSecret;

    /** Admin/Room HTTP API Base (예: http://192.168.0.2:7880) */
    @NotBlank
    private String httpUrl;

    /** WebSocket Base (예: ws://192.168.0.2:7880) */
    @NotBlank
    private String wsUrl;

    /** Signal URL (SDK connect 대상, 보통 httpUrl와 동일) */
    @NotBlank
    private String signalUrl;

    /** 토큰 TTL 상한(초). 기본 3600, 최대 24h */
    @Positive
    @Max(86_400)
    private long ttlCap = 3600;
}
