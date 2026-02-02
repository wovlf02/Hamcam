# 개발 환경 설정

**관련 문서**: [코딩 컨벤션](./coding-conventions.md) | [Git 컨벤션](./git-convention.md)

---

## 1. 시스템 요구사항

### 1.1 개발 환경

| 항목 | 버전 | 비고 |
|------|------|------|
| **Java** | 21.0.8 (LTS) | JDK 필수 |
| **Node.js** | 22.17.0 | LTS 버전 권장 |
| **npm** | 10.x+ | Node.js 포함 |
| **Docker** | 최신 버전 | MySQL, Redis용 |
| **Git** | 최신 버전 | 버전 관리 |

### 1.2 IDE 권장

| IDE | 용도 |
|-----|------|
| IntelliJ IDEA | 백엔드 (Spring Boot) |
| VS Code | 프론트엔드 (React) |
| WebStorm | 프론트엔드 대안 |

---

## 2. 프로젝트 클론

```bash
git clone https://github.com/wovlf02/Hamcam.git
cd Hamcam
```

---

## 3. 백엔드 설정

### 3.1 Java 설치

```bash
# macOS (Homebrew)
brew install openjdk@21

# Windows (Chocolatey)
choco install openjdk21

# 버전 확인
java --version
```

### 3.2 환경 변수 설정

`back/src/main/resources/application.properties` 파일 생성:

```properties
# 데이터베이스
spring.datasource.url=jdbc:mysql://localhost:3306/hamcam?useSSL=false&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# 세션
spring.session.store-type=redis
spring.session.redis.namespace=hamcam:session

# 파일 업로드
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# 이메일 (Naver SMTP)
spring.mail.host=smtp.naver.com
spring.mail.port=465
spring.mail.username=your-email@naver.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.ssl.enable=true

# Gemini AI
gemini.api.key=your-gemini-api-key

# 서버 포트
server.port=8080
```

### 3.3 빌드 및 실행

```bash
cd back

# 빌드
./gradlew clean build

# 실행
./gradlew bootRun
```

### 3.4 빌드 확인

```bash
# 테스트 실행
./gradlew test

# 빌드 결과 확인
ls build/libs/
```

---

## 4. 프론트엔드 설정

### 4.1 Node.js 설치

```bash
# macOS (Homebrew)
brew install node@22

# Windows (Chocolatey)
choco install nodejs-lts

# 버전 확인
node --version
npm --version
```

### 4.2 의존성 설치

```bash
cd front
npm install
```

### 4.3 개발 서버 실행

```bash
npm start
```

브라우저에서 `http://localhost:3000` 접속

### 4.4 프록시 설정

`src/setupProxy.js`:

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
};
```

---

## 5. 시그널링 서버 설정

### 5.1 의존성 설치

```bash
cd signaling_server
npm install
```

### 5.2 실행

```bash
node signalingServer.js
```

서버가 `http://localhost:4000`에서 실행됨

---

## 6. Docker 컨테이너

### 6.1 docker-compose.yml

프로젝트 루트의 `docker-compose.yml`:

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    container_name: hamcam-mysql
    environment:
      MYSQL_ROOT_PASSWORD: yourpassword
      MYSQL_DATABASE: hamcam
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: hamcam-redis
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  mysql-data:
```

### 6.2 컨테이너 실행

```bash
# 시작
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 중지
docker-compose down
```

---

## 7. 데이터베이스 설정

### 7.1 MySQL 접속

```bash
# Docker 컨테이너 접속
docker exec -it hamcam-mysql mysql -u root -p

# 데이터베이스 생성 (이미 없으면)
CREATE DATABASE IF NOT EXISTS hamcam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용
USE hamcam;
```

### 7.2 초기 데이터

JPA `spring.jpa.hibernate.ddl-auto=update` 설정으로 자동 스키마 생성

---

## 8. 개발 워크플로우

### 8.1 전체 서비스 시작 순서

```bash
# 1. Docker 컨테이너 (MySQL, Redis)
docker-compose up -d

# 2. 백엔드 (새 터미널)
cd back
./gradlew bootRun

# 3. 시그널링 서버 (새 터미널)
cd signaling_server
node signalingServer.js

# 4. 프론트엔드 (새 터미널)
cd front
npm start
```

### 8.2 포트 요약

| 서비스 | 포트 | URL |
|--------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8080 | http://localhost:8080 |
| Signaling | 4000 | http://localhost:4000 |
| MySQL | 3306 | localhost:3306 |
| Redis | 6379 | localhost:6379 |

---

## 9. 문제 해결

### 9.1 포트 충돌

```bash
# macOS/Linux - 포트 사용 프로세스 확인
lsof -i :3000
lsof -i :8080

# 프로세스 종료
kill -9 <PID>
```

### 9.2 npm 캐시 문제

```bash
# 캐시 정리
npm cache clean --force

# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 9.3 Gradle 캐시 문제

```bash
# 캐시 정리
./gradlew clean

# Gradle 캐시 삭제
rm -rf ~/.gradle/caches/
```

### 9.4 Docker 문제

```bash
# 컨테이너 재시작
docker-compose restart

# 모든 컨테이너/볼륨 삭제 후 재생성
docker-compose down -v
docker-compose up -d
```

### 9.5 CORS 오류

백엔드 `WebConfig.java`에서 허용 Origin 확인:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000", "http://127.0.0.1:3000")
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
}
```

---

## 10. 권장 VS Code 확장

| 확장 | 용도 |
|------|------|
| ES7+ React/Redux/React-Native snippets | React 스니펫 |
| Prettier | 코드 포맷팅 |
| ESLint | 린팅 |
| Auto Rename Tag | HTML/JSX 태그 자동 변경 |
| GitLens | Git 기능 강화 |
| Thunder Client | API 테스트 |

---

## 11. 권장 IntelliJ 플러그인

| 플러그인 | 용도 |
|----------|------|
| Lombok | Lombok 지원 |
| Spring Boot Assistant | Spring Boot 지원 |
| JPA Buddy | JPA 개발 지원 |
| Database Navigator | 데이터베이스 관리 |
