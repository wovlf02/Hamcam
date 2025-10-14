# 팀 스터디 실시간 아키텍처: 분석 및 성능 개선 최종 제안

## 1. 문서 개요

### 1.1. 목적
본 문서는 Hamcam 프로젝트의 핵심 기능인 `시간 경쟁방` 및 `문제풀이방`의 실시간 상호작용(채팅, 랭킹, 상태 동기화 등)에서 발생하는 심각한 성능 저하 문제의 원인을 기술적으로 분석하고, 이를 해결하기 위한 최종 아키텍처 개선안을 제시하는 것을 목적으로 한다.

### 1.2. 문제 정의
- **현상:** 사용자가 스터디방에서 상호작용할 때, UI 응답이 눈에 띄게 느리거나 지연됨. (예: 랭킹 업데이트, 정답 제출 피드백)
- **영향:** 실시간성이 핵심인 기능에서 사용자 경험이 크게 저하되어 기능의 본질적인 가치를 훼손함.

### 1.3. 결론 요약
현재의 이중 소켓 시스템과 Spring 백엔드에 집중된 실시간 처리 구조가 성능 저하의 명백한 원인이다. **모든 실시간 로직을 경량의 Node.js/Socket.IO 서버로 통합**하고, Spring은 API 서버 본연의 역할에 집중하도록 아키텍처를 전면 개편하여 문제를 해결한다.

---

## 2. 현행 아키텍처 심층 분석 (As-Is)

### 2.1. 시스템 구성도
```
+------------------+      (HTTP/REST)       +----------------------+
|                  | <--------------------> |                      |
|   React Client   |                        |  Spring Boot Backend |
| (웹 브라우저)    |      (STOMP over WS)   |  (Port 8080)         |
|                  | <--------------------> |                      |
+------------------+                        +----------------------+
       |                                              |
       | (Socket.IO)                                  | (DB/Redis I/O)
       |                                              |
       v                                              v
+------------------+                        +----------------------+
|  Node.js Server  |                        |  Database / Cache    |
| (Port 4000)      |                        |  (MySQL, Redis)      |
+------------------+                        +----------------------+
```

### 2.2. 구성 요소별 역할과 문제점

| 구성 요소 | 역할 | 기술 스택 | 문제점 |
| :--- | :--- | :--- | :--- |
| **React Client** | UI 렌더링, 사용자 입력 처리 | React, StompJS, Socket.IO-Client | **두 개의 소켓 연결**을 동시에 관리해야 하므로 코드 복잡성 및 리소스 소모 증가. |
| **Spring Backend** | REST API, **실시간 비즈니스 로직 처리** | Spring MVC, Spring WebSocket, STOMP | **성능 병목의 핵심.** 모든 실시간 메시지 처리에 무거운 애플리케이션 컨텍스트(인증, 트랜잭션 등)를 사용하며, **빈번한 DB/Redis I/O**를 유발함. |
| **Node.js Server** | WebRTC 시그널링 중계 | Node.js, Socket.IO | 역할이 매우 제한적으로, 경량/비동기 특성을 제대로 활용하지 못하고 있음. |
| **DB/Cache** | 데이터 영속성, 세션 관리 | MySQL, Redis | 실시간 상태 조회/수정 용도로 사용되기에는 **본질적으로 느림**. |

### 2.3. 주요 상호작용 흐름과 병목 지점
**`시간 경쟁방` 랭킹 업데이트 흐름:**
1.  `Client`: 1초마다 `stomp.send("/app/focus/update-time", ...)` 호출.
2.  `Spring`: STOMP 메시지 수신 후 `FocusRoomSocketService.updateFocusTime()` 실행.
3.  `Service`: 메모리(ConcurrentHashMap)의 시간을 1 증가시킴.
4.  `Service`: **(병목 지점 ①)** `getCurrentRanking()` 호출.
5.  `Service`: **(병목 지점 ②)** 랭킹에 포함된 모든 유저의 최신 정보를 얻기 위해 `userRepository.findById()`를 **반복 호출** (N+1 문제 발생 가능성).
6.  `Spring`: `SimpMessagingTemplate`을 통해 `/sub/focus/room/...`으로 결과 브로드캐스트.
7.  `Client`: 메시지 수신 후 UI 리렌더링.

