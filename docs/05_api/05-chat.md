# 채팅 API

**관련 문서**: [API 개요](./README.md) | [커뮤니티 API](./04-community.md)

---

## 📋 개요

채팅 기능은 그룹 채팅방, 1:1 채팅, 파일 첨부 등을 지원합니다.

---

## 📁 엔드포인트 구조

```
/api/chat/
├── rooms/          # 채팅방 관리
├── direct/         # 1:1 채팅
└── files/          # 파일 첨부
```

---

# 1. 채팅방 API (`/api/chat/rooms`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/rooms` | 채팅방 생성 (JSON) | ✅ |
| POST | `/rooms` | 채팅방 생성 (Multipart) | ✅ |
| GET | `/rooms/my` | 내 채팅방 목록 | ✅ |
| POST | `/rooms/detail` | 채팅방 상세 조회 | ✅ |
| DELETE | `/rooms` | 채팅방 삭제 (Body) | ✅ |
| DELETE | `/rooms/{roomId}` | 채팅방 삭제 (Path) | ✅ |
| POST | `/rooms/messages` | 메시지 조회 | ✅ |

---

## 1.1 채팅방 생성 (JSON)

### 요청

```
POST /api/chat/rooms
Content-Type: application/json
```

### 요청 본문

```json
{
    "roomName": "수학 스터디 채팅방",
    "invitedUserIds": [2, 3, 4]
}
```

### 응답 (성공)

```json
{
    "message": "채팅방이 생성되었습니다.",
    "data": {
        "roomId": 1,
        "roomName": "수학 스터디 채팅방",
        "roomType": "GROUP",
        "participantCount": 4,
        "createdAt": "2025-01-15T10:00:00"
    }
}
```

---

## 1.2 채팅방 생성 (Multipart - 이미지 포함)

### 요청

```
POST /api/chat/rooms
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파트 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| request | JSON | ✅ | 채팅방 정보 |
| image | File | ❌ | 채팅방 이미지 |

### request JSON 구조

```json
{
    "roomName": "수학 스터디 채팅방",
    "invitedUserIds": [2, 3, 4]
}
```

---

## 1.3 내 채팅방 목록 조회

### 요청

```
GET /api/chat/rooms/my
```

### 응답 (성공)

```json
{
    "message": "채팅방 목록 조회 성공",
    "data": [
        {
            "roomId": 1,
            "roomName": "수학 스터디 채팅방",
            "roomType": "GROUP",
            "roomImageUrl": "/uploads/chat/room1.jpg",
            "participantCount": 4,
            "lastMessage": "오늘 저녁에 문제 풀어요!",
            "lastMessageTime": "2025-01-15T18:00:00",
            "unreadCount": 3
        },
        {
            "roomId": 2,
            "roomName": "김철수",
            "roomType": "DIRECT",
            "roomImageUrl": "/uploads/profile/2.jpg",
            "participantCount": 2,
            "lastMessage": "안녕하세요!",
            "lastMessageTime": "2025-01-15T17:30:00",
            "unreadCount": 0
        }
    ]
}
```

---

## 1.4 채팅방 상세 조회

### 요청

```
POST /api/chat/rooms/detail
Content-Type: application/json
```

### 요청 본문

```json
{
    "roomId": 1
}
```

### 응답 (성공)

```json
{
    "message": "채팅방 상세 조회 성공",
    "data": {
        "room_info": {
            "roomId": 1,
            "roomName": "수학 스터디 채팅방",
            "roomType": "GROUP",
            "roomImageUrl": "/uploads/chat/room1.jpg",
            "participants": [
                {
                    "userId": 1,
                    "nickname": "방장",
                    "profileImageUrl": "/uploads/profile/1.jpg",
                    "isOnline": true
                },
                {
                    "userId": 2,
                    "nickname": "멤버1",
                    "profileImageUrl": "/uploads/profile/2.jpg",
                    "isOnline": false
                }
            ],
            "createdAt": "2025-01-15T10:00:00"
        },
        "messages": [
            {
                "messageId": 1,
                "senderId": 1,
                "senderNickname": "방장",
                "profileImageUrl": "/uploads/profile/1.jpg",
                "content": "안녕하세요!",
                "messageType": "TEXT",
                "sentAt": "2025-01-15T10:05:00",
                "unreadCount": 2
            }
        ]
    }
}
```

---

## 1.5 채팅방 삭제

### 방법 1: Body로 요청

```
DELETE /api/chat/rooms
Content-Type: application/json
```

### 요청 본문

```json
{
    "roomId": 1
}
```

### 방법 2: Path로 요청

```
DELETE /api/chat/rooms/{roomId}
```

### 응답 (성공)

```json
{
    "message": "채팅방이 삭제되었습니다."
}
```

---

## 1.6 메시지 조회

### 요청

```
POST /api/chat/rooms/messages
Content-Type: application/json
```

### 요청 본문

```json
{
    "roomId": 1
}
```

### 응답 (성공)

```json
[
    {
        "messageId": 1,
        "senderId": 1,
        "senderNickname": "방장",
        "profileImageUrl": "/uploads/profile/1.jpg",
        "content": "안녕하세요!",
        "messageType": "TEXT",
        "sentAt": "2025-01-15T10:05:00",
        "unreadCount": 0
    },
    {
        "messageId": 2,
        "senderId": 2,
        "senderNickname": "멤버1",
        "profileImageUrl": "/uploads/profile/2.jpg",
        "content": "반갑습니다!",
        "messageType": "TEXT",
        "sentAt": "2025-01-15T10:06:00",
        "unreadCount": 0
    }
]
```

---

# 2. 1:1 채팅 API (`/api/chat/direct`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/direct/start` | 1:1 채팅 시작 | ✅ |
| POST | `/direct/rooms` | 1:1 채팅방 목록 | ✅ |
| POST | `/direct/with` | 특정 사용자와 채팅방 조회 | ✅ |

