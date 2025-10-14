# 팀방 입장 시 LiveKit 스트리밍 로직 정밀 검토 및 개선 방안

이 문서는 Hamcam 프로젝트의 팀 스터디 방(FocusRoom, QuizRoom) 입장 시 LiveKit을 활용한 캠/마이크 스트리밍 로직을 정밀 검토하고, 안정적인 스트리밍 및 오류 없는 입장을 위한 개선 방안을 제시합니다.

## 1. 현재 상태 분석

### 1.1 LiveKit 서버 환경

*   **`docker-compose.yml`**:
    ```yaml
    version: "3.8"
    services:
      livekit:
        image: livekit/livekit-server:latest
        container_name: livekit
        command: ["--config", "/etc/livekit/livekit.yml", "--node-ip", "10.20.66.149"] # 서버 PC의 LAN IP로 변경
        volumes:
          - "C:/Project/Hamcam/livekit.yml:/etc/livekit/livekit.yml:ro"  # 네가 만든 livekit.yml 마운트
        ports:
          - "7880:7880/tcp"                 # WebSocket/API
          - "7881:7881/tcp"                 # ICE/TCP (fallback)
          - "40000-40100:40000-40100/udp"   # ICE/UDP (livekit.yml의 rtc.port_range_start/end와 일치)
        restart: unless-stopped
    ```
    *   LiveKit 서버는 Docker 컨테이너로 `livekit/livekit-server:latest` 이미지를 사용하여 실행됩니다.
    *   `--node-ip`를 통해 서버 PC의 LAN IP(`10.20.66.149`)로 설정되어 있습니다. 이는 로컬 네트워크 환경에서 LiveKit 서버가 올바른 IP를 사용하도록 합니다.
    *   `livekit.yml` 파일이 `/etc/livekit/livekit.yml` 경로로 컨테이너 내부에 마운트되어 설정이 적용됩니다.
    *   `7880/tcp` (WebSocket/API), `7881/tcp` (ICE/TCP), `40000-40100/udp` (ICE/UDP) 포트가 호스트와 컨테이너 간에 매핑되어 있습니다.

*   **`livekit.yml`**:
    ```yaml
    # C:\Project\Hamcam\livekit.yml
    port: 7880
    log_level: info

    rtc:
      tcp_port: 7881
      port_range_start: 40000
      port_range_end: 40100
      # --node-ip로 LAN IP를 넘길 것이므로 기본값 유지
      # use_external_ip: false

    # turn:
    #   enabled: false
    #   udp_port: 3478

    # ★ keys는 'API_KEY: API_SECRET' 형태의 맵이어야 함
    keys:
      devkey123: "78c9344275a8a63390768f35ccb864205edee5445cdb1e4b941878958d09e4b9e8475f678398e3d3927777bc82a8087c1d39db0d6497aa200c072ef4f8fac88b"
    ```
    *   LiveKit 서버의 기본 포트는 `7880`으로 설정되어 있습니다.
    *   RTC(Real-Time Communication)를 위한 TCP 포트 `7881`과 UDP 포트 범위 `40000-40100`이 명시되어 있습니다. 이는 `docker-compose.yml`의 포트 매핑과 일치합니다.
    *   `keys` 섹션에 `devkey123`이라는 API 키와 시크릿이 정의되어 있습니다. 이 키는 LiveKit 토큰을 생성할 때 사용됩니다.

### 1.2 백엔드 (Spring Boot)

*   **LiveKit 관련 API 엔드포인트**:
    *   `POST /api/livekit/token`: LiveKit 방에 접속하기 위한 JWT 토큰을 발급합니다. (roomName, isPresenter)
    *   `GET /api/study/team/livekit-token?roomName`: `isPresenter=false`로 고정된 토큰 발급 (현재 사용 여부 불확실, `API_ENDPOINTS.md`에 명시).
    *   `GET /livekit-token?roomName&isPresenter`: 퀴즈 소켓 컨트롤러 내 별도 공개 엔드포인트 (현재 사용 여부 불확실, `API_ENDPOINTS.md`에 명시).
    *   **주요 사용 엔드포인트는 `POST /api/livekit/token`으로 보입니다.**

