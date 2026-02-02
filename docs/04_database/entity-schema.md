# 엔티티 스키마

**관련 문서**: [데이터베이스 관계](./database-relations.md) | [백엔드 구조](../03_architecture/backend-structure.md)

---

## 1. 인증/사용자 (Auth)

### 1.1 User (users)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 사용자 ID |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 로그인 아이디 |
| name | VARCHAR(50) | NOT NULL | 이름 |
| password | VARCHAR(255) | NOT NULL | 비밀번호 |
| nickname | VARCHAR(100) | NOT NULL | 닉네임 |
| email | VARCHAR(100) | NOT NULL, UNIQUE | 이메일 |
| profile_image_url | VARCHAR(500) | | 프로필 이미지 URL |
| grade | INT | NOT NULL | 학년 |
| study_habit | VARCHAR(50) | NOT NULL | 학습 습관 |
| phone | VARCHAR(15) | | 전화번호 |
| point | INT | NOT NULL, DEFAULT 0 | 누적 포인트 |
| created_at | DATETIME | NOT NULL | 생성일시 |
| updated_at | DATETIME | NOT NULL | 수정일시 |

### 1.2 User Subjects (user_subjects)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| user_id | BIGINT | FK → users | 사용자 ID |
| subject | VARCHAR(255) | NOT NULL | 관심 과목 |

---

## 2. 수학 평가 (Math Evaluation)

### 2.1 MathProblem (math_problems)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 문제 ID |
| exam_month_year | VARCHAR(255) | NOT NULL | 시험 년월 (예: 2025_06) |
| problem_number | INT | NOT NULL | 문제 번호 (1-30) |
| subject | VARCHAR(255) | NOT NULL | 과목 (공통, 미적분, 확률과통계, 기하) |
| subject_detail | VARCHAR(2000) | NOT NULL | 상세 분야 |
| difficulty_grade | INT | NOT NULL | 난이도 (1:최고난도 ~ 5:가장쉬움) |
| answer | VARCHAR(255) | NOT NULL | 정답 |
| type | VARCHAR(50) | NOT NULL | 문제 유형 (MULTIPLE_CHOICE, SHORT_ANSWER) |
| image_path | VARCHAR(255) | | 문제 이미지 경로 |
| explanation | VARCHAR(1000) | | 해설 |
| hint | VARCHAR(500) | | 힌트 |
| time_limit | INT | NOT NULL, DEFAULT 300 | 제한시간 (초) |
| points | INT | NOT NULL, DEFAULT 2 | 배점 |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | 활성화 여부 |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 2.2 Student (students)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 학생 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| math_level | INT | | 수학 레벨 |
| total_problems_solved | INT | DEFAULT 0 | 총 풀이 문제 수 |
| correct_answers | INT | DEFAULT 0 | 정답 수 |

### 2.3 MathProblemAttempt (math_problem_attempts)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 시도 ID |
| student_id | BIGINT | FK → students | 학생 ID |
| math_problem_id | BIGINT | FK → math_problems | 문제 ID |
| student_answer | VARCHAR(255) | | 학생 답안 |
| is_correct | BOOLEAN | | 정답 여부 |
| time_spent | INT | | 소요 시간 (초) |
| attempted_at | DATETIME | | 시도 일시 |

### 2.4 StudentWrongAnswer (student_wrong_answers)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 오답 ID |
| student_id | BIGINT | FK → students | 학생 ID |
| math_problem_id | BIGINT | FK → math_problems | 문제 ID |
| wrong_answer | VARCHAR(255) | | 오답 내용 |
| review_count | INT | DEFAULT 0 | 복습 횟수 |
| is_reviewed | BOOLEAN | DEFAULT FALSE | 복습 완료 여부 |
| created_at | DATETIME | | 생성일시 |

### 2.5 ReviewAttempt (review_attempts)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 복습 시도 ID |
| wrong_answer_id | BIGINT | FK → student_wrong_answers | 오답 ID |
| student_answer | VARCHAR(255) | | 복습 답안 |
| is_correct | BOOLEAN | | 정답 여부 |
| attempted_at | DATETIME | | 시도 일시 |

---

## 3. 대시보드 (Dashboard)

### 3.1 Todo (todos)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | Todo ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| title | VARCHAR(255) | NOT NULL | 제목 |
| description | TEXT | | 설명 |
| todo_date | DATE | NOT NULL | 날짜 |
| is_completed | BOOLEAN | DEFAULT FALSE | 완료 여부 |
| priority | VARCHAR(20) | | 우선순위 (LOW, MEDIUM, HIGH) |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 3.2 ExamSchedule (exam_schedules)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 시험 일정 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| title | VARCHAR(255) | NOT NULL | 시험명 |
| exam_date | DATE | NOT NULL | 시험 날짜 |
| description | TEXT | | 설명 |
| created_at | DATETIME | | 생성일시 |

