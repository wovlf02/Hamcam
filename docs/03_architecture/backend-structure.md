# 백엔드 구조

**관련 문서**: [프론트엔드 구조](./frontend-structure.md) | [시스템 설계](./system-design.md) | [API 명세](../05_api/README.md)

---

## 1. 프로젝트 구조

```
back/
├── build.gradle                 # Gradle 빌드 설정
├── settings.gradle              # 프로젝트 설정
├── gradlew                      # Gradle Wrapper (Unix)
├── gradlew.bat                  # Gradle Wrapper (Windows)
└── src/
    ├── main/
    │   ├── java/com/hamcam/back/
    │   │   ├── BackApplication.java     # 애플리케이션 진입점
    │   │   ├── config/                  # 설정 클래스
    │   │   ├── controller/              # REST 컨트롤러
    │   │   ├── dto/                     # 데이터 전송 객체
    │   │   ├── entity/                  # JPA 엔티티
    │   │   ├── global/                  # 글로벌 설정
    │   │   ├── handler/                 # 핸들러
    │   │   ├── repository/              # 데이터 액세스
    │   │   ├── service/                 # 비즈니스 로직
    │   │   └── util/                    # 유틸리티
    │   └── resources/
    │       └── application.properties   # 애플리케이션 설정
    └── test/                            # 테스트 코드
```

---

## 2. Config 패키지

### 2.1 구조

```
config/
├── WebClientConfig.java         # WebClient 설정 (Gemini API)
├── auth/
│   └── EmailConfig.java         # 이메일 설정 (Naver SMTP)
├── socket/
│   └── WebSocketConfig.java     # WebSocket 설정
└── web/
    ├── JacksonConfig.java       # Jackson 직렬화 설정
    ├── RedisConfig.java         # Redis 설정
    └── WebConfig.java           # CORS, 정적 자원 설정
```

### 2.2 주요 설정

