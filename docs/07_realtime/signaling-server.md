# 시그널링 서버

**관련 문서**: [WebRTC P2P](./webrtc-p2p.md) | [WebSocket/STOMP](./websocket.md) | [시스템 설계](../03_architecture/system-design.md)

---

## 1. 개요

시그널링 서버는 WebRTC P2P 연결을 위한 신호 중계 역할을 합니다.

### 1.1 역할

- **방 관리**: 스터디방 입장/퇴장 처리
- **시그널 중계**: SDP Offer/Answer, ICE Candidate 교환
- **접속자 수 관리**: 실시간 참여자 수 브로드캐스트
- **채팅 중계**: 스터디방 내 실시간 채팅
- **집중 시간 동기화**: 참여자별 집중 시간 브로드캐스트

### 1.2 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 22.17.0 | JavaScript 런타임 |
| Socket.IO | 4.x | WebSocket 서버 |
| Axios | - | Spring API 호출 |
| HTTP | 내장 | HTTP 서버 |

---

## 2. 서버 구조

### 2.1 파일 구조

```
signaling_server/
├── package.json           # 의존성 정의
├── package-lock.json
└── signalingServer.js     # 메인 서버 코드
```

### 2.2 서버 설정

```javascript
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    // REST 엔드포인트 처리
});

// Socket.IO 서버
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            // 허용된 Origin 검사
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 포트 4000에서 실행
server.listen(4000);
```

---

## 3. REST 엔드포인트

### 3.1 실시간 접속자 수 조회

```
GET /room-counts
```

**응답**
```json
{
    "room-1": 3,
    "room-2": 5,
    "room-3": 2
}
```

---

## 4. Socket.IO 이벤트

### 4.1 클라이언트 → 서버

| 이벤트 | 데이터 | 설명 |
|--------|--------|------|
| `join-room` | `{ roomId, token }` | 방 입장 |
| `signal` | `{ targetSocketId, sdp, candidate }` | WebRTC 시그널 |
| `send-message` | `{ roomId, message }` | 채팅 메시지 전송 |
| `focus-time-update` | `{ userId, time }` | 집중 시간 업데이트 |
| `start-problem` | `{ roomId, subject, unit, level }` | 문제 시작 (퀴즈방) |
| `submit-answer` | `{ roomId, answer }` | 정답 제출 (퀴즈방) |

### 4.2 서버 → 클라이언트

| 이벤트 | 데이터 | 설명 |
|--------|--------|------|
| `all-users` | `[{ socketId, nickname, ... }]` | 기존 참여자 목록 |
| `user-joined` | `{ socketId, nickname, ... }` | 새 참여자 알림 |
| `user-left` | `socketId` | 참여자 퇴장 알림 |
| `signal` | `{ fromSocketId, sdp, candidate }` | WebRTC 시그널 수신 |
| `new-message` | `{ userId, nickname, message, timestamp }` | 새 메시지 |
| `focus-time-update` | `{ userId, time }` | 집중 시간 업데이트 |
| `room-count-update` | `{ roomId, count }` | 접속자 수 변경 |
| `error` | `message` | 오류 메시지 |

---

## 5. 이벤트 상세

### 5.1 방 입장 (join-room)

```javascript
socket.on("join-room", async ({ roomId, token }) => {
    // 1. Spring API로 사용자 정보 조회
    const response = await axios.get(`${SPRING_API_URL}/users/me`, {
        headers: { 'Cookie': socket.request.headers.cookie }
    });
    const user = response.data.data;

    // 2. Socket.IO 룸 입장
    socket.join(roomId);

    // 3. 인메모리 상태 관리
    if (!rooms.has(roomId)) {
        rooms.set(roomId, { participants: new Map() });
    }
    const room = rooms.get(roomId);
    room.participants.set(socket.id, {
        user_id: user.user_id,
        nickname: user.nickname,
        profileImageUrl: user.profile_image_url,
        focusedSeconds: 0,
        score: 0
    });

    // 4. 기존 참여자 목록 전송
    socket.emit("all-users", otherParticipants);

    // 5. 새 참여자 알림 브로드캐스트
    socket.to(roomId).emit("user-joined", { socketId, ...participantInfo });

    // 6. 접속자 수 업데이트 브로드캐스트
    io.emit("room-count-update", { roomId, count: room.participants.size });
});
```

### 5.2 시그널 중계 (signal)

```javascript
socket.on("signal", ({ targetSocketId, sdp, candidate }) => {
    // 대상 소켓에 시그널 전달
    socket.to(targetSocketId).emit("signal", {
        fromSocketId: socket.id,
        sdp,
        candidate,
    });
});
```

### 5.3 채팅 메시지 (send-message)

