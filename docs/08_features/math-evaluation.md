# 수학 평가 시스템

**관련 문서**: [AI 기능](./ai-features.md) | [대시보드 기능](./dashboard.md)

---

## 1. 개요

2025년 모의평가 기출문제를 기반으로 학생의 수학 실력을 진단하고 맞춤형 학습을 지원하는 시스템입니다.

### 1.1 핵심 기능

- **기출문제 제공**: 2025년 6월, 9월 모의평가 문제
- **맞춤형 난이도**: 학생 수준에 맞는 문제 제공
- **실시간 채점**: 즉시 채점 및 피드백
- **오답노트**: 틀린 문제 자동 수집
- **학습 분석**: 정답률, 소요시간, 약점 분석

---

## 2. 데이터 구조

### 2.1 MathProblem 엔티티

```java
@Entity
@Table(name = "math_problems")
public class MathProblem {
    @Id @GeneratedValue
    private Long id;
    
    private String examMonthYear;     // 2025_06, 2025_09
    private Integer problemNumber;    // 1-30
    private String subject;           // 공통, 미적분, 확률과통계, 기하
    private String subjectDetail;     // 상세 분야
    private Integer difficultyGrade;  // 1(최고난도) ~ 5(가장쉬움)
    private String answer;            // 정답
    
    @Enumerated(EnumType.STRING)
    private ProblemType type;         // MULTIPLE_CHOICE, SHORT_ANSWER
    
    private String imagePath;         // 문제 이미지 경로
    private String explanation;       // 해설
    private String hint;              // 힌트
    private Integer timeLimit;        // 제한시간 (초)
    private Integer points;           // 배점
    private Boolean isActive;         // 활성화 여부
}
```

### 2.2 난이도 체계

| 등급 | 난이도 | 설명 |
|------|--------|------|
| 1 | 최고난도 | 킬러 문제 |
| 2 | 상 | 어려운 문제 |
| 3 | 중 | 보통 문제 |
| 4 | 하 | 쉬운 문제 |
| 5 | 최하 | 기본 문제 |

### 2.3 과목 분류

| 과목 | 설명 |
|------|------|
| 공통 | 수학 I, II (필수) |
| 미적분 | 선택과목 |
| 확률과통계 | 선택과목 |
| 기하 | 선택과목 |

---

## 3. API

### 3.1 문제 조회

#### 모든 활성화된 문제

```
GET /api/math/problems
```

#### 과목별 문제

```
GET /api/math/problems/subject/{subject}
```

#### 난이도별 문제

```
GET /api/math/problems/difficulty/{grade}
```

#### 학년별 맞춤 문제

```
GET /api/math/problems/student-grade/{grade}?count=10
```

**학년-난이도 매핑**:
| 학년 | 난이도 범위 |
|------|-------------|
| 1학년 | 1 (최고난도) |
| 2학년 | 1-2 |
| 3학년 | 2-3 |
| 4학년 | 3-4 |
| 5학년+ | 4-5 |

#### 랜덤 문제

```
GET /api/math/problems/random?difficulty={grade}&count={count}
```

### 3.2 과목 목록

```
GET /api/math/subjects
```

**응답**
```json
["공통", "미적분", "확률과통계", "기하"]
```

---

## 4. 평가 흐름

### 4.1 문제 세트 생성

```javascript
const createProblemSet = async (studentGrade) => {
    // 쉬움 3개 + 보통 4개 + 어려움 3개 = 10문제
    const problems = await api.get(`/math/problems/student-grade/${studentGrade}?count=10`);
    return problems.data;
};
```

### 4.2 평가 진행

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 문제 표시   │────▶│  답안 입력   │────▶│  다음 문제   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               │ 마지막 문제
                                               ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ 오답 저장   │◀────│  채점       │
                    └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  결과 표시  │
                    └─────────────┘
```

### 4.3 채점 로직

```java
// MathProblem.java
public boolean isCorrect(String studentAnswer) {
    if (studentAnswer == null || answer == null) {
        return false;
    }
    
    // 공백 제거 및 대소문자 무시
    String normalizedStudent = studentAnswer.trim().toLowerCase();
    String normalizedAnswer = answer.trim().toLowerCase();
    
    return normalizedStudent.equals(normalizedAnswer);
}
```

---

## 5. 오답노트

### 5.1 StudentWrongAnswer 엔티티

```java
@Entity
public class StudentWrongAnswer {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Student student;
    
    @ManyToOne
    private MathProblem mathProblem;
    
    private String wrongAnswer;      // 학생이 제출한 오답
    private Integer reviewCount;     // 복습 횟수
    private Boolean isReviewed;      // 복습 완료 여부
    private LocalDateTime createdAt;
}
```

### 5.2 오답 등록

```java
@Transactional
public void saveWrongAnswer(Long studentId, Long problemId, String wrongAnswer) {
    Student student = studentRepository.findById(studentId).orElseThrow();
    MathProblem problem = mathProblemRepository.findById(problemId).orElseThrow();
    
    StudentWrongAnswer wrong = StudentWrongAnswer.builder()
        .student(student)
        .mathProblem(problem)
        .wrongAnswer(wrongAnswer)
        .reviewCount(0)
        .isReviewed(false)
        .build();
    
    studentWrongAnswerRepository.save(wrong);
}
```

### 5.3 복습 관리

```java
@Entity
public class ReviewAttempt {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private StudentWrongAnswer wrongAnswer;
    
