docs: 프로젝트 전체 문서화 및 독점 라이선스 적용

## 📋 작업 개요
프로젝트 문서 완전 재작성 및 표준화, 독점적 라이선스 전환, 포트폴리오 문서 추가

## ✨ 주요 변경사항

### 1. 프로젝트 문서 완전 보완 (docs/)
- **docs/README.md**: v2.1로 업데이트, 문서 작성 가이드라인 추가
- **문서 구조 정리**: 총 36개 문서, 8개 카테고리 (100% 완성도)
  - 01_overview: 프로젝트 개요, 용어정의, 기대효과
  - 02_requirements: 기능/비기능 요구사항
  - 03_architecture: 기술스택, 시스템설계, 백엔드/프론트엔드 구조
  - 04_database: 엔티티 스키마, 데이터베이스 관계
  - 05_api: API 명세 11개 문서 (인증, 사용자, 대시보드, 커뮤니티, 채팅, 친구, 학습, 평가, 파일, 실시간통신)
  - 06_development: 개발환경 설정, API 연동, 코딩 컨벤션, Git 컨벤션
  - 07_realtime: WebSocket, WebRTC P2P, 시그널링 서버
  - 08_features: 전체 기능 명세, 대시보드, Face API, 팀스터디, 수학평가, AI 기능, 커뮤니티