**분석:** 1초마다 발생하는 이벤트 처리를 위해 **DB I/O가 최소 1회 이상** 발생한다. 사용자가 N명일 경우, 최악의 상황에서는 N번의 DB 조회가 발생할 수 있다. 이는 실시간 애플리케이션에서 절대적으로 피해야 할 안티패턴이다.

---

## 3. 개선 아키텍처 제안 (To-Be)

### 3.1. 목표
- **단일화:** 모든 실시간 통신 채널을 **Node.js/Socket.IO로 단일화**한다.
- **경량화:** 실시간 로직을 경량의 비동기 환경(Node.js)에서 처리한다.
- **역할 분리:** Spring은 데이터 영속성과 비즈니스 API, Node.js는 실시간 상태 관리 및 이벤트 처리를 명확히 분담한다.

### 3.2. 변경 후 시스템 구성도
```
+------------------+      (HTTP/REST)       +----------------------+
|                  | <--------------------> |                      |
|   React Client   |                        |  Spring Boot Backend |
| (웹 브라우저)    |      (Socket.IO)       |  (Port 8080)         |
|                  | <--------------------> |                      |
+------------------+                        +----------------------+
       ^                                              ^
       |                                              | (HTTP/REST for persistence)
       | (All real-time events)                       |
       |                                              |
+-----------------------------------------------------+
|                                                     |
|            Node.js Server (Port 4000)               |
|  - WebRTC Signaling                                 |
|  - Real-time Logic (Chat, Ranking, etc.)            |
|  - In-Memory State Management (Room Status)         |
|                                                     |
+-----------------------------------------------------+
```

### 3.3. 핵심 개선 전략

#### 전략 1: 실시간 로직의 완전한 이전
- Spring의 `FocusRoomSocketController`, `QuizRoomSocketController`와 관련 서비스의 모든 메서드 로직을 `signalingServer.js`의 `socket.on()` 이벤트 핸들러로 재구현한다.
- **결과:** Spring은 더 이상 실시간 메시지를 직접 처리하지 않는다.

#### 전략 2: 인메모리(In-Memory) 상태 관리
- `signalingServer.js`에 **방 상태를 관리하는 전역 객체**를 도입한다. 이 객체는 DB를 대체하는 실시간 데이터 저장소 역할을 한다.
- **구조 예시:**
  ```javascript
  const rooms = new Map();
  // rooms.get(roomId) -> {
  //   problem: { id, title, imagePath, answer },
  //   participants: new Map(), // socket.id -> { userId, nickname, focusedSeconds, isReady, ... }
  //   hostId: userId,
  //   chatHistory: []
  // }
  ```
- **동작 방식:**
  1.  사용자가 `join-room` 이벤트로 입장 시, Node 서버는 Spring API(`GET /api/users/me`)를 호출하여 사용자 정보를 가져온 후, 위 `rooms` 객체에 저장한다.
  2.  이후 모든 실시간 이벤트(`update-time`, `submit-answer` 등)는 **오직 이 메모리 객체만을 읽고 수정**한다. DB/Redis 접근이 전혀 발생하지 않는다.

#### 전략 3: 데이터 영속성 분리
- 실시간 처리는 메모리에서만 이루어지지만, 데이터는 영구적으로 저장되어야 한다.
- **해결책:** "이벤트 기반 영속성(Event-based Persistence)" 모델을 도입한다.
- **동작 방식:**
  1.  **Spring:** `POST /api/study/team/record`와 같은 **결과 기록용 API**를 신규 생성한다.
  2.  **Node.js:** 방이 정상적으로 종료되거나, 중요한 상태 변경(예: 퀴즈 종료)이 발생했을 때, 메모리에 축적된 최종 결과 데이터를 모아 위 API를 호출하여 DB에 저장 요청을 보낸다.
- **장점:** 실시간 경로와 데이터 저장 경로가 분리되어, DB 부하가 실시간 성능에 영향을 주지 않는다.

