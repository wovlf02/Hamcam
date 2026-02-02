# 친구 API

**관련 문서**: [API 개요](./README.md) | [커뮤니티 API](./04-community.md)

---

## 📋 개요

친구 기능은 친구 요청, 수락/거절, 차단, 신고 등을 지원합니다.

---

# 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/api/friends/request` | 친구 요청 전송 | ✅ |
| POST | `/api/friends/request/accept` | 친구 요청 수락 | ✅ |
| POST | `/api/friends/request/reject` | 친구 요청 거절 | ✅ |
| POST | `/api/friends/request/cancel` | 친구 요청 취소 | ✅ |
| GET | `/api/friends/requests` | 받은 요청 목록 | ✅ |
| POST | `/api/friends/requests/sent` | 보낸 요청 목록 | ✅ |
| GET | `/api/friends/list` | 친구 목록 | ✅ |
| POST | `/api/friends/delete` | 친구 삭제 | ✅ |
| POST | `/api/friends/block` | 사용자 차단 | ✅ |
| POST | `/api/friends/unblock` | 차단 해제 | ✅ |
| GET | `/api/friends/blocked` | 차단 목록 | ✅ |
| POST | `/api/friends/search` | 사용자 검색 | ✅ |
| POST | `/api/friends/report` | 사용자 신고 | ✅ |

---

## 1. 친구 요청 전송

### 요청

```
POST /api/friends/request
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
    "message": "친구 요청이 전송되었습니다."
}
```

### 응답 (실패 - 이미 친구)

```json
{
    "message": "이미 친구 관계입니다."
}
```

### 응답 (실패 - 차단된 사용자)

```json
{
    "message": "차단된 사용자에게는 요청을 보낼 수 없습니다."
}
```

---

## 2. 친구 요청 수락

### 요청

```
POST /api/friends/request/accept
Content-Type: application/json
```

### 요청 본문

```json
{
    "requestId": 1
}
```

### 응답 (성공)

```json
{
    "message": "친구 요청을 수락했습니다."
}
```

---

## 3. 친구 요청 거절

### 요청

```
POST /api/friends/request/reject
Content-Type: application/json
```

### 요청 본문

```json
{
    "requestId": 1
}
```

### 응답 (성공)

```json
{
    "message": "친구 요청을 거절했습니다."
}
```

---

## 4. 친구 요청 취소 (보낸 요청)

### 요청

```
POST /api/friends/request/cancel
Content-Type: application/json
```

### 요청 본문

```json
{
    "requestId": 1
}
```

### 응답 (성공)

```json
{
    "message": "친구 요청을 취소했습니다."
}
```

---

## 5. 받은 친구 요청 목록

### 요청

```
GET /api/friends/requests
```

### 응답 (성공)

```json
{
    "requests": [
        {
            "requestId": 1,
            "fromUserId": 2,
            "fromUserNickname": "김철수",
            "fromUserProfileImageUrl": "/uploads/profile/2.jpg",
            "createdAt": "2025-01-15T10:00:00",
            "status": "PENDING"
        }
    ]
}
```

---

## 6. 보낸 친구 요청 목록

### 요청

```
POST /api/friends/requests/sent
```

### 응답 (성공)

```json
{
    "requests": [
        {
            "requestId": 2,
            "toUserId": 3,
            "toUserNickname": "이영희",
            "toUserProfileImageUrl": "/uploads/profile/3.jpg",
            "createdAt": "2025-01-14T10:00:00",
            "status": "PENDING"
        }
    ]
}
```

---

## 7. 친구 목록 조회

### 요청

```
GET /api/friends/list
```

### 응답 (성공)

```json
{
    "onlineFriends": [
        {
            "friendId": 1,
            "userId": 2,
            "nickname": "김철수",
            "profileImageUrl": "/uploads/profile/2.jpg",
            "isOnline": true,
            "lastActiveAt": "2025-01-15T18:00:00"
        }
    ],
    "offlineFriends": [
        {
            "friendId": 2,
            "userId": 3,
            "nickname": "이영희",
            "profileImageUrl": "/uploads/profile/3.jpg",
            "isOnline": false,
            "lastActiveAt": "2025-01-15T10:00:00"
        }
    ],
    "totalCount": 2
}
```

---

## 8. 친구 삭제

### 요청

