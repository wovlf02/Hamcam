# 📚 Hamcam 프로젝트 문서

> **학습 관리 및 협업 플랫폼** - React 19 + Spring Boot 3.4.2 기반

## 📋 문서 구조

```
docs/
├── README.md                    # 문서 개요 (이 파일)
├── assets/                      # 로고, 이미지 등 정적 자원
├── 01_overview/                 # 프로젝트 개요
│   ├── project-overview.md      # 프로젝트 소개
│   ├── glossary.md              # 용어 정의
│   └── expected-outcomes.md     # 기대 효과
├── 02_requirements/             # 요구사항 정의
│   ├── functional.md            # 기능 요구사항
│   └── non-functional.md        # 비기능 요구사항
├── 03_architecture/             # 아키텍처 설계
│   ├── tech-stack.md            # 기술 스택
│   ├── system-design.md         # 시스템 설계
│   ├── backend-structure.md     # 백엔드 구조
│   └── frontend-structure.md    # 프론트엔드 구조
├── 04_database/                 # 데이터베이스 설계
│   ├── entity-schema.md         # 엔티티 스키마
│   └── database-relations.md    # 테이블 관계
├── 05_api/                      # API 명세
│   ├── README.md                # API 개요
│   ├── 01-auth.md               # 인증 API
│   ├── 02-user.md               # 사용자 API
│   ├── 03-dashboard.md          # 대시보드 API
│   ├── 04-community.md          # 커뮤니티 API
│   ├── 05-chat.md               # 채팅 API
│   ├── 06-friend.md             # 친구 API
│   ├── 07-study.md              # 학습 API
│   ├── 08-evaluation.md         # 평가 API
│   ├── 09-file.md               # 파일 API
│   └── 10-realtime.md           # 실시간 통신 API
├── 06_development/              # 개발 가이드
│   ├── setup.md                 # 개발 환경 설정
│   ├── api-integration.md       # API 연동 가이드
│   ├── coding-conventions.md    # 코딩 컨벤션
│   └── git-convention.md        # Git 컨벤션
├── 07_realtime/                 # 실시간 통신
│   ├── websocket.md             # WebSocket/STOMP
│   ├── webrtc-p2p.md            # WebRTC P2P
│   └── signaling-server.md      # 시그널링 서버
└── 08_features/                 # 기능별 상세
    ├── complete-features.md     # 전체 기능 명세
    ├── dashboard.md             # 대시보드 기능
    ├── face-api.md              # Face API 학습 측정
    ├── team-study.md            # 팀 스터디
    ├── math-evaluation.md       # 수학 평가 시스템
    ├── ai-features.md           # AI 기능
    └── community.md             # 커뮤니티 기능
```

---

## 🎯 프로젝트 요약

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Hamcam (학습 관리 및 협업 플랫폼) |
| **대상 사용자** | 학생 (자기주도 학습자) |
| **서비스 형태** | 웹 애플리케이션 (SPA) |
| **프론트엔드** | React 19.1.0 |
| **백엔드** | Spring Boot 3.4.2 + Java 21 |
| **실시간 통신** | WebRTC P2P + Socket.IO + WebSocket/STOMP |
| **AI** | Gemini AI + Face API |
| **데이터베이스** | MySQL + Redis |

---

## 🚀 핵심 기능

| 기능 | 설명 | 관련 기술 |
|------|------|-----------|
| **대시보드** | Todo, D-Day, 학습 통계, 캘린더 | React, Recharts |
| **개인 학습** | Face API 기반 실제 학습 시간 측정 | face-api.js |
| **팀 학습** | WebRTC P2P 실시간 화상 스터디 | WebRTC, Socket.IO |
| **수학 평가** | 2025년 모의평가 기출문제 기반 진단 | Spring Boot |
| **AI 학습 지원** | 학습 계획 생성, 오답 해설 | Gemini AI |
| **커뮤니티** | 게시판, 채팅, 친구 관리 | WebSocket/STOMP |

---

## 📖 문서 읽는 순서

1. [프로젝트 개요](./01_overview/project-overview.md)
2. [기술 스택](./03_architecture/tech-stack.md)
3. [기능 요구사항](./02_requirements/functional.md)
4. [시스템 설계](./03_architecture/system-design.md)
5. [데이터베이스 스키마](./04_database/entity-schema.md)
6. [API 명세](./05_api/README.md)
7. [개발 환경 설정](./06_development/setup.md)
8. [실시간 통신](./07_realtime/websocket.md)
9. [기능별 상세](./08_features/)

---

## 🛠️ 빠른 시작

### 백엔드 실행
```bash
cd back
./gradlew clean build
./gradlew bootRun
```

### 프론트엔드 실행
```bash
cd front
npm install
npm start
```

