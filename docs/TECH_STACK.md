# 기술 스택 — 표 기반 요약 (한눈에 보기)

짧게 정리: 아래 표들은 각 영역의 핵심 기술, 주요 의존성(버전), 주요 파일 위치 및 실행 팁을 직관적으로 보여줍니다.

---

1) 전체 개요

| 영역 | 역할 요약 | 주요 파일/위치 |
|---|---|---|
| Frontend | SPA UI, 실시간/미디어, face-api 모델 로드 | front/package.json, front/src/, front/public/models/
| Backend | REST API, DB/세션, 마이그레이션, LiveKit 토큰 발급 | back/build.gradle, back/src/main/resources/db/migration/
| Signaling | WebRTC 시그널링 및 채팅 중계 | signaling_server/signalingServer.js, signaling_server/package.json

---

2) 프론트엔드 — 핵심 의존성 (빠른 표)

| 패키지 | 버전 | 용도(한줄) |
|---|---:|---|
| react | ^19.1.0 | UI 프레임워크
| react-dom | ^19.1.0 | DOM 렌더링
| react-scripts | 5.0.1 | CRA 빌드/개발 스크립트
| react-router-dom | ^7.4.1 | 라우팅
| axios | ^1.8.4 | HTTP 클라이언트
| styled-components | ^6.1.18 | CSS-in-JS
| socket.io-client | ^4.8.1 | 실시간 통신
| sockjs-client | ^1.6.1 | STOMP/Websocket 폴백
| @stomp/stompjs | ^7.1.1 | STOMP 클라이언트
| stompjs | ^2.3.3 | STOMP 호환성
| livekit-client | ^2.15.7 | LiveKit WebRTC 클라이언트
| @livekit/components-react | ^2.9.14 | LiveKit UI 컴포넌트
| face-api.js | ^0.22.2 | 브라우저 얼굴 인식 모델
| react-markdown / remark-gfm | ^10.1.0 / ^4.0.1 | 마크다운 렌더링
| recharts | ^2.15.3 | 차트/시각화
| react-calendar | ^5.1.0 | 캘린더 UI
| moment | ^2.30.1 | 날짜 처리
| web-vitals | ^2.1.4 | 퍼포먼스 측정

참고: 테스트 관련 패키지(@testing-library/*)도 존재. 개발용 .env와 proxy 설정(front/.env, package.json) 확인 필요.

---

3) 백엔드 — 주요 의존성 (build.gradle 기준)

| 그룹:아티팩트 | 버전 / 비고 |
|---|---:|
| org.springframework.boot:spring-boot-starter-web | Spring Boot BOM 관리 (플러그인 버전: 3.4.2) |
| org.springframework.boot:spring-boot-starter-data-jpa | Spring Boot BOM 관리 |
| org.springframework.boot:spring-boot-starter-websocket | Spring Boot BOM 관리 |
| org.springframework.session:spring-session-data-redis | Spring Boot BOM 관리 |
| com.fasterxml.jackson.datatype:jackson-datatype-jsr310 | Spring Boot BOM 관리 |
| io.jsonwebtoken:jjwt-api | 0.11.5 |
| io.jsonwebtoken:jjwt-impl | 0.11.5 (runtimeOnly) |
| io.jsonwebtoken:jjwt-jackson | 0.11.5 (runtimeOnly) |
| io.livekit:livekit-server | 0.9.0 (LiveKit 토큰/서버 SDK) |
| org.apache.commons:commons-lang3 | 3.12.0 |
| com.mysql:mysql-connector-j | Spring Boot BOM 관리 (버전 미명시) |

노트: Spring 관련 대부분은 BOM(플러그인 버전 3.4.2)에 의해 실제 버전이 결정됩니다. 정확한 해결 버전은 `./gradlew dependencies`로 확인 가능.

---

4) 시그널링 서버

| 항목 | 값 |
|---|---|
| 플랫폼 | Node.js
| 주요 라이브러리 | socket.io ^4.8.1
| 파일 | signaling_server/signalingServer.js
| 특징 | join-room, signal, chat 이벤트 중심, CORS/credentials 설정 포함

---

5) 실행/점검 요약 (핵심 명령)

- 프론트(개발):
  - cd front && npm install
  - npm start
  - 확인: front/.env, package.json(proxy)

- 백엔드(개발):
  - cd back && ./gradlew bootRun
  - 확인: DB 연결, Flyway 마이그레이션(back/src/main/resources/db/migration/)

- 시그널링 서버:
  - cd signaling_server && npm install
  - node signalingServer.js

---

6) 추천 추가 작업(원하면 수행)
- 백엔드의 의존성 해결 버전을 자동으로 추출해 표에 추가(./gradlew dependencies 실행) — 수행 가능
- 운영/개발 환경변수(.env, application.yml 샘플)를 한 페이지로 정리 — 수행 가능

원하시면 1) 백엔드 의존성 정확한 버전 표 추가 또는 2) 환경변수 샘플 정리 중 하나를 바로 진행하겠습니다.