```
POST /api/friends/delete
Content-Type: application/json
```

### 요청 본문

```json
{
    "friendId": 1
}
```

### 응답 (성공)

```json
{
    "message": "친구가 삭제되었습니다."
}
```

---

## 9. 사용자 차단

### 요청

```
POST /api/friends/block
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
    "message": "해당 사용자를 차단하였습니다."
}
```

### 차단 효과

- 차단된 사용자의 게시글/댓글이 보이지 않음
- 차단된 사용자가 친구 요청 불가
- 차단된 사용자와 채팅 불가

---

## 10. 차단 해제

### 요청

```
POST /api/friends/unblock
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
    "message": "차단을 해제하였습니다."
}
```

---

## 11. 차단 목록 조회

### 요청

```
GET /api/friends/blocked
```

### 응답 (성공)

```json
{
    "blockedUsers": [
        {
            "blockId": 1,
            "userId": 5,
            "nickname": "차단된유저",
            "profileImageUrl": "/uploads/profile/5.jpg",
            "blockedAt": "2025-01-10T10:00:00"
        }
    ]
}
```

---

## 12. 사용자 검색

### 요청

```
POST /api/friends/search
Content-Type: application/json
```

### 요청 본문

```json
{
    "nickname": "김"
}
```

### 응답 (성공)

```json
{
    "users": [
        {
            "userId": 2,
            "nickname": "김철수",
            "profileImageUrl": "/uploads/profile/2.jpg",
            "isFriend": true,
            "requestPending": false
        },
        {
            "userId": 4,
            "nickname": "김영수",
            "profileImageUrl": "/uploads/profile/4.jpg",
            "isFriend": false,
            "requestPending": true
        }
    ]
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| isFriend | Boolean | 이미 친구인지 여부 |
| requestPending | Boolean | 친구 요청 대기 중인지 여부 |

---

## 13. 사용자 신고

### 요청

```
POST /api/friends/report
Content-Type: application/json
```

### 요청 본문

```json
{
    "targetUserId": 5,
    "reason": "SPAM",
    "description": "스팸 메시지를 지속적으로 보냅니다."
}
```

### 신고 사유 종류

| 값 | 설명 |
|----|------|
| SPAM | 스팸 |
| HARASSMENT | 괴롭힘 |
| INAPPROPRIATE | 부적절한 내용 |
| FRAUD | 사기 |
| OTHER | 기타 |

### 응답 (성공)

```json
{
    "message": "해당 사용자가 신고되었습니다."
}
```

---

## 데이터 타입

### FriendRequestStatus (친구 요청 상태)

| 값 | 설명 |
|----|------|
| PENDING | 대기 중 |
| ACCEPTED | 수락됨 |
| REJECTED | 거절됨 |

### FriendReportStatus (신고 처리 상태)

| 값 | 설명 |
|----|------|
| PENDING | 처리 대기 |
| REVIEWED | 검토 완료 |
| ACTIONED | 조치 완료 |
| DISMISSED | 기각 |

---

## 클라이언트 구현 예시

### React - 친구 관리

```javascript
import api from '../../api/api';

// 친구 요청 전송
const sendFriendRequest = async (targetUserId) => {
    const response = await api.post('/friends/request', { targetUserId });
    return response.data;
};

// 친구 요청 수락
const acceptFriendRequest = async (requestId) => {
    const response = await api.post('/friends/request/accept', { requestId });
    return response.data;
};

// 친구 요청 거절
const rejectFriendRequest = async (requestId) => {
    const response = await api.post('/friends/request/reject', { requestId });
    return response.data;
};

// 친구 목록 조회
const getFriendList = async () => {
    const response = await api.get('/friends/list');
    return response.data;
};

// 받은 요청 목록 조회
const getReceivedRequests = async () => {
    const response = await api.get('/friends/requests');
    return response.data;
};

// 사용자 검색
const searchUsers = async (nickname) => {
    const response = await api.post('/friends/search', { nickname });
    return response.data;
};

// 사용자 차단
const blockUser = async (targetUserId) => {
    const response = await api.post('/friends/block', { targetUserId });
    return response.data;
};

// 사용자 신고
const reportUser = async (targetUserId, reason, description) => {
    const response = await api.post('/friends/report', {
        targetUserId,
        reason,
        description
    });
    return response.data;
};
```