### 시그널링 서버 실행
```bash
cd signaling_server
npm install
node signalingServer.js
```

### Docker 컨테이너 실행 (MySQL, Redis)
```bash
docker-compose up -d
```

---

## ⚙️ 필수 환경 변수

| 변수명 | 설명 |
|--------|------|
| `SPRING_DATASOURCE_URL` | JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | DB 사용자명 |
| `SPRING_DATASOURCE_PASSWORD` | DB 비밀번호 |
| `SPRING_REDIS_HOST` | Redis 호스트 |
| `SPRING_REDIS_PORT` | Redis 포트 |
| `JWT_SECRET` | JWT 서명 비밀키 |
| `GEMINI_API_KEY` | Gemini AI API 키 |

---

## 🔗 빠른 링크 (주요 문서)

### API 문서 (완전 문서화 완료 ✅)
- [인증 API](./05_api/01-auth.md) - 로그인, 회원가입
- [커뮤니티 API](./05_api/04-community.md) ✨ - 게시판, 댓글, 스터디
- [채팅 API](./05_api/05-chat.md) ✨ - 그룹채팅, 1:1채팅
- [친구 API](./05_api/06-friend.md) ✨ - 친구 관리, 차단, 신고
- [학습 API](./05_api/07-study.md) ✨ - 팀스터디, 퀴즈, AI계획
- [평가 API](./05_api/08-evaluation.md) ✨ - 단원평가, AI분석
- [실시간 통신 API](./05_api/10-realtime.md) ✨ - Socket.IO, WebRTC

### 개발 가이드
- [개발 환경 설정](./06_development/setup.md)
- [API 연동 가이드](./06_development/api-integration.md) ✨
- [코딩 컨벤션](./06_development/coding-conventions.md)

### 기능 명세
- [전체 기능 명세](./08_features/complete-features.md) ✨ - 모든 기능 상세 설명
- [대시보드 기능](./08_features/dashboard.md)
- [AI 기능](./08_features/ai-features.md)

---

## 📊 문서 통계

| 카테고리 | 문서 수 | 완성도 |
|---------|--------|:------:|
| 프로젝트 개요 | 3 | 100% |
| 요구사항 | 2 | 100% |
| 아키텍처 | 4 | 100% |
| 데이터베이스 | 2 | 100% |
| **API 명세** | **11** | **100%** ✅ |
| **개발 가이드** | **4** | **100%** ✅ |
| 실시간 통신 | 3 | 100% |
| **기능 명세** | **7** | **100%** ✅ |
| **총계** | **36** | **100%** ✅ |

---

## 📝 업데이트 이력

### v2.1 (2026-02-02) - 문서 보완
- ✅ 문서 버전 및 날짜 정보 갱신
- ✅ 문서 작성 가이드라인 추가
- ✅ 루트 README.md 표준 규격 업데이트
- ✅ 시그널링 서버 문서 검토 및 보완

### v2.0 (2025-02-02) - 완전 문서화
- ✅ **커뮤니티 API** 문서 작성 (게시판, 댓글, 공지, 스터디)
- ✅ **채팅 API** 문서 작성 (그룹채팅, 1:1채팅, 파일첨부)
- ✅ **친구 API** 문서 작성 (요청, 차단, 신고)
- ✅ **학습 API** 문서 작성 (팀스터디, 퀴즈, AI계획)
- ✅ **평가 API** 문서 작성 (단원평가, AI분석, 레벨)
- ✅ **파일 API** 문서 작성 (업로드, 이미지 서빙)
- ✅ **실시간 통신 API** 문서 작성 (Socket.IO, WebRTC)
- ✅ **API 연동 가이드** 작성 (프론트엔드 연동 방법)
- ✅ **전체 기능 명세** 작성 (모든 기능 상세 설명)
- ✅ 모든 API 요청/응답 예시 추가
- ✅ React 구현 예시 코드 추가

### v1.0 (2025-01-15) - 초기 버전
- 기본 문서 구조 수립
- 인증/사용자/대시보드 API 문서
- 프로젝트 개요 작성

---

**최종 업데이트**: 2026년 2월 2일  
**문서 버전**: v2.1  
**전체 완성도**: 100% ✅

---

## 📌 문서 작성 가이드

### 새 문서 추가 시
1. 해당 카테고리 폴더에 마크다운 파일 생성
2. 문서 상단에 관련 문서 링크 추가
3. docs/README.md의 목차 업데이트
4. 변경 이력에 추가 내용 기록

### 문서 작성 규칙
- 모든 API 문서에는 요청/응답 예시 포함
- 코드 블록에는 언어 명시 (```javascript, ```java 등)
- 표 형식으로 파라미터 및 필드 설명
- 관련 문서 상호 참조 링크 유지

---

**모든 기능이 완벽히 문서화되었습니다! 🎉**
