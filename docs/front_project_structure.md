# Front-end 프로젝트 구조

이 문서는 현재 프론트엔드 애플리케이션의 리팩토링된 **기능 기반(Feature-based)** 구조를 설명합니다.

## 1. 핵심 디렉터리 구조

주요 디렉터리 구조는 다음과 같으며, 각 기능(feature)이 독립적으로 구성됩니다.

```
front/
├─ public/                  # 정적 파일 폴더
└─ src/                     # 소스 코드 루트
   ├─ api/                   # API 통신 관련 모듈
   ├─ assets/                # 아이콘, 이미지 등 정적 리소스
   ├─ features/              # ✨ 기능별 도메인 루트
   │  ├─ auth/               # 👤 인증 (로그인, 회원가입)
   │  ├─ community/          # 💬 커뮤니티
   │  ├─ dashboard/          # 📊 대시보드
   │  ├─ devtools/           # 🔧 개발자 도구
   │  ├─ evaluation/         # 📝 단원 평가
   │  ├─ plan/               # 📅 학습 계획
   │  ├─ profile/            # 🧑‍💻 마이페이지
   │  ├─ rtc/                # 📹 실시간 통신 (WebRTC)
   │  ├─ statistics/         # 📈 통계
   │  └─ study/              # ✏️ 학습 (개인/팀)
   ├─ global/                # 🌐 전역 공통 모듈
   └─ hooks/                 # 🎣 전역 커스텀 훅
```

## 2. 상세 파일 구조

전체 파일 및 디렉터리의 상세 구조와 각 역할은 다음과 같습니다.

