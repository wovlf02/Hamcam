<h1 align="center">🎓 Hamcam</h1>

<p align="center">
  <strong>학습 관리 및 협업 플랫폼</strong><br>
  자기주도 학습의 한계를 보완하고 교육 격차를 완화하기 위해 설계된 종합 학습 플랫폼
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21.0.8-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.4.2-6DB33F?style=flat-square&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-22.17.0-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Redis-7.0-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis"/>
  <img src="https://img.shields.io/badge/Docker-Latest-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/WebRTC-P2P-333333?style=flat-square&logo=webrtc&logoColor=white" alt="WebRTC"/>
</p>

<p align="center">
  <a href="#-주요-기능">주요 기능</a> •
  <a href="#-기술-스택">기술 스택</a> •
  <a href="#-빠른-시작">빠른 시작</a> •
  <a href="#-프로젝트-구조">프로젝트 구조</a> •
  <a href="#-api-문서">문서</a>
</p>

---

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [빠른 시작](#-빠른-시작)
- [프로젝트 구조](#-프로젝트-구조)
- [환경 설정](#-환경-설정)
- [API 문서](#-api-문서)
- [기대 효과](#-기대-효과)
- [기여 가이드](#-기여-가이드)
- [라이선스](#-라이선스)
- [연락처](#-연락처)

---

## 🎯 프로젝트 소개

**Hamcam**은 자기주도 학습의 한계를 보완하고 교육 격차를 완화하기 위해 설계된 학습 관리 및 협업 플랫폼입니다.

### 해결하고자 하는 문제

| 과제 | 설명 | 해결 방안 |
|------|------|----------|
| 🎯 명확한 목표 부족 | 학습 방향성 설정의 어려움 | AI 기반 학습 계획 생성 |
| ⏰ 시간 관리의 어려움 | 계획적인 학습 시간 배분 실패 | Todo/D-Day 대시보드 |
| 📚 자원 접근 제한 | 양질의 학습 자료 부족 | 2025년 모의평가 기출문제 제공 |
| 💪 동기 부족 | 지속적인 학습 의욕 유지 실패 | 팀 스터디 및 경쟁 시스템 |
| 🧠 집중력 문제 | 외부 방해 요소로 인한 집중력 저하 | Face API 실시간 학습 측정 |
| 📝 피드백 부족 | 학습 성과에 대한 즉각적 피드백 부재 | AI 기반 오답 해설 및 피드백 |

---

## ✨ 주요 기능

### 📊 대시보드
- **Todo 관리**: 생성/수정/삭제/완료 토글, 우선순위 설정
- **시험 일정 관리**: D-Day 조회, 시험 일정 등록
- **학습 통계**: 전체/과목별/주간/월간 통계 시각화 (Recharts)
- **목표 설정**: AI 기반 목표 제안 및 수동 업데이트
- **캘린더**: 월별 학습 일정 통합 관리

### 📖 개인 학습
- **Face API 학습 측정**: 실시간 얼굴 감지를 통한 학습 집중도 측정
- **자동 타이머 제어**: 얼굴 감지 상태에 따라 학습 타이머 자동 시작/정지
- **학습 데이터 자동 저장**: 측정된 학습 시간 백엔드 API를 통해 DB 저장

### 👥 팀 학습
- **스터디방 관리**: 생성/입장/삭제
- **실시간 화상 통신**: WebRTC P2P 기반 화상 스터디
- **퀴즈 풀이방 (QuizRoom)**: 실시간 문제 풀이 및 경쟁
- **집중 경쟁방 (FocusRoom)**: 학습 시간 측정 및 순위 경쟁
- **실시간 채팅**: 스터디방 내 실시간 메시지

### 📝 수학 평가 시스템
- **2025년 모의평가 기출문제**: 실제 6월, 9월 모의평가 문제 제공
- **맞춤형 난이도 조절**: 1-5등급 문제를 학생 수준에 맞게 제공
- **실시간 평가**: 즉시 채점 및 피드백 제공
- **오답노트**: 틀린 문제 자동 수집 및 복습 관리

### 🤖 AI 학습 지원
- **AI 학습 계획 생성**: Gemini AI 기반 맞춤 학습 계획
- **AI 오답 해설**: 틀린 문제에 대한 상세 해설 제공
- **학습 회고 생성**: 주간/기간별 학습 회고 AI 생성

### 💬 커뮤니티
- **게시판**: 게시글 CRUD, 댓글, 좋아요
- **그룹 채팅**: 채팅방 생성 및 실시간 메시지
- **1:1 채팅**: 친구 간 다이렉트 메시지
- **친구 관리**: 친구 요청/수락/차단

---

## 🛠 기술 스택

### Frontend

| 기술 | 버전 | 용도 |
|------|------|------|
| React | ^19.1.0 | SPA UI 프레임워크 |
| React Router | ^7.4.1 | 클라이언트 사이드 라우팅 |
| Axios | ^1.8.4 | HTTP 클라이언트 |
| Socket.IO Client | ^4.8.1 | 실시간 통신 클라이언트 |
| styled-components | ^6.1.18 | CSS-in-JS 스타일링 |
| Recharts | ^2.15.3 | 차트 시각화 |
| face-api.js | ^0.22.2 | 얼굴 인식 |

### Backend

| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 21.0.8 (LTS) | 프로그래밍 언어 |
| Spring Boot | 3.4.2 | 백엔드 프레임워크 |
| Gradle | 8.11.1 | 빌드 도구 |
| Spring Data JPA | - | ORM |
| Spring WebSocket | - | WebSocket/STOMP |
| JWT (jjwt) | 0.11.5 | 토큰 인증 |

### Signaling Server

| 기술 | 버전 | 용도 |
|------|------|------|
| Node.js | 22.17.0 | JavaScript 런타임 |
| Socket.IO | 4.8.1 | WebRTC 시그널링 |
| Axios | ^1.12.2 | HTTP 클라이언트 |

### Database & Infrastructure

| 기술 | 버전 | 용도 |
|------|------|------|
| MySQL | 8.0 | 주 데이터베이스 |
| Redis | 7.0 | 세션/캐시 저장소 |
| Docker | - | 컨테이너화 |

### AI/ML

| 기술 | 용도 |
|------|------|
| Gemini AI | AI 학습 계획, 피드백 생성 |
| face-api.js | 브라우저 기반 얼굴 인식 |

---

## 🏗 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              클라이언트 (Browser)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │   React 19    │  │   Face API    │  │  Socket.IO    │  │   WebRTC     │  │
│  │   (SPA)       │  │   (학습 측정)  │  │  Client       │  │   P2P        │  │
│  │   Port:3000   │  │               │  │               │  │              │  │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └──────┬───────┘  │
└──────────┼──────────────────┼───────────────────┼─────────────────┼─────────┘
           │                  │                   │                 │
           ▼                  ▼                   ▼                 │
┌──────────────────────────────────────────────────────────────────────────────┐
│                               서버 레이어                                    │
├───────────────────────────────┬──────────────────────────────────────────────┤
│     Spring Boot 3.4.2         │           Node.js 22.17                      │
│     (REST API Server)         │           (Signaling Server)                 │
│     Port: 8080                │           Port: 4000                         │
└───────────────────────────────┴──────────────────────────────────────────────┘
           │                                        │
           ▼                                        │
┌──────────────────────────────────────────────────────────────────────────────┐
│                            데이터 레이어                                     │
├─────────────────────────────────┬────────────────────────────────────────────┤
│         MySQL 8.0               │              Redis 7.0                     │
│     (Primary Database)          │         (Session & Cache)                  │
│     Port: 3306                  │         Port: 6379                         │
└─────────────────────────────────┴────────────────────────────────────────────┘
```

### 포트 구성

| 서비스 | 포트 | 프로토콜 | 설명 |
|--------|------|----------|------|
| Frontend (React) | 3000 | HTTP | 개발 서버 |
| Backend (Spring Boot) | 8080 | HTTP/WS | REST API + WebSocket |
| Signaling Server | 4000 | HTTP/WS | Socket.IO 시그널링 |
| MySQL | 3306 | TCP | 데이터베이스 |
| Redis | 6379 | TCP | 세션/캐시 |

---

## 🚀 빠른 시작

### 사전 요구사항

- **Java**: 21.0.8 LTS
- **Node.js**: 22.17.0
- **Docker**: 최신 버전 (MySQL, Redis용)
- **Git**: 최신 버전

### 1. 저장소 클론

```bash
git clone https://github.com/wovlf02/Hamcam.git
cd Hamcam
```

### 2. Docker 컨테이너 실행 (MySQL, Redis)

```bash
docker-compose up -d
```

### 3. 백엔드 실행

```bash
cd back

# macOS/Linux
./gradlew clean build
./gradlew bootRun

# Windows
./gradlew.bat clean build
./gradlew.bat bootRun
```

### 4. 프론트엔드 실행

```bash
cd front
npm install
npm start
```

### 5. 시그널링 서버 실행

```bash
cd signaling_server
npm install
node signalingServer.js
```

### 6. 접속

브라우저에서 `http://localhost:3000` 접속

---

## 📁 프로젝트 구조

```
Hamcam/
├── back/                           # Spring Boot 백엔드
│   ├── build.gradle                # Gradle 빌드 설정
│   ├── gradlew                     # Gradle Wrapper (Unix)
│   ├── gradlew.bat                 # Gradle Wrapper (Windows)
│   └── src/
│       ├── main/
│       │   ├── java/com/hamcam/back/
│       │   │   ├── BackApplication.java    # 애플리케이션 진입점
│       │   │   ├── config/                 # 설정 클래스
│       │   │   │   ├── auth/               # 이메일 설정
│       │   │   │   ├── socket/             # WebSocket 설정
│       │   │   │   └── web/                # CORS, Redis, Jackson 설정
│       │   │   ├── controller/             # REST 컨트롤러
│       │   │   │   ├── auth/               # 인증 API
│       │   │   │   ├── community/          # 커뮤니티 API
│       │   │   │   ├── dashboard/          # 대시보드 API
│       │   │   │   ├── evaluation/         # 평가 API
│       │   │   │   ├── study/              # 학습 API
│       │   │   │   └── user/               # 사용자 API
│       │   │   ├── dto/                    # 데이터 전송 객체
│       │   │   ├── entity/                 # JPA 엔티티
│       │   │   ├── global/                 # 글로벌 설정 (예외처리, 응답)
│       │   │   ├── handler/                # 핸들러
│       │   │   ├── repository/             # 데이터 액세스
│       │   │   ├── service/                # 비즈니스 로직
│       │   │   └── util/                   # 유틸리티
│       │   └── resources/
│       │       └── application.properties  # 애플리케이션 설정
│       └── test/                           # 테스트 코드
│
├── front/                          # React 프론트엔드
│   ├── package.json                # 의존성 및 스크립트
│   ├── public/
│   │   ├── index.html              # SPA 진입점
│   │   └── models/                 # Face API 모델 가중치
│   └── src/
│       ├── App.js                  # 루트 컴포넌트 (라우팅)
│       ├── index.js                # 클라이언트 진입점
│       ├── api/                    # API 통신 모듈
│       │   ├── api.js              # Axios 인스턴스
│       │   └── apiUrl.js           # API URL 설정
│       ├── features/               # 기능별 모듈
│       │   ├── auth/               # 인증 (로그인, 회원가입)
│       │   ├── community/          # 커뮤니티 (게시판, 채팅, 친구)
│       │   ├── dashboard/          # 대시보드
│       │   ├── evaluation/         # 평가 (수학 문제)
│       │   ├── plan/               # 학습 계획
│       │   ├── profile/            # 프로필
│       │   ├── rtc/                # 실시간 화상 통신
│       │   ├── statistics/         # 통계
│       │   └── study/              # 학습 (팀 스터디)
│       ├── global/                 # 전역 컴포넌트/스타일
│       ├── hooks/                  # 전역 커스텀 훅
│       ├── utils/                  # 유틸리티 함수
│       └── socket.js               # Socket.IO 설정
│
├── signaling_server/               # Node.js 시그널링 서버
│   ├── package.json                # 의존성 정의
│   └── signalingServer.js          # 메인 서버 코드
│
├── docs/                           # 프로젝트 문서
│   ├── README.md                   # 문서 개요
│   ├── 01_overview/                # 프로젝트 개요
│   ├── 02_requirements/            # 요구사항 정의
│   ├── 03_architecture/            # 아키텍처 설계
│   ├── 04_database/                # 데이터베이스 설계
│   ├── 05_api/                     # API 명세
│   ├── 06_development/             # 개발 가이드
│   ├── 07_realtime/                # 실시간 통신
│   └── 08_features/                # 기능별 상세
│
├── docker-compose.yml              # Docker Compose 설정
└── README.md                       # 프로젝트 README
```

---

## ⚙ 환경 설정

### 필수 환경 변수

`back/src/main/resources/application.properties`:

```properties
# 데이터베이스
spring.datasource.url=jdbc:mysql://localhost:3306/hamcam?useSSL=false&serverTimezone=Asia/Seoul
spring.datasource.username=root
spring.datasource.password=yourpassword

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# 세션
spring.session.store-type=redis
spring.session.redis.namespace=hamcam:session

# 이메일 (Naver SMTP)
spring.mail.host=smtp.naver.com
spring.mail.port=465
spring.mail.username=your-email@naver.com
spring.mail.password=your-password

# Gemini AI
gemini.api.key=your-gemini-api-key

# 서버 포트
server.port=8080
```

### API URL 설정

`front/src/api/apiUrl.js`:

```javascript
export const API_BASE_URL_3000 = "http://localhost:3000";
export const API_BASE_URL_8080 = "http://localhost:8080";
```

---

## 📚 API 문서

### 주요 API 엔드포인트

| 카테고리 | Base Path | 설명 |
|----------|-----------|------|
| 인증 | `/api/auth` | 로그인, 회원가입, 탈퇴 |
| 사용자 | `/api/users` | 프로필 조회/수정 |
| 대시보드 | `/api/dashboard` | Todo, 시험일정, 통계 |
| 커뮤니티 | `/api/community` | 게시판, 댓글 |
| 채팅 | `/api/chat` | 그룹/1:1 채팅 |
| 친구 | `/api/friends` | 친구 관리 |
| 학습 | `/api/study` | 팀 스터디 |
| 평가 | `/api/math` | 수학 문제 평가 |
| 파일 | `/api/files` | 파일 업로드 |

### 상세 문서

📖 **[전체 API 문서 보기](./docs/05_api/README.md)**

---

## 📈 기대 효과

### 1. 체계적 학습 습관 형성

| 효과 | 구현 방법 |
|------|-----------|
| 학습 몰입도 향상 | Face API 자동 측정으로 실제 학습 시간 추적 |
| 지속성 향상 | 대시보드 시각화를 통한 학습 현황 파악 |
| 목표 관리 | Todo/D-Day로 목표 점검 및 우선순위 관리 |

### 2. 문제 해결 능력 강화

| 효과 | 구현 방법 |
|------|-----------|
| 다양한 풀이 방식 학습 | 팀 문제풀이/발표로 풀이 과정 공유 |
| 사고 확장 | 다른 학습자의 접근 방식 관찰 및 학습 |
| 협업 경험 | 실시간 화상 스터디 및 채팅 |

### 3. AI 기반 학습 효율 극대화

| 효과 | 구현 방법 |
|------|-----------|
| 취약점 식별 | Gemini 기반 맞춤 피드백 및 오답노트 |
| 최적 학습 경로 | AI 기반 학습 계획 생성 |
| 즉각적 피드백 | 평가 완료 후 AI 생성 피드백 |

### 정량적 성과

| 항목 | 개선율 |
|------|--------|
| 실시간 접속자 수 업데이트 | **98.3%** (HTTP 폴링 → Socket.IO) |
| 평균 지연 시간 | **96%** (2.5초 → 0.1초) |

---

## 🧪 테스트

### 백엔드 테스트

```bash
cd back
./gradlew test
```

### 프론트엔드 테스트

```bash
cd front
npm test
```

---

## 🤝 기여 가이드

### 기여 방법

1. **Fork** 저장소를 포크합니다
2. **Clone** 포크한 저장소를 클론합니다
3. **Branch** 새 브랜치를 생성합니다: `git checkout -b feature/amazing-feature`
4. **Commit** 변경사항을 커밋합니다: `git commit -m 'Add amazing feature'`
5. **Push** 브랜치에 푸시합니다: `git push origin feature/amazing-feature`
6. **PR** Pull Request를 생성합니다

### 브랜치 네이밍

- `feature/` - 새로운 기능
- `fix/` - 버그 수정
- `docs/` - 문서 수정
- `refactor/` - 리팩토링

### 커밋 메시지 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 설정 변경

### 코드 스타일

- **Java**: Google Java Style Guide
- **JavaScript**: ESLint + Prettier
- **Commit**: Conventional Commits

---

## 📄 라이선스

이 프로젝트는 **독점적 라이선스(Proprietary License)** 하에 보호됩니다. 
자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

### ⚠️ 라이선스 요약

| 허용 | 제한 |
|:----:|:----:|
| ✅ 교육/학습 목적 코드 열람 | ❌ 상업적 사용 |
| ✅ 개인 학습용 로컬 실행 | ❌ 복제 및 배포 |
| ✅ 비상업적 교육 데모 | ❌ 수정 및 파생물 생성 |
| | ❌ 역공학 |
| | ❌ 서브라이선스 |

```
Hamcam Proprietary License
Copyright (c) 2025-2026 Hamcam Development Team. All Rights Reserved.

본 소프트웨어는 독점적 라이선스 하에 제공됩니다.
교육 및 학습 목적의 열람만 허용되며, 상업적 사용, 복제, 배포, 
수정, 파생물 생성은 라이선서의 사전 서면 동의 없이 금지됩니다.
```

### 📦 제3자 오픈소스 라이브러리

본 프로젝트는 Apache 2.0, MIT 라이선스의 오픈소스 라이브러리를 사용합니다.
각 라이브러리의 저작권 및 라이선스 정보는 [LICENSE](LICENSE) 파일에 명시되어 있습니다.

---

## 📞 연락처

- **GitHub**: [@wovlf02](https://github.com/wovlf02)
- **Email**: nskfn02@gmail.com
- **Project Link**: [https://github.com/wovlf02/Hamcam](https://github.com/wovlf02/Hamcam)

---

## 📚 참고 문서

| 문서 | 링크 |
|------|------|
| Spring Boot | [spring.io/projects/spring-boot](https://spring.io/projects/spring-boot) |
| React | [react.dev](https://react.dev) |
| Socket.IO | [socket.io](https://socket.io) |
| WebRTC | [webrtc.org](https://webrtc.org) |
| face-api.js | [github.com/justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js) |
| Gemini AI | [ai.google.dev](https://ai.google.dev) |

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/wovlf02">wovlf02</a>
</p>

<p align="center">
  <a href="#">🔝 맨 위로</a>
</p>
