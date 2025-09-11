# API 엔드포인트 명세

기준 URL
- REST Base: http://localhost:8080/api (프론트 axios 기본값)
- WebSocket(STOMP): /pub (send), /sub (subscribe) 프리픽스 사용 추정
- 별도 시그널링 서버: ws(s)://<host>:4000 (Socket.IO)

인증/사용자
- POST /api/auth/register (multipart: request, profileImage?)
- POST /api/auth/login
- DELETE /api/auth/withdraw
- GET  /api/users/me
- POST /api/users/withdraw
- POST /api/users/profile
- POST /api/users/profile-image (multipart ModelAttribute)

대시보드/학습
- POST /api/dashboard/calendar
- POST /api/dashboard/todos/date
- POST /api/dashboard/todos
- PUT  /api/dashboard/todos
- POST /api/dashboard/todos/delete
- PUT  /api/dashboard/todos/complete
- GET  /api/dashboard/exams
- POST /api/dashboard/exams/register
- DELETE /api/dashboard/exams/{examId}
- POST /api/dashboard/exams/nearest
- POST /api/dashboard/stats/total
- POST /api/dashboard/stats/subjects
- POST /api/dashboard/stats/weekly
- POST /api/dashboard/stats/monthly
- POST /api/dashboard/stats/best-day
- POST /api/dashboard/goal/suggest
- PUT  /api/dashboard/goal
- POST /api/dashboard/reflection/weekly
- POST /api/dashboard/reflection/range
- POST /api/dashboard/reflection/custom
- POST /api/dashboard/study-time
- GET  /api/dashboard/notices
- GET  /api/dashboard/todos

플랜(학습계획)
- POST /api/plan/generate
- GET  /api/plan/my
- DELETE /api/plan/{planId}
- PATCH /api/plan/{planId}/check?checked=boolean
- PATCH /api/plan/{planId}/content

LiveKit
- POST /api/livekit/token (roomName, isPresenter)
- GET  /api/study/team/livekit-token?roomName (isPresenter=false 고정)
- GET  /livekit-token?roomName&isPresenter (퀴즈 소켓 컨트롤러 내 별도 공개 엔드포인트)

팀 스터디(REST)
- POST   /api/study/team/create
- POST   /api/study/team/enter?roomId
- DELETE /api/study/team/delete/{roomId}
- POST   /api/study/team/my
- GET    /api/study/team/all
- GET    /api/study/team/type?roomType
- GET    /api/study/team/my/type?roomType
- POST   /api/study/team/detail
- POST   /api/study/team/upload (multipart file)
- GET    /api/study/team/files?roomId
- POST   /api/study/team/post-failure

퀴즈 문제 조회(REST)
- GET /api/quiz/problems/random?subject&unit&level

커뮤니티 - 게시글/사이드바
- POST /api/community/posts/create (multipart: title,content,category,tag?,file?)
- POST /api/community/posts/update (multipart ModelAttribute)
- POST /api/community/posts/delete
- POST /api/community/posts/list
- POST /api/community/posts/detail
- GET  /api/community/posts/popular
- POST /api/community/posts/auto-fill
- POST /api/community/posts/favorite/add
- POST /api/community/posts/favorite/remove
- GET  /api/community/posts/favorites
- PATCH /api/community/posts/view
- GET  /api/community/posts/sidebar/studies
- GET  /api/community/posts/sidebar/tags
- POST /api/community/posts/sidebar/studies/create
- GET  /api/community/posts/sidebar/studies/{studyId}
- POST /api/community/posts/sidebar/studies/apply
- GET  /api/community/posts/sidebar/studies/{studyId}/applications
- POST /api/community/posts/sidebar/studies/approve

커뮤니티 - 공지
- GET /api/community/notices
- GET /api/community/notices/main

커뮤니티 - 댓글/대댓글
- POST   /api/community/comments/create
- POST   /api/community/replies/create
- PUT    /api/community/comments/update
- PUT    /api/community/replies/update
- DELETE /api/community/comments/delete
- DELETE /api/community/replies/delete
- POST   /api/community/comments/by-post