```
front/
├─ .gitignore                  # Git 추적 제외 규칙
├─ package.json                # 프로젝트 메타데이터, 의존성, 스크립트
├─ README.md                   # Create React App 기본 안내 문서
├─ public/                     # 정적 파일 폴더 (빌드 시 그대로 복사됨)
│  ├─ index.html               # React 앱의 기본 HTML 템플릿
│  ├─ manifest.json            # PWA(Progressive Web App) 설정
│  ├─ robots.txt               # 검색 엔진 크롤러 제어
│  └─ models/                  # face-api.js AI 모델 파일
└─ src/                        # 소스 코드 루트
   ├─ App.js                    # 최상위 컴포넌트, 전체 라우팅 및 레이아웃 정의
   ├─ index.js                  # React 앱의 진입점
   ├─ api/                      # API 통신 관련 모듈
   │  ├─ api.js                 # Axios 인스턴스 생성 (인증 정보 자동 포함)
   │  └─ apiUrl.js              # API 기본 URL 주소 상수
   ├─ assets/                   # 아이콘, 이미지 등 정적 리소스
   ├─ features/                 # ✨ 기능별 도메인 루트
   │  ├─ auth/                  # 👤 인증 (로그인, 회원가입)
   │  │  ├─ pages/
   │  │  │  ├─ Login.js        # 로그인 페이지
   │  │  │  └─ Register.js     # 회원가입 페이지
   │  │  └─ styles/
   │  │     ├─ Login.css
   │  │     └─ Register.css
   │  ├─ community/             # 💬 커뮤니티
   │  │  ├─ pages/
   │  │  │  ├─ Community.js    # 커뮤니티 허브 페이지
   │  │  │  ├─ Chat.js         # 채팅 기능 메인 페이지
   │  │  │  ├─ Friend.js       # 친구 관리 페이지
   │  │  │  ├─ Notice.js       # 공지사항 페이지
   │  │  │  └─ Post.js         # 게시판 페이지
   │  │  ├─ components/
   │  │  │  ├─ chat/           #   - 채팅 관련 컴포넌트
   │  │  │  │  ├─ ChatBox.js
   │  │  │  │  ├─ ChatFriendList.js
   │  │  │  │  ├─ ChatRoom.js
   │  │  │  │  ├─ ChatRoomList.js
   │  │  │  │  ├─ CreateGroupModal.js
   │  │  │  │  └─ FileUploader.js
   │  │  │  ├─ community/      #   - 게시판/스터디 관련 컴포넌트
   │  │  │  │  ├─ CommentSection.js
   │  │  │  │  ├─ PostDetail.js
   │  │  │  │  ├─ PostList.js
   │  │  │  │  ├─ PostWritePage.js
   │  │  │  │  ├─ StudyCreatePage.js
   │  │  │  │  ├─ StudyDetail.js
   │  │  │  │  └─ StudyListPage.js
   │  │  │  └─ friend/
   │  │  │     └─ FriendCard.js
   │  │  └─ styles/            #   - 커뮤니티 관련 CSS
   │  │     ├─ Chat.css
   │  │     ├─ ChatFriendList.css
   │  │     ├─ ChatRoom.css
   │  │     ├─ ChatRoomList.css
   │  │     ├─ Community.css
   │  │     ├─ CreateGroupModal.css
   │  │     ├─ Friend.css
   │  │     ├─ FriendCard.css
   │  │     ├─ Notice.css
   │  │     ├─ Post.css
   │  │     ├─ PostDetail.css
   │  │     ├─ PostTable.css
   │  │     └─ PostWritePage.css
   │  ├─ dashboard/             # 📊 대시보드
   │  │  ├─ pages/
   │  │  │  └─ Dashboard.js
   │  │  ├─ components/
   │  │  │  ├─ DashboardCalendar.js
   │  │  │  ├─ DashboardDday.js
   │  │  │  ├─ DashboardGrowth.js
   │  │  │  ├─ DashboardNotice.js
   │  │  │  ├─ DashboardTimeDetail.js
   │  │  │  └─ DashboardTodo.js
   │  │  └─ styles/
   │  │     ├─ Dashboard.css
   │  │     ├─ DashboardCalendar.css
   │  │     ├─ DashboardDday.css
   │  │     └─ DashboardTodo.css
   │  ├─ devtools/
   │  │  └─ BackendTest.js      #   - 백엔드 연동 테스트용 페이지
   │  ├─ evaluation/            # 📝 단원 평가
   │  │  ├─ pages/
   │  │  │  ├─ UnitEvaluation.js
   │  │  │  ├─ UnitEvaluationFeedback.js
   │  │  │  ├─ UnitEvaluationPlan.js
   │  │  │  ├─ UnitEvaluationPlanList.js
   │  │  │  ├─ UnitEvaluationSchedule.js
   │  │  │  └─ UnitEvaluationStart.js
   │  │  ├─ data/
   │  │  │  └─ units.js        #   - 평가 관련 정적 데이터 (과목, 단원 등)
   │  │  ├─ entry/
   │  │  │  └─ evaluation.js   #   - 평가 메인 진입 페이지
   │  │  └─ styles/
   │  │     ├─ Evaluation.css
   │  │     ├─ UnitEvaluationFeedback.css
   │  │     ├─ UnitEvaluationPlan.css
   │  │     ├─ UnitEvaluationPlanList.css
   │  │     ├─ UnitEvaluationSchedule.css
   │  │     └─ UnitEvaluationStart.css
   │  ├─ plan/
   │  │  └─ pages/
   │  │     └─ PlanMenu.js      #   - 학습 계획 메뉴 페이지
   │  ├─ profile/
   │  │  ├─ pages/
   │  │  │  └─ MyPage.js
   │  │  └─ styles/
   │  │     └─ MyPage.css
   │  ├─ rtc/                   # 📹 실시간 통신 (WebRTC/LiveKit)
   │  │  ├─ pages/
   │  │  │  ├─ RoomCreatePage.js
   │  │  │  ├─ RoomFull.js
   │  │  │  ├─ RoomList.js
   │  │  │  └─ VideoRoom.js
   │  │  ├─ hooks/
   │  │  │  ├─ useRoomLifecycle.js
   │  │  │  └─ useWebRTC.js
   │  │  ├─ utils/
   │  │  │  └─ livekit.js
   │  │  └─ styles/
   │  │     └─ VideoRoom.css
   │  ├─ statistics/            # 📈 통계
   │  │  ├─ pages/
   │  │  │  └─ Statistics.js
   │  │  └─ styles/
   │  │     └─ Statistics.css
   │  └─ study/                 # ✏️ 학습 (개인/팀)
   │     ├─ pages/
   │     │  ├─ CamStudyPage.js
   │     │  ├─ FocusRoom.js
   │     │  ├─ PersonalStudy.js
   │     │  ├─ QuizResult.js
   │     │  ├─ QuizRoom.js
   │     │  ├─ QuizSidebar.js
   │     │  ├─ StudyStart.js
   │     │  └─ TeamStudy.js
   │     ├─ components/
   │     │  └─ focus/
   │     │     ├─ FocusChat.js
   │     │     ├─ FocusRanking.js
   │     │     └─ FocusVideoGrid.js
   │     ├─ hooks/
   │     │  ├─ useFocusTimer.js
   │     │  └─ useTeamRoomSocket.js
   │     └─ styles/
   │        ├─ CamStudyPage.css
   │        ├─ FocusChat.css
   │        ├─ FocusRanking.css
   │        ├─ FocusRoom.css
   │        ├─ FocusVideoGrid.css
   │        ├─ QuizRoom.css
   │        ├─ StudyStart.css
   │        └─ TeamStudy.css
   ├─ global/                   # 🌐 전역 공통 모듈
   │  ├─ component/
   │  │  └─ NavBar.js           #   - 모든 페이지에 공통으로 사용되는 네비게이션 바
   │  └─ styles/
   │     ├─ Navbar.css
   │     └─ style.css           #   - 전역 공통 스타일
   └─ hooks/                    # 🎣 전역 커스텀 훅
      └─ useQuizRoom.js         #   - 퀴즈방 관련 로직 훅
```