#### WebConfig.java
- **CORS 설정**: localhost:3000, 127.0.0.1:3000 허용
- **정적 자원 핸들러**: /uploads/** 경로 매핑
- **경로 매칭**: 후행 슬래시 비활성화

#### WebSocketConfig.java
- **WebSocket 핸들러**: ChatWebSocketHandler
- **엔드포인트**: /ws/chat
- **허용 오리진**: 모든 패턴 (개발 환경)

#### RedisConfig.java
- **세션 저장소**: spring-session-data-redis
- **연결 설정**: 호스트, 포트 구성

---

## 3. Controller 패키지

### 3.1 구조

```
controller/
├── AIFeedbackController.java       # AI 피드백 API
├── ImageController.java            # 이미지 API
├── MathProblemController.java      # 수학 문제 API
├── admin/                          # 관리자 API
├── auth/
│   └── AuthController.java         # 인증 API
├── community/
│   ├── attachment/                 # 첨부파일 API
│   ├── block/                      # 차단 API
│   ├── chat/                       # 채팅 API
│   ├── comment/                    # 댓글 API
│   ├── friend/                     # 친구 API
│   ├── like/                       # 좋아요 API
│   ├── notice/                     # 공지사항 API
│   ├── post/                       # 게시판 API
│   └── report/                     # 신고 API
├── dashboard/
│   └── DashboardController.java    # 대시보드 API
├── evaluation/                     # 평가 API
├── file/                           # 파일 API
├── plan/                           # 학습 계획 API
├── study/
│   └── team/
│       ├── QuizRoomRestController.java    # 퀴즈방 API
│       └── TeamStudyRestController.java   # 팀스터디 API
└── user/                           # 사용자 API
```

### 3.2 주요 컨트롤러

| 컨트롤러 | 엔드포인트 | 기능 |
|----------|------------|------|
| AuthController | /api/auth | 로그인, 회원가입, 탈퇴 |
| DashboardController | /api/dashboard | Todo, D-Day, 통계, 목표 |
| MathProblemController | /api/math | 수학 문제 조회/평가 |
| TeamStudyRestController | /api/study/team | 스터디방 관리 |
| PostController | /api/community/post | 게시판 CRUD |

---

## 4. DTO 패키지

### 4.1 구조

```
dto/
├── admin/              # 관리자 DTO
├── auth/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   └── response/
│       └── LoginResponse.java
├── common/
│   └── MessageResponse.java
├── community/          # 커뮤니티 DTO
├── dashboard/
│   ├── calendar/       # 캘린더 관련
│   ├── exam/           # 시험 일정 관련
│   ├── goal/           # 목표 관련
│   ├── reflection/     # 회고 관련
│   ├── stats/          # 통계 관련
│   ├── time/           # 학습 시간 관련
│   └── todo/           # Todo 관련
├── evaluation/         # 평가 DTO
├── file/               # 파일 DTO
├── livekit/            # LiveKit DTO
├── plan/               # 학습 계획 DTO
├── study/              # 스터디 DTO
└── user/               # 사용자 DTO
```

### 4.2 네이밍 컨벤션

- **Request**: 요청 DTO (예: LoginRequest)
- **Response**: 응답 DTO (예: LoginResponse)
- **Dto**: 일반 데이터 전송 (예: CalendarEventDto)

---

## 5. Entity 패키지

### 5.1 구조

```
entity/
├── MathProblem.java            # 수학 문제
├── MathProblemAttempt.java     # 문제 시도 기록
├── ReviewAttempt.java          # 복습 시도
├── Student.java                # 학생 정보
├── StudentWrongAnswer.java     # 오답 기록
├── auth/
│   └── User.java               # 사용자
├── chat/
│   ├── ChatMessage.java        # 채팅 메시지
│   ├── ChatMessageType.java    # 메시지 타입 (Enum)
│   ├── ChatParticipant.java    # 채팅 참여자
│   ├── ChatRead.java           # 읽음 상태
│   ├── ChatRoom.java           # 채팅방
│   └── ChatRoomType.java       # 채팅방 타입 (Enum)
├── community/
│   ├── Attachment.java         # 첨부파일
│   ├── Block.java              # 차단
│   ├── BlockType.java          # 차단 타입 (Enum)
│   ├── Comment.java            # 댓글
│   ├── Like.java               # 좋아요
│   ├── Notice.java             # 공지사항
│   ├── Post.java               # 게시글
│   ├── PostCategory.java       # 게시글 카테고리 (Enum)
│   ├── PostFavorite.java       # 즐겨찾기
│   ├── Reply.java              # 대댓글
│   ├── Report.java             # 신고
│   ├── ReportStatus.java       # 신고 상태 (Enum)
│   ├── SidebarStudy.java       # 사이드바 스터디
│   ├── StudyApplication.java   # 스터디 신청
│   ├── StudyApplicationStatus.java  # 신청 상태 (Enum)
│   └── StudyParticipant.java   # 스터디 참여자
├── dashboard/
│   ├── ExamSchedule.java       # 시험 일정
│   ├── Goal.java               # 목표
│   ├── PriorityLevel.java      # 우선순위 (Enum)
│   ├── StudyLog.java           # 학습 로그
│   ├── StudySession.java       # 학습 세션
│   ├── StudyTime.java          # 학습 시간
│   └── Todo.java               # Todo
├── evaluation/                 # 평가 엔티티
├── friend/
│   ├── Friend.java             # 친구 관계
│   ├── FriendBlock.java        # 친구 차단
│   ├── FriendReport.java       # 친구 신고
│   ├── FriendReportStatus.java # 신고 상태 (Enum)
│   ├── FriendRequest.java      # 친구 요청
│   └── FriendRequestStatus.java # 요청 상태 (Enum)
├── plan/                       # 학습 계획 엔티티
└── study/
    └── team/
        ├── FocusRoom.java      # 집중 경쟁방
        ├── Passage.java        # 지문
        ├── Problem.java        # 문제
        ├── QuizRoom.java       # 퀴즈 풀이방
        ├── RoomType.java       # 방 타입 (Enum)
        ├── StudyRoom.java      # 스터디방
        ├── StudyRoomParticipant.java  # 참여자
        └── Unit.java           # 단원
```

### 5.2 핵심 엔티티

#### User.java
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;      // 고유 아이디
    private String name;          // 이름
    private String password;      // 비밀번호
    private String nickname;      // 닉네임
    private String email;         // 이메일 (고유)
    private String profileImageUrl;
    private Integer grade;        // 학년
    private String studyHabit;    // 학습 습관
    private int point;            // 누적 포인트
    @ElementCollection
    private List<String> subjects;  // 관심 과목
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### MathProblem.java
```java
@Entity
@Table(name = "math_problems")
public class MathProblem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String examMonthYear;     // 시험 년월 (2025_06)
    private Integer problemNumber;    // 문제 번호
    private String subject;           // 과목
    private String subjectDetail;     // 상세 분야
    private Integer difficultyGrade;  // 난이도 (1-5)
    private String answer;            // 정답
    @Enumerated(EnumType.STRING)
    private ProblemType type;         // 객관식/단답형
    private String imagePath;         // 이미지 경로
    private String explanation;       // 해설
    private Integer timeLimit;        // 제한시간 (초)
    private Integer points;           // 배점
    private Boolean isActive;         // 활성화 여부
}
```

---

## 6. Repository 패키지

### 6.1 구조

```
repository/
├── MathProblemAttemptRepository.java
├── MathProblemRepository.java
├── StudentRepository.java
├── StudentWrongAnswerRepository.java
├── auth/
├── chat/
├── community/
├── dashboard/
├── evaluation/
├── friend/
├── plan/
└── study/
```

### 6.2 주요 쿼리 메서드

#### MathProblemRepository
```java
public interface MathProblemRepository extends JpaRepository<MathProblem, Long> {
    List<MathProblem> findByIsActiveTrueOrderByCreatedAtDesc();
    List<MathProblem> findBySubject(String subject);
    List<MathProblem> findByDifficultyGrade(Integer difficultyGrade);
    List<MathProblem> findByExamMonthYear(String examMonthYear);
    
    @Query(value = "SELECT * FROM math_problems WHERE difficulty_grade = :grade " +
                   "ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<MathProblem> findRandomProblemsByDifficultyGrade(Integer grade, int count);
    
    @Query("SELECT DISTINCT m.subject FROM MathProblem m")
    List<String> findDistinctSubjects();
}
```

---

## 7. Service 패키지

### 7.1 구조

```
service/
├── AIFeedbackService.java          # AI 피드백
├── MathEvaluationService.java      # 수학 평가
├── MathProblemService.java         # 수학 문제
├── MathStatisticsService.java      # 수학 통계
├── PerformanceAnalysisService.java # 성능 분석
├── auth/
│   └── AuthService.java            # 인증 서비스
├── community/                      # 커뮤니티 서비스
├── dashboard/
│   ├── DashboardService.java       # 대시보드 서비스
│   ├── ExamScheduleService.java    # 시험 일정 서비스
│   └── GPTReflectionService.java   # AI 회고 서비스
├── evaluation/                     # 평가 서비스
├── study/
│   ├── personal/                   # 개인 학습 서비스
│   └── team/                       # 팀 학습 서비스
├── user/                           # 사용자 서비스
└── util/                           # 유틸리티 서비스
```

### 7.2 핵심 서비스

#### AuthService
- 회원가입 (register)
- 로그인 (login) - 세션 생성
- 회원 탈퇴 (withdraw)

#### DashboardService
- Todo CRUD
- 캘린더 이벤트 조회
- 학습 통계 조회
- 목표 관리

#### MathProblemService
- 문제 조회 (과목별, 난이도별)
- 학년별 맞춤 문제 조회
- 랜덤 문제 생성

---

## 8. Global 패키지

### 8.1 구조

```
global/
└── response/
    └── ApiResponse.java    # 표준 API 응답 형식
```

### 8.2 ApiResponse

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> ok() { ... }
    public static <T> ApiResponse<T> ok(T data) { ... }
    public static <T> ApiResponse<T> ok(String message, T data) { ... }
    public static <T> ApiResponse<T> fail(String message) { ... }
}
```

---

## 9. Util 패키지

### 9.1 구조

```
util/
└── SessionUtil.java    # 세션 유틸리티
```

### 9.2 SessionUtil

```java
public class SessionUtil {
    public static Long getUserId(HttpServletRequest request) {
        // 세션에서 userId 추출
    }
}
```

---

## 10. Handler 패키지

### 10.1 구조

```
handler/
└── ChatWebSocketHandler.java   # 채팅 WebSocket 핸들러
```

### 10.2 ChatWebSocketHandler

- WebSocket 연결 관리
- 메시지 수신/발신 처리
- 연결/해제 이벤트 처리

---

## 11. 빌드 설정 (build.gradle)

### 11.1 플러그인

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.4.2'
    id 'io.spring.dependency-management' version '1.1.7'
}
```

### 11.2 Java 버전

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}
```

### 11.3 주요 의존성

| 카테고리 | 의존성 |
|----------|--------|
| Web | spring-boot-starter-web |
| Data | spring-boot-starter-data-jpa |
| Validation | spring-boot-starter-validation |
| WebSocket | spring-boot-starter-websocket |
| Session | spring-session-data-redis |
| JWT | jjwt-api, jjwt-impl, jjwt-jackson |
| Email | spring-boot-starter-mail |
| AI | spring-boot-starter-webflux |
| Util | lombok, commons-lang3 |
| DB | mysql-connector-j |
| Test | spring-boot-starter-test |
