# WebSocket/STOMP

**관련 문서**: [시그널링 서버](./signaling-server.md) | [WebRTC P2P](./webrtc-p2p.md)

---

## 1. 개요

Hamcam은 실시간 채팅을 위해 Spring WebSocket + STOMP 프로토콜을 사용합니다.

### 1.1 사용 목적

- **실시간 채팅**: 1:1 채팅, 그룹 채팅
- **메시지 브로드캐스트**: 채팅방 내 메시지 전달
- **읽음 상태 관리**: 메시지 읽음/안읽음 상태

### 1.2 기술 스택

| 기술 | 용도 |
|------|------|
| Spring WebSocket | WebSocket 서버 |
| STOMP | 메시징 프로토콜 |
| SockJS | WebSocket 폴백 |
| @stomp/stompjs | 클라이언트 라이브러리 |

---

## 2. 서버 설정

### 2.1 WebSocketConfig.java

```java
@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/ws/chat")
                .setAllowedOriginPatterns("*");
    }
}
```

### 2.2 ChatWebSocketHandler

```java
@Component
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.put(session.getId(), session);
        log.info("WebSocket 연결: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // 메시지 처리 로직
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        log.info("WebSocket 연결 해제: {}", session.getId());
    }
}
```

---

## 3. 메시지 구조

### 3.1 ChatMessage 엔티티

```java
@Entity
public class ChatMessage {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private ChatRoom chatRoom;
    
    @ManyToOne
    private User sender;
    
    @Enumerated(EnumType.STRING)
    private ChatMessageType messageType; // TEXT, IMAGE, FILE
    
    private String content;
    private String fileUrl;
    private LocalDateTime createdAt;
}
```

### 3.2 메시지 타입

| 타입 | 설명 |
|------|------|
| TEXT | 텍스트 메시지 |
| IMAGE | 이미지 파일 |
| FILE | 일반 파일 |

### 3.3 메시지 DTO

```java
public class ChatMessageDto {
    private Long chatRoomId;
    private Long senderId;
    private String senderNickname;
    private String senderProfileImageUrl;
    private String messageType;
    private String content;
    private String fileUrl;
    private LocalDateTime createdAt;
}
```

---

## 4. 채팅방 구조

### 4.1 ChatRoom 엔티티

```java
@Entity
public class ChatRoom {
    @Id @GeneratedValue
    private Long id;
    
    private String name;
    
    @Enumerated(EnumType.STRING)
    private ChatRoomType roomType; // PRIVATE, GROUP
    
    @OneToMany(mappedBy = "chatRoom")
    private List<ChatParticipant> participants;
    
    @OneToMany(mappedBy = "chatRoom")
    private List<ChatMessage> messages;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 4.2 채팅방 타입

| 타입 | 설명 |
|------|------|
| PRIVATE | 1:1 채팅 |
| GROUP | 그룹 채팅 |

### 4.3 ChatParticipant 엔티티

```java
@Entity
public class ChatParticipant {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private ChatRoom chatRoom;
    
    @ManyToOne
    private User user;
    
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;
}
```

---

## 5. 클라이언트 구현

### 5.1 WebSocket 연결

```javascript
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws/chat'),
    
    onConnect: () => {
        console.log('STOMP 연결 성공');
        
        // 채팅방 구독
        stompClient.subscribe('/topic/chat/room/1', (message) => {
            const chatMessage = JSON.parse(message.body);
            // 메시지 처리
        });
    },
    
    onStompError: (frame) => {
        console.error('STOMP 오류:', frame);
    }
});

stompClient.activate();
```

### 5.2 메시지 전송

```javascript
const sendMessage = (roomId, content) => {
    stompClient.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify({
            chatRoomId: roomId,
            content: content,
            messageType: 'TEXT'
        })
    });
};
```

### 5.3 메시지 수신

```javascript
stompClient.subscribe(`/topic/chat/room/${roomId}`, (message) => {
    const chatMessage = JSON.parse(message.body);
    
    // 새 메시지 추가
    setMessages(prev => [...prev, chatMessage]);
});
```

---

## 6. 읽음 상태 관리

### 6.1 ChatRead 엔티티

```java
@Entity
public class ChatRead {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private ChatMessage message;
    
