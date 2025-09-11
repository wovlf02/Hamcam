# 기능 명세

코드베이스(front/src, back/src, signaling_server)를 분석하여 주요 기능을 정리했습니다.

## 인증/사용자
- 회원가입/로그인: 백엔드 AuthController, UserController 존재
- 세션 기반 사용자 식별: SessionUtil로 HttpServletRequest에서 userId 추출 (withCredentials 쿠키 사용)
- JWT 의존성(jjwt) 포함: 토큰 처리 일부 시나리오에서 사용 가능성

## 대시보드/학습 관리
- Todo 관리: 생성/수정/삭제/완료 토글, 날짜별 조회
  - 엔드포인트 예시: POST /api/dashboard/todos, PUT /api/dashboard/todos, POST /api/dashboard/todos/delete, PUT /api/dashboard/todos/complete, POST /api/dashboard/todos/date, GET /api/dashboard/todos
- 시험 일정 관리: 등록/삭제/전체 조회, D-Day 조회
  - 예시: GET /api/dashboard/exams, POST /api/dashboard/exams/register, DELETE /api/dashboard/exams/{examId}, POST /api/dashboard/exams/nearest
- 학습 통계: 전체/과목별/주간/월간/최고 집중일 통계 제공
  - 예시: POST /api/dashboard/stats/total, /subjects, /weekly, /monthly, /best-day
- 목표 설정: 제안/수동 업데이트
  - 예시: POST /api/dashboard/goal/suggest, PUT /api/dashboard/goal
- 학습 시간 업데이트: POST /api/dashboard/study-time
- 공지 조회: GET /api/dashboard/notices
- AI 회고: 주간/기간/옵션 기반 회고 생성 (GPTReflectionService)
  - 예시: POST /api/dashboard/reflection/weekly, /range, /custom

## 커뮤니티
- 게시글/댓글/대댓글/좋아요/즐겨찾기
- 공지, 첨부파일 업로드, 신고/차단
- 친구/DM/채팅방 관리
- WebSocket/STOMP 기반 실시간 커뮤니케이션 구성 존재(Integration/WS 의존성 포함)

## 팀 스터디/실시간 협업
- 팀 퀴즈/포커스 룸: REST + 소켓 컨트롤러(QuizRoomRest/SocketController, FocusRoomSocketController, StudyChatSocketController)
- 라이브 비디오/오디오: LiveKit 연동 (서버에서 토큰 발급)
  - 엔드포인트: POST /api/livekit/token (roomName, isPresenter)
- 별도 시그널링 서버(socket.io, 4000포트):
  - 방 입장/퇴장, 사용자 수 브로드캐스트(user-count)
  - WebRTC 시그널 중계(signal), 채팅(chat)

## 파일 업로드
- 멀티파트 업로드 지원(api.upload 유틸)
- 업로드 저장소 추정: /uploads 디렉터리

## 프론트 UX 흐름(주요 라우트)
- /login, /register
- /dashboard, /statistics, /mypage
- /teamStudy, /team-study/quiz/:roomId, /team-study/focus/:roomId
- /personalStudy, /studyStart, /camstudy, /video-room/:roomId, /room-full, /rooms
- 단원평가: /unit-evaluation, /unit-evaluation/start, /unit-evaluation/feedback, /unit-evaluation/schedule, /plan/*
- 커뮤니티: /community, /community/notice, /community/post, /community/post/:id, /community/chat, /community/friend

## 네트워크/환경
- 프론트 개발 서버 프록시: http://localhost:8080 (front/package.json)
- 프론트 .env: HOST=0.0.0.0, DANGEROUSLY_DISABLE_HOST_CHECK=true
- Axios 기본 URL: http://localhost:8080/api, withCredentials=true
- 시그널링 서버: 4000, ngrok 도메인 CORS 허용, credentials 허용

## 데이터/저장소
- DB 드라이버: MySQL/Oracle 지원(환경 선택)
- 마이그레이션: Flyway 규칙 리소스(db/migration/V13~V19) 존재(시험 일정 테이블 수정 중심)
- Redis 세션 사용(spring-session-data-redis)

## 테스트/운영
- 프론트: @testing-library 기반 기본 테스트 설정
- 백엔드: spring-boot-starter-test, batch/integration 테스트 의존성 포함
- Actuator 포함(헬스체크 등)

