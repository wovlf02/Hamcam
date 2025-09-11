# Front 프로젝트 구조 (트리 + 역할 정렬)

아래 트리는 front 디렉터리의 실제 파일/폴더를 기반으로 했으며, 역할/기능을 우측 열에 정렬했습니다.

```
front/                                                         프론트엔드 루트
├─ .env                                                       CRA 개발 서버/프록시 환경 설정
├─ .gitignore                                                 Git 추적 제외 규칙
├─ package.json                                               프로젝트 메타/스크립트/의존성
├─ package-lock.json                                          NPM 잠금(의존성 버전 고정)
├─ README.md                                                  CRA 기본 안내
├─ public/                                                    정적 자산(빌드시 그대로 서빙)
│  ├─ index.html                                              SPA 루트 HTML 템플릿
│  ├─ manifest.json                                           PWA 매니페스트
│  ├─ robots.txt                                              크롤러 접근 제어
│  ├─ favicon.ico                                             파비콘
│  ├─ logo192.png                                             PWA 아이콘
│  ├─ logo512.png                                             PWA 아이콘(고해상)
│  ├─ image1.jpg                                              샘플 이미지
│  ├─ image2.png                                              샘플 이미지
│  └─ models/                                                 face-api.js 모델 리소스
│     ├─ face_landmark_68_model-shard1                       랜드마크 모델 샤드
│     ├─ face_landmark_68_model-weights_manifest.json        랜드마크 가중치 매니페스트
│     ├─ face_recognition_model-shard1                       얼굴인식 모델 샤드
│     ├─ face_recognition_model-shard2                       얼굴인식 모델 샤드
│     ├─ face_recognition_model-weights_manifest.json        얼굴인식 가중치 매니페스트
│     ├─ ssd_mobilenetv1_model-shard1                        얼굴감지(SSD) 모델 샤드
│     ├─ ssd_mobilenetv1_model-shard2                        얼굴감지(SSD) 모델 샤드
│     └─ ssd_mobilenetv1_model-weights_manifest.json         얼굴감지 가중치 매니페스트
└─ src/                                                       애플리케이션 소스
   ├─ index.js                                                React 진입점(렌더링 부트스트랩)
   ├─ index.css                                               전역 기본 스타일
   ├─ App.js                                                  앱 루트/라우팅/레이아웃 구성
   ├─ App.css                                                 전역 스타일 일부
   ├─ App.test.js                                             기본 테스트 스텁
   ├─ reportWebVitals.js                                      성능 로깅 헬퍼
   ├─ setupTests.js                                           테스트 런타임 셋업
   ├─ logo.svg                                                로고 벡터
   ├─ api/                                                    API 유틸리티 모듈
   │  ├─ api.js                                               Axios 인스턴스/업로드 유틸(withCredentials)
   │  └─ apiUrl.js                                            API BASE URL 상수 정의
   ├─ components/                                             공용 UI 컴포넌트
   │  ├─ NavBar.js                                            좌측 네비게이션 사이드바
   │  ├─ chat/                                                커뮤니티 채팅 공용 컴포넌트
   │  │  ├─ ChatBox.js                                        채팅 입력/메시지 컴포즈
   │  │  ├─ ChatFriendList.js                                 친구 목록 패널
   │  │  ├─ ChatRoom.js                                       채팅방 뷰
   │  │  ├─ ChatRoomList.js                                   채팅방 리스트
   │  │  └─ FileUploader.js                                   채팅 파일 업로드 위젯
   │  ├─ dashboard/                                           대시보드 위젯 모음
   │  │  ├─ Dashboard.js                                      대시보드 컨테이너
   │  │  ├─ DashboardCalendar.js                              달력 위젯
   │  │  ├─ DashboardCalendar.css                             달력 위젯 스타일
   │  │  ├─ DashboardDday.js                                  D-Day 위젯
   │  │  ├─ DashboardDday.css                                 D-Day 위젯 스타일
   │  │  ├─ DashboardGrowth.js                                성장/추이 위젯
   │  │  ├─ DashboardNotice.js                                공지 목록 위젯
   │  │  ├─ DashboardTimeDetail.js                            시간 상세 위젯
   │  │  ├─ DashboardTodo.js                                  투두 리스트 위젯
   │  │  ├─ DashboardTodo.css                                 투두 위젯 스타일
   │  │  └─ Dashboard.css                                     대시보드 공통 스타일
   │  ├─ data/
   │  │  └─ units.js                                          단원/과목 등 정적 데이터
   │  ├─ friend/
   │  │  └─ FriendCard.js                                     친구 카드 UI
   │  └─ teamstudy/
   │     └─ focus/                                            포커스 룸 전용 컴포넌트
   │        ├─ FocusChat.js                                   포커스 룸 채팅 패널
   │        ├─ FocusRanking.js                                집중 랭킹 표시
   │        └─ FocusVideoGrid.js                              참여자 영상 그리드
   ├─ pages/                                                  라우팅 대상 페이지
   │  ├─ Dashboard.js                                         대시보드 메인
   │  ├─ Login.js                                             로그인
   │  ├─ Register.js                                          회원가입
   │  ├─ MyPage.js                                            내 정보/설정
   │  ├─ Statistics.js                                        학습 통계
   │  ├─ TeamStudy.js                                         팀 스터디 허브
   │  ├─ StudyStart.js                                        학습 시작/모드 선택
   │  ├─ PersonalStudy.js                                     개인 학습
   │  ├─ CamStudyPage.js                                      캠 스터디 기능
   │  ├─ VideoRoom.js                                         WebRTC/LiveKit 영상 회의실
   │  ├─ RoomList.js                                          팀룸 목록
   │  ├─ RoomFull.js                                          방 정원 초과 안내
   │  ├─ RoomCreatePage.js                                    팀룸 생성
   │  ├─ evaluation.js                                        평가 관련 유틸/진입
   │  ├─ QuizRoom.js                                          팀 퀴즈 룸(문제 진행)
   │  ├─ QuizSidebar.js                                       퀴즈 보조 UI
   │  ├─ QuizResult.js                                        퀴즈 결과
   │  ├─ FocusRoom.js                                         팀 포커스 룸(랭킹/타이머)
   │  ├─ PlanMenu.js                                          학습 계획 메뉴
   │  ├─ UnitEvaluation.js                                    단원평가 메인
   │  ├─ UnitEvaluationStart.js                               단원평가 시작
   │  ├─ UnitEvaluationSchedule.js                            단원평가 일정
   │  ├─ UnitEvaluationPlan.js                                단원평가 계획 생성
   │  ├─ UnitEvaluationPlanList.js                            단원평가 계획 목록
   │  ├─ UnitEvaluationFeedback.js                            단원평가 피드백
   │  └─ Community/                                           커뮤니티 섹션
   │     ├─ Community.js                                      커뮤니티 루트/탭 라우터
   │     ├─ Chat.js                                           커뮤니티 채팅 메인 탭
   │     ├─ Friend.js                                         친구 목록/관리 탭
   │     ├─ Notice.js                                         공지사항 탭
   │     ├─ Post.js                                           게시글 목록/작성 진입
   │     ├─ PostToCommunity.js                                실패문제 커뮤니티 등록
   │     └─ components/                                       커뮤니티 상세 컴포넌트
   │        ├─ CommentSection.js                              댓글/대댓글 섹션
   │        ├─ PostList.js                                    게시글 리스트
   │        ├─ PostDetail.js                                  게시글 상세
   │        ├─ PostWritePage.js                               게시글 작성 폼
   │        ├─ StudyListPage.js                               커뮤니티 스터디 목록
   │        ├─ StudyDetail.js                                 커뮤니티 스터디 상세
   │        └─ StudyCreatePage.js                             커뮤니티 스터디 생성
   ├─ css/                                                    페이지/컴포넌트별 개별 스타일
   │  ├─ CamStudyPage.css                                     캠 스터디 스타일
   │  ├─ Chat.css                                             커뮤니티 채팅 스타일
   │  ├─ ChatFriendList.css                                   친구 목록 스타일
   │  ├─ ChatRoom.css                                         채팅방 스타일
   │  ├─ ChatRoomList.css                                     채팅방 리스트 스타일
   │  ├─ Community.css                                        커뮤니티 공통 스타일
   │  ├─ CreateGroupModal.css                                 그룹 생성 모달 스타일
   │  ├─ Dashboard.css                                        대시보드 페이지 스타일
   │  ├─ Evaluation.css                                       평가 관련 스타일
   │  ├─ FocusChat.css                                        포커스 채팅 스타일
   │  ├─ FocusRanking.css                                     포커스 랭킹 스타일
   │  ├─ FocusRoom.css                                        포커스 룸 페이지 스타일
   │  ├─ FocusVideoGrid.css                                   포커스 비디오 그리드 스타일
   │  ├─ Friend.css                                           친구 탭 스타일
   │  ├─ FriendCard.css                                       친구 카드 스타일
   │  ├─ Login.css                                            로그인 스타일
   │  ├─ Modal.css                                            모달 공통 스타일
   │  ├─ MyPage.css                                           마이페이지 스타일
   │  ├─ Navbar.css                                           네비게이션 바 스타일
   │  ├─ Notice.css                                           공지 스타일
   │  ├─ Post.css                                             게시글 리스트 스타일
   │  ├─ PostDetail.css                                       게시글 상세 스타일
   │  ├─ PostTable.css                                       게시글 테이블 스타일
   │  ├─ PostWritePage.css                                    게시글 작성 스타일
   │  ├─ QuizRoom.css                                         퀴즈 룸 스타일
   │  ├─ Register.css                                         회원가입 스타일
   │  ├─ Statistics.css                                       통계 페이지 스타일
   │  ├─ StudyStart.css                                       학습 시작 스타일
   │  ├─ TeamStudy.css                                        팀 스터디 허브 스타일
   │  ├─ UnitEvaluationFeedback.css                            단평 피드백 스타일
   │  ├─ UnitEvaluationPlan.css                                단평 계획 스타일
   │  ├─ UnitEvaluationPlanList.css                            단평 계획 목록 스타일
   │  ├─ UnitEvaluationSchedule.css                            단평 일정 스타일
   │  ├─ UnitEvaluationStart.css                               단평 시작 스타일
   │  ├─ VideoRoom.css                                        비디오 룸 스타일
   │  ├─ VoteModal.css                                        투표 모달 스타일
   │  └─ style.css                                            전역 공통 스타일
   ├─ styles/
   │  └─ DashboardTodo.css                                    대시보드 투두 전용 스타일
   ├─ utils/
   │  └─ livekit.js                                           LiveKit 토큰/연결 헬퍼 함수
   ├─ hooks/                                                  커스텀 훅 모음(실시간/RTC/룸)
   │  ├─ useFocusTimer.js                                     포커스 타이머 상태/인터벌 관리
   │  ├─ useQuizRoom.js                                       퀴즈룸 상태/소켓 상호작용
   │  ├─ useRoomLifecycle.js                                  룸 생성/입장/종료 라이프사이클 관리
   │  ├─ useTeamRoomSocket.js                                 팀 스터디 STOMP/소켓 연결 관리
   │  └─ useWebRTC.js                                         WebRTC/시그널링 추상화 훅
   └─ icons/                                                  아이콘/이미지 리소스
      ├─ add.png                                              아이콘
      ├─ back.png                                             아이콘
      ├─ base_profile.png                                     기본 프로필 이미지
      ├─ bell_off.png                                         알림 끔 아이콘
      ├─ board_search.png                                     게시판 검색 아이콘
      ├─ check.png                                            체크 아이콘
      ├─ community.png                                        커뮤니티 아이콘
      ├─ github.png                                           GitHub 아이콘
      ├─ google.png                                           Google 아이콘
      ├─ group.png                                            그룹 아이콘
      ├─ home.png                                             홈 아이콘
      ├─ intro.jpg                                            인트로 이미지
      ├─ kakao.png                                            Kakao 아이콘
      ├─ map.png                                              지도 아이콘
      ├─ menu.png                                             메뉴 아이콘
      ├─ more.png                                             더보기 아이콘
      ├─ mypage.png                                           마이페이지 아이콘
      ├─ naver.png                                            Naver 아이콘
      ├─ password-hide.png                                    비밀번호 숨김 아이콘
      ├─ password-show.png                                    비밀번호 표시 아이콘
      ├─ pencil.png                                           연필 아이콘
      ├─ people.png                                           사람 아이콘
      ├─ personal.png                                         개인 학습 아이콘
      ├─ profile.jpg                                          프로필 샘플 이미지
      ├─ sample1.png                                          샘플 이미지
      ├─ sample2.png                                          샘플 이미지
      ├─ sample3.png                                          샘플 이미지
      ├─ sample4.png                                          샘플 이미지
      ├─ sample5.png                                          샘플 이미지
      ├─ school.png                                           학교 아이콘
      ├─ search.png                                           검색 아이콘
      ├─ send.png                                             전송 아이콘
      ├─ unitTest.png                                         단위테스트 이미지
      ├─ user1.png                                            사용자 아바타
      ├─ user2.png                                            사용자 아바타
      ├─ user3.png                                            사용자 아바타
      ├─ user4.png                                            사용자 아바타
      └─ x.png                                                닫기/삭제 아이콘
```

