# 평가 API

**관련 문서**: [API 개요](./README.md) | [학습 API](./07-study.md)

---

## 📋 개요

평가 기능은 단원평가 시작, 답안 제출, 결과 조회, AI 분석 등을 지원합니다.

---

## 📁 엔드포인트 구조

```
/api/evaluation/         # 단원평가
/api/math-evaluation/    # 수학 평가 분석
```

---

# 1. 단원평가 API (`/api/evaluation`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/evaluation/start` | 단원평가 시작 | ✅ |
| POST | `/evaluation/submit` | 답안 제출 | ✅ |
| GET | `/evaluation/result/{evaluationId}` | 결과 조회 | ✅ |
| GET | `/evaluation/history` | 평가 히스토리 | ✅ |
| GET | `/evaluation/study-plan` | 맞춤 학습계획 | ✅ |

---

## 1.1 단원평가 시작

### 요청

```
POST /api/evaluation/start
Content-Type: application/json
```

### 요청 본문

```json
{
    "unitId": 1,
    "subject": "수학",
    "unitName": "미적분",
    "level": "MEDIUM"
}
```

### 요청 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| unitId | Long | ❌ | 단원 ID |
| subject | String | ✅ | 과목명 |
| unitName | String | ✅ | 단원명 |
| level | String | ❌ | 난이도 (자동 설정) |

### 난이도 레벨

| 값 | 설명 |
|----|------|
| EASY | 쉬움 |
| MEDIUM | 보통 |
| HARD | 어려움 |

### 응답 (성공)

```json
{
    "evaluationId": 1,
    "unitName": "미적분",
    "subject": "수학",
    "totalQuestions": 10,
    "timeLimit": 30,
    "problems": [
        {
            "problemId": 1,
            "questionNumber": 1,
            "question": "다음 극한값을 구하시오.",
            "options": ["1", "2", "3", "4", "5"],
            "imageUrl": "/math_image/problem_1.png",
            "difficulty": "MEDIUM",
            "points": 10
        },
        {
            "problemId": 2,
            "questionNumber": 2,
            "question": "함수 f(x)의 미분계수를 구하시오.",
            "options": ["0", "1", "2", "3", "4"],
            "imageUrl": null,
            "difficulty": "HARD",
            "points": 15
        }
    ],
    "startedAt": "2025-01-15T10:00:00"
}
```

---

## 1.2 답안 제출

### 요청

```
POST /api/evaluation/submit
Content-Type: application/json
```

### 요청 본문

```json
{
    "evaluationId": 1,
    "answers": [
        {
            "problemId": 1,
            "selectedAnswer": "2",
            "timeSpent": 120
        },
        {
            "problemId": 2,
            "selectedAnswer": "3",
            "timeSpent": 180
        }
    ]
}
```

### 응답 (성공)

```json
{
    "evaluationId": 1,
    "unitName": "미적분",
    "subject": "수학",
    "totalQuestions": 10,
    "correctAnswers": 7,
    "score": 72.5,
    "difficultyScores": {
        "easyCorrect": 3,
        "easyTotal": 3,
        "mediumCorrect": 3,
        "mediumTotal": 4,
        "hardCorrect": 1,
        "hardTotal": 3
    },
    "wrongAnswers": [
        {
            "problemId": 5,
            "question": "문제 내용...",
            "yourAnswer": "2",
            "correctAnswer": "4",
            "explanation": "해설...",
            "difficulty": "HARD"
        }
    ],
    "aiFeedback": {
        "summary": "전체적으로 기본 개념은 잘 이해하고 있습니다.",
        "strengths": ["극한 개념 이해", "기본 미분 공식 활용"],
        "weaknesses": ["복합 함수 미분", "응용 문제 해결"],
        "recommendations": [
            "복합 함수 미분 공식 복습 권장",
            "응용 문제 10문제 이상 풀이 권장"
        ],
        "studyPlan": "1주차: 복합 함수 미분 집중 학습..."
    },
    "levelUp": false,
    "newLevel": "MEDIUM",
    "completedAt": "2025-01-15T10:30:00"
}
```

---

## 1.3 평가 결과 조회

### 요청

```
GET /api/evaluation/result/{evaluationId}
```

### 응답 (성공)

> 1.2 답안 제출 응답과 동일한 형식

---

## 1.4 평가 히스토리 조회