*   **LiveKit 관련 서비스/컨트롤러**:
    *   `LivekitController.java`: `/api/livekit` 경로의 요청을 받아 LiveKit 토큰 발급 및 관련 상호작용을 관리합니다.
    *   `LivekitService.java`: LiveKit 서버와 통신하여 JWT 토큰을 생성하는 등 연동 로직을 처리합니다.
    *   `LivekitProperties.java`: `application.yml`에 정의된 LiveKit 관련 속성(API 키, URL 등)을 바인딩합니다.
    *   `LivekitUrls.java`: LiveKit API 호출에 필요한 URL을 동적으로 생성하는 헬퍼 클래스입니다.

*   **스터디룸 관련 엔터티/리포지토리**:
    *   `StudyRoomParticipantRepository`: `StudyRoomParticipant` 엔터티에 대한 데이터베이스 작업을 처리합니다. 이는 사용자가 특정 스터디 방에 참여하고 있는지 확인하는 데 사용될 수 있습니다.
    *   `StudyRoom`, `StudyRoomParticipant`: 스터디 방 및 참여자 정보를 담는 엔터티입니다.

### 1.3 프론트엔드 (React)

*   **RTC 관련 파일**:
    *   `front/src/features/rtc/hooks/useWebRTC.js`: LiveKit 연결, 스트림 관리, 미디어 장치 제어 로직을 추상화한 훅으로 계획되어 있습니다. (현재는 설계 문서에만 존재)
    *   `front/src/features/rtc/components/VideoConference.js`: LiveKit의 UI 컴포넌트를 활용하여 참여자들의 비디오를 표시할 재사용 가능한 컴포넌트로 계획되어 있습니다. (현재는 설계 문서에만 존재)
    *   `front/src/features/rtc/utils/livekit.js`: LiveKit 서버 연결 및 트랙 발행(publish)에 필요한 헬퍼 함수들을 제공합니다. (현재는 설계 문서에만 존재)

*   **스터디룸 페이지**:
    *   `front/src/features/study/pages/FocusRoom.js`: 팀원들과 함께 집중 시간을 경쟁하는 '공부방' 페이지입니다.
    *   `front/src/features/study/pages/QuizRoom.js`: 팀원들과 함께 실시간으로 문제를 풀고 경쟁하는 '문제풀이방' 페이지입니다.
    *   이 페이지들은 LiveKit 스트리밍 기능을 통합해야 합니다.

*   **LiveKit 클라이언트 라이브러리**:
    *   `livekit-client`: LiveKit WebRTC 클라이언트 라이브러리.
    *   `@livekit/components-react`: LiveKit UI 컴포넌트 라이브러리.

## 2. 개선 및 해결 방안

`livekit_streaming.md` 문서에 제시된 단계별 구현 계획을 따르며, 팀방 입장 시 오류를 최소화하고 안정적인 스트리밍을 제공하는 데 중점을 둡니다.

### 2.1 Phase 1: 백엔드 - API 안정화 및 권한 검증 강화

**목표**: 프론트엔드에 안전하고 신뢰할 수 있는 LiveKit 접속 토큰을 발급합니다. 특히, 방에 참여할 권한이 있는 사용자인지 검증하는 로직을 추가하여 보안을 강화합니다.

*   **파일 수정**: `back/src/main/java/com/hamcam/back/service/livekit/LivekitService.java` (또는 이를 호출하는 `LivekitController`)
*   **로직 흐름 상세**:
    1.  **기존 로직**: 현재 `LivekitController`는 세션에서 `userId`를 추출하고, 요청받은 `roomType`, `roomId`로 토큰을 발급합니다.
    2.  **개선 로직**: 토큰 발급 전, 해당 `userId`가 요청된 `roomId`에 실제로 참여할 권한이 있는지 확인하는 절차를 추가해야 합니다. `StudyRoomParticipantRepository`를 사용하여 이를 검증합니다.
