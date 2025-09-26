package com.hamcam.back.util;

import java.util.Objects;

/**
 * Redis 키 네이밍 유틸.
 *
 * 규칙
 * - 전역 prefix: "hamcam:"
 * - 앱 상태만 저장. 참가자/미디어 실시간 상태는 절대 저장하지 않는다.
 *   (presence, track, participant 등 금지)
 *
 * 권장 자료구조
 * - 랭킹: ZSET (score = 누적점수/집중시간 등)
 * - 알림: STREAM/LIST (사용자별 푸시 큐)
 */
public final class RedisKeys {

    private static final String ROOT = "hamcam:";
    private static final String RANKING = "ranking:";
    private static final String ALERTS  = "alerts:";

    // roomType 값: "focus" | "quiz"
    private static final String FOCUS = LivekitRoomNamer.FOCUS;
    private static final String QUIZ  = LivekitRoomNamer.QUIZ;

    private RedisKeys() {}

    /* ================================
       랭킹 (앱 상태)
       --------------------------------
       ZSET   hamcam:ranking:{roomType}:{roomId}
              member = "u:{userId}", score = 누적값
       Hash   hamcam:ranking:snapshot:{roomType}:{roomId} (옵션)
     ================================= */

    public static String rankingZset(String roomType, long roomId) {
        requireType(roomType);
        requirePositive(roomId);
        return ROOT + RANKING + roomType + ":" + roomId;
    }

    public static String rankingSnapshotHash(String roomType, long roomId) {
        requireType(roomType);
        requirePositive(roomId);
        return ROOT + RANKING + "snapshot:" + roomType + ":" + roomId;
    }

    /* ================================
       알림 (앱 상태)
       --------------------------------
       STREAM hamcam:alerts:user:{userId}
       LIST   hamcam:alerts:room:{roomType}:{roomId} (옵션)
     ================================= */

    public static String userAlertsStream(long userId) {
        requirePositive(userId);
        return ROOT + ALERTS + "user:" + userId;
    }

    public static String roomAlertsList(String roomType, long roomId) {
        requireType(roomType);
        requirePositive(roomId);
        return ROOT + ALERTS + "room:" + roomType + ":" + roomId;
    }

    /* ================================
       금지된 범주
       --------------------------------
       아래 형태의 키는 생성/사용 금지:
       - 참가자 실시간 상태(ex: participants:*, media:*, tracks:*)
       - 개별 트랙/구독 상태
       코드 레벨에서 메서드 자체를 제공하지 않는다.
     ================================= */

    /* ================================
       공용 헬퍼
     ================================= */

    private static void requireType(String roomType) {
        if (!Objects.equals(roomType, FOCUS) && !Objects.equals(roomType, QUIZ)) {
            // 키 유틸은 입력이 코드 내부에서만 오므로 단순 검증 예외 사용
            throw new IllegalArgumentException("invalid roomType: " + roomType);
        }
    }

    private static void requirePositive(long id) {
        if (id <= 0) throw new IllegalArgumentException("id must be positive");
    }
}
