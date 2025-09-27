# LiveKit 스트리밍 기능 구현 설계

이 문서는 `FocusRoom`과 `QuizRoom`에 LiveKit을 사용한 실시간 캠/마이크 스트리밍 기능을 통합하기 위한 구체적인 단계별 구현 계획을 설명합니다. 현재 LiveKit 서버는 Docker를 통해 실행 중이며, 기본 API 호출이 가능한 상태임을 전제로 합니다.

## Phase 1: 백엔드 - API 안정화 및 권한 검증 강화

**목표**: 프론트엔드에 안전하고 신뢰할 수 있는 LiveKit 접속 토큰을 발급합니다. 특히, 방에 참여할 권한이 있는 사용자인지 검증하는 로직을 추가하여 보안을 강화합니다.

1.  **파일 수정**: `back/src/main/java/com/hamcam/back/service/livekit/LivekitService.java` (또는 이를 호출하는 `LivekitController`)

2.  **로직 흐름 상세**:
    1.  **기존 로직**: 현재 `LivekitController`는 세션에서 `userId`를 추출하고, 요청받은 `roomType`, `roomId`로 토큰을 발급합니다.
    2.  **개선 로직**: 토큰 발급 전, 해당 `userId`가 요청된 `roomId`에 실제로 참여할 권한이 있는지 확인하는 절차를 추가해야 합니다. `StudyRoomParticipantRepository`를 사용하여 이를 검증합니다.

3.  **구현 상세**:
    *   `LivekitController` 또는 `LivekitService`에 `StudyRoomParticipantRepository`를 의존성으로 주입합니다.
    *   `issueToken` 메서드 내에서 토큰을 생성하기 전, 다음 코드를 추가하여 참여자 여부를 확인합니다.
        ```java
        // 예시 코드 (LivekitController.java 내)
        boolean isParticipant = studyRoomParticipantRepository.existsByStudyRoomIdAndUserId(req.getRoomId(), userId);
        if (!isParticipant) {
            throw new ForbiddenException(ErrorCode.NOT_PARTICIPANT); // 403 Forbidden 응답
        }
        // ... 기존 토큰 발급 로직 ...
        ```

4.  **테스트 방안**:
    *   **성공 케이스**: Postman 또는 유사한 도구를 사용하여, 특정 스터디방에 참여 중인 사용자의 세션으로 `POST /api/livekit/token`을 요청합니다. `200 OK`와 함께 유효한 JWT가 반환되는지 확인합니다.
    *   **실패 케이스**: 스터디방에 참여하지 않은 사용자의 세션으로 동일한 요청을 보냈을 때, `403 Forbidden` 응답과 함께 `NOT_PARTICIPANT` 에러 코드가 반환되는지 확인합니다.

---

## Phase 2: 프론트엔드 - 핵심 WebRTC 로직 추상화 (Custom Hook)

**목표**: LiveKit 연결, 미디어 트랙 관리, 참여자 상태 관리 등 복잡한 WebRTC 로직을 `useWebRTC`라는 단일 커스텀 훅으로 추상화하여 재사용성을 극대화합니다.

1.  **파일 수정**: `front/src/features/rtc/hooks/useWebRTC.js`

2.  **역할**: 이 훅은 WebRTC와 관련된 모든 상태 및 로직을 관리하는 중앙 허브가 됩니다.

3.  **구현 상세**:
    *   훅은 `roomType`과 `roomId`를 인자로 받습니다.
    *   `useState`를 사용하여 `room`, `participants`, `connectionState` 등을 관리합니다.
    *   **`connectToRoom` 함수**:
        1.  `api.js`를 사용해 백엔드(`POST /api/livekit/token`)로 토큰을 요청합니다.
        2.  `new Room()`으로 LiveKit 룸 객체를 생성합니다.
        3.  `room.on(...)`을 사용하여 `participantConnected`, `trackSubscribed` 등 핵심 이벤트를 리스닝하고, 이벤트 발생 시 `participants` 상태를 업데이트합니다.
        4.  `await room.connect(url, token)`으로 서버에 연결합니다.
        5.  연결 성공 후, `await room.localParticipant.setCameraEnabled(true)` 및 `setMicrophoneEnabled(true)`를 호출하여 로컬 미디어를 발행합니다.
    *   **`disconnectFromRoom` 함수**: `room.disconnect()`를 호출하여 연결을 종료하고 관련 상태를 정리합니다.
    *   **미디어 제어 함수**: `toggleAudio`, `toggleVideo` 함수를 구현하여 로컬 참여자의 마이크/카메라를 켜고 끕니다.
    *   훅은 최종적으로 `{ room, participants, connectToRoom, disconnectFromRoom, toggleAudio, toggleVideo }` 등의 상태와 함수를 반환합니다.

4.  **테스트 방안**:
    *   UI와 결합되기 전까지는 `console.log`를 사용하여 각 단계(토큰 요청, 연결, 이벤트 수신, 상태 변경)의 로그를 확인하며 개발합니다. 실제 테스트는 Phase 3에서 진행합니다.

---

## Phase 3: 프론트엔드 - 스트리밍 UI 컴포넌트 구현

**목표**: LiveKit의 UI 컴포넌트를 활용하여 참여자들의 비디오를 표시할 재사용 가능한 컴포넌트를 만듭니다.