### 3.3 Goal (goals)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 목표 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| title | VARCHAR(255) | NOT NULL | 목표 제목 |
| description | TEXT | | 목표 설명 |
| target_date | DATE | | 목표 날짜 |
| is_achieved | BOOLEAN | DEFAULT FALSE | 달성 여부 |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 3.4 StudyTime (study_times)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 학습 시간 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| study_date | DATE | NOT NULL | 학습 날짜 |
| subject | VARCHAR(100) | | 과목 |
| duration_minutes | INT | NOT NULL | 학습 시간 (분) |
| created_at | DATETIME | | 생성일시 |

### 3.5 StudySession (study_sessions)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 세션 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| subject | VARCHAR(100) | | 과목 |
| started_at | DATETIME | NOT NULL | 시작 시간 |
| ended_at | DATETIME | | 종료 시간 |
| duration_seconds | INT | | 학습 시간 (초) |

### 3.6 StudyLog (study_logs)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 로그 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| log_date | DATE | NOT NULL | 로그 날짜 |
| content | TEXT | | 로그 내용 |

---

## 4. 커뮤니티 (Community)

### 4.1 Post (posts)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 게시글 ID |
| user_id | BIGINT | FK → users | 작성자 ID |
| title | VARCHAR(255) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| category | VARCHAR(50) | | 카테고리 |
| view_count | INT | DEFAULT 0 | 조회수 |
| like_count | INT | DEFAULT 0 | 좋아요 수 |
| is_deleted | BOOLEAN | DEFAULT FALSE | 삭제 여부 |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 4.2 Comment (comments)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 댓글 ID |
| post_id | BIGINT | FK → posts | 게시글 ID |
| user_id | BIGINT | FK → users | 작성자 ID |
| content | TEXT | NOT NULL | 내용 |
| is_deleted | BOOLEAN | DEFAULT FALSE | 삭제 여부 |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 4.3 Reply (replies)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 대댓글 ID |
| comment_id | BIGINT | FK → comments | 댓글 ID |
| user_id | BIGINT | FK → users | 작성자 ID |
| content | TEXT | NOT NULL | 내용 |
| is_deleted | BOOLEAN | DEFAULT FALSE | 삭제 여부 |
| created_at | DATETIME | | 생성일시 |

### 4.4 Attachment (attachments)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 첨부파일 ID |
| post_id | BIGINT | FK → posts | 게시글 ID |
| file_name | VARCHAR(255) | NOT NULL | 파일명 |
| file_path | VARCHAR(500) | NOT NULL | 파일 경로 |
| file_type | VARCHAR(50) | | 파일 타입 |
| file_size | BIGINT | | 파일 크기 |
| created_at | DATETIME | | 생성일시 |

### 4.5 Like (likes)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 좋아요 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| post_id | BIGINT | FK → posts | 게시글 ID (nullable) |
| comment_id | BIGINT | FK → comments | 댓글 ID (nullable) |
| created_at | DATETIME | | 생성일시 |

### 4.6 PostFavorite (post_favorites)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 즐겨찾기 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| post_id | BIGINT | FK → posts | 게시글 ID |
| created_at | DATETIME | | 생성일시 |

### 4.7 Notice (notices)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 공지 ID |
| user_id | BIGINT | FK → users | 작성자 ID |
| title | VARCHAR(255) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| is_pinned | BOOLEAN | DEFAULT FALSE | 상단 고정 |
| view_count | INT | DEFAULT 0 | 조회수 |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 4.8 Block (blocks)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 차단 ID |
| blocker_id | BIGINT | FK → users | 차단한 사용자 |
| block_type | VARCHAR(20) | NOT NULL | 차단 타입 (USER, POST, COMMENT) |
| blocked_user_id | BIGINT | FK → users | 차단된 사용자 |
| blocked_post_id | BIGINT | FK → posts | 차단된 게시글 |
| blocked_comment_id | BIGINT | FK → comments | 차단된 댓글 |
| created_at | DATETIME | | 생성일시 |

### 4.9 Report (reports)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 신고 ID |
| reporter_id | BIGINT | FK → users | 신고자 |
| reported_user_id | BIGINT | FK → users | 피신고자 |
| reported_post_id | BIGINT | FK → posts | 신고된 게시글 |
| reported_comment_id | BIGINT | FK → comments | 신고된 댓글 |
| reason | TEXT | NOT NULL | 신고 사유 |
| status | VARCHAR(20) | | 처리 상태 (PENDING, RESOLVED, REJECTED) |
| created_at | DATETIME | | 생성일시 |
| processed_at | DATETIME | | 처리일시 |

---

## 5. 채팅 (Chat)

