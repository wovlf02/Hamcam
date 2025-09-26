package com.hamcam.back.controller.study.team;

import com.hamcam.back.dto.study.team.socket.response.PresenceMessage;
import com.hamcam.back.global.exception.BadRequestException;
import com.hamcam.back.global.exception.ErrorCode;
import com.hamcam.back.global.response.ApiResponse;
import com.hamcam.back.service.study.team.livekit.LivekitBridgeService;
import com.hamcam.back.util.LivekitRoomNamer;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PresenceController
 * - REST: 페이지 최초 진입 시 "팀 학습 방 멤버 명단" 조회
 * - STOMP: JOIN/LEAVE 실시간 브로드캐스트 (PresenceMessage 사용)
 * - Redis 등 영속 저장 없음
 */
@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping(path = "/api/study/team", produces = MediaType.APPLICATION_JSON_VALUE)
public class PresenceController {

    private final LivekitBridgeService bridgeService;
    private final SimpMessagingTemplate messaging;

    /** REST: 현재 방 멤버 명단 조회 */
    @GetMapping("/rooms/{roomType}/{roomId}/presence")
    public ResponseEntity<ApiResponse<PresenceResponse>> getPresence(
            @PathVariable @NotBlank String roomType,
            @PathVariable Long roomId
    ) {
        requireRoomType(roomType);
        if (roomId == null || roomId <= 0) {
            throw new BadRequestException(ErrorCode.INVALID_INPUT);
        }

        List<MemberView> members = bridgeService.getRoster(roomType, roomId)
                .stream()
                .map(m -> MemberView.builder()
                        .userId(m.userId())
                        .nickname(m.nickname())
                        .build())
                .toList();

        PresenceResponse body = PresenceResponse.builder()
                .roomType(roomType)
                .roomId(roomId)
                .members(members)
                .build();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(ApiResponse.ok(body));
    }

    /** STOMP: 클라이언트가 SEND → 서버가 브로드캐스트 */
    @MessageMapping("/rooms/{roomName}/presence")
    public void broadcastPresence(@DestinationVariable String roomName, PresenceMessage msg) {
        LivekitRoomNamer.parse(roomName); // 방 이름 유효성 검증
        if (msg == null || msg.getUserId() == null) {
            throw new BadRequestException(ErrorCode.INVALID_INPUT);
        }
        // 그대로 브로드캐스트
        messaging.convertAndSend("/topic/rooms/" + roomName + "/presence", msg);
    }

    /* 내부 유틸 */

    private static void requireRoomType(String rt) {
        if (!"focus".equals(rt) && !"quiz".equals(rt)) {
            throw new BadRequestException(ErrorCode.INVALID_ROOM_TYPE);
        }
    }

    /* ====== REST DTO ====== */

    @Data
    @Builder
    public static class PresenceResponse {
        private String roomType;          // focus | quiz
        private Long roomId;
        private List<MemberView> members; // 현재 팀 멤버 명단(연결 여부 아님)
    }

    @Data
    @Builder
    public static class MemberView {
        private Long userId;
        private String nickname;
    }
}
