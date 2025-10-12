# Hamcam Project Analysis (GEMINI.md)

## Project Overview

Hamcam is a comprehensive learning management and collaboration platform designed to enhance self-directed learning and bridge educational gaps. It features a microservices-style architecture with a **React** single-page application (SPA) front-end, a **Java (Spring Boot)** back-end, and a separate **Node.js** signaling server for real-time communication.

The platform integrates several advanced technologies:
- **Real-time Multimedia**: **LiveKit (WebRTC)** for video/audio streaming in team study rooms.
- **AI-Powered Features**: **Google Gemini** for generating AI-driven study plans and providing feedback, and **face-api.js** for automatically tracking study time by detecting the user's presence.
- **Real-time Communication**: A combination of **WebSocket (STOMP)** for structured messaging and a **Socket.IO** signaling server for WebRTC session negotiation.
- **Database & Caching**: **MySQL** for data persistence and **Redis** for session management and caching.
- **Containerization**: **Docker** is used to manage the LiveKit server instance.

## Building and Running the Project

The project is divided into three main components: front-end, back-end, and a signaling server.

### 1. Back-End (Spring Boot)

The back-end is a Gradle-based Spring Boot application.

- **To Build:**
  ```bash
  cd back
  ./gradlew build
  ```
- **To Run:**
  ```bash
  cd back
  ./gradlew bootRun
  ```
- **Dependencies:** Managed in `back/build.gradle`. Key dependencies include Spring Boot starters for Web, Data JPA, WebSocket, and Redis, as well as `jjwt` for JWT handling and the MySQL connector.
- **Configuration:** Database connections, JWT secrets, and other environment-specific settings are likely managed in `back/src/main/resources/application.yml` or via environment variables.

### 2. Front-End (React)

The front-end is a standard Create React App project.

- **To Install Dependencies:**
  ```bash
  cd front
  npm install
  ```
- **To Run in Development Mode:**
  ```bash
  cd front
  npm start
  ```
  The development server proxies API requests to `http://localhost:8080`, as configured in `front/package.json`.
- **Dependencies:** Managed in `front/package.json`. Key libraries include `react`, `axios`, `livekit-client`, `socket.io-client`, and `face-api.js`.

### 3. Signaling Server (Node.js)

A lightweight Node.js server using Socket.IO handles WebRTC signaling.

- **To Install Dependencies:**
  ```bash
  cd signaling_server
  npm install
  ```
- **To Run:**
  ```bash
  cd signaling_server
  node signalingServer.js
  ```
  This server typically runs on port 4000.

### 4. Docker

Docker is used to run the LiveKit server.

- **To Start the LiveKit Server:**
  ```bash
  docker-compose up -d
  ```
  This command uses the configuration from `docker-compose.yml` and `livekit.yml`.

## Development Conventions

- **API Design**: The project follows a RESTful API design for most operations, documented in `docs/API_ENDPOINTS.md`.
- **Real-time Architecture**:
    - **STOMP over WebSocket** is used for structured, message-broker-like communication within features like team study rooms (`/pub/quiz/...`, `/sub/quiz/...`).
    - **Socket.IO** is used primarily as a signaling layer for WebRTC to exchange connection metadata between peers.
- **Modularity**: The front-end code is organized by features (e.g., `features/auth`, `features/study`), promoting separation of concerns. The back-end follows a standard Spring Boot structure (`controller`, `service`, `repository`, `entity`).
- **Database Migrations**: The back-end appears to use a migration-based approach for database schema changes, suggested by files in `back/src/main/resources/db/migration/`.
- **Testing**:
    - **Front-end**: Uses `@testing-library/react` for component testing (`npm test`).
    - **Back-end**: Uses JUnit 5 and Spring's testing framework (`./gradlew test`).
