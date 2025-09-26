package com.hamcam.back.config.livekit;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.StringJoiner;

/**
 * LiveKit URL 헬퍼.
 * - httpUrl, wsUrl, signalUrl 정규화(뒤 슬래시 제거)
 * - REST 호출/프록시용 path 빌더 제공
 * 프로토타입/로컬 시연 전제: 최소 기능만 제공.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LivekitUrls {

    private final LivekitProperties props;

    @Getter @ToString.Exclude
    private String httpBase;

    @Getter @ToString.Exclude
    private String wsBase;

    @Getter @ToString.Exclude
    private String signalBase;

    @PostConstruct
    void init() {
        this.httpBase   = trimTrailingSlash(props.getHttpUrl());
        this.wsBase     = trimTrailingSlash(props.getWsUrl());
        this.signalBase = trimTrailingSlash(props.getSignalUrl());
        log.debug("LiveKitUrls initialized: httpBase={}, wsBase={}, signalBase={}",
                httpBase, wsBase, signalBase);
    }

    /** 프런트 SDK connect 대상 */
    public String signalUrl() {
        return signalBase;
    }

    /** HTTP 베이스 URL (예: http://192.168.0.2:7880) */
    public String httpUrl() {
        return httpBase;
    }

    /** WS 베이스 URL (예: ws://192.168.0.2:7880) */
    public String wsUrl() {
        return wsBase;
    }

    /** HTTP 경로 조립: httpBase + /seg1/seg2...  */
    public String http(String... pathSegments) {
        return httpBase + joinPath(pathSegments);
    }

    /**
     * LiveKit Twirp(RoomService/ParticipantService 등) 경로 헬퍼.
     * 예: twirp("livekit.RoomService","ListParticipants")
     * => httpBase + /twirp/livekit.RoomService/ListParticipants
     */
    public String twirp(String service, String method) {
        return httpBase + "/twirp/" + service + "/" + method;
    }

    /* 내부 유틸 */

    private static String trimTrailingSlash(String s) {
        if (s == null || s.isEmpty()) return s;
        int end = s.length();
        while (end > 0 && s.charAt(end - 1) == '/') end--;
        return (end == s.length()) ? s : s.substring(0, end);
    }

    private static String joinPath(String... segs) {
        if (segs == null || segs.length == 0) return "";
        StringJoiner j = new StringJoiner("/", "/", "");
        for (String s : segs) {
            if (s == null || s.isEmpty()) continue;
            String cleaned = s.startsWith("/") ? s.substring(1) : s;
            cleaned = cleaned.endsWith("/") ? cleaned.substring(0, cleaned.length() - 1) : cleaned;
            if (!cleaned.isEmpty()) j.add(cleaned);
        }
        String out = j.toString();
        return out.equals("/") ? "" : out; // 빈 세그먼트만 들어오면 빈 문자열 반환
    }
}
