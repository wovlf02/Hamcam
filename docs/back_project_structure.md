# Back 프로젝트 구조 (트리 + 우측 역할 정렬)

아래 트리는 back 디렉터리의 실제 구조를 기반으로 하며, 각 항목의 역할/기능을 우측에 정렬해 표시했습니다.

```
back/                                                           백엔드 루트 (Spring Boot + Gradle)
├─ .gitattributes                                               Git 속성
├─ .gitignore                                                   Git 추적 제외 규칙
├─ .gradle/                                                     Gradle 캐시/작업 디렉터리
├─ bin/                                                         로컬/IDE 빌드 산출물
│  └─ main/                                                     런타임 빌드 결과
│     ├─ application.yml                                         실행 설정(빌드 산출)
│     └─ com/hamcam/back/                                        컴파일된 클래스
├─ build/                                                       Gradle 빌드 산출물
│  ├─ classes/java/main/...                                      컴파일 클래스
│  ├─ reports/problems/problems-report.html                      빌드 리포트
│  └─ resources/main/                                            빌드 리소스 번들
│     └─ db/migration/                                           Flyway 마이그레이션(빌드 산출)
│        ├─ V13__fix_exam_schedule_subject.sql                   마이그레이션: 시험 과목 수정
│        ├─ V14__fix_exam_schedule_date.sql                      마이그레이션: 시험 날짜 수정
│        ├─ V15__recreate_exam_schedule_table.sql                마이그레이션: 테이블 재생성
│        ├─ V16__fix_exam_schedule_table.sql                     마이그레이션: 테이블 수정
│        ├─ V17__fix_exam_schedule_table.sql                     마이그레이션: 테이블 수정
│        ├─ V18__remove_exam_name_column.sql                     마이그레이션: 컬럼 제거
│        └─ V19__recreate_exam_schedule_table.sql                마이그레이션: 테이블 재생성(최신)
├─ build.gradle                                                 빌드 스크립트(의존성/플러그인/태스크)
├─ gradle/                                                      Gradle Wrapper 설정
│  └─ wrapper/
│     ├─ gradle-wrapper.jar                                     Wrapper 바이너리
│     └─ gradle-wrapper.properties                              Wrapper 설정
├─ gradlew                                                      Gradle 실행 스크립트(Unix)
├─ gradlew.bat                                                  Gradle 실행 스크립트(Windows)
├─ settings.gradle                                              Gradle 루트 설정
└─ src/                                                         애플리케이션 소스
   ├─ main/                                                      프로덕션 소스
   │  ├─ java/                                                   자바 소스
   │  │  └─ com/hamcam/back/                                     루트 패키지
   │  │     ├─ BackApplication.java                              앱 진입점(@SpringBootApplication)
   │  │     ├─ config/                                           전역 설정
   │  │     │  ├─ auth/                                          인증·메일 설정
   │  │     │  │  └─ EmailConfig.java                             메일 전송 설정
   │  │     │  ├─ socket/                                        WebSocket/STOMP 설정
   │  │     │  │  ├─ CustomHandshakeHandler.java                 핸드셰이크 커스터마이징
   │  │     │  │  ├─ StompHandshakeInterceptor.java              STOMP 핸드셰이크 인터셉터
   │  │     │  │  ├─ WebSocketEventListener.java                 WS 연결/구독 이벤트 리스너
   │  │     │  │  └─ WebSocketStompConfig.java                   STOMP 엔드포인트/브로커 설정
   │  │     │  └─ web/                                           MVC·직렬화·캐시 설정
   │  │     │     ├─ JacksonConfig.java                          ObjectMapper 설정
   │  │     │     ├─ RedisConfig.java                            Redis 템플릿/캐시 설정
   │  │     │     └─ WebConfig.java                              CORS/인터셉터/메시지컨버터
   │  │     ├─ controller/                                      컨트롤러(REST/WS 엔드포인트)
   │  │     │  ├─ admin/                                        관리자 API
   │  │     │  │  └─ AdminReportController.java                  신고/관리 API
   │  │     │  ├─ auth/                                         인증 관련 API
   │  │     │  │  └─ AuthController.java                         로그인/회원/프로필 API
   │  │     │  ├─ community/                                    커뮤니티 도메인 컨트롤러
   │  │     │  │  ├─ attachment/AttachmentController.java        첨부 업/다운로드 API
   │  │     │  │  ├─ block/BlockController.java                  차단 관리 API
   │  │     │  │  ├─ chat/                                       채팅 관련 엔드포인트
   │  │     │  │  │  ├─ ChatAttachmentController.java            채팅 파일 첨부 API
   │  │     │  │  │  ├─ ChatMessageController.java               채팅 메시지 REST API
   │  │     │  │  │  ├─ ChatRoomController.java                  채팅방 관리 API
   │  │     │  │  │  ├─ DirectChatController.java                1:1 채팅 REST
   │  │     │  │  │  └─ StompChatController.java                 STOMP 채팅 엔드포인트
   │  │     │  │  ├─ comment/CommentController.java              댓글/대댓글 API
   │  │     │  │  ├─ friend/FriendController.java                친구 관리 API
   │  │     │  │  ├─ like/LikeController.java                    좋아요 API
   │  │     │  │  ├─ notice/NoticeController.java                공지 API
   │  │     │  │  ├─ post/PostController.java                    게시글 CRUD/목록 API
   │  │     │  │  └─ report/ReportController.java                신고 API
   │  │     │  ├─ dashboard/                                    대시보드 API
   │  │     │  │  └─ DashboardController.java                    집계/일정/통계/투두 제공
   │  │     │  ├─ file/                                         파일 업로드/관리 API
   │  │     │  │  └─ FileUploadController.java                   업로드/다운로드 엔드포인트
   │  │     │  ├─ livekit/                                      LiveKit 연동 API
   │  │     │  │  └─ LiveKitController.java                      토큰 발급/연동 관리
   │  │     │  ├─ plan/                                         학습 계획 API
   │  │     │  │  └─ PlanController.java                         계획 생성/조회/수정
   │  │     │  └─ study/                                        학습(개인/팀) API
   │  │     │     └─ team/                                      팀 학습 관련 엔드포인트
   │  │     │        ├─ FocusRoomSocketController.java           포커스 룸 소켓 엔드포인트
   │  │     │        ├─ QuizRoomRestController.java              퀴즈 룸 REST 엔드포인트
   │  │     │        ├─ QuizRoomSocketController.java            퀴즈 룍 소켓 엔드포인트
   │  │     │        ├─ StudyChatSocketController.java           팀 채팅 소켓 엔드포인트
   │  │     │        └─ TeamStudyRestController.java             팀 스터디 REST 엔드포인트
   │  │     ├─ dto/                                           요청/응답 DTO 계층
   │  │     │  ├─ admin/                                       관리자 DTO
   │  │     │  ├─ auth/                                        인증 DTO
   │  │     │  │  ├─ request/                                  요청 DTO
   │  │     │  │  │  ├─ LoginRequest.java                       로그인 요청 DTO
   │  │     │  │  │  ├─ NicknameCheckRequest.java               닉네임 체크 DTO
   │  │     │  │  │  ├─ RegisterRequest.java                    회원가입 DTO
   │  │     │  │  │  ├─ UpdateProfileRequest.java               프로필 수정 DTO
   │  │     │  │  │  ├─ UserDto.java                            사용자 DTO
   │  │     │  │  │  └─ UsernameCheckRequest.java               아이디 체크 DTO
   │  │     │  │  └─ response/                                  응답 DTO
   │  │     │  │     └─ LoginResponse.java                      로그인 응답 DTO
   │  │     │  ├─ common/                                      공통 DTO
   │  │     │  │  └─ MessageResponse.java                       메시지 응답 래퍼
   │  │     │  ├─ community/                                    커뮤니티 DTO 패키지
   │  │     │  ├─ dashboard/                                    대시보드 DTO 패키지
   │  │     │  ├─ file/                                        파일 DTO
   │  │     │  │  └─ request/FileUploadRequest.java             파일 업로드 요청 DTO
   │  │     │  ├─ livekit/                                     LiveKit DTO
   │  │     │  │  ├─ request/LiveKitTokenRequest.java          토큰 발급 요청 DTO
   │  │     │  │  └─ response/LiveKitTokenResponse.java        토큰 발급 응답 DTO
   │  │     │  ├─ plan/PlanRequest.java                        학습 계획 DTO
   │  │     │  ├─ study/                                      학습 DTO
   │  │     │  └─ user/                                       사용자 DTO
   │  │     │  │     ├─ request/UserProfileImageUpdateRequest.java  프로필 이미지 요청 DTO
   │  │     │  │     ├─ request/UserRequest.java               사용자 요청 DTO
   │  │     │  │     └─ response/UserProfileResponse.java      프로필 응답 DTO
   │  │     ├─ entity/                                       JPA 엔터티
   │  │     │  ├─ auth/User.java                              사용자 엔터티
   │  │     │  ├─ chat/                                       채팅 엔터티
   │  │     │  │  ├─ ChatMessage.java                         메시지 엔터티
   │  │     │  │  ├─ ChatMessageType.java                     메시지 타입 상수
   │  │     │  │  ├─ ChatParticipant.java                     참여자 엔터티
   │  │     │  │  ├─ ChatRead.java                            읽음 상태 엔터티
   │  │     │  │  ├─ ChatRoom.java                            채팅방 엔터티
   │  │     │  │  └─ ChatRoomType.java                        채팅방 타입 상수
   │  │     │  ├─ community/                                  커뮤니티 엔터티
   │  │     │  │  ├─ Attachment.java                          첨부 엔터티
   │  │     │  │  ├─ Block.java                               차단 엔터티
   │  │     │  │  ├─ BlockType.java                           차단 타입 상수
   │  │     │  │  ├─ Comment.java                             댓글 엔터티
   │  │     │  │  ├─ Like.java                                좋아요 엔터티
   │  │     │  │  ├─ Notice.java                              공지 엔터티
   │  │     │  │  ├─ Post.java                                게시글 엔터티
   │  │     │  │  ├─ PostCategory.java                        게시글 카테고리 상수
   │  │     │  │  ├─ PostFavorite.java                        즐겨찾기 엔터티
   │  │     │  │  ├─ Reply.java                               대댓글 엔터티
   │  │     │  │  ├─ Report.java                              신고 엔터티
   │  │     │  │  ├─ ReportStatus.java                        신고 상태 상수
   │  │     │  │  ├─ SidebarStudy.java                        사이드바 스터디 엔터티
   │  │     │  │  ├─ StudyApplication.java                    스터디 신청 엔터티
   │  │     │  │  ├─ StudyApplicationStatus.java              신청 상태 상수
   │  │     │  │  └─ StudyParticipant.java                    스터디 참여자 엔터티
   │  │     │  ├─ dashboard/                                  대시보드 엔터티
   │  │     │  │  ├─ ExamSchedule.java                        시험 일정 엔터티
   │  │     │  │  ├─ Goal.java                                목표 엔터티
   │  │     │  │  ├─ PriorityLevel.java                      우선순위 상수
   │  │     │  │  ├─ StudyLog.java                            학습 로그 엔터티
   │  │     │  │  ├─ StudySession.java                        학습 세션 엔터티
   │  │     │  │  ├─ StudyTime.java                           학습 시간 엔터티
   │  │     │  │  └─ Todo.java                                투두 엔터티
   │  │     │  ├─ friend/                                    친구 엔터티
   │  │     │  │  ├─ Friend.java                              친구 관계 엔터티
   │  │     │  │  ├─ FriendBlock.java                         친구 차단 엔터티
   │  │     │  │  ├─ FriendReport.java                        친구 신고 엔터티
   │  │     │  │  ├─ FriendReportStatus.java                  친구 신고 상태 상수
   │  │     │  │  ├─ FriendRequest.java                       친구 요청 엔터티
   │  │     │  │  └─ FriendRequestStatus.java                 친구 요청 상태 상수
   │  │     │  ├─ plan/StudyPlan.java                         학습 계획 엔터티
   │  │     │  └─ study/team/                                 팀 학습 엔터티
   │  │     │  │  ├─ FocusRoom.java                           포커스 룸 엔터티
   │  │     │  │  ├─ Passage.java                             지문 엔터티
   │  │     │  │  ├─ Problem.java                             문제 엔터티
   │  │     │  │  ├─ QuizRoom.java                            퀴즈 룸 엔터티
   │  │     │  │  ├─ RoomType.java                            룸 타입 상수
   │  │     │  │  ├─ StudyRoom.java                           스터디 룸 엔터티
   │  │     │  │  ├─ StudyRoomParticipant.java                룸 참여자 엔터티
   │  │     │  │  └─ Unit.java                                단원 엔터티
   │  │     │  ├─ global/                                    전역 공통
   │  │     │  │  ├─ exception/                               예외 정의/처리 패키지
   │  │     │  │  │  ├─ BadRequestException.java               400 예외
   │  │     │  │  │  ├─ ConflictException.java                 409 예외
   │  │     │  │  │  ├─ CustomException.java                   커스텀 예외 상위
   │  │     │  │  │  ├─ ErrorCode.java                         에러 코드 정의
   │  │     │  │  │  ├─ ForbiddenException.java                403 예외
   │  │     │  │  │  ├─ GlobalExceptionHandler.java            전역 예외 처리기
   │  │     │  │  │  ├─ NotFoundException.java                 404 예외
   │  │     │  │  │  └─ UnauthorizedException.java             401 예외
   │  │     │  │  ├─ response/                                공통 응답 패키지
   │  │     │  │  │  ├─ ApiResponse.java                       표준 응답 래퍼
   │  │     │  │  │  ├─ ErrorResponse.java                     에러 응답
   │  │     │  │  │  └─ ResponseMessage.java                   메시지 상수
   │  │     │  │  └─ util/                                    유틸 패키지(공통)
   │  │     │  │     ├─ DateTimeUtil.java                      날짜/시간 유틸
   │  │     │  │     ├─ FileUtil.java                          파일 유틸
   │  │     │  │     └─ ValidationUtil.java                    유효성 검사 유틸
   │  │     │  ├─ handler/                                   핸들러(저수준)
   │  │     │  │  └─ ChatWebSocketHandler.java                WebSocket 핸들러(채팅)
   │  │     │  ├─ repository/                                영속성 계층(Spring Data JPA)
   │  │     │  │  ├─ auth/UserRepository.java                 사용자 리포지토리
   │  │     │  │  ├─ chat/                                   채팅 리포지토리 모음
   │  │     │  │  │  ├─ ChatMessageRepository.java            메시지 저장소
   │  │     │  │  │  ├─ ChatParticipantRepository.java        참여자 저장소
   │  │     │  │  │  ├─ ChatReadRepository.java               읽음 저장소
   │  │     │  │  │  └─ ChatRoomRepository.java               채팅방 저장소
   │  │     │  │  ├─ community/                              커뮤니티 리포지토리 모음
   │  │     │  │  │  ├─ attachment/AttachmentRepository.java   첨부 저장소
   │  │     │  │  │  ├─ block/BlockRepository.java            차단 저장소
   │  │     │  │  │  ├─ comment/{Comment,Reply}Repository.java 댓글/대댓글 저장소
   │  │     │  │  │  ├─ like/LikeRepository.java              좋아요 저장소
   │  │     │  │  │  ├─ notice/NoticeRepository.java          공지 저장소
   │  │     │  │  │  ├─ post/{Post,PostFavorite}Repository.java 게시글 저장소
   │  │     │  │  │  ├─ report/ReportRepository.java          신고 저장소
   │  │     │  │  │  └─ study/{SidebarStudy,StudyApplication,StudyParticipant}Repository.java 스터디 저장소
   │  │     │  │  ├─ dashboard/                              대시보드 리포지토리
   │  │     │  │  │  ├─ ExamScheduleRepository.java          시험 일정 저장소
   │  │     │  │  │  ├─ GoalRepository.java                  목표 저장소
   │  │     │  │  │  ├─ StudyLogRepository.java              학습 로그 저장소
   │  │     │  │  │  ├─ StudySessionRepository.java          학습 세션 저장소
   │  │     │  │  │  └─ StudyTimeRepository.java             학습 시간 저장소
   │  │     │  │  ├─ friend/                                 친구 리포지토리
   │  │     │  │  │  ├─ FriendBlockRepository.java           친구 차단 저장소
   │  │     │  │  │  ├─ FriendReportRepository.java          친구 신고 저장소
   │  │     │  │  │  ├─ FriendRepository.java                친구 저장소
   │  │     │  │  │  └─ FriendRequestRepository.java         친구 요청 저장소
   │  │     │  │  ├─ plan/StudyPlanRepository.java           학습 계획 저장소
   │  │     │  │  ├─ study/                                 팀 학습 저장소
   │  │     │  │  │  ├─ FocusRoomRepository.java             포커스 룸 저장소
   │  │     │  │  │  ├─ PassageRepository.java               지문 저장소
   │  │     │  │  │  ├─ ProblemRepository.java               문제 저장소
   │  │     │  │  │  ├─ QuizRoomRepository.java              퀴즈 룸 저장소
   │  │     │  │  │  ├─ StudyRoomParticipantRepository.java   스터디 룸 참여자 저장소
   │  │     │  │  │  └─ StudyRoomRepository.java             스터디 룸 저장소
   │  │     │  │  └─ TodoRepository.java                    투두 저장소
   │  │     │  ├─ service/                                 비즈니스 로직 계층
   │  │     │  │  ├─ auth/                                 인증/세션 서비스
   │  │     │  │  │  ├─ AuthService.java                    인증 서비스
   │  │     │  │  │  └─ SessionService.java                 세션 서비스
   │  │     │  │  ├─ community/                            커뮤니티 서비스 모음
   │  │     │  │  │  ├─ attachment/AttachmentService.java   첨부 서비스
   │  │     │  │  │  ├─ block/BlockService.java             차단 서비스
   │  │     │  │  │  ├─ chat/                               채팅 서비스 모음
   │  │     │  │  │  │  ├─ ChatAttachmentService.java       채팅 첨부 처리
   │  │     │  │  │  │  ├─ ChatMessageService.java          메시지 처리
   │  │     │  │  │  │  ├─ ChatReadService.java             읽음 처리
   │  │     │  │  │  │  ├─ ChatRoomService.java             채팅방 비즈니스
   │  │     │  │  │  │  ├─ DirectChatService.java           1:1 채팅 비즈니스
   │  │     │  │  │  │  ├─ FileUploadService.java           파일 업로드 처리
   │  │     │  │  │  │  └─ WebSocketChatService.java        WS 메시징 처리
   │  │     │  │  │  ├─ comment/CommentService.java        댓글 서비스
   │  │     │  │  │  ├─ friend/FriendService.java          친구 서비스
   │  │     │  │  │  ├─ like/LikeService.java              좋아요 서비스
   │  │     │  │  │  ├─ notice/NoticeService.java          공지 서비스
   │  │     │  │  │  ├─ post/PostService.java              게시글 서비스
   │  │     │  │  │  └─ report/ReportService.java          신고 서비스
   │  │     │  │  ├─ dashboard/                            대시보드 서비스
   │  │     │  │  │  ├─ DashboardService.java             대시보드 집계/조회
   │  │     │  │  │  ├─ ExamScheduleService.java          시험 일정 서비스
   │  │     │  │  │  └─ GPTReflectionService.java         회고(GPT) 서비스
   │  │     │  │  ├─ livekit/LiveKitService.java          LiveKit 연동 서비스
   │  │     │  │  ├─ study/                               학습 서비스
   │  │     │  │  │  ├─ personal/StudySessionService.java 개인 학습 세션 서비스
   │  │     │  │  │  └─ team/                             팀 학습 서비스
   │  │     │  │  │     ├─ chat/StudyChatService.java      팀 채팅 서비스
   │  │     │  │  │     ├─ rest/QuizRoomRestService.java   퀴즈 REST 서비스
   │  │     │  │  │     └─ socket/FocusRoomSocketService.java 포커스룸 소켓 서비스
   │  │     │  │  ├─ user/UserService.java                사용자 서비스
   │  │     │  │  └─ util/                                유틸성 서비스
   │  │     │  │     ├─ FileService.java                   파일 처리 서비스
   │  │     │  │     └─ MailService.java                   메일 발송 서비스
   │  │     │  └─ util/                                   공통 유틸
   │  │     │  │  ├─ LiveKitTokenUtil.java                LiveKit 토큰 유틸
   │  │     │  │  ├─ RedisService.java                    Redis 헬퍼
   │  │     │  │  └─ SessionUtil.java                     세션 유틸
   │  └─ resources/                                      리소스
   │     └─ db/migration/                                Flyway 마이그레이션 스크립트 (소스)
   │        ├─ V13__fix_exam_schedule_subject.sql
   │        ├─ V14__fix_exam_schedule_date.sql
   │        ├─ V15__recreate_exam_schedule_table.sql
   │        ├─ V16__fix_exam_schedule_table.sql
   │        ├─ V17__fix_exam_schedule_table.sql
   │        ├─ V18__remove_exam_name_column.sql
   │        └─ V19__recreate_exam_schedule_table.sql
   └─ test/
      └─ java/com/hamcam/back/
         └─ BackApplicationTests.java
```
