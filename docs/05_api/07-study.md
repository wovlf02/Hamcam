# 학습 API

**관련 문서**: [API 개요](./README.md) | [평가 API](./08-evaluation.md)

---

## 📋 개요

학습 기능은 팀 스터디, 퀴즈방, 집중 스터디방, AI 학습 계획 생성 등을 포함합니다.

---

## 📁 엔드포인트 구조

```
/api/study/team/      # 팀 스터디 관리
/api/quiz/            # 퀴즈 문제
/api/plan/            # AI 학습 계획
/api/math/            # 수학 문제
/api/ai-feedback/     # AI 피드백
```

---

# 1. 팀 스터디 API (`/api/study/team`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/team/create` | 팀방 생성 | ✅ |
| POST | `/team/enter` | 팀방 입장 | ✅ |
| DELETE | `/team/delete/{roomId}` | 팀방 삭제 | ✅ |
| POST | `/team/my` | 내 팀방 목록 | ✅ |
| GET | `/team/all` | 전체 팀방 목록 | ✅ |
| GET | `/team/type` | 유형별 팀방 목록 | ✅ |
| GET | `/team/my/type` | 내 팀방 유형별 필터 | ✅ |
| POST | `/team/detail` | 팀방 상세 조회 | ✅ |
| POST | `/team/upload` | 파일 업로드 | ✅ |
| GET | `/team/files` | 업로드 파일 목록 | ✅ |
| POST | `/team/record` | 학습 결과 기록 | ✅ |
| POST | `/team/post-failure` | 실패 문제 게시 | ✅ |

---

## 1.1 팀방 생성

### 요청

```
POST /api/study/team/create
Content-Type: application/json
```

### 요청 본문

```json
{
    "title": "수학 스터디방",
    "roomType": "FOCUS",
    "password": "1234",
    "maxParticipants": 4,
    "targetTime": 60,
    "subject": "수학",
    "grade": 3,
    "month": 6,
    "difficulty": "중"
}
```

### RoomType (방 유형)

| 값 | 설명 |
|----|------|
| FOCUS | 집중 스터디방 (캠 스터디) |
| QUIZ | 퀴즈 대결방 |

### 응답 (성공)

```json
1
```

> 생성된 방의 ID를 반환합니다.

---

## 1.2 팀방 입장

### 요청

```
POST /api/study/team/enter?roomId=1
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| roomId | Long | ✅ | 방 ID |

### 응답 (성공)

```
HTTP 200 OK
```

---

## 1.3 팀방 삭제

### 요청

```
DELETE /api/study/team/delete/{roomId}
```

### 권한

- 방장만 삭제 가능

### 응답 (성공)

```
HTTP 200 OK
```

---

## 1.4 내 팀방 목록

### 요청

```
POST /api/study/team/my
```

### 응답 (성공)

```json
[
    {
        "roomId": 1,
        "title": "수학 스터디방",
        "roomType": "FOCUS",
        "currentParticipants": 3,
        "maxParticipants": 4,
        "hasPassword": true,
        "createdAt": "2025-01-15T10:00:00"
    }
]
```

---

## 1.5 전체 팀방 목록

### 요청

```
GET /api/study/team/all
```

### 응답 (성공)

```json
[
    {
        "roomId": 1,
        "title": "수학 스터디방",
        "roomType": "FOCUS",
        "currentParticipants": 3,
        "maxParticipants": 4,
        "hasPassword": true,
        "hostNickname": "방장닉네임",
        "createdAt": "2025-01-15T10:00:00"
    },
    {
        "roomId": 2,
        "title": "영어 퀴즈 대결",
        "roomType": "QUIZ",
        "currentParticipants": 2,
        "maxParticipants": 4,
        "hasPassword": false,
        "hostNickname": "퀴즈마스터",
        "createdAt": "2025-01-15T11:00:00"
    }
]
```

---

## 1.6 유형별 팀방 목록

### 요청

```
GET /api/study/team/type?roomType=FOCUS
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| roomType | String | ✅ | FOCUS 또는 QUIZ |

