package com.hamcam.back.dto.livekit.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import lombok.*;

/**
 * LiveKit 토큰 발급 요청
 * - roomType: focus | quiz
 * - role: publisher | subscriber  (기본 publisher)
 * - ttl: 초 단위(기본 컨트롤러에서 ttlCap으로 상한 적용)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LivekitTokenRequest {

    /** 스터디 방 식별자 */
    @NotNull
    @Positive
    private Long roomId;

    /** focus | quiz */
    @NotBlank
    @Pattern(regexp = "^(focus|quiz)$")
    private String roomType;

    /** publisher | subscriber (미지정 시 publisher) */
    @NotBlank
    @Builder.Default
    @Pattern(regexp = "^(publisher|subscriber)$")
    private String role = "publisher";

    /** 토큰 TTL(초). 컨트롤러에서 ttlCap으로 최소/최대 보정 */
    @NotNull
    @Min(60)
    @Max(86_400)
    private Long ttl;
}