### 5.1 ChatRoom (chat_rooms)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 채팅방 ID |
| name | VARCHAR(100) | | 채팅방 이름 |
| room_type | VARCHAR(20) | NOT NULL | 방 타입 (PRIVATE, GROUP) |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 5.2 ChatParticipant (chat_participants)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 참여자 ID |
| chat_room_id | BIGINT | FK → chat_rooms | 채팅방 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| joined_at | DATETIME | | 참여 일시 |
| left_at | DATETIME | | 퇴장 일시 |

### 5.3 ChatMessage (chat_messages)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 메시지 ID |
| chat_room_id | BIGINT | FK → chat_rooms | 채팅방 ID |
| sender_id | BIGINT | FK → users | 발신자 ID |
| message_type | VARCHAR(20) | NOT NULL | 메시지 타입 (TEXT, IMAGE, FILE) |
| content | TEXT | | 메시지 내용 |
| file_url | VARCHAR(500) | | 파일 URL |
| created_at | DATETIME | | 생성일시 |

### 5.4 ChatRead (chat_reads)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 읽음 ID |
| chat_message_id | BIGINT | FK → chat_messages | 메시지 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| read_at | DATETIME | | 읽은 시간 |

---

## 6. 친구 (Friend)

### 6.1 Friend (friends)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 친구 관계 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| friend_id | BIGINT | FK → users | 친구 ID |
| created_at | DATETIME | | 생성일시 |

### 6.2 FriendRequest (friend_requests)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 요청 ID |
| sender_id | BIGINT | FK → users | 요청자 ID |
| receiver_id | BIGINT | FK → users | 수신자 ID |
| status | VARCHAR(20) | | 상태 (PENDING, ACCEPTED, REJECTED) |
| created_at | DATETIME | | 생성일시 |
| processed_at | DATETIME | | 처리일시 |

### 6.3 FriendBlock (friend_blocks)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 차단 ID |
| blocker_id | BIGINT | FK → users | 차단한 사용자 |
| blocked_id | BIGINT | FK → users | 차단된 사용자 |
| created_at | DATETIME | | 생성일시 |

### 6.4 FriendReport (friend_reports)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 신고 ID |
| reporter_id | BIGINT | FK → users | 신고자 |
| reported_id | BIGINT | FK → users | 피신고자 |
| reason | TEXT | NOT NULL | 신고 사유 |
| status | VARCHAR(20) | | 처리 상태 |
| created_at | DATETIME | | 생성일시 |

---

## 7. 팀 스터디 (Team Study)

### 7.1 StudyRoom (study_rooms)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 스터디방 ID |
| host_id | BIGINT | FK → users | 방장 ID |
| name | VARCHAR(100) | NOT NULL | 방 이름 |
| description | TEXT | | 방 설명 |
| room_type | VARCHAR(20) | NOT NULL | 방 타입 (QUIZ, FOCUS) |
| max_participants | INT | DEFAULT 10 | 최대 인원 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성화 여부 |
| created_at | DATETIME | | 생성일시 |
| updated_at | DATETIME | | 수정일시 |

### 7.2 StudyRoomParticipant (study_room_participants)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 참여자 ID |
| study_room_id | BIGINT | FK → study_rooms | 스터디방 ID |
| user_id | BIGINT | FK → users | 사용자 ID |
| joined_at | DATETIME | | 참여 일시 |
| left_at | DATETIME | | 퇴장 일시 |
| focused_seconds | INT | DEFAULT 0 | 집중 시간 (초) |
| score | INT | DEFAULT 0 | 점수 |

### 7.3 QuizRoom (quiz_rooms)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 퀴즈방 ID |
| study_room_id | BIGINT | FK → study_rooms | 스터디방 ID |
| current_problem_id | BIGINT | | 현재 문제 ID |
| presenter_id | BIGINT | FK → users | 발표자 ID |
| status | VARCHAR(20) | | 진행 상태 |

### 7.4 FocusRoom (focus_rooms)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 집중방 ID |
| study_room_id | BIGINT | FK → study_rooms | 스터디방 ID |
| goal_minutes | INT | | 목표 시간 (분) |
| status | VARCHAR(20) | | 진행 상태 |

### 7.5 Problem (problems)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 문제 ID |
| unit_id | BIGINT | FK → units | 단원 ID |
| content | TEXT | NOT NULL | 문제 내용 |
| answer | VARCHAR(255) | NOT NULL | 정답 |
| difficulty | INT | | 난이도 |

### 7.6 Unit (units)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 단원 ID |
| subject | VARCHAR(100) | NOT NULL | 과목 |
| name | VARCHAR(255) | NOT NULL | 단원명 |
| order_index | INT | | 순서 |

### 7.7 Passage (passages)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 지문 ID |
| content | TEXT | NOT NULL | 지문 내용 |
| source | VARCHAR(255) | | 출처 |