    private String studentAnswer;    // 복습 시 제출한 답
    private Boolean isCorrect;       // 정답 여부
    private LocalDateTime attemptedAt;
}
```

---

## 6. 프론트엔드 구현

### 6.1 MathEvaluationStart 페이지

```javascript
const MathEvaluationStart = () => {
    const [problems, setProblems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300);
    
    // 문제 로드
    useEffect(() => {
        loadProblems();
    }, []);
    
    // 타이머
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    handleNext();
                    return 300;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentIndex]);
    
    const handleAnswer = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [currentIndex]: answer
        }));
    };
    
    const handleNext = () => {
        if (currentIndex < problems.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(300);
        } else {
            submitAnswers();
        }
    };
    
    return (
        <div className="evaluation-page">
            <Timer seconds={timeLeft} />
            <ProgressBar current={currentIndex + 1} total={problems.length} />
            <ProblemDisplay problem={problems[currentIndex]} />
            <AnswerInput 
                type={problems[currentIndex]?.type}
                onAnswer={handleAnswer}
            />
            <button onClick={handleNext}>
                {currentIndex < problems.length - 1 ? '다음' : '제출'}
            </button>
        </div>
    );
};
```

### 6.2 문제 표시 컴포넌트

```javascript
const ProblemDisplay = ({ problem }) => {
    if (!problem) return null;
    
    return (
        <div className="problem-display">
            <div className="problem-header">
                <span className="problem-number">문제 {problem.problemNumber}</span>
                <span className="difficulty">
                    난이도: {getDifficultyLabel(problem.difficultyGrade)}
                </span>
                <span className="points">{problem.points}점</span>
            </div>
            
            {problem.imagePath && (
                <img 
                    src={problem.imagePath} 
                    alt={`문제 ${problem.problemNumber}`}
                    className="problem-image"
                />
            )}
            
            <div className="subject-detail">
                {problem.subjectDetail}
            </div>
        </div>
    );
};
```

### 6.3 결과 페이지

```javascript
const MathEvaluationResult = () => {
    const location = useLocation();
    const { results } = location.state || {};
    
    const correctCount = results.filter(r => r.isCorrect).length;
    const totalCount = results.length;
    const accuracy = (correctCount / totalCount * 100).toFixed(1);
    const grade = calculateGrade(accuracy);
    
    return (
        <div className="result-page">
            <div className="summary">
                <h2>평가 결과</h2>
                <div className="score">
                    {correctCount} / {totalCount} ({accuracy}%)
                </div>
                <div className="grade">
                    {grade}등급
                </div>
            </div>
            
            <div className="problem-results">
                {results.map((result, index) => (
                    <div 
                        key={index}
                        className={`result-item ${result.isCorrect ? 'correct' : 'wrong'}`}
                    >
                        <span>문제 {index + 1}</span>
                        <span>{result.isCorrect ? '⭕' : '❌'}</span>
                        {!result.isCorrect && (
                            <span>정답: {result.correctAnswer}</span>
                        )}
                    </div>
                ))}
            </div>
            
            <button onClick={() => navigate('/dashboard')}>
                대시보드로 이동
            </button>
        </div>
    );
};
```

---

## 7. 등급 산출

### 7.1 등급 기준

| 등급 | 정답률 범위 |
|------|-------------|
| 1등급 | 96% 이상 |
| 2등급 | 89% ~ 95% |
| 3등급 | 77% ~ 88% |
| 4등급 | 60% ~ 76% |
| 5등급 | 60% 미만 |

### 7.2 등급 계산

```javascript
const calculateGrade = (accuracy) => {
    if (accuracy >= 96) return 1;
    if (accuracy >= 89) return 2;
    if (accuracy >= 77) return 3;
    if (accuracy >= 60) return 4;
    return 5;
};
```

---

## 8. 통계 분석

### 8.1 MathStatisticsService

```java
@Service
public class MathStatisticsService {
    
    public StudentMathStats getStudentStats(Long studentId) {
        List<MathProblemAttempt> attempts = attemptRepository.findByStudentId(studentId);
        
        int totalAttempts = attempts.size();
        int correctCount = (int) attempts.stream().filter(MathProblemAttempt::getIsCorrect).count();
        double accuracy = totalAttempts > 0 ? (double) correctCount / totalAttempts * 100 : 0;
        
        // 과목별 분석
        Map<String, Double> subjectAccuracy = attempts.stream()
            .collect(Collectors.groupingBy(
                a -> a.getMathProblem().getSubject(),
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    list -> {
                        long correct = list.stream().filter(MathProblemAttempt::getIsCorrect).count();
                        return (double) correct / list.size() * 100;
                    }
                )
            ));
        
        // 약점 분야 식별
        List<String> weakSubjects = subjectAccuracy.entrySet().stream()
            .filter(e -> e.getValue() < 60)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
        
        return StudentMathStats.builder()
            .totalAttempts(totalAttempts)
            .correctCount(correctCount)
            .accuracy(accuracy)
            .subjectAccuracy(subjectAccuracy)
            .weakSubjects(weakSubjects)
            .build();
    }
}
```

---

## 9. 문제 이미지 관리

### 9.1 이미지 경로 구조

```
front/src/features/evaluation/math_image/
├── 2025_06/
│   ├── 01.png
│   ├── 02.png
│   └── ...
└── 2025_09/
    ├── 01.png
    ├── 02.png
    └── ...
```

### 9.2 이미지 경로 생성

```javascript
const getImagePath = (examMonthYear, problemNumber) => {
    const paddedNumber = problemNumber.toString().padStart(2, '0');
    return `/math_image/${examMonthYear}/${paddedNumber}.png`;
};
```

---

## 10. 향후 계획

### 10.1 추가 예정 기능

- [ ] 미적분 문제 추가
- [ ] 확률과통계 문제 추가
- [ ] 기하 문제 추가
- [ ] AI 기반 오답 해설
- [ ] 맞춤형 문제 추천
- [ ] 풀이 과정 입력 기능