---

## 4. 상세 실행 계획 (Roadmap)

### Phase 1: 환경 재구성 (Prerequisites)
1.  **[Backend]** `build.gradle`에서 `spring-boot-starter-websocket` 의존성을 주석 처리하거나 삭제한다.
2.  **[Backend]** STOMP 관련 설정, 컨트롤러, 서비스를 모두 삭제한다. (`/config/socket`, `/controller/study/team/*SocketController.java` 등)
3.  **[Frontend]** `package.json`에서 `sockjs-client`, `@stomp/stompjs` 의존성을 삭제한다. (`npm uninstall`)
4.  **[Frontend]** `FocusRoom.js`, `QuizRoom.js` 등에서 STOMP 연결 로직을 모두 삭제한다.

### Phase 2: Node.js 서버 기능 확장
1.  **[Signaling Server]** `axios` 라이브러리를 추가하여 Spring API를 호출할 수 있도록 준비한다.
2.  **[Signaling Server]** 위 `3.3. 전략 2`에서 설계한 `rooms` 상태 관리 객체를 구현한다.
3.  **[Signaling Server]** `socket.on('join-room', ...)` 핸들러를 수정하여, Spring API로 유저 정보를 조회하고 `rooms` 객체에 참여자 정보를 초기화하는 로직을 추가한다.
4.  **[Signaling Server]** 기존 Spring STOMP 컨트롤러에 있던 모든 `@MessageMapping`에 대응하는 `socket.on()` 이벤트 핸들러를 구현한다. (예: `socket.on('start-problem', ...)`, `socket.on('submit-answer', ...)`)
    - 모든 로직은 `rooms` 메모리 객체를 읽고 쓰는 방식으로만 동작해야 한다.
    - 상태 변경 후, `io.to(roomId).emit(...)`을 통해 변경된 결과를 즉시 클라이언트에게 브로드캐스트한다.
5.  **[Signaling Server]** 방 종료 시점에 Spring으로 데이터를 전송하는 로직을 구현한다.

### Phase 3: Backend API 개발
1.  **[Backend]** `TeamStudyRestController` 또는 신규 컨트롤러에 `POST /api/study/team/record` 엔드포인트를 개발한다.
    - 이 API는 Node.js 서버로부터의 요청만 허용하도록 IP 화이트리스트나 별도의 인증 키를 사용하는 것이 좋다.
    - 요청받은 데이터를 분석하여 `StudyLog`, `QuizResult` 등 관련 엔터티에 맞게 DB에 저장한다.

### Phase 4: Frontend 로직 전환
1.  **[Frontend]** `useTeamStudySocket`이라는 새로운 커스텀 훅을 생성하여 모든 Socket.IO 관련 로직을 캡슐화한다.
2.  **[Frontend]** `FocusRoom.js`, `QuizRoom.js`는 이 훅을 사용하여 서버와 통신한다.
    - `useEffect`에서 소켓 연결 및 `join-room` 이벤트를 전송한다.
    - `socket.emit()`으로 서버에 이벤트를 보낸다. (예: `socket.emit('submit-answer', { answer })`)
    - `socket.on()`으로 서버로부터의 상태 업데이트를 수신한다. (예: `socket.on('ranking-update', setRanking)`)
3.  **[Frontend]** 모든 UI 컴포넌트가 Socket.IO 기반의 새로운 데이터 흐름에 맞게 동작하도록 수정한다.

---

## 5. 결론
제시된 아키텍처는 복잡하고 비효율적인 현재 구조를 **단순하고 빠른 구조**로 전환하는 것을 목표로 한다. 실시간 처리는 Node.js의 비동기/인메모리 특성을 최대한 활용하고, 데이터의 영속성은 안정적인 Spring API를 통해 보장함으로써 **성능과 안정성** 두 마리 토끼를 모두 잡을 수 있다. 이 계획을 따르면 사용자가 체감하는 속도는 극적으로 향상될 것이며, 향후 기능 확장 및 유지보수 또한 훨씬 용이해질 것이다.