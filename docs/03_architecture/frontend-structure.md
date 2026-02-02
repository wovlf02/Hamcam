# 프론트엔드 구조

**관련 문서**: [백엔드 구조](./backend-structure.md) | [시스템 설계](./system-design.md) | [기술 스택](./tech-stack.md)

---

## 1. 프로젝트 구조

```
front/
├── package.json                 # 의존성 및 스크립트
├── public/
│   ├── index.html              # SPA 진입점
│   ├── favicon.ico             # 파비콘
│   ├── manifest.json           # PWA 매니페스트
│   └── models/                 # Face API 모델 가중치
└── src/
    ├── App.js                  # 루트 컴포넌트 (라우팅)
    ├── App.css                 # 앱 전역 스타일
    ├── index.js                # 클라이언트 진입점
    ├── index.css               # 전역 CSS
    ├── api/                    # API 통신 모듈
    ├── assets/                 # 정적 자원
    ├── features/               # 기능별 모듈
    ├── global/                 # 전역 컴포넌트/스타일
    ├── hooks/                  # 전역 커스텀 훅
    ├── utils/                  # 유틸리티 함수
    ├── socket.js               # Socket.IO 설정
    ├── setupProxy.js           # 프록시 설정
    └── setupTests.js           # 테스트 설정
```

---

## 2. API 모듈

### 2.1 구조

```
api/
├── api.js                      # Axios 인스턴스
└── apiUrl.js                   # API URL 설정
```

### 2.2 api.js

```javascript
import axios from 'axios';
import { API_BASE_URL_8080 } from './apiUrl';

const api = axios.create({
    baseURL: `${API_BASE_URL_8080}/api`,
    timeout: 10000,
    withCredentials: true,  // 쿠키 자동 포함
    headers: {
        'Content-Type': 'application/json',
    },
});

// 파일 업로드 메서드
api.upload = async (url, files, extraData = {}) => {
    const formData = new FormData();
    // ... 파일 처리
    return api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export default api;
```

### 2.3 apiUrl.js

```javascript
export const API_BASE_URL_3000 = "http://localhost:3000";
export const API_BASE_URL_8080 = "http://localhost:8080";
```

---

## 3. Features 모듈

### 3.1 구조

```
features/
├── auth/                       # 인증
│   ├── pages/
│   │   ├── Login.js
│   │   └── Register.js
│   └── styles/
├── community/                  # 커뮤니티
│   ├── components/
│   │   └── community/
│   │       ├── PostWritePage.js
│   │       ├── PostDetail.js
│   │       ├── StudyListPage.js
│   │       ├── StudyDetail.js
│   │       └── StudyCreatePage.js
│   ├── pages/
│   │   ├── Community.js
│   │   ├── Post.js
│   │   ├── Notice.js
│   │   ├── Chat.js
│   │   └── Friend.js
│   └── styles/
├── dashboard/                  # 대시보드
│   ├── components/
│   ├── pages/
│   │   └── Dashboard.js
│   └── styles/
├── devtools/                   # 개발 도구
│   └── BackendTest.js
├── evaluation/                 # 평가
│   ├── components/
│   ├── data/
│   │   └── mathProblems.js
│   ├── entry/
│   │   └── evaluation.js
│   ├── math_image/             # 수학 문제 이미지
│   ├── pages/
│   │   ├── MathEvaluationStart.js
│   │   ├── MathEvaluationResult.js
│   │   ├── UnitEvaluation.js
│   │   ├── UnitEvaluationPlan.js
│   │   ├── UnitEvaluationPlanList.js
│   │   ├── UnitEvaluationFeedback.js
│   │   └── UnitEvaluationSchedule.js
│   ├── styles/
│   └── index.js
├── plan/                       # 학습 계획
│   └── pages/
│       └── PlanMenu.js
├── profile/                    # 프로필
│   ├── pages/
│   │   └── MyPage.js
│   └── styles/
├── rtc/                        # 실시간 통신
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   │   ├── VideoRoom.js
│   │   ├── RoomList.js
│   │   └── RoomFull.js
│   ├── styles/
│   └── utils/
├── statistics/                 # 통계
│   ├── pages/
│   │   └── Statistics.js
│   └── styles/
└── study/                      # 학습
    ├── components/
    ├── hooks/
    │   └── useQuizRoom.js
    ├── pages/
    │   ├── TeamStudy.js
    │   ├── StudyStart.js
    │   ├── PersonalStudy.js
    │   ├── CamStudyPage.js
    │   ├── QuizRoom.js
    │   ├── FocusRoom.js
    │   └── QuizResult.js
    └── styles/
```

### 3.2 Feature 구조 패턴

각 Feature는 다음 구조를 따릅니다:

```
feature/
├── components/     # 재사용 가능한 컴포넌트
├── hooks/          # 커스텀 훅
├── pages/          # 라우팅 대상 페이지
├── styles/         # CSS 스타일
├── utils/          # 유틸리티 함수
└── index.js        # 모듈 내보내기
```

---

## 4. Global 모듈

### 4.1 구조

```
global/
├── component/
│   └── NavBar.js               # 네비게이션 바
└── styles/
    └── style.css               # 전역 스타일
```

### 4.2 NavBar

- 사이드바 네비게이션
- 로고 및 메뉴 항목
- 현재 페이지 하이라이트

---

## 5. Hooks 모듈

### 5.1 구조

```
hooks/
├── useAuth.js                  # 인증 훅
└── useQuizRoom.js              # 퀴즈방 훅
```

### 5.2 useAuth

```javascript
// 인증 상태 관리
// 로그인/로그아웃 처리
// 세션 확인
```

### 5.3 useQuizRoom

