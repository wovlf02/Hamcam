# API 명세서

> **API 버전**: v1  
> **Base URL**: `http://localhost:8080/api`

**관련 문서**: [인증 API](./01-auth.md) | [대시보드 API](./03-dashboard.md) | [백엔드 구조](../03_architecture/backend-structure.md)

---

## 📋 개요

Hamcam 백엔드 API 명세서입니다. Spring Boot 3.4.2 기반으로 구현되며, REST API 아키텍처를 따릅니다.

---

## 📁 문서 구조

```
05_api/
├── README.md                    # API 문서 개요 (이 파일)
├── 01-auth.md                   # 인증 API
├── 02-user.md                   # 사용자 API
├── 03-dashboard.md              # 대시보드 API
├── 04-community.md              # 커뮤니티 API (게시글, 댓글, 공지사항, 스터디)
├── 05-chat.md                   # 채팅 API (그룹채팅, 1:1채팅, 파일첨부)
├── 06-friend.md                 # 친구 API (요청, 차단, 신고)
├── 07-study.md                  # 학습 API (팀스터디, 퀴즈, AI계획)
├── 08-evaluation.md             # 평가 API (단원평가, AI분석)
└── 09-file.md                   # 파일 API (업로드, 이미지)
```

---

## 🔐 인증 방식

| 항목 | 값 |
|------|-----|
| 인증 방식 | 세션 기반 (HttpSession) |
| 세션 저장소 | Redis |
| 토큰 전달 방식 | Cookie (JSESSIONID) |
| 클라이언트 설정 | withCredentials: true |

---

## 📊 표준 응답 형식

### 성공 응답

```json
{
    "success": true,
    "message": "요청이 성공적으로 처리되었습니다.",
    "data": { ... }
}
```

### 실패 응답

```json
{
    "success": false,
    "message": "오류 메시지",
    "data": null
}
```

---

## 📊 도메인별 API 요약

### 인증 (Auth) - `/api/auth`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/auth/register` | 회원가입 | ❌ |
| POST | `/auth/login` | 로그인 | ❌ |
| DELETE | `/auth/withdraw` | 회원 탈퇴 | ✅ |

### 사용자 (User) - `/api/users`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/users/me` | 내 정보 조회 | ✅ |
| PUT | `/users/me` | 프로필 수정 | ✅ |
| PUT | `/users/me/password` | 비밀번호 변경 | ✅ |

### 대시보드 (Dashboard) - `/api/dashboard`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/dashboard/calendar` | 월별 캘린더 이벤트 | ✅ |
| POST | `/dashboard/todos/date` | 날짜별 Todo 조회 | ✅ |
| POST | `/dashboard/todos` | Todo 생성 | ✅ |
| PUT | `/dashboard/todos` | Todo 수정 | ✅ |
| POST | `/dashboard/todos/delete` | Todo 삭제 | ✅ |
| PUT | `/dashboard/todos/complete` | Todo 완료 토글 | ✅ |
| GET | `/dashboard/exams` | 시험 일정 조회 | ✅ |
| POST | `/dashboard/exams` | 시험 일정 생성 | ✅ |
| DELETE | `/dashboard/exams/{id}` | 시험 일정 삭제 | ✅ |
| GET | `/dashboard/stats` | 학습 통계 조회 | ✅ |
| GET | `/dashboard/goals` | 목표 조회 | ✅ |
| PUT | `/dashboard/goals` | 목표 업데이트 | ✅ |
| POST | `/dashboard/study-time` | 학습 시간 업데이트 | ✅ |
| POST | `/dashboard/reflection/weekly` | 주간 회고 생성 | ✅ |

### 수학 문제 (Math) - `/api/math`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/math/problems` | 모든 문제 조회 | ✅ |
| GET | `/math/problems/{id}` | 문제 상세 조회 | ✅ |
| GET | `/math/problems/subject/{subject}` | 과목별 문제 조회 | ✅ |
| GET | `/math/problems/difficulty/{grade}` | 난이도별 문제 조회 | ✅ |
| GET | `/math/problems/random` | 랜덤 문제 조회 | ✅ |
| GET | `/math/problems/student-grade/{grade}` | 학년별 맞춤 문제 | ✅ |
| GET | `/math/subjects` | 과목 목록 조회 | ✅ |

### 팀 스터디 (Team Study) - `/api/study/team`

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/study/team/create` | 스터디방 생성 | ✅ |
| GET | `/study/team/all` | 스터디방 목록 | ✅ |
| POST | `/study/team/detail` | 스터디방 상세 | ✅ |
| DELETE | `/study/team/delete/{roomId}` | 스터디방 삭제 | ✅ |
| POST | `/study/team/enter` | 스터디방 입장 | ✅ |
| POST | `/study/team/my` | 내 스터디방 목록 | ✅ |

### AI 학습 계획 (`/api/plan`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/plan/generate` | AI 학습계획 생성 | ✅ |
| GET | `/plan/my` | 내 학습계획 목록 | ✅ |
| DELETE | `/plan/{planId}` | 학습계획 삭제 | ✅ |
| PATCH | `/plan/{planId}/check` | 완료 상태 토글 | ✅ |