```javascript
socket.on("send-message", ({ roomId, message }) => {
    const room = rooms.get(roomId);
    const sender = room?.participants.get(socket.id);
    if (!sender) return;

    const chatMessage = {
        userId: sender.user_id,
        nickname: sender.nickname,
        profileImageUrl: sender.profileImageUrl,
        message,
        timestamp: new Date()
    };

    // 방 전체에 메시지 브로드캐스트
    io.to(roomId).emit("new-message", chatMessage);
});
```

### 5.4 집중 시간 업데이트 (focus-time-update)

```javascript
socket.on("focus-time-update", ({ userId, time }) => {
    const roomId = findRoomBySocketId(socket.id);
    const room = rooms.get(roomId);
    
    if (room) {
        const participant = room.participants.get(socket.id);
        if (participant) {
            participant.focusedSeconds = time;
        }
    }

    // 방 전체에 업데이트 브로드캐스트
    io.to(roomId).emit("focus-time-update", { userId, time });
});
```

### 5.5 연결 해제 (disconnecting)

```javascript
socket.on("disconnecting", () => {
    const roomIds = Array.from(socket.rooms).filter(r => r !== socket.id);

    roomIds.forEach(roomId => {
        const room = rooms.get(roomId);
        if (room) {
            // 참여자 제거
            room.participants.delete(socket.id);
            
            // 퇴장 알림
            io.to(roomId).emit("user-left", socket.id);

            // 접속자 수 업데이트
            io.emit("room-count-update", {
                roomId,
                count: room.participants.size
            });

            // 빈 방 정리
            if (room.participants.size === 0) {
                rooms.delete(roomId);
            }
        }
    });
});
```

---

## 6. 인메모리 상태 관리

### 6.1 rooms 구조

```javascript
const rooms = new Map();

// rooms.get(roomId) 구조
{
    participants: Map {
        'socket-id-1' => {
            user_id: 1,
            nickname: "사용자1",
            profileImageUrl: "/uploads/profile/1.jpg",
            focusedSeconds: 3600,
            score: 100
        },
        'socket-id-2' => { ... }
    }
}
```

### 6.2 참여자 정보

| 필드 | 타입 | 설명 |
|------|------|------|
| user_id | number | 사용자 ID |
| nickname | string | 닉네임 |
| profileImageUrl | string | 프로필 이미지 URL |
| focusedSeconds | number | 집중 시간 (초) |
| score | number | 점수 (퀴즈방) |

---

## 7. Spring API 연동

### 7.1 API URL 설정

```javascript
// front/src/api/apiUrl.js 파일에서 동적으로 읽어옴
let SPRING_API_URL = "";
try {
    const apiUrlPath = path.join(__dirname, '..', 'front', 'src', 'api', 'apiUrl.js');
    const apiUrlFileContent = fs.readFileSync(apiUrlPath, 'utf8');
    const match = apiUrlFileContent.match(/export const API_BASE_URL_8080 = ["'`](.*)["'`];/);
    if (match && match[1]) {
        SPRING_API_URL = `${match[1]}/api`;
    }
} catch (error) {
    SPRING_API_URL = "http://localhost:8080/api"; // Fallback
}
```

### 7.2 사용자 정보 조회

```javascript
const response = await axios.get(`${SPRING_API_URL}/users/me`, {
    headers: { 'Cookie': socket.request.headers.cookie }
});
const user = response.data.data;
```

---

## 8. CORS 설정

```javascript
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            // 허용되는 Origin
            if (!origin || 
                origin.startsWith("http://localhost") || 
                origin.startsWith("http://127.0.0.1") || 
                origin.startsWith("http://192.168.") || 
                /\.ngrok-free\.app$/.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});
```

---

## 9. 클라이언트 연결

### 9.1 React 클라이언트 예시

```javascript
import { io } from 'socket.io-client';

// 연결
const socket = io('http://localhost:4000', {
    withCredentials: true
});

// 방 입장
socket.emit('join-room', { roomId: 'room-123' });

// 기존 참여자 수신
socket.on('all-users', (users) => {
    users.forEach(user => {
        // WebRTC 연결 시작
        createPeerConnection(user.socketId);
    });
});

// 새 참여자 알림
socket.on('user-joined', (user) => {
    createPeerConnection(user.socketId);
});

// 참여자 퇴장
socket.on('user-left', (socketId) => {
    removePeerConnection(socketId);
});

// 시그널 수신
socket.on('signal', ({ fromSocketId, sdp, candidate }) => {
    handleSignal(fromSocketId, sdp, candidate);
});
```

---

## 10. 실행

```bash
cd signaling_server

# 의존성 설치
npm install

# 서버 실행
node signalingServer.js
```

**로그 예시**
```
✅ Spring API URL을 동적으로 설정했습니다: http://localhost:8080/api
✅ Signaling 서버가 포트 4000에서 실행 중입니다.
✅ 사용자 연결됨: abc123...
[room-1] 사용자1(abc123) 님이 입장했습니다. (총 1명)
📊 [room-1] 접속자 수 업데이트 브로드캐스트: 1명
```
