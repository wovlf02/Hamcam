package com.hamcam.back.config.socket;

import com.hamcam.back.global.exception.ForbiddenException;
import com.hamcam.back.service.study.team.livekit.LivekitBridgeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * STOMP 인터셉터(프로토타입/로컬 시연)
 * - CONNECT: 세션 사용자 식별 필수
 * - SUBSCRIBE: /topic/rooms/{room}/** ACL + 팀 멤버십 검증(있으면)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private static final String ATTR_USER_ID = "USER_ID";
    private static final Pattern ROOM_TOPIC = Pattern.compile("^/topic/rooms/([^/]+)(?:/.*)?$");
    private static final Pattern ROOM_NAME  = Pattern.compile("^(focus|quiz)-\\d+$");

    @Nullable
    private final LivekitBridgeService bridgeService; // 없으면 멤버십 검증 생략

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor acc = StompHeaderAccessor.wrap(message);
        StompCommand cmd = acc.getCommand();
        if (cmd == null) return message; // HEARTBEAT 등

        Map<String, Object> attrs = acc.getSessionAttributes();
        Long userId = (attrs != null) ? asLong(attrs.get(ATTR_USER_ID)) : null;

        if (cmd == StompCommand.CONNECT) {
            require(userId != null, "no session");
            // Principal 주입(선택). java.security.Principal만 사용. 보안 의존성 없음.
            acc.setUser(() -> "u:" + userId);
            return message;
        }

        if (cmd == StompCommand.SUBSCRIBE) {
            require(userId != null, "no session");
            String dest = acc.getDestination();
            require(dest != null, "no destination");

            String room = extractRoom(dest);
            require(room != null, "invalid topic");
            require(ROOM_NAME.matcher(room).matches(), "invalid room");

            if (bridgeService != null) {
                boolean ok = bridgeService.hasMembership(userId, room);
                require(ok, "not a room member");
            }
            return message;
        }

        return message; // SEND/UNSUBSCRIBE 등은 이번 범위에서 미검증
    }

    /* util */

    private static void require(boolean cond, String msg) {
        if (!cond) throw new ForbiddenException(msg); // 403
    }

    @Nullable
    private static Long asLong(Object v) {
        if (v instanceof Long l) return l;
        if (v instanceof Integer i) return i.longValue();
        if (v instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    @Nullable
    private static String extractRoom(String destination) {
        Matcher m = ROOM_TOPIC.matcher(destination);
        return m.matches() ? m.group(1) : null;
    }
}
