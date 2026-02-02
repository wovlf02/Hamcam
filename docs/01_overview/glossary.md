# 용어 정의 (Glossary)

**관련 문서**: [프로젝트 개요](./project-overview.md) | [기술 스택](../03_architecture/tech-stack.md)

---

## 1. 일반 용어

| 용어 | 설명 |
|------|------|
| **Hamcam** | 학습 관리 및 협업 플랫폼 프로젝트명 |
| **자기주도 학습** | 학습자가 스스로 학습 목표를 설정하고 관리하는 학습 방식 |
| **교육 격차** | 가정·환경·자원 등 외부 요인에 의한 학업 성취도 차이 |
| **SPA** | Single Page Application, 단일 페이지 애플리케이션 |

---

## 2. 기술 용어

### 2.1 프론트엔드

| 용어 | 설명 |
|------|------|
| **React** | Facebook에서 개발한 JavaScript UI 라이브러리 |
| **React Router** | React 애플리케이션을 위한 라우팅 라이브러리 |
| **Axios** | Promise 기반 HTTP 클라이언트 |
| **styled-components** | CSS-in-JS 스타일링 라이브러리 |
| **Recharts** | React 기반 차트 라이브러리 |
| **face-api.js** | JavaScript 기반 얼굴 인식 라이브러리 |

### 2.2 백엔드

| 용어 | 설명 |
|------|------|
| **Spring Boot** | Spring 기반 애플리케이션 개발 프레임워크 |
| **Spring Data JPA** | JPA 기반 데이터 액세스 추상화 레이어 |
| **Spring WebSocket** | WebSocket 프로토콜 지원 |
| **Spring WebFlux** | 비동기 논블로킹 웹 프레임워크 |
| **JWT** | JSON Web Token, 토큰 기반 인증 |
| **Lombok** | Java 보일러플레이트 코드 감소 라이브러리 |

### 2.3 실시간 통신

| 용어 | 설명 |
|------|------|
| **WebRTC** | Web Real-Time Communication, 브라우저 간 실시간 통신 |
| **P2P** | Peer-to-Peer, 중앙 서버 없이 피어 간 직접 연결 |
| **STUN** | Session Traversal Utilities for NAT, NAT 우회를 위한 프로토콜 |
| **ICE** | Interactive Connectivity Establishment, 연결 설정 프레임워크 |
| **SDP** | Session Description Protocol, 세션 설명 프로토콜 |
| **Socket.IO** | 실시간 양방향 이벤트 기반 통신 라이브러리 |
| **STOMP** | Simple Text Oriented Messaging Protocol, 메시징 프로토콜 |
| **SockJS** | WebSocket 에뮬레이션 라이브러리 |

### 2.4 데이터베이스

| 용어 | 설명 |
|------|------|
| **MySQL** | 오픈소스 관계형 데이터베이스 |
| **Redis** | 인메모리 키-값 데이터 저장소 |
| **JPA** | Java Persistence API, 자바 ORM 표준 |
| **Entity** | 데이터베이스 테이블과 매핑되는 도메인 객체 |
| **Repository** | 데이터 액세스 계층 인터페이스 |

### 2.5 AI/ML

| 용어 | 설명 |
|------|------|
| **Gemini AI** | Google의 멀티모달 AI 모델 |
| **Face API** | 얼굴 인식 및 분석 API |
| **학습 측정** | Face API를 통한 실제 학습 시간 자동 측정 |

---

## 3. 도메인 용어

### 3.1 사용자 관련

| 용어 | 설명 |
|------|------|
| **User** | 시스템 사용자 (학생) |
| **Student** | 학습 관련 확장 정보를 가진 사용자 |
| **Profile** | 사용자 프로필 정보 |
| **Point** | 사용자 활동에 따른 누적 포인트 |

### 3.2 대시보드 관련

| 용어 | 설명 |
|------|------|
| **Todo** | 할 일 목록 항목 |
| **D-Day** | 시험까지 남은 일수 |
| **ExamSchedule** | 시험 일정 정보 |
| **Goal** | 학습 목표 |
| **StudyTime** | 학습 시간 기록 |
| **StudyStats** | 학습 통계 정보 |
| **Reflection** | 학습 회고 |

### 3.3 학습 관련

| 용어 | 설명 |
|------|------|
| **CamStudy** | Face API 기반 개인 학습 |
| **StudyRoom** | 팀 스터디 방 |
| **QuizRoom** | 퀴즈 풀이형 스터디 방 |
| **FocusRoom** | 집중 경쟁형 스터디 방 |
| **FocusedSeconds** | 집중한 시간 (초 단위) |

### 3.4 평가 관련

| 용어 | 설명 |
|------|------|
| **MathProblem** | 수학 문제 엔티티 |
| **MathProblemAttempt** | 문제 시도 기록 |
| **StudentWrongAnswer** | 오답 기록 (오답노트) |
| **ReviewAttempt** | 복습 시도 기록 |
| **DifficultyGrade** | 난이도 등급 (1-5, 1이 가장 어려움) |
| **UnitEvaluation** | 단원 평가 |

### 3.5 커뮤니티 관련

| 용어 | 설명 |
|------|------|
| **Post** | 게시글 |
| **Comment** | 댓글 |
| **Reply** | 대댓글 |
| **Attachment** | 첨부 파일 |
| **Like** | 좋아요 |
| **Favorite** | 즐겨찾기 |
| **Report** | 신고 |
| **Block** | 차단 |
| **Notice** | 공지사항 |

### 3.6 채팅 관련

| 용어 | 설명 |
|------|------|
| **ChatRoom** | 채팅방 |
| **ChatMessage** | 채팅 메시지 |
| **ChatParticipant** | 채팅방 참여자 |
| **ChatRead** | 메시지 읽음 상태 |
| **ChatRoomType** | 채팅방 유형 (1:1, 그룹) |

### 3.7 친구 관련

| 용어 | 설명 |
|------|------|
| **Friend** | 친구 관계 |
| **FriendRequest** | 친구 요청 |
| **FriendBlock** | 친구 차단 |
| **FriendReport** | 친구 신고 |

---

## 4. API 관련 용어

| 용어 | 설명 |
|------|------|
| **REST** | Representational State Transfer, API 설계 아키텍처 |
| **Endpoint** | API 접근 경로 |
| **Request** | API 요청 객체 |
| **Response** | API 응답 객체 |
| **DTO** | Data Transfer Object, 데이터 전송 객체 |
| **ApiResponse** | 표준화된 API 응답 형식 |
| **withCredentials** | 쿠키를 포함한 HTTP 요청 설정 |

---

## 5. 아키텍처 용어

| 용어 | 설명 |
|------|------|
| **레이어드 아키텍처** | Controller-Service-Repository-Entity 4계층 구조 |
| **Controller** | HTTP 요청을 처리하는 컨트롤러 계층 |
| **Service** | 비즈니스 로직을 처리하는 서비스 계층 |
| **Repository** | 데이터 액세스를 처리하는 저장소 계층 |
| **Feature 기반 구조** | 기능별로 모듈을 분리하는 프론트엔드 구조 |
| **시그널링 서버** | WebRTC P2P 연결을 위한 시그널 중계 서버 |