    @ManyToOne
    private User user;
    
    private LocalDateTime readAt;
}
```

### 6.2 읽음 표시 전송

```javascript
const markAsRead = (roomId, messageId) => {
    stompClient.publish({
        destination: `/app/chat/read`,
        body: JSON.stringify({
            chatRoomId: roomId,
            messageId: messageId
        })
    });
};
```

---

## 7. REST API 연동

### 7.1 채팅방 목록 조회

```
GET /api/community/chat/rooms
```

**응답**
```json
[
    {
        "id": 1,
        "name": "스터디 그룹",
        "roomType": "GROUP",
        "participantCount": 5,
        "lastMessage": "안녕하세요",
        "lastMessageAt": "2025-01-15T10:00:00",
        "unreadCount": 3
    }
]
```

### 7.2 채팅방 생성

```
POST /api/community/chat/rooms
```

**요청**
```json
{
    "name": "새 채팅방",
    "roomType": "GROUP",
    "participantIds": [1, 2, 3]
}
```

### 7.3 메시지 조회

```
GET /api/community/chat/rooms/{roomId}/messages?page=0&size=50
```

**응답**
```json
{
    "content": [
        {
            "id": 1,
            "senderId": 1,
            "senderNickname": "사용자1",
            "senderProfileImageUrl": "/uploads/profile/1.jpg",
            "messageType": "TEXT",
            "content": "안녕하세요",
            "createdAt": "2025-01-15T10:00:00"
        }
    ],
    "totalElements": 100,
    "totalPages": 2
}
```

---

## 8. 파일 전송

### 8.1 파일 업로드 API

```
POST /api/community/chat/upload
Content-Type: multipart/form-data
```

**요청**
- file: 업로드할 파일
- chatRoomId: 채팅방 ID

**응답**
```json
{
    "fileUrl": "/uploads/chat/file.pdf",
    "fileName": "file.pdf",
    "fileSize": 1024000
}
```

### 8.2 파일 메시지 전송

```javascript
const sendFileMessage = async (roomId, file) => {
    // 1. 파일 업로드
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatRoomId', roomId);
    
    const response = await api.post('/community/chat/upload', formData);
    const { fileUrl, fileName } = response.data;
    
    // 2. 파일 메시지 전송
    stompClient.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify({
            chatRoomId: roomId,
            content: fileName,
            fileUrl: fileUrl,
            messageType: file.type.startsWith('image/') ? 'IMAGE' : 'FILE'
        })
    });
};
```

---

## 9. Socket.IO vs STOMP

Hamcam에서는 두 가지 실시간 통신 방식을 사용합니다.

### 9.1 Socket.IO (포트 4000)

- **용도**: WebRTC 시그널링, 팀 스터디 실시간 기능
- **이벤트**: join-room, signal, focus-time-update
- **서버**: Node.js

### 9.2 STOMP (포트 8080)

- **용도**: 채팅 메시지
- **엔드포인트**: /ws/chat
- **서버**: Spring Boot

### 9.3 사용 구분

| 기능 | 프로토콜 | 이유 |
|------|----------|------|
| WebRTC 시그널링 | Socket.IO | 빠른 시그널 교환 필요 |
| 팀 스터디 채팅 | Socket.IO | 시그널링 서버에서 통합 관리 |
| 1:1/그룹 채팅 | STOMP | 메시지 영속화, 읽음 상태 |
| 접속자 수 | Socket.IO | 실시간 브로드캐스트 |

---

## 10. 연결 상태 관리

### 10.1 연결 끊김 감지

```javascript
stompClient.onWebSocketClose = () => {
    console.log('WebSocket 연결 끊김');
    // 재연결 시도
    setTimeout(() => {
        stompClient.activate();
    }, 5000);
};
```

### 10.2 하트비트 설정

```javascript
const stompClient = new Client({
    heartbeatIncoming: 10000,  // 10초
    heartbeatOutgoing: 10000,
});
```

### 10.3 에러 처리

```javascript
stompClient.onStompError = (frame) => {
    console.error('STOMP 에러:', frame.headers['message']);
    // 에러 알림 표시
};
```
