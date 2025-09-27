package com.hamcam.back.controller.livekit;

import com.hamcam.back.config.livekit.LivekitProperties;
import com.hamcam.back.config.livekit.LivekitUrls;
import com.hamcam.back.dto.livekit.request.LivekitTokenRequest;
import com.hamcam.back.dto.livekit.response.LivekitTokenResponse;
import com.hamcam.back.global.exception.BadRequestException;
import com.hamcam.back.global.exception.ErrorCode;
import com.hamcam.back.global.exception.UnauthorizedException;
import com.hamcam.back.service.livekit.LivekitService;
import com.hamcam.back.util.LivekitRoomNamer;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

// @RestController  // LiveKit 비활성화
// @RequestMapping("/api/livekit")
public class LivekitController {

    private static final String ATTR_USER_ID = "userId";

    private final LivekitService livekitService;
    private final LivekitProperties props;
    private final LivekitUrls urls;

    public LivekitController(LivekitService livekitService,
                             LivekitProperties props,
                             LivekitUrls urls) {
        this.livekitService = livekitService;
        this.props = props;
        this.urls = urls;
    }

    /** Livekit 접속 토큰 발급: 세션 기반 식별, TTL cap, role 그대로 전달 */
    @PostMapping(path = "/token", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LivekitTokenResponse> issueToken(
            @Valid @RequestBody LivekitTokenRequest req,
            HttpSession session) {

        Long userId = extractUserId(session);
        validate(req);

        String identity = "u:" + userId;
        String roomName = LivekitRoomNamer.roomName(req.getRoomType(), req.getRoomId());
        long ttl = Math.min(req.getTtl(), props.getTtlCap());

        String jwt = livekitService.createJoinToken(identity, roomName, req.getRole(), ttl);

        LivekitTokenResponse body = new LivekitTokenResponse(
                jwt,
                identity,
                urls.signalUrl(),
                Instant.now().plusSeconds(ttl).toEpochMilli()
        );

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(body);
    }

    private static Long extractUserId(HttpSession session) {
        Object v = session.getAttribute(ATTR_USER_ID);
        if (v instanceof Long l) return l;
        if (v instanceof Integer i) return i.longValue();
        if (v instanceof String s) {
            try {
                return Long.parseLong(s);
            } catch (NumberFormatException ignored) {}
        }
        throw new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    }

    private static void validate(LivekitTokenRequest req) {
        if (req.getRoomId() == null || req.getRoomId() <= 0) {
            throw new BadRequestException(ErrorCode.INVALID_INPUT);
        }
        if (!LivekitRoomNamer.isValidType(req.getRoomType())) {
            throw new BadRequestException(ErrorCode.INVALID_ROOM_TYPE);
        }
        String role = req.getRole();
        if (!"publisher".equals(role) && !"subscriber".equals(role)) {
            throw new BadRequestException(ErrorCode.INVALID_INPUT);
        }
        if (req.getTtl() == null || req.getTtl() <= 0) {
            throw new BadRequestException(ErrorCode.INVALID_INPUT);
        }
    }
}