1.  **파일 생성**: `front/src/features/rtc/components/VideoConference.js`

2.  **역할**: `useWebRTC` 훅에서 받은 `room` 객체를 사용하여 전체 화상 회의 UI를 렌더링합니다.

3.  **구현 상세**:
    *   `@livekit/components-react` 라이브러리의 `LiveKitRoom`, `GridLayout`, `ParticipantTile`, `ControlBar` 컴포넌트를 사용합니다.
    *   컴포넌트는 `useWebRTC` 훅에서 반환된 `room`, `connect`, `disconnect` 등의 함수와 상태를 사용합니다.
    *   `LiveKitRoom` 컴포넌트로 전체를 감싸고, 서버 URL, 토큰, room 객체를 props로 전달합니다.
    *   `GridLayout`과 `ParticipantTile`을 사용하여 참여자 비디오 그리드를 렌더링합니다.
    *   `ControlBar`를 사용하여 마이크/카메라 토글, 화면 공유, 연결 끊기 버튼을 포함한 제어판을 구현합니다.

    ```jsx
    // front/src/features/rtc/components/VideoConference.js 예시
    import { LiveKitRoom, GridLayout, ParticipantTile, ControlBar } from '@livekit/components-react';

    export const VideoConference = ({ room, token, serverUrl }) => {
      if (!token) return <div>Getting token...</div>;

      return (
        <LiveKitRoom
          serverUrl={serverUrl}
          token={token}
          connect={true}
          video={true}
          audio={true}
        >
          <GridLayout>
            <ParticipantTile />
          </GridLayout>
          <ControlBar />
        </LiveKitRoom>
      );
    };
    ```

4.  **테스트 방안**: 이 컴포넌트는 `FocusRoom`과 `QuizRoom`에 통합된 후 테스트됩니다.

---

## Phase 4: 프론트엔드 - `FocusRoom` 및 `QuizRoom`에 기능 통합

**목표**: `FocusRoom`과 `QuizRoom` 페이지에 `VideoConference` 컴포넌트를 통합하여 실제 스트리밍 기능을 활성화합니다.

1.  **파일 수정**:
    *   `front/src/features/study/pages/FocusRoom.js`
    *   `front/src/features/study/pages/QuizRoom.js`

2.  **로직 흐름 상세**:
    1.  각 페이지 컴포넌트에서 `roomId`를 URL 파라미터 등에서 가져옵니다.
    2.  `useEffect` 훅을 사용하여 컴포넌트가 마운트될 때 백엔드로부터 LiveKit 토큰을 비동기적으로 요청합니다. `useState`를 사용하여 토큰과 서버 URL을 저장합니다.
    3.  가져온 토큰과 서버 URL을 `VideoConference` 컴포넌트의 props로 전달하여 렌더링합니다.

3.  **구현 상세 (`FocusRoom.js` 예시)**:
    ```jsx
    import React, { useState, useEffect } from 'react';
    import { useParams } from 'react-router-dom';
    import { VideoConference } from '../../rtc/components/VideoConference';
    import api from '../../../api/api'; // axios 인스턴스

    const FocusRoom = () => {
      const { roomId } = useParams();
      const [token, setToken] = useState(null);
      const serverUrl = process.env.REACT_APP_LIVEKIT_URL; // .env 파일에 LiveKit URL 정의 필요

      useEffect(() => {
        const fetchToken = async () => {
          try {
            const response = await api.post('/livekit/token', {
              roomType: 'focus',
              roomId: roomId,
              role: 'publisher',
              ttl: 3600,
            });
            setToken(response.data.jwt);
          } catch (error) {
            console.error('Failed to fetch LiveKit token', error);
          }
        };

        if (roomId) {
          fetchToken();
        }
      }, [roomId]);

      return (
        <div>
          <h1>Focus Room {roomId}</h1>
          {token ? (
            <VideoConference serverUrl={serverUrl} token={token} />
          ) : (
            <div>Loading video...</div>
          )}
          {/* ... 기존 FocusRoom UI ... */}
        </div>
      );
    };

    export default FocusRoom;
    ```
    *   `QuizRoom.js`도 위와 거의 동일한 구조로 수정합니다. (`roomType`을 'quiz'로 변경)

4.  **테스트 방안**:
    *   **통합 테스트**: 두 명의 다른 사용자로 로그인하여 동일한 `FocusRoom` 또는 `QuizRoom`에 입장합니다.
    *   **기능 검증**:
        *   각 사용자의 캠과 마이크가 정상적으로 켜지고, 서로의 영상과 음성이 스트리밍되는지 확인합니다.
        *   `ControlBar`의 음소거, 카메라 끄기 버튼이 정상적으로 동작하는지 확인합니다.
        *   한 사용자가 페이지를 벗어나거나 연결을 끊었을 때, 다른 사용자의 화면에서 해당 참여자가 사라지는지 확인합니다.
        *   방에 재입장했을 때 스트리밍이 정상적으로 복구되는지 확인합니다.

이 계획을 따르면 백엔드와 프론트엔드 양쪽에서 체계적으로 LiveKit 스트리밍 기능을 연동하고 테스트할 수 있습니다.