```javascript
// 퀴즈방 상태 관리
// 발표자 선정/투표
// 점수/랭킹 관리
```

---

## 6. 라우팅 (App.js)

### 6.1 레이아웃 구조

```javascript
// 사이드바 있는 레이아웃
const LayoutWithSidebar = () => (
    <div className="main-layout-container">
        <NavBar />
        <div className="content-area">
            <Outlet />
        </div>
    </div>
);

// 사이드바 없는 레이아웃 (문제풀이 등)
const LayoutWithoutSidebar = () => (
    <div style={{ width: '100vw', minHeight: '100vh' }}>
        <Outlet />
    </div>
);
```

### 6.2 라우트 구성

| 경로 | 컴포넌트 | 레이아웃 |
|------|----------|----------|
| `/login` | Login | 없음 |
| `/register` | Register | 없음 |
| `/unit-evaluation/start` | MathEvaluationStart | 없음 |
| `/math-evaluation/start` | MathEvaluationStart | 없음 |
| `/math-evaluation/result` | MathEvaluationResult | 없음 |
| `/dashboard` | Dashboard | 사이드바 |
| `/teamStudy` | TeamStudy | 사이드바 |
| `/personalStudy` | PersonalStudy | 사이드바 |
| `/camstudy` | CamStudyPage | 사이드바 |
| `/video-room/:roomId` | VideoRoom | 사이드바 |
| `/community` | Community | 사이드바 |
| `/community/post` | Post | 사이드바 |
| `/community/notice` | Notice | 사이드바 |
| `/community/chat` | Chat | 사이드바 |
| `/community/friend` | Friend | 사이드바 |
| `/statistics` | Statistics | 사이드바 |
| `/mypage` | MyPage | 사이드바 |
| `/team-study/quiz/:roomId` | QuizRoom | 사이드바 |
| `/team-study/focus/:roomId` | FocusRoom | 사이드바 |
| `/plan/menu` | PlanMenu | 사이드바 |
| `/evaluation` | Evaluation | 사이드바 |

---

## 7. 주요 페이지

### 7.1 인증 (auth)

#### Login.js
- 로그인 폼
- 세션 기반 인증
- LocalStorage에 사용자 정보 저장

#### Register.js
- 회원가입 폼
- 프로필 이미지 업로드
- 학년, 과목 선택

### 7.2 대시보드 (dashboard)

#### Dashboard.js
- Todo 리스트
- D-Day (시험 일정)
- 학습 통계 차트 (Recharts)
- 캘린더 (react-calendar)
- 목표 설정

### 7.3 학습 (study)

#### CamStudyPage.js
- Face API 얼굴 감지
- 학습 시간 자동 측정
- 타이머 자동 시작/정지

#### TeamStudy.js
- 스터디방 목록
- 방 생성/입장

#### QuizRoom.js
- 퀴즈 풀이방
- 실시간 화상 통신
- 채팅

#### FocusRoom.js
- 집중 경쟁방
- 집중 시간 측정
- 순위 표시

### 7.4 평가 (evaluation)

#### MathEvaluationStart.js
- 수학 문제 풀이 인터페이스
- 실시간 채점
- 타이머

#### MathEvaluationResult.js
- 평가 결과 표시
- 오답 확인
- 등급 산출

### 7.5 커뮤니티 (community)

#### Post.js
- 게시글 목록
- 필터링/정렬

#### PostDetail.js
- 게시글 상세
- 댓글/대댓글
- 좋아요

#### Chat.js
- 채팅방 목록
- 실시간 메시지

#### Friend.js
- 친구 목록
- 친구 요청

---

## 8. 스타일링

### 8.1 styled-components

```javascript
import styled from 'styled-components';

const Button = styled.button`
    background: #007bff;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
`;
```

### 8.2 CSS 파일

```
styles/
├── style.css           # 전역 스타일
├── Dashboard.css       # 대시보드 스타일
├── Auth.css            # 인증 페이지 스타일
└── ...
```

---

## 9. 상태 관리

### 9.1 로컬 상태

- React `useState` 사용
- 컴포넌트 레벨 상태 관리

### 9.2 전역 상태

- LocalStorage: 사용자 정보
- App.js: 게시글, 스터디 목록

### 9.3 서버 상태

- API 호출 결과
- 실시간 WebSocket/Socket.IO 데이터

---

## 10. 실시간 통신

### 10.1 Socket.IO (socket.js)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
    withCredentials: true,
});

export default socket;
```

### 10.2 WebRTC 훅 (rtc/hooks/)

- RTCPeerConnection 관리
- 로컬/원격 스트림 처리
- ICE Candidate 교환

---

## 11. Face API 설정

### 11.1 모델 파일

```
public/models/
├── face_landmark_68_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── ssd_mobilenetv1_model-shard1
├── ssd_mobilenetv1_model-shard2
├── ssd_mobilenetv1_model-weights_manifest.json
├── tiny_face_detector_model-shard1
└── tiny_face_detector_model-weights_manifest.json
```

### 11.2 사용법

```javascript
import * as faceapi from 'face-api.js';

// 모델 로드
await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

// 얼굴 감지
const detections = await faceapi.detectAllFaces(
    videoRef.current,
    new faceapi.TinyFaceDetectorOptions()
);

if (detections.length > 0) {
    // 얼굴 감지됨 - 타이머 시작
} else {
    // 얼굴 미감지 - 타이머 정지
}
```

---

## 12. 빌드 및 스크립트

### 12.1 package.json 스크립트

```json
{
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "build:raw": "react-scripts build --no-minify",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
}
```

### 12.2 실행 명령어

| 명령어 | 설명 |
|--------|------|
| `npm start` | 개발 서버 실행 (포트 3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm test` | 테스트 실행 |
