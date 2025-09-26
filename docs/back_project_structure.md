# Back-end 프로젝트 구조 (트리 + 역할)

이 문서는 `back` 디렉터리, 즉 Spring Boot 백엔드 애플리케이션의 구조를 설명합니다. 각 파일과 디렉터리의 주요 역할과 기능이 함께 나열되어 있습니다.

## 1. 핵심 디렉터리 구조

```
back/
├─ build.gradle
├─ gradle/
├─ gradlew
├─ gradlew.bat
├─ settings.gradle
└─ src/
   ├─ main/
   │  ├─ java/com/hamcam/back/
   │  │  ├─ config/
   │  │  ├─ controller/
   │  │  ├─ dto/
   │  │  ├─ entity/
   │  │  ├─ global/
   │  │  ├─ handler/
   │  │  ├─ repository/
   │  │  ├─ service/
   │  │  └─ util/
   │  └─ resources/
   └─ test/
```

## 2. 상세 파일 구조 및 역할

```
back/
├─ .gitattributes                                               # Git 속성 파일로, 텍스트 파일의 줄바꿈(LF/CRLF) 방식을 통일하여 OS 간의 호환성 문제를 방지합니다.
├─ .gitignore                                                   # Git 버전 관리에서 제외할 파일 및 디렉터리 목록을 지정합니다. (예: 빌드 결과물, 로그 파일, IDE 설정)
├─ build.gradle                                                 # 프로젝트의 빌드 자동화 도구인 Gradle의 설정 파일입니다. 의존성 라이브러리, 플러그인, 빌드 태스크를 정의합니다.
├─ gradle/                                                      # Gradle Wrapper 설정 디렉터리입니다.
│  └─ wrapper/
│     ├─ gradle-wrapper.jar                                     # Gradle Wrapper의 실행 가능한 JAR 파일로, 로컬에 Gradle을 설치하지 않아도 빌드를 실행할 수 있게 합니다.
│     └─ gradle-wrapper.properties                              # Wrapper가 사용할 Gradle 버전과 설정을 정의합니다.
├─ gradlew                                                      # Unix 계열(Linux, macOS) 운영체제에서 Gradle Wrapper를 실행하기 위한 셸 스크립트입니다.
├─ gradlew.bat                                                  # Windows 운영체제에서 Gradle Wrapper를 실행하기 위한 배치 스크립트입니다.
├─ settings.gradle                                              # Gradle 프로젝트의 설정을 정의하는 파일로, 주로 루트 프로젝트의 이름을 지정합니다.
└─ src/                                                         # 애플리케이션의 전체 소스 코드를 포함하는 최상위 디렉터리입니다.
   ├─ main/                                                      # 실제 배포될 프로덕션 코드와 리소스를 담는 디렉터리입니다.
   │  ├─ java/                                                   # Java 소스 코드가 위치하는 디렉터리입니다.
   │  │  └─ com/hamcam/back/                                     # 애플리케이션의 루트 패키지 경로입니다.
   │  │     ├─ BackApplication.java                              # @SpringBootApplication 애너테이션을 포함하는 애플리케이션의 주 진입점(main-class)입니다.
   │  │     ├─ config/                                           # 애플리케이션의 전역 설정을 담당하는 클래스들을 모아놓은 패키지입니다.
   │  │     │  ├─ auth/                                          # 인증 및 이메일 관련 설정을 담당합니다.
   │  │     │  │  └─ EmailConfig.java                             # Naver SMTP 서버를 사용한 이메일 전송 기능을 설정합니다.
   │  │     │  ├─ livekit/                                       # 실시간 비디오/오디오 통신을 위한 LiveKit 서버 연동 설정을 담당합니다.
   │  │     │  │  ├─ LivekitProperties.java                      # `application.yml`에 정의된 LiveKit 관련 속성(API 키, URL 등)을 바인딩합니다.
   │  │     │  │  └─ LivekitUrls.java                            # LiveKit API 호출에 필요한 URL을 동적으로 생성하는 헬퍼 클래스입니다.
   │  │     │  ├─ socket/                                        # WebSocket 및 STOMP 프로토콜 관련 설정을 담당합니다.
   │  │     │  │  ├─ CustomHandshakeHandler.java                 # WebSocket 연결 시 사용자 인증 정보를 Principal 객체로 변환하는 핸들러입니다.
   │  │     │  │  ├─ StompAuthChannelInterceptor.java            # STOMP 메시지(CONNECT, SUBSCRIBE 등)를 가로채 인증 및 권한 검사를 수행합니다.
   │  │     │  │  ├─ StompHandshakeInterceptor.java              # HTTP 세션의 사용자 ID를 WebSocket 세션 속성으로 복사하는 역할을 합니다.
   │  │     │  │  ├─ WebSocketEventListener.java                 # WebSocket 연결 및 해제 이벤트를 감지하여 사용자 온라인 상태를 Redis에 기록/삭제합니다.
   │  │     │  │  └─ WebSocketStompConfig.java                   # STOMP 엔드포인트(`/ws`, `/ws/chat` 등)와 메시지 브로커(`/sub`, `/app`)를 설정합니다.
   │  │     │  └─ web/                                           # Spring Web MVC, 직렬화, 캐싱 등 웹 계층의 전역 설정을 담당합니다.
   │  │     │     ├─ JacksonConfig.java                          # JSON 직렬화/역직렬화를 위한 Jackson의 동작(날짜 형식, snake_case 등)을 전역으로 설정합니다.
   │  │     │     ├─ RedisConfig.java                            # Redis와의 연결을 설정하고, 용도별(String, Object) RedisTemplate 빈을 생성합니다.
   │  │     │     └─ WebConfig.java                              # CORS 정책, 정적 리소스 핸들러(`uploads` 경로 매핑) 등 웹 관련 설정을 구성합니다.
   │  │     ├─ controller/                                      # HTTP 요청을 받아 처리하는 REST 컨트롤러 및 WebSocket 엔드포인트가 위치하는 계층입니다.
   │  │     │  ├─ admin/                                        # 관리자 기능 관련 API 컨트롤러 패키지입니다.
   │  │     │  │  └─ AdminReportController.java                  # 사용자 신고 내역 조회 및 처리 등 관리자 전용 API를 제공합니다. (현재는 비어 있음)
   │  │     │  ├─ auth/                                         # 사용자 인증(회원가입, 로그인, 탈퇴) 관련 API를 제공합니다.
   │  │     │  │  └─ AuthController.java                         # `/api/auth` 경로의 요청을 받아 회원가입, 로그인, 프로필 관리 기능을 처리합니다.
   │  │     │  ├─ community/                                    # 커뮤니티 기능(게시판, 채팅, 친구 등) 관련 컨트롤러를 모아놓은 패키지입니다.
   │  │     │  │  ├─ attachment/AttachmentController.java        # 게시글의 파일 첨부(업로드, 다운로드, 목록 조회, 삭제) API를 제공합니다.
   │  │     │  │  ├─ block/BlockController.java                  # 사용자, 게시글, 댓글, 대댓글에 대한 차단 및 차단 해제 API를 제공합니다.
   │  │     │  │  ├─ chat/                                       # 실시간 채팅 기능과 관련된 REST 및 WebSocket 엔드포인트를 제공합니다.
   │  │     │  │  │  ├─ ChatAttachmentController.java            # 채팅방 내 파일(이미지 등) 업로드, 다운로드, 미리보기 API를 제공합니다.
   │  │     │  │  │  ├─ ChatMessageController.java               # 채팅방 입장 시 이전 메시지를 불러오는 REST API를 제공합니다.
   │  │     │  │  │  ├─ ChatRoomController.java                  # 채팅방 생성, 목록 조회, 상세 정보 조회, 삭제 등 채팅방 관리 API를 제공합니다.
   │  │     │  │  │  ├─ DirectChatController.java                # 1:1 채팅방 생성 및 조회 관련 REST API를 제공합니다.
   │  │     │  │  │  └─ StompChatController.java                 # WebSocket을 통해 실시간 채팅 메시지(일반, 읽음 확인)를 처리하는 STOMP 엔드포인트입니다.
   │  │     │  │  ├─ comment/CommentController.java              # 게시글의 댓글 및 대댓글 생성, 수정, 삭제, 조회 API를 제공합니다.
   │  │     │  │  ├─ friend/FriendController.java                # 친구 요청, 수락/거절, 목록 조회, 삭제, 차단 등 친구 관계 관리 API를 제공합니다.
   │  │     │  │  ├─ like/LikeController.java                    # 게시글, 댓글, 대댓글에 대한 '좋아요' 기능(토글, 수 조회, 여부 확인) API를 제공합니다.
   │  │     │  │  ├─ notice/NoticeController.java                # 공지사항 목록 조회 API를 제공합니다.
   │  │     │  │  ├─ post/PostController.java                    # 게시글 생성, 수정, 삭제, 상세/목록 조회, 즐겨찾기 등 게시판 핵심 API를 제공합니다.
   │  │     │  │  └─ report/ReportController.java                # 부적절한 콘텐츠(게시글, 댓글 등)나 사용자를 신고하는 API를 제공합니다.
   │  │     │  ├─ dashboard/                                    # 사용자 대시보드 관련 API를 제공하는 컨트롤러 패키지입니다.
   │  │     │  │  └─ DashboardController.java                    # 월별 캘린더, 할 일(Todo), 시험 일정, 학습 통계, 목표, 회고 등 대시보드 전체 기능의 엔드포인트입니다.
   │  │     │  ├─ file/                                         # 파일 업로드 및 관리를 위한 API 컨트롤러 패키지입니다.
   │  │     │  │  └─ FileUploadController.java                   # 범용 파일 업로드 및 다운로드 엔드포인트를 제공합니다.
   │  │     │  ├─ livekit/                                      # 실시간 통신 서비스인 LiveKit 연동을 위한 API 컨트롤러입니다.
   │  │     │  │  └─ LivekitController.java                      # LiveKit 방에 접속하기 위한 JWT 토큰을 발급하고 관련 상호작용을 관리합니다.
   │  │     │  ├─ plan/                                         # 학습 계획 관련 API 컨트롤러 패키지입니다.
   │  │     │  │  └─ PlanController.java                         # AI를 이용한 학습 계획 생성, 조회, 수정, 삭제 API를 제공합니다.
   │  │     │  ├─ study/                                        # 개인 및 팀 학습 기능 관련 API 컨트롤러 패키지입니다.
   │  │     │  │  └─ team/                                      # 팀 기반 학습(스터디) 기능의 엔드포인트를 모아놓은 패키지입니다.
   │  │     │  │     ├─ FocusRoomSocketController.java           # '집중 시간 경쟁 방'의 실시간 상호작용(입장, 시간 업데이트 등)을 처리하는 WebSocket 엔드포인트입니다.
   │  │     │  │     ├─ PresenceController.java                  # 학습 방 내 사용자의 참여 상태(roster) 조회 및 실시간 입/퇴장 알림을 처리합니다.
   │  │     │  │     ├─ QuizRoomRestController.java              # '퀴즈 풀이 방'에서 필요한 문제 데이터를 제공하는 REST 엔드포인트입니다.
   │  │     │  │     ├─ QuizRoomSocketController.java            # '퀴즈 풀이 방'의 실시간 상호작용(준비, 시작, 정답 제출 등)을 처리하는 WebSocket 엔드포인트입니다.
   │  │     │  │     ├─ StudyChatSocketController.java           # 모든 팀 학습(퀴즈, 집중) 방에서 공용으로 사용하는 실시간 채팅 엔드포인트입니다.
   │  │     │  │     └─ TeamStudyRestController.java             # 팀 스터디 방의 생성, 입장, 삭제, 목록 조회 등 방 관리를 위한 REST 엔드포인트입니다.
   │  │     │  └─ user/                                         # 사용자 정보 관련 API 컨트롤러 패키지입니다.
   │  │     │     └─ UserController.java                         # 자신의 프로필 정보 조회, 수정, 회원 탈퇴 등 사용자 관련 API를 제공합니다.
   │  │     ├─ dto/                                              # 데이터 전송 객체(DTO)로, 계층 간 데이터 교환을 위해 사용됩니다.
   │  │     │  ├─ admin/response/                               # 관리자 기능 관련 응답 DTO 패키지입니다.
   │  │     │  │  ├─ ReportDetailResponse.java                 # 신고 상세 정보 응답 DTO입니다.
   │  │     │  │  └─ ReportListResponse.java                   # 신고 목록 응답 DTO입니다.
   │  │     │  ├─ auth/                                         # 인증(로그인, 회원가입) 과정에서 사용하는 DTO 패키지입니다.
   │  │     │  │  ├─ request/                                  # 인증 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  ├─ LoginRequest.java                     # 로그인 요청 DTO입니다.
   │  │     │  │  │  ├─ NicknameCheckRequest.java             # 닉네임 중복 확인 요청 DTO입니다.
   │  │     │  │  │  ├─ RegisterRequest.java                  # 회원가입 요청 DTO입니다.
   │  │     │  │  │  ├─ UpdateProfileRequest.java             # 프로필 수정 요청 DTO입니다.
   │  │     │  │  │  ├─ UserDto.java                          # 사용자 기본 정보 DTO입니다.
   │  │     │  │  │  └─ UsernameCheckRequest.java             # 아이디 중복 확인 요청 DTO입니다.
   │  │     │  │  └─ response/                                 # 인증 관련 응답 DTO 패키지입니다.
   │  │     │  │     └─ LoginResponse.java                      # 로그인 성공 시 사용자 정보를 담는 응답 DTO입니다.
   │  │     │  ├─ common/                                       # 여러 도메인에서 공통적으로 사용되는 응답 DTO를 포함합니다.
   │  │     │  │  └─ MessageResponse.java                      # 간단한 메시지와 데이터를 포함하는 공통 응답 DTO입니다.
   │  │     │  ├─ community/                                    # 커뮤니티(게시판, 채팅, 친구 등) 기능에서 사용하는 DTO 패키지입니다.
   │  │     │  │  ├─ attachment/                               # 첨부파일 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 첨부파일 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ AttachmentIdRequest.java          # 첨부파일 ID를 포함하는 요청 DTO입니다.
   │  │     │  │  │  │  ├─ AttachmentUploadRequest.java      # 첨부파일 업로드 요청 DTO입니다.
   │  │     │  │  │  │  └─ PostIdRequest.java                  # 게시글 ID를 포함하는 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 첨부파일 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ AttachmentDownloadResponse.java   # 첨부파일 다운로드 정보 응답 DTO입니다.
   │  │     │  │  │     ├─ AttachmentListResponse.java       # 첨부파일 목록 응답 DTO입니다.
   │  │     │  │  │     └─ AttachmentResponse.java           # 단일 첨부파일 정보 응답 DTO입니다.
   │  │     │  │  ├─ block/                                    # 차단 기능 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 차단 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ BlockTargetRequest.java           # 차단 대상 ID를 포함하는 요청 DTO입니다.
   │  │     │  │  │  │  └─ UnblockTargetRequest.java         # 차단 해제 대상 ID를 포함하는 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 차단 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ BlockedCommentListResponse.java   # 차단된 댓글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ BlockedPostListResponse.java      # 차단된 게시글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ BlockedReplyListResponse.java     # 차단된 대댓글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ BlockedTargetResponse.java        # 차단된 대상의 정보를 담는 응답 DTO입니다.
   │  │     │  │  │     └─ BlockedUserListResponse.java      # 차단된 사용자 목록 응답 DTO입니다.
   │  │     │  │  ├─ chat/                                       # 채팅 기능 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 채팅 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ ChatAttachmentRequest.java        # 채팅 첨부파일 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatEnterRequest.java             # 채팅방 입장/퇴장 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatFileUploadRequest.java        # 채팅 파일 업로드 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatMessageRequest.java           # 채팅 메시지 전송 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatReadRequest.java              # 채팅 메시지 읽음 확인 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatRoomCreateRequest.java        # 채팅방 생성 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatRoomDeleteRequest.java        # 채팅방 삭제 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatRoomDetailRequest.java        # 채팅방 상세 정보 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ChatStompMessage.java             # STOMP 메시지 DTO입니다.
   │  │     │  │  │  │  ├─ DirectChatLookupRequest.java      # 1:1 채팅방 조회 요청 DTO입니다.
   │  │     │  │  │  │  ├─ DirectChatRequest.java            # 1:1 채팅 시작 요청 DTO입니다.
   │  │     │  │  │  │  └─ RoomAccessRequest.java            # 채팅방 접근 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 채팅 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ ChatBroadcastMessage.java         # 채팅방에 브로드캐스트될 메시지 DTO입니다.
   │  │     │  │  │     ├─ ChatFilePreviewResponse.java      # 채팅 파일 미리보기 응답 DTO입니다.
   │  │     │  │  │     ├─ ChatMessageResponse.java          # 채팅 메시지 응답 DTO입니다.
   │  │     │  │  │     ├─ ChatParticipantDto.java           # 채팅 참여자 정보 DTO입니다.
   │  │     │  │  │     ├─ ChatRoomListResponse.java         # 채팅방 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ ChatRoomResponse.java             # 채팅방 정보 응답 DTO입니다.
   │  │     │  │  │     └─ MessageSendResultResponse.java    # 메시지 전송 결과 응답 DTO입니다.
   │  │     │  │  ├─ comment/                                  # 댓글/대댓글 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 댓글/대댓글 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ CommentCreateRequest.java         # 댓글 생성 요청 DTO입니다.
   │  │     │  │  │  │  ├─ CommentDeleteRequest.java         # 댓글 삭제 요청 DTO입니다.
   │  │     │  │  │  │  ├─ CommentListRequest.java           # 댓글 목록 조회 요청 DTO입니다.
   │  │     │  │  │  │  ├─ CommentUpdateRequest.java         # 댓글 수정 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReplyCreateRequest.java           # 대댓글 생성 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReplyDeleteRequest.java           # 대댓글 삭제 요청 DTO입니다.
   │  │     │  │  │  │  └─ ReplyUpdateRequest.java           # 대댓글 수정 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 댓글/대댓글 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ CommentListResponse.java          # 댓글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ CommentResponse.java              # 단일 댓글 정보 응답 DTO입니다.
   │  │     │  │  │     └─ ReplyResponse.java                # 단일 대댓글 정보 응답 DTO입니다.
   │  │     │  │  ├─ friend/                                   # 친구 기능 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 친구 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ DirectChatRequest.java            # 1:1 채팅 요청 DTO입니다.
   │  │     │  │  │  │  ├─ FriendAcceptRequest.java          # 친구 요청 수락 DTO입니다.
   │  │     │  │  │  │  ├─ FriendBlockRequest.java           # 친구 차단/해제 요청 DTO입니다.
   │  │     │  │  │  │  ├─ FriendCancelRequest.java          # 보낸 친구 요청 취소 DTO입니다.
   │  │     │  │  │  │  ├─ FriendDeleteRequest.java          # 친구 삭제 요청 DTO입니다.
   │  │     │  │  │  │  ├─ FriendRejectRequest.java          # 친구 요청 거절 DTO입니다.
   │  │     │  │  │  │  ├─ FriendReportRequest.java          # 친구 신고 요청 DTO입니다.
   │  │     │  │  │  │  ├─ FriendRequestSendRequest.java     # 친구 요청 발신 DTO입니다.
   │  │     │  │  │  │  └─ FriendSearchRequest.java          # 친구 검색 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 친구 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ BlockedFriendListResponse.java    # 차단된 친구 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ FriendActionResponse.java         # 친구 관련 동작 결과 응답 DTO입니다.
   │  │     │  │  │     ├─ FriendListResponse.java           # 온라인/오프라인 친구 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ FriendRequestListResponse.java    # 받은 친구 요청 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ FriendSearchResponse.java         # 친구 검색 결과 응답 DTO입니다.
   │  │     │  │  │     └─ SentFriendRequestListResponse.java  # 보낸 친구 요청 목록 응답 DTO입니다.
   │  │     │  │  ├─ like/                                     # 좋아요 기능 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 좋아요 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ CommentLikeCountRequest.java      # 댓글 좋아요 수 요청 DTO입니다.
   │  │     │  │  │  │  ├─ CommentLikeStatusRequest.java     # 댓글 좋아요 여부 확인 요청 DTO입니다.
   │  │     │  │  │  │  ├─ CommentLikeToggleRequest.java     # 댓글 좋아요 토글 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostLikeCountRequest.java         # 게시글 좋아요 수 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostLikeStatusRequest.java        # 게시글 좋아요 여부 확인 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostLikeToggleRequest.java        # 게시글 좋아요 토글 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReplyLikeCountRequest.java        # 대댓글 좋아요 수 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReplyLikeStatusRequest.java       # 대댓글 좋아요 여부 확인 요청 DTO입니다.
   │  │     │  │  │  │  └─ ReplyLikeToggleRequest.java       # 대댓글 좋아요 토글 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 좋아요 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ LikeCountResponse.java            # 좋아요 수 응답 DTO입니다.
   │  │     │  │  │     └─ LikeStatusResponse.java           # 좋아요 여부 응답 DTO입니다.
   │  │     │  │  ├─ notice/                                   # 공지사항 관련 DTO 패키지입니다.
   │  │     │  │  │  └─ response/                             # 공지사항 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ NoticeResponse.java               # 공지사항 상세 정보 응답 DTO입니다.
   │  │     │  │  │     └─ NoticeSummaryResponse.java        # 공지사항 요약 정보 응답 DTO입니다.
   │  │     │  │  ├─ post/                                     # 게시글 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 게시글 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ PostCreateRequest.java            # 게시글 생성 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostDeleteRequest.java            # 게시글 삭제 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostDetailRequest.java            # 게시글 상세 조회 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostFavoriteRequest.java          # 게시글 즐겨찾기 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostFilterRequest.java            # 게시글 필터링 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostListRequest.java              # 게시글 목록 조회 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostSearchRequest.java            # 게시글 검색 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostUpdateRequest.java            # 게시글 수정 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostViewRequest.java              # 게시글 조회수 증가 요청 DTO입니다.
   │  │     │  │  │  │  └─ ProblemReferenceRequest.java      # 문제 기반 게시글 자동 생성 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 게시글 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ FavoritePostListResponse.java     # 즐겨찾기 게시글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ PopularPostListResponse.java      # 인기 게시글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ PostListResponse.java             # 게시글 목록 응답 DTO입니다.
   │  │     │  │  │     ├─ PostResponse.java                 # 게시글 상세 정보 응답 DTO입니다.
   │  │     │  │  │     ├─ PostSummaryResponse.java          # 게시글 요약 정보 응답 DTO입니다.
   │  │     │  │  │     ├─ ProblemReferenceResponse.java     # 문제 기반 게시글 자동 생성 응답 DTO입니다.
   │  │     │  │  │     └─ TagListResponse.java              # 태그 목록 응답 DTO입니다.
   │  │     │  │  ├─ report/                                   # 신고 기능 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 신고 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ CommentReportRequest.java         # 댓글 신고 요청 DTO입니다.
   │  │     │  │  │  │  ├─ PostReportRequest.java            # 게시글 신고 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReplyReportRequest.java           # 대댓글 신고 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReportRequest.java                # 범용 신고 요청 DTO입니다.
   │  │     │  │  │  │  └─ UserReportRequest.java            # 사용자 신고 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 신고 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ ReportDetailResponse.java         # 신고 상세 정보 응답 DTO입니다.
   │  │     │  │  │     ├─ ReportListResponse.java           # 신고 목록 응답 DTO입니다.
   │  │     │  │  │     └─ ReportResponse.java               # 신고 처리 결과 응답 DTO입니다.
   │  │     │  │  └─ study/                                    # 커뮤니티 내 스터디 관련 DTO 패키지입니다.
   │  │     │  │     ├─ request/                              # 스터디 관련 요청 DTO 패키지입니다.
   │  │     │  │     │  ├─ SidebarStudyCreateRequest.java      # 사이드바에서 스터디 생성 요청 DTO입니다.
   │  │     │  │     │  ├─ StudyApplicationApprovalRequest.java  # 스터디 참여 신청 승인/거절 요청 DTO입니다.
   │  │     │  │     │  └─ StudyApplyRequest.java              # 스터디 참여 신청 요청 DTO입니다.
   │  │     │  │     └─ response/                             # 스터디 관련 응답 DTO 패키지입니다.
   │  │     │  │        ├─ StudyInfoDto.java                   # 스터디 상세 정보 DTO입니다.
   │  │     │  │        ├─ StudyInfoListResponse.java        # 스터디 목록 응답 DTO입니다.
   │  │     │  │        ├─ UserListResponse.java             # 사용자 목록 응답 DTO입니다.
   │  │     │  │        └─ UserSimpleDto.java                # 사용자 간단 정보 DTO입니다.
   │  │     │  ├─ dashboard/                                    # 대시보드(캘린더, 통계, 할 일 등) 기능에서 사용하는 DTO 패키지입니다.
   │  │     │  │  ├─ calendar/                                 # 캘린더 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 캘린더 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ CalendarDailyRequest.java         # 일별 캘린더 이벤트 요청 DTO입니다.
   │  │     │  │  │  │  ├─ CalendarMonthRequest.java         # 월별 캘린더 이벤트 요청 DTO입니다.
   │  │     │  │  │  │  └─ CalendarRequest.java              # 캘린더 요청 DTO입니다.
   │  │     │  │  │  └─ CalendarEventDto.java                   # 캘린더 이벤트 정보 DTO입니다.
   │  │     │  │  ├─ exam/                                     # 시험 일정 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 시험 일정 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  └─ ExamScheduleRequest.java          # 시험 일정 생성/수정 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 시험 일정 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ DDayInfoResponse.java             # D-Day 정보 응답 DTO입니다.
   │  │     │  │  │     └─ ExamScheduleResponse.java         # 시험 일정 정보 응답 DTO입니다.
   │  │     │  │  ├─ goal/                                     # 학습 목표 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 학습 목표 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ GoalResetRequest.java             # 목표 초기화 요청 DTO입니다.
   │  │     │  │  │  │  └─ GoalUpdateRequest.java            # 목표 수정 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 학습 목표 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     └─ GoalSuggestionResponse.java       # 목표 제안 응답 DTO입니다.
   │  │     │  │  ├─ reflection/                               # 학습 회고 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 학습 회고 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  ├─ OptionReflectionRequest.java      # 옵션 기반 회고 요청 DTO입니다.
   │  │     │  │  │  │  ├─ RangeReflectionRequest.java       # 기간 기반 회고 요청 DTO입니다.
   │  │     │  │  │  │  ├─ ReflectionDeleteRequest.java      # 회고 삭제 요청 DTO입니다.
   │  │     │  │  │  │  └─ WeeklyReflectionRequest.java      # 주간 회고 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 학습 회고 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ ReflectionType.java             # 회고 타입 Enum입니다.
   │  │     │  │  │     └─ WeeklyReflectionResponse.java     # 주간 회고 응답 DTO입니다.
   │  │     │  │  ├─ stats/                                    # 통계 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 통계 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  └─ FocusTimeUpdateRequest.java       # 집중 시간 수정 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 통계 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     ├─ BestFocusDayResponse.java         # 최고 집중일 응답 DTO입니다.
   │  │     │  │  │     ├─ GrowthResponse.java               # 성장률 응답 DTO입니다.
   │  │     │  │  │     ├─ MonthlyStatsResponse.java         # 월간 통계 응답 DTO입니다.
   │  │     │  │  │     ├─ SubjectStatsResponse.java         # 과목별 통계 응답 DTO입니다.
   │  │     │  │  │     ├─ TotalStatsResponse.java           # 전체 통계 응답 DTO입니다.
   │  │     │  │  │     └─ WeeklyStatsResponse.java          # 주간 통계 응답 DTO입니다.
   │  │     │  │  ├─ time/                                     # 학습 시간 관련 DTO 패키지입니다.
   │  │     │  │  │  └─ request/                              # 학습 시간 관련 요청 DTO 패키지입니다.
   │  │     │  │  │     └─ StudyTimeUpdateRequest.java       # 학습 시간 수정 요청 DTO입니다.
   │  │     │  │  └─ todo/                                     # 할 일(Todo) 관련 DTO 패키지입니다.
   │  │     │  │     ├─ request/                              # 할 일 관련 요청 DTO 패키지입니다.
   │  │     │  │     │  ├─ TodoDateRequest.java              # 날짜 기반 할 일 조회 요청 DTO입니다.
   │  │     │  │     │  ├─ TodoDeleteRequest.java            # 할 일 삭제 요청 DTO입니다.
   │  │     │  │     │  ├─ TodoRequest.java                  # 할 일 생성 요청 DTO입니다.
   │  │     │  │     │  ├─ TodoToggleRequest.java            # 할 일 완료 토글 요청 DTO입니다.
   │  │     │  │     │  └─ TodoUpdateRequest.java            # 할 일 수정 요청 DTO입니다.
   │  │     │  │     └─ response/                             # 할 일 관련 응답 DTO 패키지입니다.
   │  │     │  │        └─ TodoResponse.java                 # 할 일 정보 응답 DTO입니다.
   │  │     │  ├─ file/                                         # 파일 관련 작업(업로드 등)에서 사용하는 DTO 패키지입니다.
   │  │     │  │  └─ request/                                  # 파일 관련 요청 DTO 패키지입니다.
   │  │     │  │     └─ FileUploadRequest.java                    # 파일 업로드 요청 DTO입니다.
   │  │     │  ├─ livekit/                                      # LiveKit 연동에 사용하는 DTO 패키지입니다.
   │  │     │  │  ├─ request/                                  # LiveKit 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  └─ LivekitTokenRequest.java                  # LiveKit 토큰 발급 요청 DTO입니다.
   │  │     │  │  └─ response/                                 # LiveKit 관련 응답 DTO 패키지입니다.
   │  │     │  │     └─ LivekitTokenResponse.java                 # LiveKit 토큰 발급 응답 DTO입니다.
   │  │     │  ├─ plan/                                         # 학습 계획 기능에서 사용하는 DTO 패키지입니다.
   │  │     │  │  └─ PlanRequest.java                            # 학습 계획 생성 요청 DTO입니다.
   │  │     │  ├─ study/                                        # 학습(개인/팀) 기능에서 사용하는 DTO 패키지입니다.
   │  │     │  │  ├─ personal/                                 # 개인 학습 관련 DTO 패키지입니다.
   │  │     │  │  │  ├─ request/                              # 개인 학습 관련 요청 DTO 패키지입니다.
   │  │     │  │  │  │  └─ StudySessionRequest.java          # 개인 학습 세션 생성 요청 DTO입니다.
   │  │     │  │  │  └─ response/                             # 개인 학습 관련 응답 DTO 패키지입니다.
   │  │     │  │  │     └─ StudySessionResponse.java         # 개인 학습 세션 정보 응답 DTO입니다.
   │  │     │  │  └─ team/                                     # 팀 학습 관련 DTO 패키지입니다.
   │  │     │  │     ├─ response/inner/                         # 팀 학습 내부에서 사용되는 응답 DTO 패키지입니다.
   │  │     │  │     │  └─ ParticipantInfo.java                # 팀 학습 참여자 정보 DTO입니다.
   │  │     │  │     ├─ rest/                                   # 팀 학습 REST API 관련 DTO 패키지입니다.
   │  │     │  │     │  ├─ request/                          # 팀 학습 REST API 관련 요청 DTO 패키지입니다.
   │  │     │  │     │  │  ├─ TeamRoomCreateRequest.java      # 팀 학습방 생성 요청 DTO입니다.
   │  │     │  │     │  │  ├─ TeamRoomDetailRequest.java      # 팀 학습방 상세 정보 요청 DTO입니다.
   │  │     │  │     │  │  └─ TeamRoomPostFailureRequest.java # 실패 문제 게시글 등록 요청 DTO입니다.
   │  │     │  │     │  └─ response/                         # 팀 학습 REST API 관련 응답 DTO 패키지입니다.
   │  │     │  │     │     ├─ QuizProblemResponse.java        # 퀴즈 문제 응답 DTO입니다.
   │  │     │  │     │     ├─ TeamRoomDetailResponse.java     # 팀 학습방 상세 정보 응답 DTO입니다.
   │  │     │  │     │     └─ TeamRoomSimpleInfo.java         # 팀 학습방 요약 정보 DTO입니다.
   │  │     │  │     └─ socket/                                 # 팀 학습 WebSocket 관련 DTO 패키지입니다.
   │  │     │  │        ├─ request/                          # 팀 학습 WebSocket 관련 요청 DTO 패키지입니다.
   │  │     │  │        │  ├─ FileUploadNoticeRequest.java    # 파일 업로드 알림 요청 DTO입니다.
   │  │     │  │        │  ├─ FocusChatMessageRequest.java    # 집중방 채팅 메시지 요청 DTO입니다.
   │  │     │  │        │  ├─ FocusConfirmExitRequest.java    # 집중방 퇴장 확인 요청 DTO입니다.
   │  │     │  │        │  ├─ FocusGoalAchievedRequest.java   # 집중방 목표 달성 요청 DTO입니다.
   │  │     │  │        │  ├─ FocusTimeUpdateRequest.java     # 집중방 시간 업데이트 요청 DTO입니다.
   │  │     │  │        │  ├─ FocusWarningRequest.java        # 집중방 경고 요청 DTO입니다.
   │  │     │  │        │  ├─ PresenterAnnounceRequest.java   # 발표자 공지 요청 DTO입니다.
   │  │     │  │        │  ├─ QuizAnswerRequest.java          # 퀴즈 정답 제출 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomContinueRequest.java        # 방 계속 진행 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomEndPresentationRequest.java # 발표 종료 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomEnterRequest.java           # 방 입장 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomHandRequest.java            # 손들기 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomProblemChangeRequest.java   # 문제 변경 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomReadyRequest.java           # 준비 완료 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomStartRequest.java           # 방 시작 요청 DTO입니다.
   │  │     │  │        │  ├─ RoomTerminateRequest.java       # 방 종료 요청 DTO입니다.
   │  │     │  │        │  ├─ StudyChatMessageRequest.java    # 학습방 채팅 메시지 요청 DTO입니다.
   │  │     │  │        │  ├─ VoteSubmitRequest.java          # 투표 제출 요청 DTO입니다.
   │  │     │  │        │  ├─ VoteType.java                   # 투표 타입 Enum입니다.
   │  │     │  │        │  └─ WarningReason.java              # 경고 사유 Enum입니다.
   │  │     │  │        └─ response/                         # 팀 학습 WebSocket 관련 응답 DTO 패키지입니다.
   │  │     │  │           ├─ FileUploadNoticeResponse.java   # 파일 업로드 알림 응답 DTO입니다.
   │  │     │  │           ├─ FocusChatMessageResponse.java   # 집중방 채팅 메시지 응답 DTO입니다.
   │  │     │  │           ├─ FocusRankingResponse.java       # 집중방 랭킹 응답 DTO입니다.
   │  │     │  │           ├─ ParticipantInfo.java            # 참여자 정보 DTO입니다.
   │  │     │  │           ├─ PresenceMessage.java            # 참여 상태 메시지 DTO입니다.
   │  │     │  │           ├─ ProblemBroadcastResponse.java   # 문제 브로드캐스트 응답 DTO입니다.
   │  │     │  │           ├─ RankingDto.java                 # 랭킹 정보 DTO입니다.
   │  │     │  │           ├─ StudyChatMessageResponse.java   # 학습방 채팅 메시지 응답 DTO입니다.
   │  │     │  │           ├─ TextNoticeResponse.java         # 텍스트 공지 응답 DTO입니다.
   │  │     │  │           ├─ VoteResultResponse.java         # 투표 결과 응답 DTO입니다.
   │  │     │  │           └─ VoteUITriggerResponse.java      # 투표 UI 트리거 응답 DTO입니다.
   │  │     │  └─ user/                                         # 사용자 정보 관련 기능에서 사용하는 DTO 패키지입니다.
   │  │     │     ├─ request/                                  # 사용자 관련 요청 DTO 패키지입니다.
   │  │     │     │  ├─ UserProfileImageUpdateRequest.java      # 프로필 이미지 수정 요청 DTO입니다.
   │  │     │     │  └─ UserRequest.java                        # 사용자 정보 관련 요청 DTO입니다.
   │  │     │     └─ response/                                 # 사용자 관련 응답 DTO 패키지입니다.
   │  │     │        └─ UserProfileResponse.java                # 사용자 프로필 정보 응답 DTO입니다.
   │  │     ├─ entity/                                         # 데이터베이스 테이블과 1:1로 매핑되는 JPA 엔터티 클래스를 모아놓은 패키지입니다.
   │  │     │  ├─ auth/User.java                                # 사용자 계정 정보를 나타내는 엔터티입니다.
   │  │     │  ├─ chat/                                         # 채팅 시스템을 구성하는 엔터티(채팅방, 메시지, 참여자, 읽음 상태) 패키지입니다.
   │  │     │  │  ├─ ChatMessage.java                        # 채팅 메시지 엔터티입니다.
   │  │     │  │  ├─ ChatMessageType.java                    # 채팅 메시지 타입 Enum입니다.
   │  │     │  │  ├─ ChatParticipant.java                    # 채팅방 참여자 엔터티입니다.
   │  │     │  │  ├─ ChatRead.java                           # 메시지 읽음 상태 엔터티입니다.
   │  │     │  │  ├─ ChatRoom.java                           # 채팅방 엔터티입니다.
   │  │     │  │  └─ ChatRoomType.java                       # 채팅방 타입 Enum입니다.
   │  │     │  ├─ community/                                    # 커뮤니티 기능(게시글, 댓글, 좋아요, 신고 등)을 구성하는 엔터티 패키지입니다.
   │  │     │  │  ├─ Attachment.java                         # 첨부파일 엔터티입니다.
   │  │     │  │  ├─ Block.java                              # 차단 정보 엔터티입니다.
   │  │     │  │  ├─ BlockType.java                          # 차단 대상 타입 Enum입니다.
   │  │     │  │  ├─ Comment.java                            # 댓글 엔터티입니다.
   │  │     │  │  ├─ Like.java                               # 좋아요 엔터티입니다.
   │  │     │  │  ├─ Notice.java                             # 공지사항 엔터티입니다.
   │  │     │  │  ├─ Post.java                               # 게시글 엔터티입니다.
   │  │     │  │  ├─ PostCategory.java                       # 게시글 카테고리 Enum입니다.
   │  │     │  │  ├─ PostFavorite.java                       # 게시글 즐겨찾기 엔터티입니다.
   │  │     │  │  ├─ Reply.java                              # 대댓글 엔터티입니다.
   │  │     │  │  ├─ Report.java                             # 신고 정보 엔터티입니다.
   │  │     │  │  ├─ ReportStatus.java                       # 신고 처리 상태 Enum입니다.
   │  │     │  │  ├─ SidebarStudy.java                       # 사이드바 스터디 엔터티입니다.
   │  │     │  │  ├─ StudyApplication.java                   # 스터디 참여 신청 엔터티입니다.
   │  │     │  │  ├─ StudyApplicationStatus.java             # 스터디 참여 신청 상태 Enum입니다.
   │  │     │  │  └─ StudyParticipant.java                   # 스터디 참여자 엔터티입니다.
   │  │     │  ├─ dashboard/                                  # 대시보드 기능(시험 일정, 목표, 할 일 등)을 구성하는 엔터티 패키지입니다.
   │  │     │  │  ├─ ExamSchedule.java                       # 시험 일정 엔터티입니다.
   │  │     │  │  ├─ Goal.java                               # 학습 목표 엔터티입니다.
   │  │     │  │  ├─ PriorityLevel.java                      # 할 일 우선순위 Enum입니다.
   │  │     │  │  ├─ StudyLog.java                           # 학습 로그 엔터티입니다.
   │  │     │  │  ├─ StudySession.java                       # 학습 세션 엔터티입니다.
   │  │     │  │  ├─ StudyTime.java                          # 학습 시간 엔터티입니다.
   │  │     │  │  └─ Todo.java                               # 할 일(Todo) 엔터티입니다.
   │  │     │  ├─ friend/                                       # 친구 관계(친구, 요청, 차단, 신고)를 구성하는 엔터티 패키지입니다.
   │  │     │  │  ├─ Friend.java                             # 친구 관계 엔터티입니다.
   │  │     │  │  ├─ FriendBlock.java                        # 친구 차단 엔터티입니다.
   │  │     │  │  ├─ FriendReport.java                       # 친구 신고 엔터티입니다.
   │  │     │  │  ├─ FriendReportStatus.java                 # 친구 신고 상태 Enum입니다.
   │  │     │  │  ├─ FriendRequest.java                      # 친구 요청 엔터티입니다.
   │  │     │  │  └─ FriendRequestStatus.java                # 친구 요청 상태 Enum입니다.
   │  │     │  ├─ plan/StudyPlan.java                           # 사용자가 생성한 학습 계획을 나타내는 엔터티입니다.
   │  │     │  └─ study/team/                                   # 팀 학습 기능(스터디 방, 문제, 지문 등)을 구성하는 엔터티 패키지입니다.
   │  │     │     ├─ FocusRoom.java                          # 집중 시간 경쟁방 엔터티입니다.
   │  │     │     ├─ Passage.java                            # 국어 지문 엔터티입니다.
   │  │     │     ├─ Problem.java                            # 문제 엔터티입니다.
   │  │     │     ├─ QuizRoom.java                           # 퀴즈 풀이방 엔터티입니다.
   │  │     │     ├─ RoomType.java                           # 팀 학습방 타입 Enum입니다.
   │  │     │     ├─ StudyRoom.java                          # 팀 학습방 추상 엔터티입니다.
   │  │     │     ├─ StudyRoomParticipant.java               # 팀 학습방 참여자 엔터티입니다.
   │  │     │     └─ Unit.java                               # 문제 단원 엔터티입니다.
   │  │     ├─ global/                                         # 애플리케이션 전반에 걸쳐 사용되는 공통 코드(예외 처리, 응답 형식 등)를 모아놓은 패키지입니다.
   │  │     │  ├─ exception/                                    # 비즈니스 로직 중 발생하는 예외를 처리하기 위한 사용자 정의 예외 클래스와 전역 예외 핸들러를 포함합니다.
   │  │     │  │  ├─ BadRequestException.java                # 400 Bad Request 예외 클래스입니다.
   │  │     │  │  ├─ ConflictException.java                  # 409 Conflict 예외 클래스입니다.
   │  │     │  │  ├─ CustomException.java                    # 모든 사용자 정의 예외의 부모 클래스입니다.
   │  │     │  │  ├─ ErrorCode.java                          # 전역 에러 코드를 정의하는 Enum입니다.
   │  │     │  │  ├─ ForbiddenException.java                 # 403 Forbidden 예외 클래스입니다.
   │  │     │  │  ├─ GlobalExceptionHandler.java             # 전역 예외를 처리하는 핸들러입니다.
   │  │     │  │  ├─ NotFoundException.java                  # 404 Not Found 예외 클래스입니다.
   │  │     │  │  └─ UnauthorizedException.java              # 401 Unauthorized 예외 클래스입니다.
   │  │     │  ├─ response/                                     # 모든 API 응답을 일관된 형식으로 감싸기 위한 공통 응답 래퍼 클래스를 포함합니다.
   │  │     │  │  ├─ ApiResponse.java                        # 성공 응답을 위한 제네릭 래퍼 클래스입니다.
   │  │     │  │  ├─ ErrorResponse.java                      # 실패 응답을 위한 에러 DTO입니다.
   │  │     │  │  └─ ResponseMessage.java                    # 간단한 메시지 응답 DTO입니다.
   │  │     │  └─ util/                                         # 날짜, 파일, 유효성 검사 등 범용적으로 사용되는 유틸리티 클래스를 포함합니다.
   │  │     │     ├─ DateTimeUtil.java                       # 날짜/시간 관련 유틸리티 클래스입니다.
   │  │     │     ├─ FileUtil.java                           # 파일 처리 관련 유틸리티 클래스입니다.
   │  │     │     └─ ValidationUtil.java                     # 유효성 검사 유틸리티 클래스입니다.
   │  │     ├─ handler/                                        # 저수준의 통신 프로토콜을 직접 다루는 핸들러 클래스 패키지입니다.
   │  │     │  └─ ChatWebSocketHandler.java                     # WebSocket 연결 및 메시지 수신을 직접 처리하는 핸들러입니다. (STOMP와는 다른 방식)
   │  │     ├─ repository/                                     # 데이터베이스에 접근하기 위한 Spring Data JPA 리포지토리 인터페이스를 모아놓은 패키지입니다.
   │  │     │  ├─ auth/UserRepository.java                      # User 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  ├─ chat/                                         # 채팅 관련 엔터티(ChatMessage, ChatRoom 등)의 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ ChatMessageRepository.java              # ChatMessage 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ ChatParticipantRepository.java          # ChatParticipant 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ ChatReadRepository.java                 # ChatRead 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  └─ ChatRoomRepository.java                 # ChatRoom 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  ├─ community/                                    # 커뮤니티 관련 엔터티(Post, Comment 등)의 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ attachment/AttachmentRepository.java    # Attachment 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ block/BlockRepository.java              # Block 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ comment/                                # 댓글/대댓글 관련 리포지토리 패키지입니다.
   │  │     │  │  │  ├─ CommentRepository.java              # Comment 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  │  └─ ReplyRepository.java                # Reply 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ like/LikeRepository.java                # Like 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ notice/NoticeRepository.java            # Notice 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ post/                                   # 게시글 관련 리포지토리 패키지입니다.
   │  │     │  │  │  ├─ PostFavoriteRepository.java         # PostFavorite 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  │  └─ PostRepository.java                 # Post 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ report/ReportRepository.java            # Report 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  └─ study/                                  # 커뮤니티 스터디 관련 리포지토리 패키지입니다.
   │  │     │  │     ├─ SidebarStudyRepository.java         # SidebarStudy 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │     ├─ StudyApplicationRepository.java     # StudyApplication 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │     └─ StudyParticipantRepository.java     # StudyParticipant 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  ├─ dashboard/                                    # 대시보드 관련 엔터티(Todo, ExamSchedule 등)의 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ ExamScheduleRepository.java             # ExamSchedule 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ GoalRepository.java                     # Goal 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ StudyLogRepository.java                 # StudyLog 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ StudySessionRepository.java             # StudySession 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ StudyTimeRepository.java                # StudyTime 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  └─ TodoRepository.java                     # Todo 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  ├─ friend/                                       # 친구 관련 엔터티(Friend, FriendRequest 등)의 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ FriendBlockRepository.java              # FriendBlock 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ FriendReportRepository.java             # FriendReport 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  ├─ FriendRepository.java                   # Friend 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  │  └─ FriendRequestRepository.java            # FriendRequest 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  ├─ plan/StudyPlanRepository.java                 # StudyPlan 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │  └─ study/                                        # 학습 관련 엔터티(StudyRoom, Problem 등)의 데이터베이스 작업을 처리합니다.
   │  │     │     ├─ FocusRoomRepository.java                # FocusRoom 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │     ├─ PassageRepository.java                  # Passage 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │     ├─ ProblemRepository.java                  # Problem 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │     ├─ QuizRoomRepository.java                 # QuizRoom 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │     ├─ StudyRoomParticipantRepository.java     # StudyRoomParticipant 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     │     └─ StudyRoomRepository.java                # StudyRoom 엔터티에 대한 데이터베이스 작업을 처리합니다.
   │  │     ├─ service/                                        # 비즈니스 로직을 구현하는 서비스 클래스를 모아놓은 계층입니다.
   │  │     │  ├─ auth/                                         # 인증 및 세션 관련 비즈니스 로직을 처리합니다.
   │  │     │  │  ├─ AuthService.java                        # 회원가입, 로그인, 탈퇴 등 인증 관련 핵심 로직을 처리합니다.
   │  │     │  │  └─ SessionService.java                     # 세션에서 현재 사용자 정보를 가져오는 서비스를 제공합니다.
   │  │     │  ├─ community/                                    # 커뮤니티 기능의 핵심 비즈니스 로직을 처리합니다.
   │  │     │  │  ├─ attachment/AttachmentService.java       # 게시글 첨부파일의 업로드, 다운로드, 삭제 로직을 처리합니다.
   │  │     │  │  ├─ block/BlockService.java                 # 게시글, 댓글, 사용자 차단 및 해제 로직을 처리합니다.
   │  │     │  │  ├─ chat/                                   # 채팅 관련 비즈니스 로직을 처리합니다.
   │  │     │  │  │  ├─ ChatAttachmentService.java          # 채팅방의 파일 업로드, 다운로드, 미리보기 로직을 처리합니다.
   │  │     │  │  │  ├─ ChatMessageService.java             # 채팅 메시지 저장, 조회 및 마지막 메시지 업데이트 로직을 처리합니다.
   │  │     │  │  │  ├─ ChatReadService.java                # 메시지 읽음 상태를 처리하고, 안 읽은 사용자 수를 계산합니다.
   │  │     │  │  │  ├─ ChatRoomService.java                # 채팅방 생성, 삭제, 조회 및 참여자 관리 로직을 처리합니다.
   │  │     │  │  │  ├─ DirectChatService.java              # 1:1 채팅방 생성 및 조회 로직을 처리합니다.
   │  │     │  │  │  ├─ FileUploadService.java              # 채팅방 대표 이미지 업로드 및 삭제 로직을 처리합니다.
   │  │     │  │  │  └─ WebSocketChatService.java           # WebSocket을 통해 수신된 채팅 메시지를 저장하고 응답을 생성합니다.
   │  │     │  │  ├─ comment/CommentService.java             # 댓글 및 대댓글의 생성, 수정, 삭제, 조회 로직을 처리합니다.
   │  │     │  │  ├─ friend/FriendService.java               # 친구 요청, 수락, 거절, 삭제, 차단, 검색 등 친구 관계 로직을 처리합니다.
   │  │     │  │  ├─ like/LikeService.java                   # 게시글, 댓글, 대댓글의 좋아요 토글, 수 조회, 여부 확인 로직을 처리합니다.
   │  │     │  │  ├─ notice/NoticeService.java               # 주요 및 전체 공지사항 조회 로직을 처리합니다.
   │  │     │  │  ├─ post/PostService.java                   # 게시글 생성, 수정, 삭제, 조회, 검색, 즐겨찾기 등 게시판 핵심 로직을 처리합니다.
   │  │     │  │  └─ report/ReportService.java               # 게시글, 댓글, 사용자 신고 로직을 처리합니다.
   │  │     │  ├─ dashboard/                                    # 대시보드 데이터 집계 및 조회를 위한 비즈니스 로직을 처리합니다.
   │  │     │  │  ├─ DashboardService.java                   # 캘린더, 할 일, 시험 일정, 통계 등 대시보드 전반의 데이터를 조회하고 가공합니다.
   │  │     │  │  ├─ ExamScheduleService.java                # 시험 일정 생성, 조회, D-Day 계산 로직을 처리합니다.
   │  │     │  │  └─ GPTReflectionService.java               # 학습 데이터를 기반으로 AI 회고를 생성하는 로직을 처리합니다.
   │  │     │  ├─ livekit/LivekitService.java                   # LiveKit 서버와 통신하여 JWT 토큰을 생성하는 등 연동 로직을 처리합니다.
   │  │     │  ├─ study/                                        # 개인 및 팀 학습 관련 비즈니스 로직을 처리합니다.
   │  │     │  │  ├─ personal/StudySessionService.java       # 개인 학습 세션 기록을 저장하는 로직을 처리합니다.
   │  │     │  │  └─ team/                                   # 팀 학습 관련 비즈니스 로직을 처리합니다.
   │  │     │  │     ├─ chat/StudyChatService.java          # 팀 학습방(퀴즈, 집중)의 실시간 채팅 메시지를 처리하고 Redis에 저장합니다.
   │  │     │  │     ├─ livekit/LivekitBridgeService.java   # 팀 학습방과 LiveKit 룸 간의 멤버십 확인 및 명단 조회 로직을 처리합니다.
   │  │     │  │     ├─ rest/                               # 팀 학습 관련 REST API의 비즈니스 로직을 처리합니다.
   │  │     │  │     │  ├─ QuizRoomRestService.java        # 퀴즈방에서 사용할 문제를 조건에 따라 랜덤으로 조회합니다.
   │  │     │  │     │  └─ TeamStudyRestService.java       # 팀 학습방 생성, 입장, 삭제, 조회 및 커뮤니티 연동 로직을 처리합니다.
   │  │     │  │     └─ socket/                             # 팀 학습 관련 WebSocket의 비즈니스 로직을 처리합니다.
   │  │     │  │        ├─ FocusRoomSocketService.java     # 집중 시간 경쟁방의 실시간 상태(집중 시간, 목표 달성, 순위)를 관리합니다.
   │  │     │  │        └─ QuizRoomSocketService.java      # 퀴즈 풀이방의 실시간 상태(준비, 문제 시작, 손들기, 투표, 정답 처리)를 관리합니다.
   │  │     │  ├─ user/UserService.java                       # 사용자 정보 조회, 수정 등 사용자 관련 비즈니스 로직을 처리합니다.
   │  │     │  └─ util/                                         # 파일 저장, 메일 발송 등 유틸리티 성격의 비즈니스 로직을 처리합니다.
   │  │     │     ├─ FileService.java                        # 프로필 이미지 및 학습 자료 등 파일 저장/삭제/조회 로직을 처리합니다.
   │  │     │     └─ MailService.java                        # 인증 코드 이메일 발송 로직을 처리합니다.
   │  │     └─ util/                                           # 특정 도메인에 종속되지 않는 범용 유틸리티 클래스 패키지입니다.
   │  │        ├─ LivekitRoomNamer.java                         # LiveKit의 방 이름을 일관된 규칙으로 생성하고 파싱하는 유틸리티입니다.
   │  │        ├─ RedisKeys.java                                # Redis에 사용될 키를 중앙에서 관리하고 생성하는 유틸리티입니다.
   │  │        ├─ RedisService.java                             # Redis 관련 공통 작업을 간편하게 수행할 수 있도록 돕는 헬퍼 서비스입니다.
   │  │        └─ SessionUtil.java                              # HTTP 및 WebSocket 세션에서 사용자 ID를 안전하게 추출하는 유틸리티입니다.
   │  └─ resources/                                                 # 설정 파일, 정적 리소스, 템플릿 등 프로덕션 코드 외의 리소스를 담는 디렉터리입니다.
   │     └─ application.yml                                        # Spring Boot 애플리케이션의 주 설정 파일입니다. (DB, 서버 포트, 로깅, 외부 서비스 연동 정보 등)
   └─ test/                                                       # 테스트 코드 소스 디렉터리입니다.
      └─ java/com/hamcam/back/
         └─ BackApplicationTests.java                           # Spring Boot 애플리케이션의 컨텍스트가 정상적으로 로드되는지 확인하는 기본 테스트입니다.
```
