# Hamcam - 학습 관리 및 협업 플랫폼

URL: https://github.com/wovlf02/Hamcam
기술: JavaScript, React, React Router, Spring Boot, Spring Data JPA, Spring WebSocket, MySQL, Redis, JWT, Axios, STOMP, SockJS, WebRTC P2P, Socket.IO, Face API, Gemini AI
날짜: 2025년 1월 → 진행 중
팀구성: 개인 프로젝트

<aside>

*📚 자기주도 학습의 한계를 보완하고 교육 격차를 완화하기 위해 설계된 학습 관리 및 협업 플랫폼. Face API 기반 개인 학습 측정, Gemini AI 기반 학습 계획 생성, Socket.IO + WebRTC P2P 기반 실시간 화상 스터디, STOMP 기반 실시간 채팅, 2025년 모의평가 기출문제 기반 수학 문제 평가 시스템 등 다양한 기능을 제공합니다.*

</aside>

<aside>

> ***Information***
> 

**개발 기간:** 2025/01 ~ 진행 중

**팀 구성:** 1인

**담당 업무:** 기획, 문서화, 풀스택 개발

</aside>

<aside>

> ***Review***
> 

React와 Spring Boot를 활용한 웹 애플리케이션 개발과 RESTful API 설계 역량을 강화했습니다. WebRTC P2P 기반 실시간 화상 스트리밍, Socket.IO 시그널링 서버를 통한 Offer/Answer 교환 및 ICE Candidate 중계, STOMP 기반 WebSocket 실시간 채팅 시스템, Face API 기반 얼굴 인식 학습 시간 측정, Gemini AI 기반 학습 계획 및 피드백 생성 경험을 쌓았으며, MySQL/Redis를 활용한 데이터베이스 및 세션 관리 역량을 확보했습니다.

</aside>

### 01. GitHub

