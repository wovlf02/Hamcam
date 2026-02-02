# 비기능 요구사항

**관련 문서**: [기능 요구사항](./functional.md) | [기술 스택](../03_architecture/tech-stack.md)

---

## 1. 성능 (Performance)

### 1.1 응답 시간

| ID | 요구사항 | 목표값 |
|----|----------|--------|
| PERF-001 | REST API 평균 응답 시간 | < 500ms |
| PERF-002 | 페이지 초기 로딩 시간 | < 3초 |
| PERF-003 | WebSocket 메시지 지연 | < 100ms |
| PERF-004 | WebRTC 연결 설정 시간 | < 2초 |
| PERF-005 | Face API 얼굴 인식 속도 | < 200ms |

### 1.2 처리량

| ID | 요구사항 | 목표값 |
|----|----------|--------|
| PERF-010 | 동시 접속 사용자 수 | 100+ |
| PERF-011 | 스터디방당 최대 참여자 | 10명 |
| PERF-012 | 초당 API 요청 처리 | 1000+ |

### 1.3 최적화

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| PERF-020 | 불필요한 리렌더링 방지 | React.memo 사용 |
| PERF-021 | 실시간 업데이트 효율성 | Socket.IO 이벤트 기반 (HTTP 폴링 대비 98.3% 개선) |
| PERF-022 | 세션 성능 향상 | Redis 캐싱 |
| PERF-023 | 날짜/시간 직렬화 최적화 | Jackson JSR310 |

---

## 2. 확장성 (Scalability)

### 2.1 수평적 확장

| ID | 요구사항 | 설명 |
|----|----------|------|
| SCAL-001 | 시그널링 서버 확장 | 다중 인스턴스 지원 가능 |
| SCAL-002 | 데이터베이스 확장 | MySQL 레플리케이션 지원 |
| SCAL-003 | 세션 공유 | Redis 기반 분산 세션 |

### 2.2 모듈화

| ID | 요구사항 | 설명 |
|----|----------|------|
| SCAL-010 | 백엔드 레이어드 아키텍처 | Controller-Service-Repository-Entity 4계층 분리 |
| SCAL-011 | 도메인별 패키지 분리 | auth, community, chat, friend, dashboard, study, evaluation, plan |
| SCAL-012 | 프론트엔드 Feature 기반 구조 | 기능별 독립 모듈 구성 |
| SCAL-013 | API 모듈화 | Axios 인스턴스 기반 통신 모듈화 |

---

## 3. 신뢰성 (Reliability)

### 3.1 가용성

| ID | 요구사항 | 목표값 |
|----|----------|--------|
| REL-001 | 서비스 가용성 | 99% |
| REL-002 | 데이터 백업 주기 | 일 1회 |
| REL-003 | 장애 복구 시간 | < 1시간 |

### 3.2 데이터 일관성

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| REL-010 | 트랜잭션 관리 | Spring @Transactional |
| REL-011 | 데이터 무결성 | JPA 엔티티 제약조건 |
| REL-012 | 동시성 제어 | 낙관적 잠금/비관적 잠금 |

### 3.3 오류 처리

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| REL-020 | 글로벌 예외 처리 | @ControllerAdvice |
| REL-021 | 표준 응답 형식 | ApiResponse 클래스 |
| REL-022 | 에러 로깅 | Slf4j + Lombok |

---

## 4. 보안 (Security)

### 4.1 인증

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| SEC-001 | 세션 기반 인증 | HttpServletRequest 세션 |
| SEC-002 | JWT 토큰 인증 | jjwt 라이브러리 |
| SEC-003 | 비밀번호 암호화 | BCrypt 해싱 |
| SEC-004 | 이메일 인증 | Spring Mail (Naver SMTP) |

### 4.2 접근 제어

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| SEC-010 | 엔드포인트 보호 | Spring Security 6.x |
| SEC-011 | CORS 설정 | WebConfig 다양한 Origin 허용 |
| SEC-012 | WebSocket 인증 | StompAuthChannelInterceptor |

### 4.3 데이터 보호

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| SEC-020 | 쿠키 기반 세션 유지 | withCredentials 설정 |
| SEC-021 | 민감 정보 보호 | 환경 변수 관리 |