*   **구현 상세**:
    *   `LivekitController` 또는 `LivekitService`에 `StudyRoomParticipantRepository`를 의존성으로 주입합니다.
    *   `issueToken` 메서드 내에서 토큰을 생성하기 전, 다음 코드를 추가하여 참여자 여부를 확인합니다.
        ```java
        // 예시 코드 (LivekitService.java 내)
        // LivekitService.java에 StudyRoomParticipantRepository 주입
        private final StudyRoomParticipantRepository studyRoomParticipantRepository;

        public LivekitTokenResponse issueToken(LivekitTokenRequest req, Long userId) {
            // ... (기존 로직) ...

            // 룸 참여 권한 검증
            boolean isParticipant = studyRoomParticipantRepository.existsByStudyRoomIdAndUserId(req.getRoomId(), userId);
            if (!isParticipant) {
                throw new ForbiddenException(ErrorCode.NOT_PARTICIPANT); // 403 Forbidden 응답
            }

            // ... (기존 토큰 발급 로직) ...
        }
        ```
*   **테스트 방안**:
    *   **성공 케이스**: Postman 또는 유사한 도구를 사용하여, 특정 스터디방에 참여 중인 사용자의 세션으로 `POST /api/livekit/token`을 요청합니다. `200 OK`와 함께 유효한 JWT가 반환되는지 확인합니다.
    *   **실패 케이스**: 스터디방에 참여하지 않은 사용자의 세션으로 동일한 요청을 보냈을 때, `403 Forbidden` 응답과 함께 `NOT_PARTICIPANT` 에러 코드가 반환되는지 확인합니다.

### 2.2 Phase 2: 프론트엔드 - 핵심 WebRTC 로직 추상화 (Custom Hook)

**목표**: LiveKit 연결, 미디어 트랙 관리, 참여자 상태 관리 등 복잡한 WebRTC 로직을 `useWebRTC`라는 단일 커스텀 훅으로 추상화하여 재사용성을 극대화합니다.

*   **파일 생성**: `front/src/features/rtc/hooks/useWebRTC.js`
*   **역할**: 이 훅은 WebRTC와 관련된 모든 상태 및 로직을 관리하는 중앙 허브가 됩니다.
*   **구현 상세**:
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
*   **테스트 방안**:
    *   UI와 결합되기 전까지는 `console.log`를 사용하여 각 단계(토큰 요청, 연결, 이벤트 수신, 상태 변경)의 로그를 확인하며 개발합니다. 실제 테스트는 Phase 3에서 진행합니다.

### 2.3 Phase 3: 프론트엔드 - 스트리밍 UI 컴포넌트 구현

**목표**: LiveKit의 UI 컴포넌트를 활용하여 참여자들의 비디오를 표시할 재사용 가능한 컴포넌트를 만듭니다.

*   **파일 생성**: `front/src/features/rtc/components/VideoConference.js`
*   **역할**: `useWebRTC` 훅에서 받은 `room` 객체를 사용하여 전체 화상 회의 UI를 렌더링합니다.
*   **구현 상세**:
    *   `@livekit/components-react` 라이브러리의 `LiveKitRoom`, `GridLayout`, `ParticipantTile`, `ControlBar` 컴포넌트를 사용합니다.
    *   컴포넌트는 `useWebRTC` 훅에서 반환된 `room`, `connect`, `disconnect` 등의 함수와 상태를 사용합니다.
    *   `LiveKitRoom` 컴포넌트로 전체를 감싸고, 서버 URL, 토큰, room 객체를 props로 전달합니다.
    *   `GridLayout`과 `ParticipantTile`을 사용하여 참여자 비디오 그리드를 렌더링합니다.
    *   `ControlBar`를 사용하여 마이크/카메라 토글, 화면 공유, 연결 끊기 버튼을 포함한 제어판을 구현합니다.

    ```jsx
    // front/src/features/rtc/components/VideoConference.js 예시
    import React from 'react';
    import { LiveKitRoom, GridLayout, ParticipantTile, ControlBar, useRoomContext, useLocalParticipant, useParticipants } from '@livekit/components-react';
    import { Room } from 'livekit-client';

    const MyVideoConference = ({ token, serverUrl, room }) => {
      if (!token || !room) {
        return <div>Loading video conference...</div>;
      }

      return (
        <LiveKitRoom
          room={room} // useWebRTC 훅에서 생성된 room 객체를 전달
          token={token}
          serverUrl={serverUrl}
          connect={true}
          video={true}
          audio={true}
          data-lk-theme="default"
        >
          <VideoGridLayout />
          <ControlBar />
        </LiveKitRoom>
      );
    };

    const VideoGridLayout = () => {
      const participants = useParticipants();
      const { localParticipant } = useLocalParticipant();

      // 로컬 참여자를 가장 먼저 렌더링하도록 정렬
      const sortedParticipants = [localParticipant, ...participants.filter(p => p.identity !== localParticipant.identity)];

      return (
        <GridLayout participants={sortedParticipants}>
          {sortedParticipants.map((participant) => (
            <ParticipantTile key={participant.identity} participant={participant} />
          ))}
        </GridLayout>
      );
    };

    export default MyVideoConference;
    ```
