# 기술 스택

다음 내용은 코드베이스 분석(front/package.json, back/build.gradle, signaling_server/*, front/src/* 등)을 기반으로 정리했습니다.

## 프론트엔드
- React 19 (react, react-dom)
- Create React App (react-scripts 5)
- 라우팅: react-router-dom 7
- 상태/유틸: axios, moment
- UI: styled-components 6, react-icons, react-calendar, recharts, react-markdown + remark-gfm
- 미디어/RTC: livekit-client, @livekit/components-react, @livekit/components-styles
- 실시간 통신: socket.io-client, @stomp/stompjs, sockjs-client, stompjs
- 테스트: @testing-library/*, web-vitals
- 개발 설정: front/.env(HOST=0.0.0.0, DANGEROUSLY_DISABLE_HOST_CHECK=true), package.json(proxy: http://localhost:8080)

## 백엔드
- Java 21, Spring Boot 3.4.2, Gradle 빌드
- Spring Boot Starters: web, data-jpa, validation, websocket, actuator, thymeleaf
- 확장: batch, jdbc, data-rest, data-ldap, integration(http/jdbc/jpa/mail/redis/stomp/websocket)
- 세션/캐시: spring-session-data-redis, spring-data-redis
- JSON: jackson-datatype-jsr310
- 인증/토큰: jjwt (api/impl/jackson)
- 미디어/RTC: io.livekit:livekit-server (LiveKit 토큰 발급 등 서버 사이드 연동)
- 개발 편의: lombok(compileOnly/annotationProcessor), spring-boot-devtools
- DB 드라이버: mysql-connector-j, ojdbc11 (MySQL/Oracle 중 환경별 선택 사용 추정)
- 마이그레이션: Flyway 규칙의 SQL 파일 존재(back/src/main/resources/db/migration/V13~V19)
- 테스트: spring-boot-starter-test, spring-batch-test, spring-integration-test

## 시그널링 서버(WebRTC/채팅 중계)
- Node.js
- socket.io 4 (서버)
- 포트: 4000 (signaling_server/signalingServer.js)
- CORS: ngrok 도메인 허용(정규식), credentials 허용
- 이벤트: join-room, signal, chat, user-count, user-connected/disconnected 등

## 기타/도구
- 리포지토리 루트: front, back(Spring Boot), signaling_server(socket.io), uploads(업로드 저장소로 추정), lib(그루비 JAR 모음)
- 구성 파일: application.yml/properties는 리포지토리 내 미발견(외부 제공/환경 변수 기반 구성 추정)

