# 🎓 Hamcam

## 🚀 프로젝트 한눈에 보기
Hamcam은 자기주도 학습의 한계를 보완하고 교육 격차를 완화하기 위해 설계된 학습 관리 및 협업 플랫폼입니다. 웹(React)과 Java(Spring Boot) 백엔드로 구성되며, 개인 학습 측정(Face API), AI 기반 학습계획(Gemini), 실시간 멀티미디어(WebRTC/LiveKit) 등 다양한 기능을 제공합니다.

---

## 🛠️ 기술 스택

| 🔧 영역            | 🛠️ 기술                | 🔢 버전 |
|-------------------|---------------------|--------|
| **Back-End**      | Java               | 21.0.8 |
|                   | Spring Boot        | 3.4.2  |
|                   | Gradle Wrapper     | 8.11.1 |
| **Front-End**     | React              | ^19.1.0|
|                   | Node.js            | 22.17.0|
| **Realtime/Media**| LiveKit / WebRTC   | 사용    |
| **AI/ML**         | Gemini, Face API   | 사용    |
| **DB/Cache**      | MySQL, Redis       | 사용    |
| **DevOps**        | Docker, GitHub     | 사용    |

---

## 📖 프로젝트 개요

### 배경 및 목적
- 해결 대상
  - 자기주도 학습의 7가지 과제: 명확한 목표 부족, 시간 관리의 어려움, 자원 접근 제한, 동기 부족, 집중력 문제, 과도한 부담감, 피드백 부족
  - 교육 격차 심화: 가정·환경·자원 등 외부 요인에 의한 성취도 차이를 완화
- 목표
  - 개인별 학습 추적과 맞춤 피드백으로 학습 효율을 높이고, 협업 기능으로 문제 해결 능력과 동기를 강화합니다.

### 핵심 기능

| 기능 | 설명 | 관련 기술 |
|---|---:|:---|
| 대시보드 | Todo 리스트, 시험 D‑Day, 학습 통계 시각화로 목표와 진행을 한눈에 관리 | — |
| 개인 학습 | Face API로 공부 시간 자동 측정·기록하여 실제 학습량 추적 | Face API |
| 팀 학습 | WebRTC + WebSocket 기반 실시간 문제풀이방 및 시간 경쟁형 룸(화상/음성/채팅) | WebRTC / WebSocket |
| 학습 계획 | Gemini 기반 AI가 학습 계획 초안 생성, 사용자가 수정·삭제·커스터마이징 가능 | Gemini |
| 단원 평가 | 자동 채점 및 AI 오답 해설(오답노트)로 약점 보완 지원 | AI (Gemini 등) |
| **수학 문제 평가** | **2025년 모의평가 기출문제 기반 맞춤형 수학 실력 진단** | **Spring Boot + React** |
| 커뮤니티 | 친구 관리, 1:1·그룹 채팅, 게시판을 통한 피어 러닝 지원 | REST / WebSocket |

## 📝 기대 효과 및 결론

1) 체계적 학습 습관 형성
- 자동 측정(Face API) + 대시보드 시각화 → 학습 몰입도 및 지속성 향상
- Todo/D‑Day로 목표 점검·우선순위 관리로 꾸준한 학습 유도

2) 심층적 사고력 확장 및 문제 해결 능력 강화
- 팀문제풀이/발표로 풀이 과정 공유 → 다양한 풀이 방식 학습 및 사고 확장
- 실전형 협업 경험 누적으로 문제 해결 역량 향상

3) AI 기반 개인 맞춤 학습으로 학습 효율 극대화
- Gemini 기반 맞춤 피드백·오답노트로 취약점 식별 및 최적 학습 경로 제공
- 개인별 최적화로 동일 시간 대비 학습 성과 상승

---

## 🗂️ 프로젝트 구조

