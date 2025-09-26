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

## 2. 상세 파일 구조 및 역할

전체 파일 및 디렉터리의 상세 구조와 각 역할은 다음과 같습니다.

```
front/
├─ .gitignore                  # Git이 추적하지 않을 파일 및 폴더 목록을 지정합니다.
├─ package.json                # 프로젝트의 이름, 버전, 의존성 라이브러리, 실행 스크립트 등 메타데이터를 관리합니다.
├─ package-lock.json           # 의존성 트리의 정확한 버전을 관리하여 일관된 설치를 보장합니다.
├─ README.md                   # 프로젝트에 대한 기본 정보를 제공하는 문서입니다. (Create React App 기본 제공)
├─ public/                     # 웹 서버의 루트 역할을 하는 정적 파일 폴더입니다.
│  ├─ favicon.ico              # 브라우저 탭에 표시되는 파비콘 이미지입니다.
│  ├─ image1.jpg               # 로그인 페이지에 사용되는 샘플 이미지 1입니다.
│  ├─ image2.png               # 로그인 페이지에 사용되는 샘플 이미지 2입니다.
│  ├─ index.html               # 모든 React 컴포넌트가 렌더링될 기본 HTML 셸(shell) 파일입니다.
│  ├─ logo192.png              # PWA용 192x192 로고 이미지입니다.
│  ├─ logo512.png              # PWA용 512x512 로고 이미지입니다.
│  ├─ manifest.json            # PWA(Progressive Web App) 설치 시 사용될 앱 아이콘, 이름, 테마 색상 등을 정의합니다.
│  ├─ robots.txt               # 검색 엔진 크롤러의 사이트 접근 정책을 정의합니다.
│  └─ models/                  # 얼굴 인식 기능(face-api.js)에 사용되는 AI 모델 가중치 파일들을 저장합니다.
└─ src/                        # 실제 애플리케이션의 소스 코드가 위치하는 메인 디렉터리입니다.
   ├─ App.css                   # App.js 컴포넌트에 적용되는 기본 스타일입니다.
   ├─ App.js                    # 애플리케이션의 최상위 컴포넌트로, React Router를 사용해 전체 페이지 라우팅 구조를 정의하고 관리합니다.
   ├─ App.test.js               # App 컴포넌트에 대한 기본 테스트 파일입니다.
   ├─ index.css                 # 애플리케이션 전역에 영향을 미치는 최상위 스타일시트입니다.
   ├─ index.js                  # React 애플리케이션의 최초 진입점으로, `App` 컴포넌트를 `root` DOM에 렌더링합니다.
   ├─ logo.svg                  # React 로고 SVG 이미지입니다.
   ├─ reportWebVitals.js        # 웹 성능 측정을 위한 유틸리티 파일입니다.
   ├─ setupTests.js             # Jest 테스트 환경 설정 파일입니다.
   ├─ api/                      # 서버와의 통신을 담당하는 모듈이 위치합니다.
   │  ├─ api.js                 # `axios` 라이브러리를 사용해 API 요청을 보내는 인스턴스를 생성합니다. 세션 유지를 위해 `withCredentials` 옵션이 활성화되어 있습니다.
   │  └─ apiUrl.js              # 개발 및 프로덕션 환경에 따른 API 서버의 기본 URL 주소를 상수로 정의합니다.
   ├─ assets/                   # 애플리케이션 전반에서 사용되는 아이콘, 이미지 등의 정적 리소스를 관리합니다.
   │  └─ icons/
   ├─ features/                 # ✨ 애플리케이션의 핵심 기능들이 도메인별로 그룹화되어 있습니다.
   │  ├─ auth/                  # 👤 인증 (로그인, 회원가입)
   │  │  ├─ pages/
   │  │  │  ├─ Login.js        # 아이디와 비밀번호로 로그인을 처리하고, 성공 시 WebSocket 연결 및 대시보드로 이동시킵니다.
   │  │  │  └─ Register.js     # 사용자로부터 회원 정보를 입력받아 API를 통해 회원가입을 처리합니다.
   │  │  └─ styles/
   │  │     ├─ Login.css       # 로그인 페이지 스타일시트
   │  │     └─ Register.css    # 회원가입 페이지 스타일시트
   │  ├─ community/             # 💬 커뮤니티 기능 관련 파일들을 관리합니다.
   │  │  ├─ pages/
   │  │  │  ├─ Community.js    # 공지, 인기글, 온라인 친구 목록 등을 보여주는 커뮤니티의 메인 허브 페이지입니다.
   │  │  │  ├─ Chat.js         # `ChatRoomList`와 `ChatRoom` 컴포넌트를 조합해 채팅 UI를 구성합니다.
   │  │  │  ├─ Friend.js       # 친구 목록, 친구 요청, 차단 목록을 관리하는 페이지입니다.
   │  │  │  ├─ Notice.js       # 전체 공지사항을 목록 형태로 보여주는 페이지입니다.
   │  │  │  └─ Post.js         # 게시판의 전체 게시글 목록을 보여주고, 검색 및 페이지네이션 기능을 제공합니다.
   │  │  ├─ components/        # 커뮤니티 하위 기능별 컴포넌트 그룹입니다.
   │  │  │  ├─ chat/           #   - 채팅 기능에 특화된 컴포넌트들입니다.
   │  │  │  │  ├─ ChatBox.js             # 메시지 입력 및 전송 UI를 담당합니다.
   │  │  │  │  ├─ ChatFriendList.js      # 친구 목록을 API로 조회하여 온라인/오프라인 상태와 함께 표시합니다.
   │  │  │  │  ├─ ChatRoom.js            # STOMP를 통해 특정 채팅방의 메시지를 실시간으로 주고받는 핵심 채팅창 컴포넌트입니다.
   │  │  │  │  ├─ ChatRoomList.js        # 내가 참여 중인 모든 채팅방 목록을 보여주고, 안 읽은 메시지 수를 표시합니다.
   │  │  │  │  ├─ CreateGroupModal.js    # 여러 친구를 선택하여 새로운 그룹 채팅방을 생성하는 모달창입니다.
   │  │  │  │  └─ FileUploader.js        # 채팅방 내에서 파일을 업로드하는 기능을 제공합니다.
   │  │  │  ├─ community/      #   - 게시판 및 스터디 찾기 관련 컴포넌트들입니다.
   │  │  │  │  ├─ CommentSection.js      # 특정 게시글의 댓글을 조회하고 새로 작성하는 컴포넌트입니다.
   │  │  │  │  ├─ PostDetail.js          # 단일 게시글의 상세 내용, 댓글, 좋아요를 보여주는 페이지입니다.
   │  │  │  │  ├─ PostList.js            # 게시글 데이터를 받아 테이블 형태로 목록을 렌더링합니다.
   │  │  │  │  ├─ PostWritePage.js       # 새로운 게시글을 작성하고 서버에 등록하는 페이지입니다.
   │  │  │  │  ├─ StudyCreatePage.js     # 커뮤니티 내 스터디 그룹을 생성하는 페이지입니다.
   │  │  │  │  ├─ StudyDetail.js         # 스터디 그룹의 상세 정보 및 참여 신청을 관리합니다.
   │  │  │  │  └─ StudyListPage.js       # 전체 스터디 그룹 목록을 보여줍니다.
   │  │  │  └─ friend/
   │  │  │     └─ FriendCard.js          # 친구 검색 결과, 요청 등 다양한 상태의 유저 정보를 카드로 표시합니다.
   │  │  └─ styles/            #   - 커뮤니티 각 페이지 및 컴포넌트의 스타일시트입니다.
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
   │  ├─ dashboard/             # 📊 대시보드 기능 관련 파일들을 관리합니다.
   │  │  ├─ pages/
   │  │  │  └─ Dashboard.js    # 캘린더, D-Day, 할일 목록 등 여러 위젯을 조합하여 대시보드 메인 화면을 구성합니다.
   │  │  ├─ components/
   │  │  │  ├─ DashboardCalendar.js   # 할일, 시험 일정 등을 포함한 월간 캘린더를 표시합니다.
   │  │  │  ├─ DashboardDday.js       # 등록된 시험 일정까지의 D-Day를 계산하여 보여줍니다.
   │  │  │  ├─ DashboardGrowth.js     # 주간 학습 성장률을 API로 받아와 시각적으로 표시합니다.
   │  │  │  ├─ DashboardNotice.js     # 주요 공지사항을 목록 형태로 보여줍니다.
   │  │  │  ├─ DashboardTimeDetail.js # 주간/오늘 목표 학습 시간을 상세 설정하는 UI를 제공합니다.
   │  │  │  └─ DashboardTodo.js       # 날짜별 할일(Todo) 목록을 관리하고, 완료 상태를 토글할 수 있습니다.
   │  │  └─ styles/
   │  │     ├─ Dashboard.css
   │  │     ├─ DashboardCalendar.css
   │  │     ├─ DashboardDday.css
   │  │     └─ DashboardTodo.css
   │  ├─ devtools/
   │  │  └─ BackendTest.js      #   - 개발 단계에서 백엔드 API와의 연동을 간단히 테스트하기 위한 페이지입니다.
   │  ├─ evaluation/            # 📝 단원 평가 기능 관련 파일들을 관리합니다.
   │  │  ├─ pages/
   │  │  │  ├─ UnitEvaluation.js          # 단원 평가를 시작하기 전 과목, 단원, 난이도를 선택하는 페이지입니다.
   │  │  │  ├─ UnitEvaluationFeedback.js  # 평가 완료 후 AI가 생성한 학습 피드백을 보여주는 페이지입니다.
   │  │  │  ├─ UnitEvaluationPlan.js      # AI를 통해 주차별 학습 계획을 생성하는 페이지입니다.
   │  │  │  ├─ UnitEvaluationPlanList.js  # 생성된 학습 계획 목록을 조회하고 관리합니다.
   │  │  │  ├─ UnitEvaluationSchedule.js  # 캘린더를 통해 시험 및 학습 일정을 관리하는 페이지입니다.
   │  │  │  └─ UnitEvaluationStart.js     # 실제 단원 평가가 진행되는 페이지로, 타이머와 문제 풀이 UI를 포함합니다.
   │  │  ├─ data/
   │  │  │  └─ units.js        #   - 학년, 과목, 단원명 등 평가에 사용되는 정적 데이터를 정의합니다.
   │  │  ├─ entry/
   │  │  │  └─ evaluation.js   #   - 단원 평가 관련 하위 메뉴(일정, 시험보기, 학습계획 등)로 연결되는 진입점 페이지입니다.
   │  │  └─ styles/
   │  │     ├─ Evaluation.css
   │  │     ├─ UnitEvaluationFeedback.css
   │  │     ├─ UnitEvaluationPlan.css
   │  │     ├─ UnitEvaluationPlanList.css
   │  │     ├─ UnitEvaluationSchedule.css
   │  │     └─ UnitEvaluationStart.css
   │  ├─ plan/
   │  │  └─ pages/
   │  │     └─ PlanMenu.js      #   - 'AI 학습 계획 생성'과 '내 학습 계획 보기' 두 가지 메뉴를 제공하는 페이지입니다.
   │  ├─ profile/
   │  │  ├─ pages/
   │  │  │  └─ MyPage.js       #   - 현재 로그인된 사용자의 프로필 정보를 보여주고 로그아웃 기능을 제공합니다.
   │  │  └─ styles/
   │  │     └─ MyPage.css
   │  ├─ rtc/                   # 📹 실시간 통신(WebRTC) 관련 기능들을 관리합니다.
   │  │  ├─ pages/
   │  │  │  ├─ RoomCreatePage.js #   - 새로운 화상 스터디방을 생성하는 페이지입니다.
   │  │  │  ├─ RoomFull.js       #   - 정원이 가득 찬 방에 입장을 시도했을 때 보여주는 안내 페이지입니다.
   │  │  │  ├─ RoomList.js       #   - 현재 생성된 모든 스터디방 목록을 보여줍니다.
   │  │  │  └─ VideoRoom.js      #   - WebRTC를 이용해 다른 사용자들과 화상으로 통신하는 핵심 페이지입니다.
   │  │  ├─ hooks/
   │  │  │  ├─ useRoomLifecycle.js #   - 스터디방 입장/퇴장 시 API 호출 및 소켓 연결/해제 등 공통 로직을 처리하는 훅입니다.
   │  │  │  └─ useWebRTC.js        #   - LiveKit SDK를 사용하여 WebRTC 연결, 스트림 관리, 미디어 장치 제어 로직을 추상화한 훅입니다.
   │  │  ├─ utils/
   │  │  │  └─ livekit.js      #   - LiveKit 서버 연결 및 트랙 발행(publish)에 필요한 헬퍼 함수들을 제공합니다.
   │  │  └─ styles/
   │  │     └─ VideoRoom.css
   │  ├─ statistics/            # 📈 학습 통계 기능 관련 파일들을 관리합니다.
   │  │  ├─ pages/
   │  │  │  └─ Statistics.js   #   - 월별 학습 시간, 과목별 성취도, 학습 패턴 등을 시각적인 차트로 보여주는 페이지입니다.
   │  │  └─ styles/
   │  │     └─ Statistics.css
   │  └─ study/                 # ✏️ 개인 및 팀 학습 기능 관련 파일들을 관리합니다.
   │     ├─ pages/
   │     │  ├─ CamStudyPage.js      # 개인 학습 시 얼굴 인식을 통해 학습 집중도를 측정하고 타이머를 제어하는 페이지입니다.
   │     │  ├─ FocusRoom.js         # 팀원들과 함께 집중 시간을 경쟁하는 '공부방' 페이지입니다.
   │     │  ├─ PersonalStudy.js     # 개인 캠스터디를 시작하기 전 학습할 단원과 시간을 설정하는 페이지입니다.
   │     │  ├─ QuizResult.js        # 단원 평가 완료 후 채점 결과를 상세히 보여주는 페이지입니다.
   │     │  ├─ QuizRoom.js          # 팀원들과 함께 실시간으로 문제를 풀고 경쟁하는 '문제풀이방' 페이지입니다.
   │     │  ├─ QuizSidebar.js       # 퀴즈 진행 중 전체 문제 목록과 현재 위치를 보여주는 사이드바입니다.
   │     │  ├─ StudyStart.js        # '개인 학습'과 '팀 학습' 모드를 선택하는 페이지입니다.
   │     │  └─ TeamStudy.js         # 전체 팀 학습방 목록을 조회하고, 새로운 방을 생성하거나 참여하는 허브 페이지입니다.
   │     ├─ components/
   │     │  └─ focus/             #   - '공부방' 기능에 특화된 컴포넌트들입니다.
   │     │     ├─ FocusChat.js
   │     │     ├─ FocusRanking.js
   │     │     └─ FocusVideoGrid.js
   │     ├─ hooks/
   │     │  ├─ useFocusTimer.js     #   - 공부방의 집중 시간을 측정하고 서버와 동기화하는 훅입니다.
   │     │  └─ useTeamRoomSocket.js #   - 팀 스터디방의 실시간 채팅 및 이벤트 통신을 위한 STOMP 소켓 로직을 관리하는 훅입니다.
   │     └─ styles/              #   - 학습 관련 페이지들의 스타일시트입니다.
   │        ├─ CamStudyPage.css
   │        ├─ FocusChat.css
   │        ├─ FocusRanking.css
   │        ├─ FocusRoom.css
   │        ├─ FocusVideoGrid.css
   │        ├─ QuizRoom.css
   │        ├─ StudyStart.css
   │        └─ TeamStudy.css
   ├─ global/                   # 🌐 여러 페이지에서 공통으로 사용되는 전역 모듈입니다.
   │  ├─ component/
   │  │  └─ NavBar.js           #   - 모든 페이지 좌측에 고정되어 메뉴 네비게이션을 제공하는 컴포넌트입니다.
   │  └─ styles/
   │     ├─ Navbar.css
   │     └─ style.css           #   - 애플리케이션 전반에 적용되는 최상위 글로벌 스타일입니다.
   └─ hooks/                    # 🎣 여러 기능에 걸쳐 사용될 수 있는 전역 커스텀 훅입니다.
      └─ useQuizRoom.js         #   - 문제풀이방의 발표자 선정, 투표 등 복잡한 상태 흐름을 관리하는 훅입니다.
```