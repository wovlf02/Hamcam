package com.hamcam.back.util;

import com.hamcam.back.global.exception.BadRequestException;
import com.hamcam.back.global.exception.ErrorCode;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * LiveKit 룸 네이밍/파싱 유틸
 * 규칙:
 *  - roomType: "focus" | "quiz"
 *  - roomName: "{roomType}-{roomId}" (예: focus-123)
 *  - roomId: 양의 정수
 */
public final class LivekitRoomNamer {

    public static final String FOCUS = "focus";
    public static final String QUIZ  = "quiz";

    private static final Pattern ROOM = Pattern.compile("^(focus|quiz)-(\\d+)$");

    private LivekitRoomNamer() {}

    /** roomType과 roomId로 표준 roomName 생성 */
    public static String roomName(String roomType, long roomId) {
        requireType(roomType);
        if (roomId <= 0) throw new BadRequestException(ErrorCode.INVALID_ROOM_NAME);
        return roomType + "-" + roomId;
    }

    /** roomName을 파싱해 (type, id)로 반환 */
    public static RoomKey parse(String roomName) {
        if (!StringUtil.hasText(roomName)) {
            throw new BadRequestException(ErrorCode.INVALID_ROOM_NAME);
        }
        Matcher m = ROOM.matcher(roomName);
        if (!m.matches()) throw new BadRequestException(ErrorCode.INVALID_ROOM_NAME);

        String type = m.group(1);          // focus | quiz
        long roomId = Long.parseLong(m.group(2));
        if (roomId <= 0) throw new BadRequestException(ErrorCode.INVALID_ROOM_NAME);

        return new RoomKey(type, roomId);
    }

    /** roomType 검증 */
    public static void requireType(String roomType) {
        if (!isValidType(roomType)) throw new BadRequestException(ErrorCode.INVALID_ROOM_TYPE);
    }

    /** 유효한 roomType 여부 */
    public static boolean isValidType(String roomType) {
        return Objects.equals(roomType, FOCUS) || Objects.equals(roomType, QUIZ);
    }

    /** 유효한 roomName 여부 */
    public static boolean isValidName(String roomName) {
        return StringUtil.hasText(roomName) && ROOM.matcher(roomName).matches();
    }

    /** roomName에서 type만 추출 */
    public static String typeOf(String roomName) {
        return parse(roomName).type();
    }

    /** roomName에서 id만 추출 */
    public static long idOf(String roomName) {
        return parse(roomName).roomId();
    }

    /** 파싱 결과 */
    public record RoomKey(String type, long roomId) {}

    /** 내부 문자열 유틸(외부 의존 최소화) */
    private static final class StringUtil {
        static boolean hasText(String s) {
            return s != null && !s.trim().isEmpty();
        }
    }
}
