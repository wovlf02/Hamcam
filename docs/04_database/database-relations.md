# 데이터베이스 관계

**관련 문서**: [엔티티 스키마](./entity-schema.md) | [백엔드 구조](../03_architecture/backend-structure.md)

---

## 1. ER 다이어그램 개요

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CORE ENTITIES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           ┌──────────────┐                                  │
│                           │    User      │                                  │
│                           │   (users)    │                                  │
│                           └──────┬───────┘                                  │
│                                  │                                          │
│        ┌─────────────────────────┼─────────────────────────┐                │
│        │           │             │              │          │                │
│        ▼           ▼             ▼              ▼          ▼                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Student  │ │   Post   │ │  Friend  │ │ ChatRoom │ │StudyRoom │          │
│  └────┬─────┘ └────┬─────┘ └──────────┘ └────┬─────┘ └────┬─────┘          │
│       │            │                          │            │                │
│       ▼            ▼                          ▼            ▼                │
│  ┌──────────┐ ┌──────────┐              ┌──────────┐ ┌──────────┐          │
│  │MathProblem││ Comment  │              │ChatMessage││Participant│          │
│  │  Attempt  ││          │              │          ││          │            │
│  └──────────┘ └──────────┘              └──────────┘ └──────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 도메인별 관계

### 2.1 사용자 및 인증

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ ...         │
└──────┬──────┘
       │
       │ 1:N (ElementCollection)
       ▼
┌─────────────┐
│user_subjects│
├─────────────┤
│ user_id(FK) │
│ subject     │
└─────────────┘
```

**관계 설명**:
- User는 여러 개의 관심 과목(subjects)을 가질 수 있음
- `@ElementCollection`으로 별도 테이블에 저장

---

### 2.2 수학 평가

```
┌─────────────┐         ┌─────────────┐
│    User     │         │ MathProblem │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │ 1:1                   │ 1:N
       ▼                       │
┌─────────────┐                │
│   Student   │────────────────┼──────────────────┐
└──────┬──────┘                │                  │
       │                       │                  │
       │ 1:N                   │                  │
       ▼                       ▼                  ▼
┌─────────────────────┐  ┌─────────────┐  ┌──────────────────┐
│ MathProblemAttempt  │  │StudentWrong │  │                  │
├─────────────────────┤  │   Answer    │  │ N:1 MathProblem  │
│ student_id (FK)     │  └──────┬──────┘  └──────────────────┘
│ math_problem_id(FK) │         │
└─────────────────────┘         │ 1:N
                                ▼
                         ┌─────────────┐
                         │ReviewAttempt│
                         └─────────────┘
```

**관계 설명**:
- User ↔ Student: 1:1 (학습 확장 정보)
- Student → MathProblemAttempt: 1:N (문제 시도 기록)
- Student → StudentWrongAnswer: 1:N (오답 기록)
- MathProblem → MathProblemAttempt: 1:N
- MathProblem → StudentWrongAnswer: 1:N
- StudentWrongAnswer → ReviewAttempt: 1:N (복습 시도)

---

### 2.3 대시보드

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├───────────────┬────────────────┬────────────────┬────────────────┐
       │ 1:N           │ 1:N            │ 1:N            │ 1:N            │
       ▼               ▼                ▼                ▼                ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Todo   │    │ExamSched │    │   Goal   │    │StudyTime │    │StudyLog  │
│          │    │   ule    │    │          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**관계 설명**:
- User는 여러 Todo를 가질 수 있음
- User는 여러 시험 일정(ExamSchedule)을 가질 수 있음
- User는 여러 목표(Goal)를 가질 수 있음
- User는 여러 학습 시간 기록(StudyTime)을 가질 수 있음
- User는 여러 학습 로그(StudyLog)를 가질 수 있음

---

### 2.4 커뮤니티

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ 1:N (작성자)
       ▼
┌─────────────┐
│    Post     │
├─────────────┤
│ user_id(FK) │
└──────┬──────┘
       │
       ├───────────────┬────────────────┬────────────────┬────────────────┐
       │ 1:N           │ 1:N            │ 1:N            │ 1:N            │
       ▼               ▼                ▼                ▼                ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Comment  │    │Attachment│    │   Like   │    │  Report  │    │PostFavor │
│          │    │          │    │          │    │          │    │   ite    │
└────┬─────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │
     │ 1:N
     ▼
┌──────────┐
│  Reply   │
└──────────┘
```

**관계 설명**:
- User → Post: 1:N (게시글 작성)
- Post → Comment: 1:N
- Comment → Reply: 1:N (대댓글)
- Post → Attachment: 1:N (첨부파일)
- Post → Like: 1:N
- Post → Report: 1:N
- Post → PostFavorite: 1:N

---

### 2.5 채팅

```
┌─────────────┐
│  ChatRoom   │
├─────────────┤
│ id (PK)     │
│ room_type   │
└──────┬──────┘
       │
       ├───────────────┬────────────────┐
       │ 1:N           │ 1:N            │
       ▼               ▼                │
┌─────────────┐  ┌─────────────┐        │
│ChatParticip │  │ ChatMessage │        │
│    ant      │  └──────┬──────┘        │
└──────┬──────┘         │               │
       │                │ 1:N           │
       │ N:1            ▼               │
       ▼         ┌─────────────┐        │
┌─────────────┐  │  ChatRead   │        │
│    User     │  └─────────────┘        │
└─────────────┘                         │
                                        │
```