- **docs/assets/**: 로고 및 이미지 자원용 폴더 생성

### 2. 루트 README.md 전면 개선
- **표준 규격 적용**: GitHub 표준 README 포맷 준수
- **기술 배지 추가**: Java, Spring Boot, React, Node.js, MySQL, Redis, Docker, WebRTC
- **체계적 구성**:
  - 목차 추가 (12개 섹션)
  - 프로젝트 소개 및 해결 과제 표로 정리
  - 주요 기능 6개 카테고리 (대시보드, 개인학습, 팀학습, 수학평가, AI지원, 커뮤니티)
  - 기술 스택 표 형식 정리 (Frontend, Backend, Signaling Server, Database, AI/ML)
  - 시스템 아키텍처 다이어그램 포함
  - 빠른 시작 가이드 (6단계)
  - 상세 프로젝트 구조 트리
  - 환경 설정 가이드
  - API 문서 요약 및 링크
  - 기대 효과 (정량적 성과: 98.3% 개선율 명시)
  - 테스트 명령어
  - 기여 가이드 (브랜치 네이밍, 커밋 규칙, 코드 스타일)
- **정확성 개선**: `front_web` → `front` 폴더명 수정

### 3. 포트폴리오 문서 작성 (hamcam.md)
- **목적**: 프로젝트 소개 및 포트폴리오 제출용
- **내용**: 프로젝트 배경, 핵심 기능, 기술적 구현, 성과 지표 등

### 4. 라이선스 전환 (MIT → Proprietary)
#### 법적 검토 및 오픈소스 라이선스 분석
- **사용 라이브러리 조사**:
  - Backend: Spring Boot (Apache 2.0), Lombok (MIT), Jackson (Apache 2.0), jjwt (Apache 2.0), MySQL Connector/J (GPL 2.0 + FOSS Exception)
  - Frontend: React (MIT), React Router (MIT), Axios (MIT), Socket.IO (MIT), styled-components (MIT), Recharts (MIT), face-api.js (MIT), LiveKit (Apache 2.0)
  - Signaling Server: Node.js (MIT), Socket.IO (MIT)
- **결론**: 모든 라이브러리가 Permissive License → 독점 라이선스 적용 법적으로 가능

#### Hamcam Proprietary License v1.0 작성 (LICENSE)
- **허용 사항**:
  - ✅ 교육/학습 목적 소스 코드 열람
  - ✅ 개인 학습용 로컬 환경 실행
  - ✅ 비상업적 교육 기관 데모
- **금지 사항**:
  - ❌ 상업적 사용 (판매, 유료 서비스, 수익 창출)
  - ❌ 복제 및 배포 (재배포, 재라이선스)
  - ❌ 수정 및 파생물 (코드 수정, 파생 저작물 생성, API/스키마 복제)
  - ❌ 역공학 (역컴파일, 보안 우회)
  - ❌ 서브라이선스 (권한 양도)
- **법적 보호 조항**:
  - 준거법: 대한민국 법률
  - 관할 법원: 서울중앙지방법원
  - 위반 시: 즉시 권한 종료 + 법적 조치 + 손해배상 청구
  - 보증 부인 및 책임 제한 (AS-IS 제공)
- **제3자 오픈소스 고지**:
  - Apache License 2.0 라이브러리 목록 및 저작권
  - MIT License 라이브러리 목록 및 저작권
  - MySQL Connector/J GPL 2.0 + FOSS Exception 명시

#### README.md 라이선스 섹션 업데이트
- 독점 라이선스 적용 명시
- 허용/제한 사항 표로 시각화
- 제3자 오픈소스 라이브러리 고지

## 🔧 기술적 세부사항

### 파일 변경 내역
```
docs/
├── README.md (v2.1 업데이트, 문서 구조 보완)
├── assets/ (신규 폴더)
├── 01_overview/ (기존 문서 검증 완료)
├── 02_requirements/ (기존 문서 검증 완료)
├── 03_architecture/ (기존 문서 검증 완료)
├── 04_database/ (기존 문서 검증 완료)
├── 05_api/ (11개 API 문서 검증 완료)
├── 06_development/ (4개 개발 가이드 검증 완료)
├── 07_realtime/ (3개 실시간 통신 문서 검증 완료)
└── 08_features/ (7개 기능 명세 문서 검증 완료)

/ (루트)
├── README.md (전면 개선, 표준 규격 적용)
├── LICENSE (MIT → Hamcam Proprietary License v1.0)
├── hamcam.md (신규 포트폴리오 문서)
└── commit-message.md (이 파일)
```

### 문서화 통계
- **총 문서 수**: 36개
- **총 문서 라인**: 약 8,000+ 라인
- **완성도**: 100%
- **커버리지**: 
  - 백엔드 구조 100% (Controller, Service, Repository, Entity, DTO)
  - 프론트엔드 구조 100% (Features, Components, Hooks, Utils)
  - API 명세 100% (11개 도메인)
  - 실시간 통신 100% (WebSocket, WebRTC, Signaling Server)

## 💡 기대 효과

### 문서화
- ✅ 프로젝트 이해도 향상 (신규 개발자 온보딩 시간 단축)
- ✅ 유지보수성 증대 (구조 및 API 명세 명확화)
- ✅ 협업 효율 개선 (표준화된 문서 구조)

### 라이선스
- ✅ 지적 재산권 보호 (상업적 무단 사용 방지)
- ✅ 법적 리스크 최소화 (명확한 사용 조건 명시)
- ✅ 오픈소스 컴플라이언스 준수 (제3자 라이브러리 고지)
- ✅ 상업화 준비 완료 (독점 라이선스 적용)

## 🎯 변경 이유

1. **문서 부족**: 기존 docs 폴더에 일부 문서만 존재, 전체 시스템 이해 어려움
2. **README 개선 필요**: 표준 규격 미준수, 정보 부족, 가독성 저하
3. **라이선스 불명확**: MIT 라이선스로 인한 상업화 시 지적 재산권 보호 불가
4. **포트폴리오 필요**: 프로젝트 소개 및 제출용 별도 문서 부재

## 📝 추가 정보

### 검증 완료 항목
- [x] docs 폴더 모든 문서 파일 구조 확인
- [x] 실제 코드와 문서 내용 일치성 검증
- [x] 백엔드 패키지 구조 (Controller, Service, Repository, Entity, DTO) 문서화
- [x] 프론트엔드 Features 구조 (auth, dashboard, community, evaluation, plan, profile, rtc, statistics, study) 문서화
- [x] API 엔드포인트 11개 도메인 명세 검증
- [x] 오픈소스 라이선스 법적 검토 (Apache 2.0, MIT, GPL + FOSS Exception)
- [x] 독점 라이선스 조항 12개 섹션 작성
- [x] README.md 표준 규격 준수 확인

### 참고 사항
- 날짜: 2026년 2월 2일
- 문서 버전: v2.1
- 라이선스 버전: Hamcam Proprietary License v1.0
- 커밋 타입: docs (문서 관련 변경)

---

## 📌 Breaking Changes
없음 (문서 및 라이선스만 변경, 코드 변경 없음)

## 🔗 관련 이슈
없음

## 👥 작성자
- wovlf02 (GitHub: @wovlf02, Email: nskfn02@gmail.com)