*   **테스트 방안**: 이 컴포넌트는 `FocusRoom`과 `QuizRoom`에 통합된 후 테스트됩니다.

### 2.4 Phase 4: 프론트엔드 - `FocusRoom` 및 `QuizRoom`에 기능 통합

**목표**: `FocusRoom`과 `QuizRoom` 페이지에 `VideoConference` 컴포넌트를 통합하여 실제 스트리밍 기능을 활성화합니다.

*   **파일 수정**:
    *   `front/src/features/study/pages/FocusRoom.js`
    *   `front/src/features/study/pages/QuizRoom.js`
*   **로직 흐름 상세**:
    1.  각 페이지 컴포넌트에서 `roomId`를 URL 파라미터 등에서 가져옵니다.
    2.  `useEffect` 훅을 사용하여 컴포넌트가 마운트될 때 백엔드로부터 LiveKit 토큰을 비동기적으로 요청합니다. `useState`를 사용하여 토큰과 서버 URL을 저장합니다.
    3.  가져온 토큰과 서버 URL을 `VideoConference` 컴포넌트의 props로 전달하여 렌더링합니다.
*   **구현 상세 (`FocusRoom.js` 예시)**:
    ```jsx
    // front/src/features/study/pages/FocusRoom.js
    import React, { useState, useEffect, useRef } from 'react';
    import { useParams } from 'react-router-dom';
    import MyVideoConference from '../../rtc/components/VideoConference'; // 이름 변경
    import api from '../../../api/api'; // axios 인스턴스
    import { Room } from 'livekit-client'; // LiveKit Room 객체 임포트

    const FocusRoom = () => {
      const { roomId } = useParams();
      const [token, setToken] = useState(null);
      const [livekitRoom, setLivekitRoom] = useState(null); // LiveKit Room 객체 상태
      const serverUrl = process.env.REACT_APP_LIVEKIT_URL || 'ws://localhost:7880'; // .env 파일에 LiveKit URL 정의 필요

      useEffect(() => {
        const fetchTokenAndConnect = async () => {
          if (!roomId) return;

          try {
            // 1. LiveKit 토큰 요청
            const response = await api.post('/livekit/token', {
              roomType: 'focus', // 또는 'quiz'
              roomId: roomId,
              role: 'publisher', // 또는 'viewer' 등 역할에 따라
              ttl: 3600,
            });
            const fetchedToken = response.data.jwt;
            setToken(fetchedToken);

            // 2. LiveKit Room 객체 생성 및 연결
            const room = new Room();
            setLivekitRoom(room); // Room 객체 상태 저장

            // 이벤트 리스너 설정 (필요에 따라 추가)
            room.on('participantConnected', (participant) => {
              console.log('Participant connected:', participant.identity);
            });
            room.on('participantDisconnected', (participant) => {
              console.log('Participant disconnected:', participant.identity);
            });
            room.on('connectionStateChanged', (state) => {
              console.log('Connection state changed:', state);
            });
            room.on('mediaDeviceError', (error) => {
              console.error('Media device error:', error);
              // 사용자에게 미디어 장치 오류를 알리는 UI 표시
            });

            await room.connect(serverUrl, fetchedToken);
            console.log('Connected to LiveKit room:', room.name);

            // 로컬 미디어 발행 (자동 발행이 LiveKitRoom 컴포넌트에서 처리될 경우 생략 가능)
            // await room.localParticipant.setCameraEnabled(true);
            // await room.localParticipant.setMicrophoneEnabled(true);

          } catch (error) {
            console.error('Failed to fetch LiveKit token or connect to room', error);
            // 오류 발생 시 사용자에게 알림 또는 리다이렉션 처리
            alert('팀방 입장 중 오류가 발생했습니다. 다시 시도해주세요.');
            // navigate('/teamStudy'); // 예시: 팀 스터디 목록 페이지로 리다이렉션
          }
        };

        fetchTokenAndConnect();

        // 컴포넌트 언마운트 시 LiveKit 연결 해제
        return () => {
          if (livekitRoom) {
            livekitRoom.disconnect();
            console.log('Disconnected from LiveKit room');
          }
        };
      }, [roomId, serverUrl]); // livekitRoom은 의존성 배열에 넣지 않음 (useEffect 내부에서 설정되므로)

      return (
        <div>
          <h1>Focus Room {roomId}</h1>
          {token && livekitRoom ? (
            <MyVideoConference serverUrl={serverUrl} token={token} room={livekitRoom} />
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
*   **테스트 방안**:
    *   **통합 테스트**: 두 명의 다른 사용자로 로그인하여 동일한 `FocusRoom` 또는 `QuizRoom`에 입장합니다.
    *   **기능 검증**:
        *   각 사용자의 캠과 마이크가 정상적으로 켜지고, 서로의 영상과 음성이 스트리밍되는지 확인합니다.
        *   `ControlBar`의 음소거, 카메라 끄기 버튼이 정상적으로 동작하는지 확인합니다.
        *   한 사용자가 페이지를 벗어나거나 연결을 끊었을 때, 다른 사용자의 화면에서 해당 참여자가 사라지는지 확인합니다.
        *   방에 재입장했을 때 스트리밍이 정상적으로 복구되는지 확인합니다.

### 2.5 오류 처리 방안

*   **토큰 발급 실패**: 백엔드에서 `ForbiddenException` (권한 없음) 또는 기타 예외 발생 시, 프론트엔드에서 `try-catch` 블록을 통해 이를 감지하고 사용자에게 적절한 메시지(예: "방에 참여할 권한이 없습니다.")를 표시하거나 이전 페이지로 리다이렉션합니다.
*   **LiveKit 연결 실패**: `room.connect()` 호출 시 네트워크 문제, 서버 오류 등으로 연결에 실패할 경우 `catch` 블록에서 처리합니다. 사용자에게 "실시간 연결에 실패했습니다. 네트워크 상태를 확인해주세요."와 같은 메시지를 표시합니다.
*   **미디어 장치 접근 실패**: 브라우저에서 카메라/마이크 접근 권한이 없거나 장치에 문제가 있을 경우, `room.on('mediaDeviceError', ...)` 이벤트를 통해 감지하고 사용자에게 권한 허용을 요청하거나 장치 상태를 확인하도록 안내합니다.
*   **`process.env.REACT_APP_LIVEKIT_URL` 설정**: 프론트엔드 `.env` 파일에 LiveKit 서버의 WebSocket URL을 명확히 정의하여 환경에 따라 유연하게 대응하도록 합니다. 예: `REACT_APP_LIVEKIT_URL=ws://localhost:7880` (개발 환경) 또는 `wss://your.livekit.domain` (배포 환경).

이 계획을 따르면 백엔드와 프론트엔드 양쪽에서 체계적으로 LiveKit 스트리밍 기능을 연동하고 테스트할 수 있으며, 팀방 입장 시 발생할 수 있는 오류를 효과적으로 처리할 수 있습니다.