---

## 2.1 1:1 채팅 시작

### 요청

```
POST /api/chat/direct/start
Content-Type: application/json
```

### 요청 본문

```json
{
    "targetUserId": 2
}
```

### 응답 (성공)

```json
{
    "message": "1:1 채팅방 생성 또는 조회 완료",
    "data": {
        "roomId": 5,
        "roomName": "김철수",
        "roomType": "DIRECT",
        "roomImageUrl": "/uploads/profile/2.jpg",
        "participantCount": 2,
        "createdAt": "2025-01-15T10:00:00"
    }
}
```

### 동작 방식

- 이미 해당 사용자와 1:1 채팅방이 있으면 기존 채팅방 반환
- 없으면 새로 생성하여 반환

---

## 2.2 1:1 채팅방 목록

### 요청

```
POST /api/chat/direct/rooms
```

### 응답 (성공)

```json
{
    "message": "1:1 채팅방 목록 조회 성공",
    "data": [
        {
            "roomId": 5,
            "roomName": "김철수",
            "roomType": "DIRECT",
            "roomImageUrl": "/uploads/profile/2.jpg",
            "lastMessage": "안녕하세요!",
            "lastMessageTime": "2025-01-15T17:30:00",
            "unreadCount": 0
        }
    ]
}
```

---

## 2.3 특정 사용자와 채팅방 조회

### 요청

```
POST /api/chat/direct/with
Content-Type: application/json
```

### 요청 본문

```json
{
    "targetUserId": 2
}
```

### 응답 (성공)

```json
{
    "message": "상대 사용자와의 채팅방 조회 성공",
    "data": {
        "roomId": 5,
        "roomName": "김철수",
        "roomType": "DIRECT",
        "roomImageUrl": "/uploads/profile/2.jpg",
        "participantCount": 2
    }
}
```

---

# 3. 파일 첨부 API (`/api/chat/files`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/files/upload` | 파일 업로드 메시지 | ✅ |
| POST | `/files/preview` | 이미지 미리보기 | ✅ |
| POST | `/files/download` | 파일 다운로드 | ✅ |

---

## 3.1 파일 업로드 메시지

### 요청

```
POST /api/chat/files/upload
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파트 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| roomId | Long | ✅ | 채팅방 ID |
| file | File | ✅ | 첨부 파일 |

### 응답 (성공)

```json
{
    "messageId": 10,
    "senderId": 1,
    "senderNickname": "방장",
    "profileImageUrl": "/uploads/profile/1.jpg",
    "content": "document.pdf",
    "messageType": "FILE",
    "fileUrl": "/uploads/chat/files/abc123_document.pdf",
    "sentAt": "2025-01-15T10:30:00",
    "unreadCount": 3
}
```

---

## 3.2 이미지 미리보기

### 요청

```
POST /api/chat/files/preview
Content-Type: application/json
```

### 요청 본문

```json
{
    "messageId": 10
}
```

### 응답 (성공)

```json
{
    "messageId": 10,
    "fileName": "image.jpg",
    "contentType": "image/jpeg",
    "base64Data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

---

## 3.3 파일 다운로드

### 요청

```
POST /api/chat/files/download
Content-Type: application/json
```

### 요청 본문

```json
{
    "messageId": 10
}
```

### 응답

- Content-Type: `application/octet-stream`
- Content-Disposition: `attachment; filename*=UTF-8''document.pdf`
- Body: 파일 바이너리 데이터

---

## 데이터 타입

### ChatRoomType (채팅방 타입)

| 값 | 설명 |
|----|------|
| DIRECT | 1:1 채팅 |
| GROUP | 그룹 채팅 |

### ChatMessageType (메시지 타입)

| 값 | 설명 |
|----|------|
| TEXT | 텍스트 메시지 |
| FILE | 파일 메시지 |
| IMAGE | 이미지 메시지 |
| SYSTEM | 시스템 메시지 |

---

## 클라이언트 구현 예시

### React - 채팅방 관리

```javascript
import api from '../../api/api';

// 내 채팅방 목록 조회
const getMyChatRooms = async () => {
    const response = await api.get('/chat/rooms/my');
    return response.data.data;
};

// 채팅방 생성
const createChatRoom = async (roomName, invitedUserIds, image = null) => {
    if (image) {
        const formData = new FormData();
        formData.append('request', JSON.stringify({ roomName, invitedUserIds }));
        formData.append('image', image);
        
        const response = await api.post('/chat/rooms', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    } else {
        const response = await api.post('/chat/rooms', { roomName, invitedUserIds });
        return response.data.data;
    }
};

// 1:1 채팅 시작
const startDirectChat = async (targetUserId) => {
    const response = await api.post('/chat/direct/start', { targetUserId });
    return response.data.data;
};

// 채팅방 메시지 조회
const getChatMessages = async (roomId) => {
    const response = await api.post('/chat/rooms/messages', { roomId });
    return response.data;
};

// 파일 업로드
const uploadFile = async (roomId, file) => {
    const formData = new FormData();
    formData.append('roomId', roomId);
    formData.append('file', file);
    
    const response = await api.post('/chat/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// 파일 다운로드
const downloadFile = async (messageId) => {
    const response = await api.post('/chat/files/download', 
        { messageId },
        { responseType: 'blob' }
    );
    
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'file';
    link.click();
};
```
