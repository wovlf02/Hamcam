# 대시보드 API

**관련 문서**: [API 개요](./README.md) | [인증 API](./01-auth.md)

---

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/api/dashboard/calendar` | 월별 캘린더 이벤트 |
| POST | `/api/dashboard/todos/date` | 날짜별 Todo 조회 |
| POST | `/api/dashboard/todos` | Todo 생성 |
| PUT | `/api/dashboard/todos` | Todo 수정 |
| POST | `/api/dashboard/todos/delete` | Todo 삭제 |
| PUT | `/api/dashboard/todos/complete` | Todo 완료 토글 |
| GET | `/api/dashboard/exams` | 시험 일정 목록 |
| POST | `/api/dashboard/exams` | 시험 일정 생성 |
| PUT | `/api/dashboard/exams` | 시험 일정 수정 |
| DELETE | `/api/dashboard/exams/{id}` | 시험 일정 삭제 |
| GET | `/api/dashboard/dday` | D-Day 조회 |
| GET | `/api/dashboard/stats/total` | 전체 통계 |
| GET | `/api/dashboard/stats/weekly` | 주간 통계 |
| GET | `/api/dashboard/stats/monthly` | 월간 통계 |
| GET | `/api/dashboard/stats/best-day` | 최고 집중일 |
| GET | `/api/dashboard/goals/suggestion` | 목표 제안 |
| PUT | `/api/dashboard/goals` | 목표 업데이트 |
| PUT | `/api/dashboard/study-time` | 학습 시간 업데이트 |
| POST | `/api/dashboard/reflection/weekly` | 주간 회고 |
| POST | `/api/dashboard/reflection/range` | 기간별 회고 |
| POST | `/api/dashboard/reflection/option` | 옵션 기반 회고 |

---

## 1. 캘린더

### 1.1 월별 캘린더 이벤트 조회

```
POST /api/dashboard/calendar
Content-Type: application/json
```

**요청 본문**
```json
{
    "year": 2025,
    "month": 1
}
```

**응답**
```json
[
    {
        "date": "2025-01-15",
        "type": "TODO",
        "title": "수학 문제 풀기",
        "completed": false
    },
    {
        "date": "2025-01-20",
        "type": "EXAM",
        "title": "모의고사"
    }
]
```

---

## 2. Todo 관리

### 2.1 날짜별 Todo 조회

```
POST /api/dashboard/todos/date
Content-Type: application/json
```

**요청 본문**
```json
{
    "date": "2025-01-15"
}
```

**응답**
```json
[
    {
        "id": 1,
        "title": "수학 문제 풀기",
        "description": "미적분 20문제",
        "todoDate": "2025-01-15",
        "isCompleted": false,
        "priority": "HIGH",
        "createdAt": "2025-01-10T10:00:00"
    }
]
```

### 2.2 Todo 생성

```
POST /api/dashboard/todos
Content-Type: application/json
```

**요청 본문**
```json
{
    "title": "영어 단어 암기",
    "description": "TOEIC 필수 단어 50개",
    "todoDate": "2025-01-16",
    "priority": "MEDIUM"
}
```

**응답**
```json
{
    "success": true,
    "message": null,
    "data": null
}
```

### 2.3 Todo 수정

```
PUT /api/dashboard/todos
Content-Type: application/json
```

**요청 본문**
```json
{
    "id": 1,
    "title": "수학 문제 풀기 (수정)",
    "description": "미적분 30문제로 변경",
    "todoDate": "2025-01-15",
    "priority": "HIGH"
}
```

**응답**
```json
{
    "message": "✏️ Todo가 수정되었습니다."
}
```

### 2.4 Todo 삭제

```
POST /api/dashboard/todos/delete
Content-Type: application/json
```

**요청 본문**
```json
{
    "id": 1
}
```

**응답**
```json
{
    "message": "🗑️ Todo가 삭제되었습니다."
}
```

### 2.5 Todo 완료 토글

```
PUT /api/dashboard/todos/complete
Content-Type: application/json
```

**요청 본문**
```json
{
    "id": 1,
    "isCompleted": true
}
```

**응답**
```json
{
    "message": "✅ 완료 상태가 변경되었습니다."
}
```

---

## 3. 시험 일정 (D-Day)

### 3.1 시험 일정 목록 조회

```
GET /api/dashboard/exams
```

**응답**
```json
[
    {
        "id": 1,
        "title": "수능",
        "examDate": "2025-11-14",
        "description": "2026학년도 대학수학능력시험",
        "createdAt": "2025-01-01T00:00:00"
    }
]
```

### 3.2 시험 일정 생성

```
POST /api/dashboard/exams
Content-Type: application/json
```

**요청 본문**
```json
{
    "title": "모의고사",
    "examDate": "2025-06-04",
    "description": "6월 모의평가"
}
```

**응답**
```json
{
    "success": true,
    "message": null,
    "data": null
}
```

### 3.3 시험 일정 삭제

```
DELETE /api/dashboard/exams/{id}
```

**응답**
```json
{
    "message": "🗑️ 시험 일정이 삭제되었습니다."
}
```

### 3.4 D-Day 조회

```
GET /api/dashboard/dday
```

**응답**
```json
{
    "examId": 1,
    "title": "수능",
    "examDate": "2025-11-14",
    "dDay": 300
}
```

---

## 4. 학습 통계

### 4.1 전체 통계

```
GET /api/dashboard/stats/total
```

**응답**
```json
{
    "totalStudyMinutes": 12500,
    "totalDays": 150,
    "averageMinutesPerDay": 83,
    "subjects": [
        { "name": "수학", "minutes": 5000 },
        { "name": "영어", "minutes": 4000 },
        { "name": "국어", "minutes": 3500 }
    ]
}
```

### 4.2 주간 통계

```
GET /api/dashboard/stats/weekly
```

**응답**
```json
{
    "weekStart": "2025-01-13",
    "weekEnd": "2025-01-19",
    "totalMinutes": 840,
    "dailyStats": [
        { "date": "2025-01-13", "minutes": 120 },
        { "date": "2025-01-14", "minutes": 100 },
        { "date": "2025-01-15", "minutes": 150 }
    ]
}
```

### 4.3 월간 통계

```
GET /api/dashboard/stats/monthly
```

**응답**
```json
{
    "year": 2025,
    "month": 1,
    "totalMinutes": 3600,
    "dailyStats": [
        { "date": "2025-01-01", "minutes": 120 },
        { "date": "2025-01-02", "minutes": 100 }
    ]
}
```

### 4.4 최고 집중일

```
GET /api/dashboard/stats/best-day
```

**응답**
```json
{
    "date": "2025-01-15",
    "minutes": 180,
    "subjects": ["수학", "영어"]
}
```

---

## 5. 목표 관리

### 5.1 AI 목표 제안

```
GET /api/dashboard/goals/suggestion
```

**응답**
```json
{
    "suggestions": [
        "주 30시간 학습 목표",
        "수학 주 5회 학습",
        "영어 단어 하루 50개"
    ]
}
```

### 5.2 목표 업데이트

```
PUT /api/dashboard/goals
Content-Type: application/json
```

**요청 본문**
```json
{
    "goals": [
        {
            "title": "주 30시간 학습",
            "targetDate": "2025-02-01"
        }
    ]
}
```

**응답**
```json
{
    "message": "✅ 목표가 업데이트되었습니다."
}
```

---

## 6. 학습 시간

### 6.1 학습 시간 업데이트

```
PUT /api/dashboard/study-time
Content-Type: application/json
```

**요청 본문**
```json
{
    "studyDate": "2025-01-15",
    "subject": "수학",
    "durationMinutes": 120
}
```

**응답**
```json
{
    "message": "⏱️ 학습 시간이 기록되었습니다."
}
```

---

## 7. AI 회고

### 7.1 주간 회고 생성

```
POST /api/dashboard/reflection/weekly
Content-Type: application/json
```

**요청 본문**
```json
{
    "weekStart": "2025-01-13"
}
```

**응답**
```json
{
    "reflection": "이번 주 학습 분석 결과...",
    "strengths": ["꾸준한 학습 습관"],
    "improvements": ["수학 학습 시간 증가 필요"],
    "recommendations": ["미적분 문제풀이 집중 권장"]
}
```

### 7.2 기간별 회고 생성

```
POST /api/dashboard/reflection/range
Content-Type: application/json
```

**요청 본문**
```json
{
    "startDate": "2025-01-01",
    "endDate": "2025-01-31"
}
```

### 7.3 옵션 기반 회고 생성

```
POST /api/dashboard/reflection/option
Content-Type: application/json
```

**요청 본문**
```json
{
    "options": {
        "includeStats": true,
        "includeGoals": true,
        "includeRecommendations": true
    }
}
```

---

## 데이터 타입

### PriorityLevel (우선순위)

| 값 | 설명 |
|----|------|
| LOW | 낮음 |
| MEDIUM | 보통 |
| HIGH | 높음 |

### CalendarEventType (캘린더 이벤트 타입)

| 값 | 설명 |
|----|------|
| TODO | 할 일 |
| EXAM | 시험 |
| STUDY | 학습 기록 |