커뮤니티 - 좋아요
- POST /api/community/likes/posts/toggle
- POST /api/community/likes/posts/count
- POST /api/community/likes/posts/check
- POST /api/community/likes/comments/toggle
- POST /api/community/likes/comments/count
- POST /api/community/likes/comments/check
- POST /api/community/likes/replies/toggle
- POST /api/community/likes/replies/count
- POST /api/community/likes/replies/check

커뮤니티 - 차단
- POST   /api/community/blocks/posts
- DELETE /api/community/blocks/posts
- POST   /api/community/blocks/posts/list
- POST   /api/community/blocks/comments
- DELETE /api/community/blocks/comments
- POST   /api/community/blocks/comments/list
- POST   /api/community/blocks/replies
- DELETE /api/community/blocks/replies
- POST   /api/community/blocks/replies/list
- POST   /api/community/blocks/users
- DELETE /api/community/blocks/users
- POST   /api/community/blocks/users/list

커뮤니티 - 신고
- POST /api/community/posts/report
- POST /api/community/comments/report
- POST /api/community/replies/report
- POST /api/community/users/report

친구/유저 탐색
- POST /api/friends/request
- POST /api/friends/request/accept
- POST /api/friends/request/reject
- POST /api/friends/request/cancel
- GET  /api/friends/requests
- POST /api/friends/requests/sent
- GET  /api/friends/list
- POST /api/friends/delete
- POST /api/friends/block
- POST /api/friends/unblock
- GET  /api/friends/blocked
- POST /api/friends/search
- POST /api/friends/report

채팅(커뮤니티)
- 채팅방
  - POST   /api/chat/rooms (JSON 또는 multipart)
  - GET    /api/chat/rooms/my
  - POST   /api/chat/rooms/detail
  - DELETE /api/chat/rooms (body)
  - DELETE /api/chat/rooms/{roomId}
- 메시지
  - POST   /api/chat/rooms/messages (초기 로딩, 전체 메시지)
- 파일
  - POST   /api/chat/files/upload (multipart ModelAttribute)
  - POST   /api/chat/files/preview
  - POST   /api/chat/files/download
- 1:1 채팅
  - POST   /api/chat/direct/start
  - POST   /api/chat/direct/rooms
  - POST   /api/chat/direct/with

일반 파일 업로드(공통)
- POST /api/files/upload (multipart, 결과: /upload/{userId}/{filename})

WebSocket/STOMP 메시지 엔드포인트
- 커뮤니티 채팅
  - SEND /pub/chat/send
  - SEND /pub/chat/read
  - SUB  /sub/chat/room/{roomId}
- 팀 스터디 채팅
  - SEND /pub/quiz/chat/send
  - SEND /pub/focus/chat/send
  - SUB  /sub/quiz/room/{roomId}
  - SUB  /sub/focus/room/{roomId}
  - SUB  /sub/focus/room/{roomId}/participants
  - SUB  /sub/focus/room/{roomId}/winner
- 팀 스터디 제어(퀴즈)
  - SEND /pub/quiz/ready
  - SEND /pub/quiz/start
  - SEND /pub/quiz/hand
  - SEND /pub/quiz/end-presentation
  - SEND /pub/quiz/vote
  - SEND /pub/quiz/terminate
  - SEND /pub/quiz/file/uploaded
  - SEND /pub/quiz/answer
- 팀 스터디 제어(포커스)
  - SEND /pub/focus/enter
  - SEND /pub/focus/update-time
  - SEND /pub/focus/goal-achieved
  - SEND /pub/focus/confirm-exit
  - SEND /pub/focus/terminate
  - SEND /pub/focus/warning

Socket.IO 시그널링 서버 이벤트(ws://:4000)
- Client → Server
  - join-room(roomId)
  - signal({ roomId, data })
  - chat({ roomId, message, senderId })
- Server → Client
  - all-users([socketId]) — 새 유저에게 기존 유저 목록 제공
  - user-connected(socketId)
  - user-disconnected(socketId)
  - user-count(number)