---

## 5. 유지보수성 (Maintainability)

### 5.1 코드 품질

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| MAIN-001 | 일관된 코드 스타일 | ESLint (프론트엔드) |
| MAIN-002 | 보일러플레이트 감소 | Lombok (백엔드) |
| MAIN-003 | 타입 안전성 | Java 21 + JavaScript ES6+ |

### 5.2 테스트

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| MAIN-010 | 백엔드 테스트 | JUnit 5 + Spring Boot Test |
| MAIN-011 | 프론트엔드 테스트 | Jest |
| MAIN-012 | 통합 테스트 | Spring Integration Test |

### 5.3 문서화

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| MAIN-020 | API 문서화 | 수동 Markdown 문서 |
| MAIN-021 | 프로젝트 문서화 | docs 폴더 체계적 관리 |
| MAIN-022 | 코드 주석 | Javadoc (백엔드), JSDoc (프론트엔드) |

---

## 6. 호환성 (Compatibility)

### 6.1 브라우저 지원

| ID | 요구사항 | 지원 범위 |
|----|----------|-----------|
| COMP-001 | Chrome | 최신 버전 |
| COMP-002 | Firefox | 최신 버전 |
| COMP-003 | Safari | 최신 버전 |
| COMP-004 | Edge | 최신 버전 |

### 6.2 디바이스

| ID | 요구사항 | 지원 범위 |
|----|----------|-----------|
| COMP-010 | 데스크톱 | 권장 |
| COMP-011 | 태블릿 | 부분 지원 |
| COMP-012 | 모바일 | 부분 지원 |

---

## 7. 운영 (Operations)

### 7.1 모니터링

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| OPS-001 | 헬스체크 | Spring Boot Actuator |
| OPS-002 | 로깅 | Slf4j + Lombok @Slf4j |
| OPS-003 | 실시간 상태 확인 | Socket.IO room-count-update |

### 7.2 배포

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| OPS-010 | 컨테이너화 | Docker Compose |
| OPS-011 | 빌드 자동화 | Gradle Wrapper 8.11.1 |
| OPS-012 | DB 마이그레이션 | Flyway (지원) |

### 7.3 개발 환경

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| OPS-020 | Hot Reload | Spring Boot DevTools |
| OPS-021 | 의존성 버전 관리 | Spring Boot BOM |
| OPS-022 | 일관된 빌드 환경 | Gradle Wrapper |

---

## 8. 사용성 (Usability)

### 8.1 UI/UX

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| USE-001 | 직관적인 네비게이션 | React Router + NavBar |
| USE-002 | 일관된 디자인 | styled-components |
| USE-003 | 반응형 레이아웃 | LayoutWithSidebar, LayoutWithoutSidebar |
| USE-004 | 데이터 시각화 | Recharts 차트 |
| USE-005 | 캘린더 UI | react-calendar |
| USE-006 | 아이콘 | react-icons, react-feather |
| USE-007 | 마크다운 지원 | react-markdown |

### 8.2 피드백

| ID | 요구사항 | 설명 |
|----|----------|------|
| USE-010 | 로딩 상태 표시 | 로딩 인디케이터 |
| USE-011 | 성공/실패 알림 | 토스트 메시지 |
| USE-012 | 실시간 상태 업데이트 | Socket.IO 이벤트 |

---

## 9. 환경 요구사항

### 9.1 개발 환경

| 항목 | 버전 |
|------|------|
| Java | 21.0.8 (LTS) |
| Node.js | 22.17.0 |
| Gradle | 8.11.1 |
| Docker | 최신 버전 |

### 9.2 런타임 환경

| 항목 | 설명 |
|------|------|
| 운영체제 | Windows, macOS, Linux |
| 메모리 (백엔드) | 최소 512MB |
| 메모리 (프론트엔드) | 최소 256MB |
| 디스크 공간 | 최소 1GB |

### 9.3 네트워크

| 항목 | 설명 |
|------|------|
| HTTPS | 프로덕션 환경에서 필수 |
| WebSocket | 포트 8080, 4000 |
| WebRTC | UDP 포트 필요 |