### 응답 (성공)

```json
[
    {
        "roomId": 1,
        "title": "수학 스터디방",
        "roomType": "FOCUS",
        "currentParticipants": 3,
        "maxParticipants": 4
    }
]
```

---

## 1.7 팀방 상세 조회

### 요청

```
POST /api/study/team/detail
Content-Type: application/json
```

### 요청 본문

```json
{
    "roomId": 1
}
```

### 응답 (성공)

```json
{
    "roomId": 1,
    "title": "수학 스터디방",
    "roomType": "FOCUS",
    "hostUserId": 1,
    "hostNickname": "방장닉네임",
    "maxParticipants": 4,
    "targetTime": 60,
    "subject": "수학",
    "grade": 3,
    "month": 6,
    "difficulty": "중",
    "participants": [
        {
            "userId": 1,
            "nickname": "방장닉네임",
            "profileImageUrl": "/uploads/profile/1.jpg",
            "focusedSeconds": 1800,
            "isHost": true
        },
        {
            "userId": 2,
            "nickname": "참여자1",
            "profileImageUrl": "/uploads/profile/2.jpg",
            "focusedSeconds": 1200,
            "isHost": false
        }
    ],
    "createdAt": "2025-01-15T10:00:00"
}
```

---

## 1.8 파일 업로드

### 요청

```
POST /api/study/team/upload
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파트 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| file | File | ✅ | 업로드할 파일 |

### 응답 (성공)

```json
"/uploads/team/abc123_document.pdf"
```

---

## 1.9 업로드 파일 목록

### 요청

```
GET /api/study/team/files?roomId=1
```

### 응답 (성공)

```json
[
    "/uploads/team/abc123_document.pdf",
    "/uploads/team/def456_image.jpg"
]
```

---

## 1.10 학습 결과 기록

### 요청

```
POST /api/study/team/record
Content-Type: application/json
```

### 요청 본문

```json
{
    "roomId": 1,
    "userId": 1,
    "focusedSeconds": 3600,
    "score": 85
}
```

> 주로 Node.js 시그널링 서버가 호출합니다.

### 응답 (성공)

```
HTTP 200 OK
```

---

## 1.11 실패 문제 커뮤니티 게시

### 요청

```
POST /api/study/team/post-failure
Content-Type: application/json
```

### 요청 본문

```json
{
    "problemId": 1,
    "roomId": 1,
    "content": "이 문제 풀이 방법을 모르겠습니다."
}
```

### 응답 (성공)

```
HTTP 200 OK
```

---

# 2. 퀴즈 API (`/api/quiz`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/quiz/problems/random` | 랜덤 문제 조회 | ✅ |

---

## 2.1 랜덤 문제 조회

### 요청

```
GET /api/quiz/problems/random?subject=수학&unit=지수함수와+로그함수&level=중
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| subject | String | ✅ | 과목명 (국어/수학/영어 등) |
| unit | String | ✅ | 단원명 |
| level | String | ✅ | 난이도 (최하/하/중/상/최상) |

### 응답 (성공)

```json
{
    "problemId": 1,
    "subject": "수학",
    "unit": "지수함수와 로그함수",
    "level": "중",
    "question": "log₂8의 값은?",
    "options": ["1", "2", "3", "4"],
    "answer": "3",
    "explanation": "log₂8 = log₂2³ = 3",
    "imageUrl": "/math_image/problem_1.png",
    "passage": null
}
```

> 국어 과목의 경우 `passage` 필드에 지문이 포함됩니다.

---

# 3. AI 학습 계획 API (`/api/plan`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/plan/generate` | AI 학습 계획 생성 | ✅ |
| GET | `/plan/my` | 내 학습 계획 목록 | ✅ |
| DELETE | `/plan/{planId}` | 학습 계획 삭제 | ✅ |
| PATCH | `/plan/{planId}/check` | 완료 상태 토글 | ✅ |
| PATCH | `/plan/{planId}/content` | 계획 내용 수정 | ✅ |