```
Hamcam/
├── back/                  # Spring Boot 백엔드
│   ├── build.gradle       # 의존성 및 빌드 설정
│   ├── src/
│   │  ├── main/
│   │  │  ├── java/
│   │  │  │  └── com/hamcam/back/
│   │  │  │     ├── BackApplication.java  # 애플리케이션 진입점
│   │  │  │     ├── config/               # 설정 파일
│   │  │  │     │  ├── auth/               # 메일, JWT, 이메일 검증 등 인증 설정
│   │  │  │     │  ├── socket/             # WebSocket/Socket 설정 (STOMP 등)
│   │  │  │     │  └── web/                # CORS, MVC, 인터셉터 등 웹 설정
│   │  │  │     ├── controller/           # REST 컨트롤러 계층 (엔드포인트)
│   │  │  │     │  ├── admin/              # 관리자용 엔드포인트 (리포트·관리)
│   │  │  │     │  ├── auth/               # 인증(로그인/회원가입/인증) 관련 엔드포인트
│   │  │  │     │  ├── chat/               # 채팅·메시지 관련 API
│   │  │  │     │  ├── community/          # 게시판·커뮤니티 API
│   │  │  │     │  ├── friend/             # 친구 관리 API
│   │  │  │     │  └── video/              # 실시간 비디오/회의 관련 엔드포인트
│   │  │  │     ├── dto/                  # 요청/응답용 DTO
│   │  │  │     │  ├── admin/              # 관리자 관련 DTO
│   │  │  │     │  ├── auth/               # 로그인/회원가입/토큰 DTO
│   │  │  │     │  ├── chat/               # 메시지/채팅방 DTO
│   │  │  │     │  ├── community/          # 게시판 DTO
│   │  │  │     │  ├── friend/             # 친구 관련 DTO
│   │  │  │     │  └── video/              # 비디오 관련 DTO
│   │  │  │     ├── entity/               # JPA 엔티티 (도메인 모델)
│   │  │  │     │  ├── auth/               # User 등 인증 엔티티
│   │  │  │     │  ├── chat/               # ChatMessage, ChatRoom 등
│   │  │  │     │  ├── community/          # Post, Comment 등
│   │  │  │     │  ├── friend/             # Friendship 등
│   │  │  │     │  ├── **math/             # 수학 문제 관련 엔티티** 
│   │  │  │     │  │  ├── **MathProblem          # 수학 문제 정보 (2025 모의평가)**
│   │  │  │     │  │  ├── **Student              # 학생 정보 및 수학 레벨**
│   │  │  │     │  │  ├── **MathProblemAttempt   # 수학 문제 시도 기록**
│   │  │  │     │  │  ├── **StudentWrongAnswer   # 오답노트**
│   │  │  │     │  │  └── **ReviewAttempt        # 복습 시도 기록** 
│   │  │  │     │  └── video/              # VideoRoom 등 엔티티
│   │  │  │     ├── repository/           # DB 접근 계층 (Spring Data JPA 등)
│   │  │  │     │  ├── auth/               # UserRepository 등
│   │  │  │     │  ├── chat/               # 채팅 관련 저장소
│   │  │  │     │  ├── community/          # 게시판 저장소
│   │  │  │     │  ├── friend/             # 친구 저장소
│   │  │  │     │  └── video/              # 비디오 저장소
│   │  │  │     ├── security/             # 보안 관련 코드
│   │  │  │     │  └── auth/               # JWT 발급/검증, UserDetails 등
│   │  │  │     ├── service/              # 비즈니스 로직
│   │  │  │     │  ├── auth/               # 인증 로직, 토큰 관리, 이메일 검증
│   │  │  │     │  └── video/              # LiveKit/WebRTC 연동, 룸 관리
│   │  │  │     └── utils/                # 유틸리티 함수들
│   │  │  │        ├── auth/              # 토큰/암호화/인증 보조 유틸
│   │  │  │        ├── common/            # 공통 도우미(헬퍼) 함수
│   │  │  │        └── file/              # 파일명 생성, 저장 처리 유틸
│   │  │  └── resources/
│   │  └── test/
├── front_web/             # React 웹 프론트엔드
│   ├── package.json       # 의존성 및 스크립트
│   ├── package-lock.json
│   ├── public/            # 정적 자원(앱 쉘, 아이콘, manifest 등)
│   │  ├── index.html      # SPA 진입점
│   │  ├── favicon.ico
│   │  ├── logo192.png
│   │  ├── logo512.png
│   │  ├── manifest.json
│   │  └── robots.txt
│   ├── src/               # 애플리케이션 소스
│   │  ├── App.js          # 루트 컴포넌트
│   │  ├── index.js        # 클라이언트 진입점, 라우터/리덕스 초기화 등
│   │  ├── components/     # 재사용 가능한 UI 요소 (버튼, 모달, 레이아웃 등)
│   │  ├── pages/          # 페이지 단위 컴포넌트(라우팅 대상), 각 페이지는 여러 컴포넌트를 조합
│   │  ├── **features/     # 기능별 모듈화된 컴포넌트**
│   │  │  └── **evaluation/ # 수학 문제 평가 시스템**
│   │  │     ├── **components/ # 수학 평가 컴포넌트들**
│   │  │     │  ├── **MathEvaluationMain.jsx  # 수학 평가 메인 페이지**
│   │  │     │  ├── **MathProblemSolver.jsx   # 문제 풀이 인터페이스**
│   │  │     │  ├── **MathEvaluationMain.css  # 메인 페이지 스타일**
│   │  │     │  └── **MathProblemSolver.css   # 문제 풀이 스타일**
│   │  │     ├── **data/       # 수학 문제 데이터**
│   │  │     │  └── **mathProblems.js         # 2025년 모의평가 문제 데이터**
│   │  │     └── **index.js    # 모듈 내보내기**
│   │  ├── css/            # 전역/모듈 CSS 파일
│   │  ├── setupTests.js   # Jest 셋업
│   │  └── App.test.js     # 기본 테스트
│   └── public/
└── lib/                   # 외부 라이브러리
```

## 역할 정리

