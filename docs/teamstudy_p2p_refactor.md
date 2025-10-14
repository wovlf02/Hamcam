# 팀 스터디 P2P 전환 기능 명세

## 1. 개요

본 문서는 `team-study/focus`와 `team-study/quiz` 기능의 백엔드 및 프론트엔드 구조를 개편하여, 기존의 LiveKit 기반 미디어 서버 의존성을 제거하고 **WebRTC를 이용한 P2P(Peer-to-Peer) 방식으로 전환**하기 위한 상세 명세를 정의합니다.

- **목표:** LiveKit 관련 코드를 모두 제거하고, `signaling_server` (Socket.IO)를 통해 사용자 간의 WebRTC 연결을 중계하여 2명 이상의 사용자가 캠/마이크를 스트리밍할 수 있도록 구현합니다.
- **핵심 변경:**
    - **미디어 처리:** 중앙 서버(LiveKit) 경유 방식 → 사용자 간 직접 연결(P2P)
    - **시그널링:** STOMP/WebSocket 혼용 → **Socket.IO 단일화** (기존 `signalingServer.js` 활용)
    - **백엔드 역할:** 토큰 발급 및 미디어 관리 → **방 상태 관리** (참여자, 방장 등) 및 **권한 제어**에 집중

---

## 2. 기술 스택 변경

| 구분 | 기존 (As-Is) | 변경 (To-Be) | 비고 |
| --- | --- | --- | --- |
| **미디어 스트리밍** | `livekit-client`, `@livekit/components-react` | 브라우저 네이티브 `RTCPeerConnection` API | 라이브러리 의존성 제거, 경량화 |
| **시그널링** | Spring STOMP, `signalingServer.js` (Socket.IO) 혼용 | `signalingServer.js` (Socket.IO) | 모든 실시간 통신 채널 단일화 |
| **백엔드 (Spring)** | LiveKit 토큰 발급 API | 방장 관리, 참여자 상태 관리 REST API | `LivekitController`, `LivekitService` 등 제거 |
| **프론트엔드 (React)** | `useWebRTC.js`, `livekit.js` 유틸 | `useP2PRoom.js` (신규 훅) | P2P 연결 및 상태 관리 로직 추상화 |

---

## 3. 상세 기능 명세

### 3.1. 백엔드 (Spring Boot)

LiveKit 관련 모든 코드를 삭제하고, 방의 상태와 권한을 관리하는 역할에 집중합니다.

#### 3.1.1. API 변경 사항

1.  **`DELETE: /api/livekit/token`**
    - 해당 `LivekitController` 및 관련 DTO, Service를 **완전히 삭제**합니다.

2.  **`DELETE: /api/study/team/delete/{roomId}`**
    - **방장(Host)만 호출 가능**하도록 권한 검증 로직을 추가합니다.
    - `TeamStudyRestService`에서 요청을 보낸 사용자의 `userId`와 `StudyRoom` 엔터티의 `hostId`를 비교합니다.
    - 일치하지 않을 경우, `403 Forbidden` (권한 없음) 응답을 반환합니다.

#### 3.1.2. 데이터베이스 (Entity) 변경

1.  **`StudyRoom` 엔터티 수정**
    - 방장 정보를 저장하기 위해 `hostId` 필드를 추가합니다.
    ```java
    // back/src/main/java/com/hamcam/back/entity/study/team/StudyRoom.java
    @Column(name = "host_id")
    private Long hostId;
    ```

2.  **`StudyRoomParticipant` 엔터티 수정**
    - 방장 위임을 위해 참여자가 방에 들어온 시간을 기록하는 `joinedAt` 필드를 추가합니다.
    - 이 필드는 방장 유고 시 차기 방장을 결정하는 기준이 됩니다.
    ```java
    // back/src/main/java/com/hamcam/back/entity/study/team/StudyRoomParticipant.java
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();
    ```

#### 3.1.3. 방장 자동 위임 로직