---

## 3.1 AI 학습 계획 생성

### 요청

```
POST /api/plan/generate
Content-Type: application/json
```

### 요청 본문

```json
{
    "subject": "수학",
    "grade": 3,
    "weeks": 4,
    "range": "미적분 전체"
}
```

### 요청 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| subject | String | ✅ | 과목 |
| grade | Integer | ✅ | 학년 |
| weeks | Integer | ✅ | 학습 기간 (주) |
| range | String | ✅ | 학습 범위 |
| prompt | String | ❌ | 사용자 정의 프롬프트 |

### 응답 (성공)

```markdown
| 날짜 | 학습 목표 | 시간 | 주요 과제 | 참고사항 |
|------|----------|------|----------|----------|
| 2025-01-15 | 극한의 개념 | 2시간 | 개념 정리 | - |
| 2025-01-16 | 미분의 정의 | 2시간 | 문제 풀이 | - |
...
```

> Gemini API를 활용하여 마크다운 표 형태의 학습 계획을 생성합니다.

---

## 3.2 내 학습 계획 목록

### 요청

```
GET /api/plan/my
```

### 응답 (성공)

```json
[
    {
        "id": 1,
        "userId": "1",
        "subject": "수학",
        "grade": 3,
        "weeks": 4,
        "units": "미적분 전체",
        "planContent": "| 날짜 | 학습 목표 | ...",
        "checked": false,
        "createdAt": "2025-01-15T10:00:00"
    }
]
```

---

## 3.3 학습 계획 삭제

### 요청

```
DELETE /api/plan/{planId}
```

### 응답 (성공)

```
"삭제되었습니다."
```

---

## 3.4 완료 상태 토글

### 요청

```
PATCH /api/plan/{planId}/check?checked=true
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| checked | Boolean | ✅ | 완료 상태 |

### 응답 (성공)

```
"상태가 변경되었습니다."
```

---

## 3.5 계획 내용 수정

### 요청

```
PATCH /api/plan/{planId}/content
Content-Type: application/json
```

### 요청 본문

```json
{
    "planContent": "수정된 계획 내용..."
}
```

### 응답 (성공)

```
"계획이 수정되었습니다."
```

---

# 4. 수학 문제 API (`/api/math`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/math/problems` | 전체 문제 조회 | ❌ |
| GET | `/math/problems/{id}` | 문제 상세 조회 | ❌ |
| GET | `/math/problems/subject/{subject}` | 과목별 문제 | ❌ |
| GET | `/math/problems/difficulty/{grade}` | 난이도별 문제 | ❌ |
| GET | `/math/problems/exam/{examMonthYear}` | 시험별 문제 | ❌ |
| GET | `/math/problems/grade/{studentGrade}` | 학년별 맞춤 문제 | ❌ |
| GET | `/math/problems/grade/{studentGrade}/all` | 학년별 전체 문제 | ❌ |
| GET | `/math/evaluation/generate` | 평가용 문제 세트 | ❌ |
| GET | `/math/statistics` | 문제 통계 | ❌ |
| GET | `/math/subjects` | 과목 목록 | ❌ |

---

## 4.1 전체 문제 조회

### 요청

```
GET /api/math/problems
```

### 응답 (성공)

```json
[
    {
        "id": 1,
        "subject": "수학",
        "unit": "미적분",
        "difficulty": 3,
        "question": "문제 내용...",
        "answer": "3",
        "explanation": "해설...",
        "imageUrl": "/math_image/problem_1.png",
        "examMonthYear": "2024-06",
        "isActive": true
    }
]
```

---

## 4.2 학년별 맞춤 문제 조회

### 요청