[https://github.com/wovlf02/Hamcam](https://github.com/wovlf02/Hamcam)

### 02. 프로젝트 배경 및 목적

- **해결 대상**
  - 자기주도 학습의 7가지 과제: 명확한 목표 부족, 시간 관리의 어려움, 자원 접근 제한, 동기 부족, 집중력 문제, 과도한 부담감, 피드백 부족
  - 교육 격차 심화: 가정·환경·자원 등 외부 요인에 의한 성취도 차이를 완화
- **목표**
  - 개인별 학습 추적과 맞춤 피드백으로 학습 효율을 높이고, 협업 기능으로 문제 해결 능력과 동기를 강화합니다.

### 03. 주요 구현 사항 및 기술적 성과

<aside>

 **⏲ 효율성 개선**

1. 레이어드 아키텍처 설계 - Controller, Service, Repository, Entity 4계층으로 명확히 분리하여 유지보수성 및 테스트 용이성 확보
2. 도메인별 패키지 분리 - auth, community, chat, friend, dashboard, study, evaluation, plan 등 도메인별로 컨트롤러, 서비스, 엔티티, DTO를 분리하여 관리
3. Feature 기반 프론트엔드 구조 - auth, community, dashboard, evaluation, plan, profile, rtc, statistics, study 등 기능별 독립 모듈 구성
4. API 모듈화 - Axios 인스턴스를 활용한 API 통신 모듈화 및 withCredentials 기반 세션 유지
5. 공통 유틸리티 분리 - 글로벌 예외 처리, 응답 포맷, 보안 설정 등 공통 로직 모듈화
6. Spring Boot BOM 관리 - 의존성 버전을 Spring Boot BOM으로 일관되게 관리
7. HTTP 폴링에서 Socket.IO 이벤트 기반으로 전환 - 실시간 접속자 수 업데이트 효율성 98.3% 개선
</aside>

<aside>

**🔄 실시간 통신 구현**

1. Spring WebSocket + STOMP - SockJS 폴백을 지원하는 WebSocket 기반 실시간 채팅 구현
2. Socket.IO 시그널링 서버 - WebRTC P2P 연결을 위한 시그널 중계 (Offer/Answer/ICE Candidate), 방 관리를 위한 별도 Node.js 서버 (포트 4000)
3. WebRTC P2P 화상 통신 - RTCPeerConnection을 이용한 Peer-to-Peer 직접 연결, Google STUN 서버 활용
4. 채팅방 관리 - 1:1 채팅, 그룹 채팅, 실시간 메시지 송수신
5. 메시지 타입 분류 - TEXT, IMAGE, FILE 등 다양한 메시지 타입 처리
6. 읽음 표시 - STOMP를 통한 메시지 읽음/안읽음 상태 실시간 관리
7. 실시간 참여자 수 브로드캐스트 - room-count-update 이벤트를 통한 즉시 동기화
</aside>

<aside>

**📹 WebRTC P2P 기반 화상 스터디**

1. P2P 직접 연결 - RTCPeerConnection을 이용한 브라우저 간 직접 미디어 스트리밍
2. Socket.IO 시그널링 - join-room, signal 이벤트를 통한 SDP Offer/Answer 및 ICE Candidate 교환
3. STUN 서버 활용 - stun:stun.l.google.com:19302를 통한 NAT traversal
4. 참여자 미디어 관리 - getUserMedia API로 로컬 스트림 획득, addTrack으로 peer에 미디어 전송
5. 동적 Peer 관리 - Map 자료구조로 socketId별 RTCPeerConnection 객체 관리
6. 팀 스터디 룸 타입 분리 - 퀴즈 풀이방(QuizRoom), 집중 경쟁방(FocusRoom) 지원
7. 미디어 제어 - 캠/마이크 on/off, 원격 참여자 음소거 기능
</aside>

<aside>

 **📊 대시보드 기능**

1. Todo 관리 - 생성/수정/삭제/완료 토글, 날짜별 조회
2. 시험 일정 관리 - D-Day 조회, 시험 일정 등록/삭제
3. 학습 통계 - 전체/과목별/주간/월간/최고 집중일 통계 시각화 (Recharts)
4. 목표 설정 - AI 기반 목표 제안 및 수동 업데이트
5. 학습 시간 측정 - 개인 학습 시간 자동 기록 및 업데이트
6. AI 회고 - GPTReflectionService를 통한 주간/기간/옵션 기반 학습 회고 생성
7. 캘린더 - react-calendar를 활용한 월별 학습 일정 관리
</aside>

<aside>

 **🤖 AI 기반 학습 지원**

1. Gemini AI 학습 계획 생성 - 사용자 맞춤형 학습 계획 초안 자동 생성
2. AI 오답 해설 - 단원 평가 후 오답노트 및 AI 피드백 제공
3. 학습 피드백 - 평가 완료 후 AI가 생성한 학습 피드백 표시
4. 게시글 자동 생성 - 문제 기반 게시글 내용 자동 채우기 (auto-fill)
5. WebFlux 기반 AI API 호출 - Spring WebFlux를 통한 비동기 Gemini API 통신
6. 성능 분석 - PerformanceAnalysisService를 통한 학습 성과 분석
7. 맞춤 피드백 - AIFeedbackService를 통한 개인화된 학습 조언
</aside>

<aside>

**👁 Face API 기반 학습 시간 측정**

1. face-api.js 브라우저 얼굴 인식 - 실시간 얼굴 감지를 통한 학습 집중도 측정
2. AI 모델 가중치 로드 - public/models 디렉터리에 사전 학습된 모델 파일 저장
3. 자동 타이머 제어 - 얼굴 감지 상태에 따라 학습 타이머 자동 시작/정지
4. 개인 학습 페이지 - CamStudyPage에서 Face API 기반 학습 측정 수행
5. 실제 학습량 추적 - 모니터 앞 실제 학습 시간만 자동 측정
6. 학습 데이터 저장 - 측정된 학습 시간 백엔드 API를 통해 DB 저장
7. 캠 스터디 UX - 개인 캠스터디 시작 전 단원/시간 설정 기능
</aside>

<aside>

**🧮 수학 문제 평가 시스템**

1. 2025년 모의평가 기출문제 - 6월, 9월 모의평가 문제 데이터베이스
2. 맞춤형 난이도 조절 - 1-5등급 문제를 학생 수준에 맞게 제공
3. 실시간 평가 - 즉시 채점 및 피드백 제공
4. 학습 분석 - 정답률, 소요시간, 약점 과목 분석
5. 오답노트 - StudentWrongAnswer 엔티티를 통한 틀린 문제 자동 수집
6. 복습 관리 - ReviewAttempt를 통한 복습 시도 기록 관리
7. 문제 시도 기록 - MathProblemAttempt를 통한 문제별 시도 내역 저장
</aside>

<aside>

 **💬 커뮤니티 기능**

1. 게시판 시스템 - 게시글 CRUD, 이미지/파일 첨부, 즐겨찾기, 조회수 관리
2. 댓글 및 대댓글 - CommentSection을 통한 계층형 댓글 구조 구현
3. 좋아요 시스템 - 게시글 및 댓글 좋아요/좋아요 취소 토글 기능
4. 신고 시스템 - 게시글/댓글/사용자 신고 기능 및 관리자 처리 시스템
5. 차단 시스템 - 특정 사용자/게시글/댓글 차단으로 콘텐츠 숨김 처리
6. 친구 관리 - 친구 요청/수락/거절, 친구 목록, 친구 차단, 온라인/오프라인 상태 표시
7. 스터디 그룹 - 커뮤니티 내 스터디 그룹 생성, 참여 신청, 승인 관리
</aside>

<aside>

**👥 팀 스터디 기능**

1. 팀 스터디방 생성/입장/삭제 - REST API 기반 방 관리
2. 퀴즈 풀이방 (QuizRoom) - 실시간 문제 풀이 및 경쟁
3. 집중 경쟁방 (FocusRoom) - 집중 시간 측정 및 순위 경쟁
4. 발표자 선정/투표 - useQuizRoom 훅을 통한 복잡한 상태 흐름 관리
5. 팀 채팅 - StudyChatSocketController를 통한 실시간 채팅
6. 파일 공유 - 팀 스터디방 내 파일 업로드 및 공유
7. 실시간 참여자 상태 - STOMP를 통한 참여자 입/퇴장 실시간 알림
</aside>

<aside>

**🎨 UI/UX 최적화**

1. React Router 7.x - BrowserRouter 기반 SPA 라우팅 구성
2. Feature 기반 레이아웃 - 사이드바 있는/없는 레이아웃 분리 (LayoutWithSidebar, LayoutWithoutSidebar)
3. styled-components - CSS-in-JS를 통한 컴포넌트 스타일링
4. Recharts 차트 시각화 - 학습 통계 데이터 시각적 표현
5. react-calendar 캘린더 UI - 학습 일정 관리를 위한 캘린더 컴포넌트
6. react-markdown 렌더링 - 마크다운 콘텐츠 렌더링 지원
7. react-icons / react-feather - 아이콘 라이브러리 활용
</aside>

<aside>

 **📈 성능 최적화**

1. React.memo 최적화 - RoomCard 등 불필요한 리렌더링 방지
2. Socket.IO 이벤트 기반 업데이트 - HTTP 폴링 대비 네트워크 효율성 98.3% 개선
3. 평균 지연 시간 96% 개선 - 2.5초에서 0.1초로 단축
4. Redis 세션 캐싱 - spring-session-data-redis를 통한 세션 성능 향상
5. Spring Boot Actuator - 헬스체크 및 모니터링 지원
6. Jackson JSR310 - 날짜/시간 직렬화 최적화
7. Flyway 마이그레이션 - 데이터베이스 스키마 버전 관리
</aside>

<aside>

 **🔐 인증 및 보안**

1. 세션 기반 인증 - SessionUtil을 통한 HttpServletRequest에서 userId 추출 (withCredentials 쿠키)
2. JWT 토큰 - jjwt 라이브러리를 활용한 토큰 기반 인증 처리
3. Spring Security 6.x - 역할 기반 접근 제어 및 엔드포인트 보호
4. 비밀번호 암호화 - BCrypt를 통한 비밀번호 해싱
5. 이메일 인증 - Spring Mail(Naver SMTP)을 통한 인증 코드 발송 및 검증
6. CORS 설정 - WebConfig를 통한 다양한 Origin 허용 정책 구성
7. WebSocket 인증 - StompAuthChannelInterceptor를 통한 STOMP 메시지 인증/권한 검사
</aside>

<aside>

**📁 데이터베이스 설계**

1. 사용자 관련 - User, Student 엔티티
2. 학습 관련 - MathProblem, MathProblemAttempt, StudentWrongAnswer, ReviewAttempt
3. 대시보드 관련 - Todo, ExamSchedule, StudyStats, Goal, Reflection 등
4. 커뮤니티 관련 - Post, Comment, Reply, Attachment, Like, Favorite, Report, Block
5. 채팅 관련 - ChatRoom, ChatMessage, ChatParticipant, ChatRead
6. 친구 관련 - Friendship, FriendRequest, FriendBlock, FriendReport
7. 스터디 관련 - StudyRoom, StudyRoomParticipant, Quiz 관련 엔티티
</aside>

<aside>

**🛠 개발 환경 및 도구**

1. Gradle Wrapper 8.11.1 - 일관된 빌드 환경을 위한 Gradle Wrapper 사용
2. Docker Compose - MySQL, Redis 컨테이너 오케스트레이션
3. Spring Boot DevTools - Hot Reload를 통한 개발 생산성 향상
4. ESLint + Jest - 프론트엔드 코드 린팅 및 테스트 프레임워크
5. JUnit 5 + Spring Boot Test - 백엔드 테스트 프레임워크
6. 체계적 문서화 - docs 폴더에 상세 기술 문서 관리
7. Thymeleaf - 서버 사이드 템플릿 엔진 (필요 시 사용)
</aside>

### 04. 기술 스택 상세

| 분류 | 기술 | 버전 | 설명 |
| --- | --- | --- | --- |
| Frontend | React | ^19.1.0 | SPA UI 프레임워크 |
|  | React Router DOM | ^7.4.1 | 화면 네비게이션 |
|  | Axios | ^1.8.4 | HTTP 클라이언트 |
|  | styled-components | ^6.1.18 | CSS-in-JS 스타일링 |
|  | socket.io-client | ^4.8.1 | WebRTC 시그널링 및 실시간 소켓 통신 |
|  | @stomp/stompjs | ^7.1.1 | STOMP 클라이언트 |
|  | face-api.js | ^0.22.2 | 브라우저 얼굴 인식 |
|  | recharts | ^2.15.3 | 차트/시각화 |
|  | react-calendar | ^5.1.0 | 캘린더 UI |
|  | react-markdown | ^10.1.0 | 마크다운 렌더링 |
|  | moment | ^2.30.1 | 날짜 처리 |
| Backend | Spring Boot | 3.4.2 | 백엔드 프레임워크 |
|  | Java | 21 (LTS) | 프로그래밍 언어 |
|  | Spring Data JPA | - | ORM, 데이터 액세스 |
|  | Spring WebSocket | - | 실시간 STOMP 통신 |
|  | Spring WebFlux | - | 비동기 HTTP 클라이언트 (Gemini API) |
|  | Spring Session | - | Redis 세션 관리 |
|  | Spring Mail | - | 이메일 발송 |
|  | JWT (jjwt) | 0.11.5 | 토큰 기반 인증 |
| Realtime/Media | WebRTC | - | P2P 실시간 화상/음성 통신 |
|  | Socket.IO | ^4.8.1 | WebRTC 시그널링 서버 |
| AI/ML | Gemini AI | - | 학습 계획/피드백 생성 |
|  | Face API | ^0.22.2 | 얼굴 인식 학습 측정 |
| Database | MySQL | - | 메인 관계형 데이터베이스 |
|  | Redis | - | 세션/캐시 저장소 |
| DevOps | Docker | - | 컨테이너 관리 |
|  | Gradle | 8.11.1 | 빌드 도구 |
|  | Node.js | 22.17.0 | JavaScript 런타임 |
|  | Flyway | - | DB 마이그레이션 |

### 05. 프로젝트 구조

```
Hamcam/
├── back/                      # Spring Boot 백엔드
│   ├── build.gradle           # 의존성 및 빌드 설정
│   ├── src/
│   │  ├── main/
│   │  │  ├── java/com/hamcam/back/
│   │  │  │  ├── BackApplication.java    # 애플리케이션 진입점
│   │  │  │  ├── config/                 # 설정 파일
│   │  │  │  │  ├── auth/                # 이메일, 인증 설정
│   │  │  │  │  ├── socket/              # WebSocket/STOMP 설정
│   │  │  │  │  └── web/                 # CORS, Jackson, Redis 설정
│   │  │  │  ├── controller/             # REST 컨트롤러 계층
│   │  │  │  │  ├── admin/               # 관리자용 엔드포인트
│   │  │  │  │  ├── auth/                # 인증 관련 엔드포인트
│   │  │  │  │  ├── community/           # 커뮤니티 API
│   │  │  │  │  ├── dashboard/           # 대시보드 API
│   │  │  │  │  ├── plan/                # 학습 계획 API
│   │  │  │  │  ├── study/team/          # 팀 스터디 API/WebSocket
│   │  │  │  │  └── user/                # 사용자 정보 API
│   │  │  │  ├── dto/                    # 요청/응답용 DTO
│   │  │  │  ├── entity/                 # JPA 엔티티
│   │  │  │  │  ├── auth/                # User 등 인증 엔티티
│   │  │  │  │  ├── chat/                # ChatMessage, ChatRoom 등
│   │  │  │  │  ├── community/           # Post, Comment 등
│   │  │  │  │  ├── dashboard/           # Todo, ExamSchedule 등
│   │  │  │  │  ├── evaluation/          # 단원평가 관련 엔티티
│   │  │  │  │  ├── friend/              # Friendship 등
│   │  │  │  │  ├── math/                # MathProblem, Student 등
│   │  │  │  │  ├── plan/                # 학습 계획 엔티티
│   │  │  │  │  └── study/               # StudyRoom 등
│   │  │  │  ├── repository/             # DB 접근 계층
│   │  │  │  ├── service/                # 비즈니스 로직
│   │  │  │  └── util/                   # 유틸리티 함수
│   │  │  └── resources/
│   │  │     └── db/migration/           # Flyway 마이그레이션 스크립트
│   │  └── test/
├── front/                     # React 웹 프론트엔드
│   ├── package.json           # 의존성 및 스크립트
│   ├── public/
│   │  ├── index.html          # SPA 진입점
│   │  └── models/             # face-api.js AI 모델 가중치
│   └── src/
│      ├── App.js              # 루트 컴포넌트, 라우팅 정의
│      ├── api/                # API 통신 모듈
│      ├── features/           # 기능별 도메인 루트
│      │  ├── auth/            # 인증 (로그인, 회원가입)
│      │  ├── community/       # 커뮤니티 (게시판, 채팅, 친구)
│      │  ├── dashboard/       # 대시보드
│      │  ├── evaluation/      # 단원 평가/수학 문제 평가
│      │  ├── plan/            # 학습 계획
│      │  ├── profile/         # 마이페이지
│      │  ├── rtc/             # 실시간 통신 (WebRTC P2P)
│      │  ├── statistics/      # 학습 통계
│      │  └── study/           # 개인/팀 학습
│      ├── global/             # 전역 공통 모듈 (NavBar 등)
│      └── hooks/              # 전역 커스텀 훅
├── signaling_server/          # Socket.IO 시그널링 서버
│   ├── package.json
│   └── signalingServer.js     # 방 입장/퇴장, WebRTC P2P 시그널 중계 (Offer/Answer/ICE)
├── docs/                      # 기술 문서
│   ├── API_ENDPOINTS.md       # API 엔드포인트 명세
│   ├── FEATURES.md            # 기능 명세
│   ├── TECH_STACK.md          # 기술 스택 요약
│   ├── back_project_structure.md
│   ├── front_project_structure.md
│   ├── realtime_room_count_implementation.md
│   ├── teamstudy_p2p_refactor.md  # P2P WebRTC 구현 문서
│   └── ...
├── docker-compose.yml         # MySQL, Redis 컨테이너 설정
└── README.md                  # 프로젝트 개요
```

### 06. 기대 효과 및 결론

**1) 체계적 학습 습관 형성**
- Face API 자동 측정 + 대시보드 시각화 → 학습 몰입도 및 지속성 향상
- Todo/D-Day로 목표 점검·우선순위 관리로 꾸준한 학습 유도