- **시나리오:** 사용자가 스터디방에서 나갈 때(WebSocket 연결 해제 또는 `leave` API 호출 시)
- **구현 위치:** `TeamStudyRestService` 또는 별도의 `StudyRoomStateService`
- **로직:**
    1.  방을 나가는 사용자의 `userId`와 해당 방의 `hostId`를 비교합니다.
    2.  **만약 나가는 사용자가 방장이라면:**
        a. `StudyRoomParticipantRepository`에서 해당 방의 참여자 목록을 `joinedAt` 기준으로 오름차순 정렬하여 조회합니다.
        b. 나가는 자신을 제외한 **가장 먼저 들어온 사용자**를 차기 방장으로 선정합니다.
        c. `StudyRoom` 엔터티의 `hostId`를 새로 선정된 사용자의 `userId`로 업데이트합니다.
        d. **(중요)** 변경된 방장 정보를 프론트엔드에 알리기 위해 `signaling_server`로 `host-changed` 이벤트를 전달합니다. (내부 API 호출 또는 메시지 큐 사용)

### 3.2. 시그널링 서버 (Node.js / Socket.IO)

`signalingServer.js`를 확장하여 WebRTC 시그널링과 채팅, 상태 동기화를 모두 처리합니다.

#### 3.2.1. Socket.IO 이벤트 명세

- **Client → Server**
    - `join-room ({ roomId, userId, nickname })`: 사용자가 방에 입장. 서버는 해당 `socket.id`를 `roomId`에 join시키고, 사용자 정보를 소켓에 저장.
    - `offer ({ targetSocketId, sdp })`: WebRTC `offer` SDP를 특정 사용자(`targetSocketId`)에게 전달 요청.
    - `answer ({ targetSocketId, sdp })`: WebRTC `answer` SDP를 특정 사용자에게 전달 요청.
    - `ice-candidate ({ targetSocketId, candidate })`: ICE Candidate를 특정 사용자에게 전달 요청.
    - `send-message ({ roomId, message })`: 채팅 메시지를 해당 `roomId`에 전송 요청.
    - `leave-room ({ roomId })`: 사용자가 방을 나감을 명시적으로 알림.

- **Server → Client**
    - `all-users (users)`: 방에 새로 입장한 사용자에게 기존에 있던 사용자 목록(`{socketId, userId, nickname}` 배열)을 전송.
    - `user-joined (user)`: 방 안의 다른 사용자들에게 새로 들어온 사용자 정보(`{socketId, userId, nickname}`)를 알림.
    - `user-left (socketId)`: 사용자가 방을 나갔음을 알림. 프론트엔드는 이를 받아 해당 사용자의 비디오 엘리먼트와 `RTCPeerConnection`을 정리.
    - `offer ({ fromSocketId, sdp })`: `offer` SDP를 수신.
    - `answer ({ fromSocketId, sdp })`: `answer` SDP를 수신.
    - `ice-candidate ({ fromSocketId, candidate })`: ICE Candidate를 수신.
    - `new-message ({ senderSocketId, userId, nickname, message, timestamp })`: 새로운 채팅 메시지를 방 전체에 브로드캐스트.
    - `host-changed ({ newHostId })`: 방장이 변경되었음을 방 전체에 알림.
    - `room-participants-update ({ roomId, count })`: 특정 방의 참여자 수가 변경될 때마다 `TeamStudy` 목록 페이지에 실시간 업데이트를 위해 브로드캐스트.

### 3.3. 프론트엔드 (React)

LiveKit 관련 코드를 모두 제거하고, P2P 연결을 관리하는 커스텀 훅과 UI 컴포넌트를 새로 구현합니다.

#### 3.3.1. 신규 커스텀 훅: `useP2PRoom.js`

- **역할:** Socket.IO 연결, WebRTC 피어(Peer) 관리, 미디어 스트림 상태 관리를 포함한 모든 P2P 통신 로직을 캡슐화합니다.
- **반환 값 (상태 및 함수):**
    - `localStream`: 내 로컬 비디오/오디오 스트림.
    - `peers: Map<socketId, { peer: RTCPeerConnection, stream: MediaStream }>`: 연결된 모든 피어의 `RTCPeerConnection` 객체와 원격 스트림을 관리하는 Map.
    - `participants: Array<{socketId, userId, nickname}>`: 현재 참여자 목록.
    - `hostId`: 현재 방장의 `userId`.
    - `sendMessage(message)`: 채팅 메시지 전송 함수.
    - `toggleMute()`, `toggleCamera()`: 내 미디어 장치 제어 함수.
    - `leaveRoom()`: 방 나가기 함수.
