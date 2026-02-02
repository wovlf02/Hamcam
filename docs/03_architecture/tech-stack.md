# 기술 스택

**관련 문서**: [시스템 설계](./system-design.md) | [백엔드 구조](./backend-structure.md) | [프론트엔드 구조](./frontend-structure.md)

---

## 1. Frontend

### 1.1 핵심 프레임워크

| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | ^19.1.0 | SPA UI 프레임워크 |
| **React DOM** | ^19.1.0 | React DOM 렌더링 |
| **React Router DOM** | ^7.4.1 | 클라이언트 사이드 라우팅 |

### 1.2 상태 관리 및 HTTP 통신

| 기술 | 버전 | 용도 |
|------|------|------|
| **Axios** | ^1.8.4 | HTTP 클라이언트 (API 통신) |
| **LocalStorage** | - | 클라이언트 상태 저장 |

### 1.3 UI/스타일링

| 기술 | 버전 | 용도 |
|------|------|------|
| **styled-components** | ^6.1.18 | CSS-in-JS 스타일링 |
| **react-icons** | ^5.5.0 | 아이콘 라이브러리 |
| **react-feather** | ^2.0.10 | Feather 아이콘 |

### 1.4 데이터 시각화

| 기술 | 버전 | 용도 |
|------|------|------|
| **recharts** | ^2.15.3 | 차트/그래프 시각화 |
| **react-calendar** | ^5.1.0 | 캘린더 컴포넌트 |

### 1.5 실시간 통신

| 기술 | 버전 | 용도 |
|------|------|------|
| **socket.io-client** | ^4.8.1 | WebRTC 시그널링 클라이언트 |
| **livekit-client** | ^2.15.7 | LiveKit 클라이언트 |
| **@livekit/components-react** | ^2.9.14 | LiveKit React 컴포넌트 |

### 1.6 AI/ML

| 기술 | 버전 | 용도 |
|------|------|------|
| **face-api.js** | ^0.22.2 | 브라우저 얼굴 인식 |

### 1.7 유틸리티

| 기술 | 버전 | 용도 |
|------|------|------|
| **moment** | ^2.30.1 | 날짜/시간 처리 |
| **react-markdown** | ^10.1.0 | 마크다운 렌더링 |
| **remark-gfm** | ^4.0.1 | GitHub Flavored Markdown |

### 1.8 개발 도구

| 기술 | 버전 | 용도 |
|------|------|------|
| **react-scripts** | 5.0.1 | Create React App 빌드 도구 |
| **http-proxy-middleware** | ^3.0.3 | 개발 서버 프록시 |

### 1.9 테스트

| 기술 | 버전 | 용도 |
|------|------|------|
| **@testing-library/react** | ^16.3.0 | React 컴포넌트 테스트 |
| **@testing-library/jest-dom** | ^6.6.3 | Jest DOM 매처 |
| **web-vitals** | ^2.1.4 | 웹 성능 측정 |

---

## 2. Backend

### 2.1 핵심 프레임워크

| 기술 | 버전 | 용도 |
|------|------|------|
| **Spring Boot** | 3.4.2 | 백엔드 프레임워크 |
| **Java** | 21 (LTS) | 프로그래밍 언어 |
| **Gradle** | 8.11.1 | 빌드 도구 (Gradle Wrapper) |

### 2.2 Spring 모듈

| 기술 | 용도 |
|------|------|
| **spring-boot-starter-web** | REST API |
| **spring-boot-starter-data-jpa** | ORM, 데이터 액세스 |
| **spring-boot-starter-validation** | 입력 검증 |
| **spring-boot-starter-websocket** | WebSocket/STOMP 통신 |
| **spring-boot-starter-actuator** | 헬스체크, 모니터링 |
| **spring-boot-starter-thymeleaf** | 서버 사이드 템플릿 |
| **spring-boot-starter-mail** | 이메일 발송 |
| **spring-boot-starter-webflux** | 비동기 HTTP 클라이언트 (Gemini API) |
| **spring-boot-starter-batch** | 배치 처리 |
| **spring-boot-starter-data-redis** | Redis 데이터 액세스 |
| **spring-boot-starter-data-rest** | REST 리포지토리 노출 |

### 2.3 Spring Session & 캐싱

| 기술 | 용도 |
|------|------|
| **spring-session-data-redis** | Redis 기반 분산 세션 |
| **spring-boot-starter-data-redis** | Redis 클라이언트 |

### 2.4 Spring Integration