**2) 심층적 사고력 확장 및 문제 해결 능력 강화**
- 팀 문제풀이/발표로 풀이 과정 공유 → 다양한 풀이 방식 학습 및 사고 확장
- 실전형 협업 경험 누적으로 문제 해결 역량 향상

**3) AI 기반 개인 맞춤 학습으로 학습 효율 극대화**
- Gemini 기반 맞춤 피드백·오답노트로 취약점 식별 및 최적 학습 경로 제공
- 개인별 최적화로 동일 시간 대비 학습 성과 상승

### 07. 실행 방법

**백엔드 실행**
```bash
cd back
./gradlew clean build
./gradlew bootRun
```

**프론트엔드 실행**
```bash
cd front
npm install
npm start
```

**시그널링 서버 실행 (WebRTC P2P)**
```bash
cd signaling_server
npm install
node signalingServer.js
```

**Docker 컨테이너 실행 (MySQL, Redis)**
```bash
docker-compose up -d
```

### 08. 환경 변수

- `SPRING_DATASOURCE_URL` — JDBC URL
- `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` — JWT 서명 비밀
- `SPRING_REDIS_HOST` / `SPRING_REDIS_PORT`
- `GEMINI_API_KEY` — Gemini AI API 키

### 09. 참고 문서

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [WebRTC](https://webrtc.org/)
- [Socket.IO](https://socket.io/)
- [Face API](https://justadudewhohacks.github.io/face-api.js/docs/index.html)
- [Gemini AI](https://ai.google.dev/)