```
GET /api/math/problems/grade/{studentGrade}?count=10
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| count | Integer | ❌ | 문제 수 (기본: 10) |

### 응답 (성공)

```json
[
    {
        "id": 1,
        "subject": "수학",
        "difficulty": 4,
        "question": "...",
        "answer": "2"
    }
]
```

### 학년별 난이도 매핑

| 학년 | 문제 난이도 |
|------|------------|
| 1학년 | 어려운 문제 중심 |
| 3학년 | 중간 난이도 |
| 5학년 | 쉬운 문제 중심 |

---

## 4.3 평가용 문제 세트 생성

### 요청

```
GET /api/math/evaluation/generate?subject=공통&count=10
```

### 쿼리 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| subject | String | ❌ | 과목 (기본: 공통) |
| count | Integer | ❌ | 문제 수 (기본: 10) |

### 응답 (성공)

```json
[
    {
        "id": 1,
        "difficulty": 2,
        "question": "...",
        "answer": "1"
    },
    {
        "id": 5,
        "difficulty": 4,
        "question": "...",
        "answer": "3"
    }
]
```

---

# 5. AI 피드백 API (`/api/ai-feedback`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/ai-feedback/generate/{studentId}` | AI 피드백 생성 | ✅ |
| GET | `/ai-feedback/performance-stats/{studentId}` | 성능 통계 조회 | ✅ |
| GET | `/ai-feedback/status` | AI 피드백 상태 확인 | ✅ |

---

## 5.1 AI 피드백 생성

### 요청

```
POST /api/ai-feedback/generate/{studentId}
```

### 응답 (성공)

```json
{
    "success": true,
    "message": "AI 피드백이 성공적으로 생성되었습니다.",
    "feedback": "학습 분석 결과:\n\n1. 강점: 기본 개념 이해도가 높습니다.\n2. 개선점: 응용 문제 풀이 능력 향상이 필요합니다.\n3. 추천: 미적분 심화 문제를 더 풀어보세요.",
    "performanceData": {
        "totalProblems": 50,
        "correctAnswers": 35,
        "accuracyRate": 70.0,
        "averageTime": 45.5,
        "weakSubjects": {
            "미적분": 5,
            "확률과통계": 3
        },
        "difficultyAnalysis": {
            "쉬움": 2,
            "보통": 5,
            "어려움": 8
        }
    }
}
```

---

## 5.2 성능 통계 조회

### 요청

```
GET /api/ai-feedback/performance-stats/{studentId}
```

### 응답 (성공)

```json
{
    "success": true,
    "message": "성능 통계가 성공적으로 조회되었습니다.",
    "stats": {
        "recentAccuracy": 75.0,
        "totalAttempts": 100,
        "averageTimePerProblem": 42.3,
        "improvementTrend": "상승",
        "weakAreas": ["미적분", "확률과통계"],
        "strongAreas": ["수열", "함수"]
    }
}
```

---

## 5.3 AI 피드백 상태 확인

### 요청

```
GET /api/ai-feedback/status
```

### 응답 (성공)

```json
{
    "success": true,
    "message": "AI 피드백 상태 조회 완료",
    "isEnabled": true,
    "status": "사용 가능"
}
```

---

## 클라이언트 구현 예시

### React - 팀 스터디

```javascript
import api from '../../api/api';

// 팀방 생성
const createTeamRoom = async (roomData) => {
    const response = await api.post('/study/team/create', roomData);
    return response.data;
};

// 팀방 입장
const enterTeamRoom = async (roomId) => {
    const response = await api.post(`/study/team/enter?roomId=${roomId}`);
    return response.data;
};

// 전체 팀방 목록
const getAllTeamRooms = async () => {
    const response = await api.get('/study/team/all');
    return response.data;
};

// 팀방 상세 조회
const getTeamRoomDetail = async (roomId) => {
    const response = await api.post('/study/team/detail', { roomId });
    return response.data;
};

// AI 학습 계획 생성
const generateStudyPlan = async (subject, grade, weeks, range) => {
    const response = await api.post('/plan/generate', {
        subject,
        grade,
        weeks,
        range
    });
    return response.data;
};

// AI 피드백 생성
const generateAIFeedback = async (studentId) => {
    const response = await api.post(`/ai-feedback/generate/${studentId}`);
    return response.data;
};
```