| 기술 | 용도 |
|------|------|
| **spring-integration-http** | HTTP 통합 |
| **spring-integration-jdbc** | JDBC 통합 |
| **spring-integration-jpa** | JPA 통합 |
| **spring-integration-mail** | 메일 통합 |
| **spring-integration-redis** | Redis 통합 |

### 2.5 데이터베이스

| 기술 | 용도 |
|------|------|
| **MySQL Connector/J** | MySQL JDBC 드라이버 |
| **jackson-datatype-jsr310** | Java 8 날짜/시간 직렬화 |

### 2.6 보안

| 기술 | 버전 | 용도 |
|------|------|------|
| **jjwt-api** | 0.11.5 | JWT API |
| **jjwt-impl** | 0.11.5 | JWT 구현체 |
| **jjwt-jackson** | 0.11.5 | JWT Jackson 바인딩 |

### 2.7 유틸리티

| 기술 | 버전 | 용도 |
|------|------|------|
| **Lombok** | - | 보일러플레이트 코드 감소 |
| **commons-lang3** | 3.12.0 | Apache Commons 유틸리티 |

### 2.8 개발 도구

| 기술 | 용도 |
|------|------|
| **spring-boot-devtools** | Hot Reload 개발 생산성 향상 |

### 2.9 테스트

| 기술 | 용도 |
|------|------|
| **spring-boot-starter-test** | Spring Boot 테스트 |
| **spring-batch-test** | 배치 테스트 |
| **spring-integration-test** | 통합 테스트 |
| **junit-platform-launcher** | JUnit 5 런처 |

---

## 3. Signaling Server (Node.js)

### 3.1 런타임

| 기술 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 22.17.0 | JavaScript 런타임 |

### 3.2 핵심 라이브러리

| 기술 | 용도 |
|------|------|
| **socket.io** | WebSocket 서버 (시그널링) |
| **axios** | HTTP 클라이언트 (Spring API 호출) |
| **http** | HTTP 서버 (내장 모듈) |
| **fs** | 파일 시스템 (내장 모듈) |
| **path** | 경로 처리 (내장 모듈) |

---

## 4. 데이터베이스 & 캐시

### 4.1 메인 데이터베이스

| 기술 | 용도 |
|------|------|
| **MySQL** | 관계형 데이터베이스 |

### 4.2 캐시 & 세션

| 기술 | 용도 |
|------|------|
| **Redis** | 세션 저장소, 캐시 |

---

## 5. 실시간 통신

### 5.1 WebRTC

| 기술 | 용도 |
|------|------|
| **WebRTC (RTCPeerConnection)** | P2P 실시간 미디어 통신 |
| **getUserMedia API** | 로컬 미디어 스트림 획득 |
| **STUN Server (Google)** | NAT 우회 (stun:stun.l.google.com:19302) |

### 5.2 시그널링

| 기술 | 용도 |
|------|------|
| **Socket.IO** | Offer/Answer/ICE Candidate 교환 |
| **STOMP** | WebSocket 메시징 프로토콜 |
| **SockJS** | WebSocket 폴백 |

---

## 6. AI/ML

### 6.1 학습 측정

| 기술 | 용도 |
|------|------|
| **face-api.js** | 브라우저 기반 얼굴 인식 |
| **AI 모델 가중치** | public/models 디렉터리에 저장 |

### 6.2 AI 학습 지원

| 기술 | 용도 |
|------|------|
| **Gemini AI** | 학습 계획 생성, 피드백 제공 |
| **Spring WebFlux** | 비동기 Gemini API 호출 |

---

## 7. DevOps

### 7.1 컨테이너화

| 기술 | 용도 |
|------|------|
| **Docker** | 컨테이너 관리 |
| **Docker Compose** | MySQL, Redis, LiveKit 오케스트레이션 |

### 7.2 빌드

| 기술 | 버전 | 용도 |
|------|------|------|
| **Gradle Wrapper** | 8.11.1 | 일관된 빌드 환경 |
| **npm** | - | 프론트엔드/시그널링 서버 패키지 관리 |

---

## 8. 버전 요약

| 분류 | 기술 | 버전 |
|------|------|------|
| **Language** | Java | 21 (LTS) |
| **Language** | JavaScript | ES6+ |
| **Backend** | Spring Boot | 3.4.2 |
| **Frontend** | React | 19.1.0 |
| **Frontend** | React Router | 7.4.1 |
| **Build** | Gradle | 8.11.1 |
| **Runtime** | Node.js | 22.17.0 |
| **Realtime** | Socket.IO | 4.8.1 |
| **AI** | face-api.js | 0.22.2 |
| **Security** | jjwt | 0.11.5 |
