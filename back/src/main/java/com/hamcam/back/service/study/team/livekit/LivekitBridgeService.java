package com.hamcam.back.service.study.team.livekit;

import com.hamcam.back.global.exception.BadRequestException;
import com.hamcam.back.global.exception.ErrorCode;
import com.hamcam.back.repository.auth.UserRepository;
import com.hamcam.back.repository.study.StudyRoomParticipantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 팀 학습 도메인 ↔ LiveKit 룸 브리지
 * - 룸 네이밍: focus-{roomId} | quiz-{roomId}
 * - 멤버십 확인 및 초기 명단 조회만 담당
 * - 참가자/미디어 실시간 상태는 저장하지 않음(STOMP 브로드캐스트만)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LivekitBridgeService {

    private static final Pattern ROOM = Pattern.compile("^(focus|quiz)-(\\d+)$");

    private final StudyRoomParticipantRepository participantRepo;
    private final UserRepository userRepository; // 닉네임 조회 보조용

    /** STOMP SUBSCRIBE ACL용: 해당 roomName에 userId가 속하는지 여부 */
    public boolean hasMembership(Long userId, String roomName) {
        RoomKey k = parseRoomName(roomName);
        // 팀 룸 참여 여부만 확인. 없으면 false
        return participantRepo.existsByStudyRoomIdAndUserId(k.roomId, userId);
    }

    /** REST 초기 진입용: 방 타입+ID로 현재 팀 멤버 명단 조회 */
    public List<RosterItem> getRoster(String roomType, Long roomId) {
        requireRoomType(roomType);
        return participantRepo.findByStudyRoomId(roomId).stream()
                .map(p -> {
                    Long uid = extractUserId(p);
                    String nick = extractNickname(p);
                    if (nick == null) {
                        // 필요 시 사용자 테이블에서 보조 조회
                        nick = userRepository.findById(uid)
                                .map(u -> safe(u.getNickname()))
                                .orElse("user-" + uid);
                    }
                    return new RosterItem(uid, nick);
                })
                .toList();
    }

    /** 편의: roomName(focus-123)으로 명단 조회 */
    public List<RosterItem> getRoster(String roomName) {
        RoomKey k = parseRoomName(roomName);
        return getRoster(k.type, k.roomId);
    }

    /* ===== 내부 유틸 ===== */

    private static RoomKey parseRoomName(String roomName) {
        Matcher m = ROOM.matcher(roomName);
        if (!m.matches()) {
            // 문자열 대신 ErrorCode 사용
            throw new BadRequestException(ErrorCode.INVALID_ROOM_NAME); // 방 이름 오류
        }
        String type = m.group(1);          // focus | quiz
        long roomId = Long.parseLong(m.group(2));
        return new RoomKey(type, roomId);
    }

    private static void requireRoomType(String rt) {
        if (!"focus".equals(rt) && !"quiz".equals(rt)) {
            // 문자열 대신 ErrorCode 사용
            throw new BadRequestException(ErrorCode.INVALID_ROOM_TYPE); // 방 타입 오류
        }
    }

    // StudyRoomParticipant에서 userId 얻는 방식 추상화
    private static Long extractUserId(Object participant) {
        // 예상 형태 1) getUserId()
        try { return (Long) participant.getClass().getMethod("getUserId").invoke(participant); }
        catch (Exception ignored) { }
        // 예상 형태 2) getUser().getId()
        try {
            Object user = participant.getClass().getMethod("getUser").invoke(participant);
            if (user != null) {
                return (Long) user.getClass().getMethod("getId").invoke(user);
            }
        } catch (Exception ignored) { }
        throw new IllegalStateException("cannot resolve userId from participant");
    }

    // StudyRoomParticipant에서 nickname 얻는 방식 추상화(없으면 null)
    @Nullable
    private static String extractNickname(Object participant) {
        // 예상 형태 1) getNickname()
        try {
            Object v = participant.getClass().getMethod("getNickname").invoke(participant);
            return safe(v);
        } catch (Exception ignored) { }
        // 예상 형태 2) getUser().getNickname()
        try {
            Object user = participant.getClass().getMethod("getUser").invoke(participant);
            if (user != null) {
                Object v = user.getClass().getMethod("getNickname").invoke(user);
                return safe(v);
            }
        } catch (Exception ignored) { }
        return null;
    }

    @Nullable
    private static String safe(@Nullable Object o) {
        String s = (o == null) ? null : String.valueOf(o);
        return (s == null || s.isBlank()) ? null : s;
    }

    private record RoomKey(String type, long roomId) {}

    /** PresenceController가 기대하는 간단 뷰 모델 */
    public record RosterItem(Long userId, String nickname) {}
}