### 단원평가 (`/api/evaluation`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/evaluation/start` | 단원평가 시작 | ✅ |
| POST | `/evaluation/submit` | 답안 제출 | ✅ |
| GET | `/evaluation/result/{id}` | 결과 조회 | ✅ |
| GET | `/evaluation/history` | 평가 히스토리 | ✅ |
| GET | `/evaluation/study-plan` | 맞춤 학습계획 | ✅ |

### 커뮤니티 - 게시판 (`/api/community/posts`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/community/posts/create` | 게시글 작성 | ✅ |
| POST | `/community/posts/list` | 게시글 목록 | ✅ |
| POST | `/community/posts/detail` | 게시글 상세 | ✅ |
| POST | `/community/posts/update` | 게시글 수정 | ✅ |
| POST | `/community/posts/delete` | 게시글 삭제 | ✅ |
| GET | `/community/posts/popular` | 인기 게시글 | ✅ |
| POST | `/community/posts/favorite/add` | 즐겨찾기 추가 | ✅ |
| GET | `/community/posts/favorites` | 즐겨찾기 목록 | ✅ |

### 커뮤니티 - 댓글 (`/api/community`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/community/comments/create` | 댓글 작성 | ✅ |
| POST | `/community/comments/by-post` | 댓글 목록 | ✅ |
| PUT | `/community/comments/update` | 댓글 수정 | ✅ |
| DELETE | `/community/comments/delete` | 댓글 삭제 | ✅ |
| POST | `/community/replies/create` | 대댓글 작성 | ✅ |

### 친구 (`/api/friends`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/friends/list` | 친구 목록 | ✅ |
| POST | `/friends/request` | 친구 요청 | ✅ |
| POST | `/friends/request/accept` | 요청 수락 | ✅ |
| POST | `/friends/request/reject` | 요청 거절 | ✅ |
| POST | `/friends/delete` | 친구 삭제 | ✅ |
| POST | `/friends/block` | 사용자 차단 | ✅ |
| POST | `/friends/search` | 사용자 검색 | ✅ |

### 채팅 (`/api/chat`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/chat/rooms` | 채팅방 생성 | ✅ |
| GET | `/chat/rooms/my` | 채팅방 목록 | ✅ |
| POST | `/chat/rooms/detail` | 채팅방 상세 | ✅ |
| POST | `/chat/rooms/messages` | 메시지 조회 | ✅ |
| POST | `/chat/direct/start` | 1:1 채팅 시작 | ✅ |
| POST | `/chat/files/upload` | 파일 업로드 | ✅ |

### AI 피드백 (`/api/ai`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/ai/feedback` | AI 피드백 생성 | ✅ |
| POST | `/ai/plan` | AI 학습 계획 생성 | ✅ |

---

## 🔄 실시간 통신

### WebSocket/STOMP

| 엔드포인트 | 설명 |
|------------|------|
| `ws://localhost:8080/ws/chat` | 채팅 WebSocket |

### Socket.IO (시그널링 서버)

| URL | 설명 |
|-----|------|
| `http://localhost:4000` | 시그널링 서버 |

| 이벤트 | 방향 | 설명 |
|--------|------|------|
| `join-room` | Client → Server | 방 입장 |
| `signal` | Client ↔ Server | SDP/ICE 교환 |
| `send-message` | Client → Server | 채팅 메시지 전송 |
| `new-message` | Server → Client | 채팅 메시지 수신 |
| `focus-time-update` | Client ↔ Server | 집중 시간 업데이트 |
| `room-count-update` | Server → Client | 접속자 수 업데이트 |
| `user-joined` | Server → Client | 사용자 입장 알림 |
| `user-left` | Server → Client | 사용자 퇴장 알림 |
| `all-users` | Server → Client | 기존 참여자 목록 |

---

## 📝 공통 헤더

### 요청 헤더

| 헤더 | 값 | 설명 |
|------|-----|------|
| Content-Type | application/json | JSON 요청 (기본) |
| Content-Type | multipart/form-data | 파일 업로드 |

### 쿠키

| 쿠키 | 설명 |
|------|------|
| JSESSIONID | 세션 ID |

---

## ⚠️ 에러 코드

| HTTP 상태 | 설명 |
|-----------|------|
| 200 | 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 500 | 서버 오류 |

---

## 📖 상세 문서

- [01. 인증 API](./01-auth.md)
- [02. 사용자 API](./02-user.md)
- [03. 대시보드 API](./03-dashboard.md)
- [04. 커뮤니티 API](./04-community.md)
- [05. 채팅 API](./05-chat.md)
- [06. 친구 API](./06-friend.md)
- [07. 학습 API](./07-study.md)
- [08. 평가 API](./08-evaluation.md)
- [09. 파일 API](./09-file.md)
- [10. 실시간 통신 API](./10-realtime.md)