**관계 설명**:
- ChatRoom → ChatParticipant: 1:N
- ChatRoom → ChatMessage: 1:N
- ChatMessage → ChatRead: 1:N (읽음 상태)
- ChatParticipant → User: N:1
- ChatMessage → User (sender): N:1

---

### 2.6 친구

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├───────────────┬────────────────┬────────────────┐
       │               │                │                │
       ▼               ▼                ▼                ▼
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Friend  │    │FriendReq │    │FriendBloc│    │FriendRepo│
│ (양방향) │    │   uest   │    │    k     │    │    rt    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**관계 설명**:
- User ↔ User (Friend): N:N (친구 관계)
- User → FriendRequest: 1:N (친구 요청 발신)
- User ← FriendRequest: 1:N (친구 요청 수신)
- User → FriendBlock: 1:N (차단)
- User → FriendReport: 1:N (신고)

---

### 2.7 팀 스터디

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ (host)
       ▼
┌─────────────┐
│  StudyRoom  │
├─────────────┤
│ host_id(FK) │
│ room_type   │
└──────┬──────┘
       │
       ├───────────────┬────────────────┬────────────────┐
       │ 1:N           │ 1:1            │ 1:1            │
       ▼               ▼                ▼                │
┌─────────────┐  ┌──────────┐    ┌──────────┐           │
│StudyRoom    │  │ QuizRoom │    │FocusRoom │           │
│ Participant │  └──────────┘    └──────────┘           │
└──────┬──────┘                                         │
       │ N:1                                            │
       ▼                                                │
┌─────────────┐                                         │
│    User     │◀────────────────────────────────────────┘
└─────────────┘
```

**관계 설명**:
- User → StudyRoom (host): 1:N (방장)
- StudyRoom → StudyRoomParticipant: 1:N
- StudyRoomParticipant → User: N:1
- StudyRoom → QuizRoom: 1:1 (확장)
- StudyRoom → FocusRoom: 1:1 (확장)

---

## 3. 핵심 관계 요약

| 관계 | 타입 | 설명 |
|------|------|------|
| User → Student | 1:1 | 학습 확장 정보 |
| User → Todo | 1:N | Todo 목록 |
| User → Post | 1:N | 게시글 작성 |
| User → Friend | N:N | 친구 관계 |
| User → ChatParticipant | 1:N | 채팅 참여 |
| User → StudyRoomParticipant | 1:N | 스터디 참여 |
| Student → MathProblemAttempt | 1:N | 문제 시도 |
| Student → StudentWrongAnswer | 1:N | 오답 기록 |
| MathProblem → MathProblemAttempt | 1:N | 시도 기록 |
| StudentWrongAnswer → ReviewAttempt | 1:N | 복습 시도 |
| Post → Comment | 1:N | 댓글 |
| Comment → Reply | 1:N | 대댓글 |
| ChatRoom → ChatMessage | 1:N | 메시지 |
| ChatMessage → ChatRead | 1:N | 읽음 상태 |
| StudyRoom → StudyRoomParticipant | 1:N | 참여자 |

---

## 4. JPA 연관관계 매핑

### 4.1 User ↔ Student (1:1)

```java
// Student.java
@Entity
public class Student {
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

### 4.2 MathProblem → MathProblemAttempt (1:N)

```java
// MathProblem.java
@OneToMany(mappedBy = "mathProblem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<MathProblemAttempt> attempts;

// MathProblemAttempt.java
@ManyToOne
@JoinColumn(name = "math_problem_id")
private MathProblem mathProblem;
```

### 4.3 Post → Comment (1:N)

```java
// Post.java
@OneToMany(mappedBy = "post")
private List<Comment> comments;

// Comment.java
@ManyToOne
@JoinColumn(name = "post_id")
private Post post;
```

### 4.4 Comment → Reply (1:N)

```java
// Comment.java
@OneToMany(mappedBy = "comment")
private List<Reply> replies;

// Reply.java
@ManyToOne
@JoinColumn(name = "comment_id")
private Comment comment;
```

---

## 5. 인덱스 권장사항

| 테이블 | 인덱스 | 컬럼 | 이유 |
|--------|--------|------|------|
| users | idx_users_username | username | 로그인 조회 |
| users | idx_users_email | email | 이메일 중복 검사 |
| posts | idx_posts_user_id | user_id | 사용자별 게시글 조회 |
| posts | idx_posts_category | category | 카테고리별 조회 |
| comments | idx_comments_post_id | post_id | 게시글별 댓글 조회 |
| math_problems | idx_math_difficulty | difficulty_grade | 난이도별 조회 |
| math_problems | idx_math_subject | subject | 과목별 조회 |
| todos | idx_todos_user_date | user_id, todo_date | 날짜별 Todo 조회 |
| study_times | idx_study_user_date | user_id, study_date | 날짜별 학습 시간 조회 |
