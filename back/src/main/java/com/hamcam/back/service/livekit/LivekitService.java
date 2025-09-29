package com.hamcam.back.service.livekit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamcam.back.config.livekit.LivekitProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * LiveKitService
 * - 입력: identity("u:{userId}"), room("focus-{id}"|"quiz-{id}"), role("publisher"|"subscriber"), ttl(초)
 * - 출력: HS256 서명된 LiveKit JWT
 * - 권한: roomJoin, canPublish(역할에 따라), canSubscribe, canPublishData
 */
@Slf4j
// @Service  // LiveKit 비활성화
@RequiredArgsConstructor
public class LivekitService {

    private final LivekitProperties props;

    private SecretKeySpec hmacKey;
    private final ObjectMapper om = new ObjectMapper();

    @PostConstruct
    void init() {
        byte[] secret = tryHex(props.getApiSecret());
        if (secret == null) secret = props.getApiSecret().getBytes(StandardCharsets.UTF_8);
        this.hmacKey = new SecretKeySpec(secret, "HmacSHA256");
        log.debug("LiveKitService initialized");
    }

    /** LiveKit 접속 토큰 생성 */
    public String createJoinToken(String identity, String room, String role, long ttlSeconds) {
        long now = Instant.now().getEpochSecond();
        long exp = now + ttlSeconds;

        Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");

        Map<String, Object> payload = new HashMap<>();
        payload.put("iss", props.getApiKey());   // API Key
        payload.put("sub", identity);            // 사용자 식별자
        payload.put("nbf", now - 1);
        payload.put("iat", now);
        payload.put("exp", exp);

        // LiveKit video grant
        Map<String, Object> video = new HashMap<>();
        video.put("roomJoin", true);
        video.put("room", room);
        video.put("canPublish", "publisher".equals(role));
        video.put("canSubscribe", true);
        video.put("canPublishData", true);

        payload.put("video", video);
        payload.put("name", identity);   // 선택
        payload.put("metadata", "{}");   // 선택

        return signHS256(header, payload);
    }

    /* ===== 내부 유틸 ===== */

    private String signHS256(Map<String, Object> header, Map<String, Object> payload) {
        try {
            String h = b64url(om.writeValueAsBytes(header));
            String p = b64url(om.writeValueAsBytes(payload));
            String input = h + "." + p;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(hmacKey);
            byte[] sig = mac.doFinal(input.getBytes(StandardCharsets.UTF_8));
            return input + "." + b64url(sig);
        } catch (Exception e) {
            throw new RuntimeException("livekit token signing failed", e);
        }
    }

    private static String b64url(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }

    /** hex 문자열이면 디코드. 아니면 null */
    private static byte[] tryHex(String s) {
        try {
            int n = s.length();
            if (n % 2 != 0) return null;
            byte[] out = new byte[n / 2];
            for (int i = 0; i < n; i += 2) {
                out[i / 2] = (byte) Integer.parseInt(s.substring(i, i + 2), 16);
            }
            return out;
        } catch (Exception ignore) {
            return null;
        }
    }
}