### Config
- `config/auth`: 이메일 전송, JWT 키/만료 정책, 인증 관련 설정을 관리합니다.
- `config/socket`: WebSocket/STOMP 및 메시지 브로커(예: Redis, RabbitMQ) 설정을 포함합니다.
- `config/web`: CORS, 인터셉터, 리졸버 등 웹 관련 공통 설정을 담당합니다.

### Controller (엔드포인트)
- `controller/admin`: 관리자 전용 API(리포트 조회, 사용자 관리 등).
- `controller/auth`: 로그인, 회원가입, 이메일/토큰 인증 관련 엔드포인트.
- `controller/chat`: 채팅방 생성/메시지 송수신/첨부파일 처리 API.
- `controller/community`: 게시글/댓글/검색/카테고리 관련 API.
- `controller/friend`: 친구 요청/수락/차단 등 친구 관리 API.
- `controller/video`: 실시간 화상 회의, 룸 입장/퇴장, 권한 관리 API.

### DTO / Entity / Repository
- `dto/*`: 각 API의 요청 및 응답 형식을 정의하는 객체 모음 (입력 검증 포함).
- `entity/*`: 데이터베이스 테이블과 매핑되는 도메인 모델(JPA 엔티티).
- `repository/*`: 엔티티 저장소 인터페이스 (쿼리, 페이징, 트랜잭션 경계 담당).

### Security / Service / Utils
- `security/auth`: 인증·인가 핵심 로직 (UserDetails, JWT 필터/프로바이더 등).
- `service/auth`: 로그인/회원가입, 토큰 발급/갱신, 비밀번호 재설정 등 인증 비즈니스 로직.
- `service/video`: LiveKit/WebRTC 연동, 룸 매니저, 실시간 권한 검증 로직.
- `utils/auth`: 인증 보조 유틸 (토큰 생성/검증 등).
- `utils/common`: 로깅, 변환, 날짜 등 프로젝트 전반에 쓰이는 공통 유틸.
- `utils/file`: 파일명 생성, 업로드/다운로드 처리, 파일 타입 검사 유틸.

---

## ⚙️ 환경 및 전제 조건

### 개발 환경
- ☕ **Java**: 21.0.8
- 🖥️ **Node.js**: 22.17.0
- ⚙️ **Gradle**: 8.11.1
- 🐳 **Docker**: MySQL, Redis 컨테이너 실행

### 필수 환경 변수
- `SPRING_DATASOURCE_URL` — JDBC URL
- `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET` — JWT 서명 비밀
- `SPRING_REDIS_HOST` / `SPRING_REDIS_PORT`
- `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`
- `GEMINI_API_KEY`

> **Tip**: 비밀값은 안전한 비밀 관리 시스템에 저장하세요.

---

## 🚀 빠른 시작

### 백엔드 실행
```powershell
cd back
./gradlew.bat clean build
./gradlew.bat bootRun
```

### 프론트엔드 실행
```powershell
cd front_web
npm install
npm start
```

---

## 🧪 테스트

- **백엔드**: `./gradlew.bat test`
- **프론트엔드**: `npm test`

---

## 🤝 기여 가이드

1. 이슈 생성 및 설명 작성
2. 브랜치 생성: `feature/` 또는 `fix/` 접두사 사용
3. 코드 스타일 준수 및 테스트 통과 확인
4. PR 생성 후 리뷰 요청

---

## 🧮 수학 문제 평가 시스템

### 주요 기능
- **2025년 모의평가 기출문제**: 실제 6월, 9월 모의평가 문제 데이터베이스
- **맞춤형 난이도 조절**: 1-5등급 문제를 학생 수준에 맞게 제공
- **실시간 평가**: 즉시 채점 및 피드백 제공
- **학습 분석**: 정답률, 소요시간, 약점 과목 분석
- **오답노트**: 틀린 문제 자동 수집 및 복습 관리

### 기술 구현
- **백엔드**: Spring Boot 3.4.2 + JPA를 통한 문제 데이터 관리
- **프론트엔드**: React 19.1.0 기반 인터랙티브 문제 풀이 인터페이스
- **데이터베이스**: MySQL을 통한 문제, 학생, 시도 기록 저장
- **이미지 관리**: `/math_image/` 경로에 체계적으로 정리된 문제 이미지

### 평가 시스템 구조
```
수학 평가 플로우:
1. 문제 세트 생성 (쉬움 3개 + 보통 4개 + 어려움 3개)
2. 학생 답안 제출 및 실시간 채점
3. 결과 분석 및 등급 산출 (1-5등급)
4. 오답 문제 자동 오답노트 등록
5. 학습 통계 업데이트 및 약점 분석
```

### 지원 과목 및 범위
- **공통**: 수학 I, II (기출문제 15개 수록)
- **미적분**: 준비 중
- **확률과통계**: 준비 중  
- **기하**: 준비 중

---

## 📚 참고 문서
- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://reactjs.org/)
- [LiveKit](https://livekit.io/)
- [Face API](https://faceapi.com)
- [Gemini](https://gemini.com)

---