### 요청

```
GET /api/evaluation/history
```

### 응답 (성공)

```json
{
    "evaluations": [
        {
            "evaluationId": 1,
            "unitName": "미적분",
            "subject": "수학",
            "score": 72.5,
            "totalQuestions": 10,
            "correctAnswers": 7,
            "completedAt": "2025-01-15T10:30:00"
        },
        {
            "evaluationId": 2,
            "unitName": "확률과 통계",
            "subject": "수학",
            "score": 85.0,
            "totalQuestions": 10,
            "correctAnswers": 8,
            "completedAt": "2025-01-14T10:30:00"
        }
    ],
    "totalCount": 2,
    "averageScore": 78.75
}
```

---

## 1.5 맞춤 학습계획 조회

### 요청

```
GET /api/evaluation/study-plan
```

### 응답 (성공)

```json
{
    "success": true,
    "message": "맞춤형 학습계획 조회 완료",
    "studyPlan": "최근 평가 결과를 분석한 결과:\n\n1. 강점 영역: 극한, 기본 미분\n2. 보완 필요 영역: 복합 함수 미분, 적분\n\n추천 학습 계획:\n- 1주차: 복합 함수 미분 복습\n- 2주차: 적분 기초 학습\n..."
}
```

### 응답 (평가 기록 없음)

```json
{
    "success": true,
    "message": "맞춤형 학습계획 조회 완료",
    "studyPlan": "아직 평가 기록이 없습니다. 먼저 단원평가를 완료해주세요."
}
```

---

# 2. 수학 평가 분석 API (`/api/math-evaluation`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/math-evaluation/analyze` | 평가 결과 분석 | ✅ |
| POST | `/math-evaluation/detailed-analysis` | 상세 분석 | ✅ |

---

## 2.1 평가 결과 분석 (Gemini AI)

### 요청

```
POST /api/math-evaluation/analyze
Content-Type: application/json
```

### 요청 본문

```json
{
    "userGrade": 3,
    "score": 72.5,
    "correctCount": 7,
    "totalCount": 10,
    "unitName": "미적분",
    "difficultyScores": {
        "easy": { "correct": 3, "total": 3 },
        "medium": { "correct": 3, "total": 4 },
        "hard": { "correct": 1, "total": 3 }
    },
    "wrongAnswers": [
        {
            "problemId": 5,
            "question": "문제 내용...",
            "yourAnswer": "2",
            "correctAnswer": "4",
            "concept": "복합 함수 미분"
        }
    ]
}
```

### 응답 (성공)

```
📊 **미적분 단원평가 분석 결과**

### 종합 평가
- 점수: 72.5점 (10문제 중 7문제 정답)
- 수준: 중급

### 난이도별 분석
- 쉬움: 100% (3/3) ✅
- 보통: 75% (3/4) ⚠️
- 어려움: 33% (1/3) ❌

### 취약 개념
1. 복합 함수 미분 - 기본 개념 복습 필요
2. 응용 문제 해결력 향상 필요

### 학습 추천
1. 복합 함수 미분 공식 정리 및 예제 풀이
2. 미적분 응용 문제 20문제 추가 풀이 권장
3. 개념 영상 강의 복습 권장

### 다음 목표
- 다음 평가 목표: 80점 이상
- 집중 학습 영역: 복합 함수 미분
```

> Gemini API를 활용하여 마크다운 형식의 분석 결과를 생성합니다.

---

## 2.2 상세 학습 로드맵

### 요청

```
POST /api/math-evaluation/detailed-analysis
Content-Type: application/json
```

### 요청 본문

> 2.1과 동일

### 응답 (성공)

```
📚 **상세 학습 로드맵**

## 1주차: 기본 개념 복습
- Day 1-2: 극한의 정의와 성질 복습
- Day 3-4: 미분의 정의와 기본 공식
- Day 5-7: 기본 미분 문제 풀이 (30문제)

## 2주차: 복합 함수 미분 집중
- Day 1-2: 합성 함수 미분법
- Day 3-4: 음함수 미분법
- Day 5-7: 복합 함수 미분 문제 풀이 (40문제)

## 3주차: 응용 및 심화
- Day 1-3: 미분의 활용 (최대최소)
- Day 4-5: 접선의 방정식
- Day 6-7: 종합 문제 풀이 (30문제)

## 4주차: 실전 대비
- Day 1-3: 모의평가 1회
- Day 4-5: 오답 분석 및 보완
- Day 6-7: 최종 점검

### 추천 학습 자료
1. 개념원리 미적분 p.45-78
2. 쎈 미적분 응용 문제집
3. EBS 수능완성 미적분편
```