- **내부 로직:**
    1.  컴포넌트 마운트 시 Socket.IO 서버에 연결하고 `join-room` 이벤트를 보냅니다.
    2.  `all-users` 이벤트를 받으면, 각 사용자에 대해 `RTCPeerConnection`을 생성하고 `offer`를 보냅니다.
    3.  `user-joined` 이벤트를 받으면, 새로 들어온 사용자를 위해 `RTCPeerConnection`을 생성합니다.
    4.  `offer`, `answer`, `ice-candidate` 이벤트를 수신하여 각 피어와의 연결을 설정합니다.
    5.  `user-left` 이벤트를 받으면, 해당 `socketId`에 해당하는 피어 연결을 정리합니다.
    6.  `host-changed` 이벤트를 수신하여 `hostId` 상태를 업데이트합니다.

#### 3.3.2. 컴포넌트 변경 사항

1.  **`FocusRoom.js`, `QuizRoom.js`**
    - 기존 LiveKit 관련 로직을 모두 제거합니다.
    - `useP2PRoom(roomId)` 훅을 호출하여 P2P 관련 상태와 함수를 가져옵니다.
    - `VideoGrid` 컴포넌트에 `localStream`과 `peers` 상태를 전달하여 비디오 화면을 렌더링합니다.
    - 채팅 컴포넌트는 `useP2PRoom`에서 제공하는 `sendMessage` 함수와 `messages` 상태를 사용하도록 수정합니다.
    - 방 삭제 버튼은 현재 사용자의 `userId`와 `hostId`가 일치할 때만 보이도록 조건부 렌더링을 추가합니다.

2.  **`VideoGrid.js` (신규 또는 수정)**
    - `localStream`을 표시할 `video` 엘리먼트 하나와, `peers` Map을 순회하며 각 원격 스트림을 표시할 `video` 엘리먼트들을 렌더링합니다.

3.  **`TeamStudy.js` (방 목록 페이지)**
    - 페이지 로드 시 Socket.IO에 연결하여 `room-participants-update` 이벤트를 구독합니다.
    - 이벤트 수신 시, 해당 `roomId`를 가진 방 카드의 참여자 수를 실시간으로 업데이트하여 UX를 개선합니다.

---

## 4. P2P 연결 흐름 (User Flow)

1.  **사용자 A**가 `/team-study/focus/1`에 접속합니다.
2.  **[A-Front]** `useP2PRoom` 훅이 Socket.IO 서버에 `join-room({ roomId: 1, ... })` 이벤트를 보냅니다.
3.  **[Server]** A를 `1`번 방에 join시키고, 현재 방에 A밖에 없으므로 `all-users`로 빈 배열을 보냅니다.
4.  **[A-Back]** 백엔드는 A를 방의 첫 참여자로 인식하고, `StudyRoom`의 `hostId`를 A의 `userId`로 설정합니다.
5.  **사용자 B**가 동일한 방에 접속합니다.
6.  **[B-Front]** `useP2PRoom` 훅이 `join-room({ roomId: 1, ... })` 이벤트를 보냅니다.
7.  **[Server]** B를 `1`번 방에 join시키고, B에게는 `all-users` 이벤트로 A의 정보를 `{ socketId, ... }` 형태로 보냅니다. 동시에, A에게는 `user-joined` 이벤트로 B의 정보를 보냅니다.
8.  **[B-Front]** `all-users`를 수신한 B는 A에 대한 `RTCPeerConnection`을 생성하고, `createOffer`를 호출한 뒤 `offer` 이벤트를 A의 `socketId`를 타겟으로 서버에 보냅니다.
9.  **[Server]** `offer`를 A에게 중계합니다.
10. **[A-Front]** `offer`를 수신한 A는 B에 대한 `RTCPeerConnection`을 생성하고, 수신한 `offer`를 `setRemoteDescription`으로 설정합니다. 그 후 `createAnswer`를 호출하여 `answer` 이벤트를 B의 `socketId`를 타겟으로 서버에 보냅니다.
11. **[Server]** `answer`를 B에게 중계합니다.
12. **[B-Front]** `answer`를 수신한 B는 `setRemoteDescription`으로 설정을 완료합니다.
13. **[A, B-Front]** 각자 생성된 `ice-candidate`들을 서버를 통해 서로에게 교환합니다.
14. **[결과]** A와 B 사이에 P2P 연결이 수립되고, 미디어 스트림이 직접 교환되기 시작합니다.