---

## 데이터 타입

### StudentLevel (학생 레벨)

| 값 | 설명 |
|----|------|
| BEGINNER | 초급 |
| INTERMEDIATE | 중급 |
| ADVANCED | 고급 |
| EXPERT | 전문가 |

### EvaluationStatus (평가 상태)

| 값 | 설명 |
|----|------|
| IN_PROGRESS | 진행 중 |
| COMPLETED | 완료 |
| EXPIRED | 만료 |

---

## 레벨업 조건

| 현재 레벨 | 다음 레벨 | 조건 |
|-----------|-----------|------|
| BEGINNER | INTERMEDIATE | 70점 이상 2회 연속 |
| INTERMEDIATE | ADVANCED | 80점 이상 2회 연속 |
| ADVANCED | EXPERT | 90점 이상 3회 연속 |

---

## 클라이언트 구현 예시

### React - 단원평가

```javascript
import api from '../../api/api';

// 단원평가 시작
const startEvaluation = async (subject, unitName, level = null) => {
    const response = await api.post('/evaluation/start', {
        subject,
        unitName,
        level
    });
    return response.data;
};

// 답안 제출
const submitAnswers = async (evaluationId, answers) => {
    const response = await api.post('/evaluation/submit', {
        evaluationId,
        answers
    });
    return response.data;
};

// 평가 결과 조회
const getEvaluationResult = async (evaluationId) => {
    const response = await api.get(`/evaluation/result/${evaluationId}`);
    return response.data;
};

// 평가 히스토리 조회
const getEvaluationHistory = async () => {
    const response = await api.get('/evaluation/history');
    return response.data;
};

// AI 분석 요청
const requestAIAnalysis = async (evaluationData) => {
    const response = await api.post('/math-evaluation/analyze', evaluationData);
    return response.data;
};

// 상세 분석 요청
const requestDetailedAnalysis = async (evaluationData) => {
    const response = await api.post('/math-evaluation/detailed-analysis', evaluationData);
    return response.data;
};

// 맞춤 학습계획 조회
const getPersonalizedStudyPlan = async () => {
    const response = await api.get('/evaluation/study-plan');
    return response.data;
};
```

### 평가 진행 컴포넌트

```javascript
const EvaluationPage = () => {
    const [evaluation, setEvaluation] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    
    const handleStartEvaluation = async (subject, unitName) => {
        const result = await startEvaluation(subject, unitName);
        setEvaluation(result);
        setTimeLeft(result.timeLimit * 60);
    };
    
    const handleSelectAnswer = (problemId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [problemId]: {
                selectedAnswer: answer,
                timeSpent: calculateTimeSpent()
            }
        }));
    };
    
    const handleSubmit = async () => {
        const formattedAnswers = Object.entries(answers).map(([problemId, data]) => ({
            problemId: parseInt(problemId),
            ...data
        }));
        
        const result = await submitAnswers(evaluation.evaluationId, formattedAnswers);
        // 결과 페이지로 이동
        navigate(`/evaluation/result/${evaluation.evaluationId}`, { state: result });
    };
    
    return (
        <div className="evaluation-page">
            {evaluation ? (
                <>
                    <Timer timeLeft={timeLeft} />
                    <ProgressBar 
                        current={currentQuestion + 1} 
                        total={evaluation.problems.length} 
                    />
                    <ProblemCard 
                        problem={evaluation.problems[currentQuestion]}
                        selectedAnswer={answers[evaluation.problems[currentQuestion].problemId]?.selectedAnswer}
                        onSelect={handleSelectAnswer}
                    />
                    <NavigationButtons 
                        onPrev={() => setCurrentQuestion(prev => prev - 1)}
                        onNext={() => setCurrentQuestion(prev => prev + 1)}
                        onSubmit={handleSubmit}
                        isFirst={currentQuestion === 0}
                        isLast={currentQuestion === evaluation.problems.length - 1}
                    />
                </>
            ) : (
                <EvaluationStartForm onStart={handleStartEvaluation} />
            )}
        </div>
    );
};
```
