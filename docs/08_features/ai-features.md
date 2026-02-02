# AI 기능

**관련 문서**: [Face API 학습 측정](./face-api.md) | [수학 평가 시스템](./math-evaluation.md)

---

## 1. 개요

Hamcam은 Gemini AI를 활용하여 학습 계획 생성, AI 피드백, 학습 회고 등 다양한 AI 기반 학습 지원 기능을 제공합니다.

### 1.1 AI 활용 기능

| 기능 | 설명 |
|------|------|
| 학습 계획 생성 | 개인화된 학습 계획 자동 생성 |
| AI 피드백 | 평가 후 맞춤형 피드백 제공 |
| 오답 해설 | 틀린 문제에 대한 AI 해설 |
| 학습 회고 | 주간/기간별 AI 학습 분석 |
| 게시글 자동 생성 | 문제 기반 게시글 내용 자동 채우기 |
| 목표 제안 | AI 기반 학습 목표 추천 |

### 1.2 기술 스택

| 기술 | 용도 |
|------|------|
| **Gemini AI** | Google의 멀티모달 AI 모델 |
| **Spring WebFlux** | 비동기 HTTP 클라이언트 |
| **WebClient** | Gemini API 호출 |

---

## 2. Gemini AI 설정

### 2.1 WebClientConfig

```java
@Configuration
public class WebClientConfig {
    
    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }
}
```

### 2.2 환경 변수

```properties
gemini.api.key=your-gemini-api-key
```

---

## 3. 학습 계획 생성

### 3.1 기능 설명

사용자 정보(학년, 과목, 학습 습관 등)를 기반으로 개인화된 학습 계획을 생성합니다.

### 3.2 API

```
POST /api/ai/plan
Content-Type: application/json
```

**요청**
```json
{
    "userId": 1,
    "targetExam": "수능",
    "examDate": "2025-11-14",
    "subjects": ["수학", "영어"],
    "studyHoursPerDay": 8,
    "preferences": {
        "preferMorning": true,
        "focusOnWeakSubjects": true
    }
}
```

**응답**
```json
{
    "success": true,
    "data": {
        "weeklyPlan": [
            {
                "day": "월요일",
                "schedule": [
                    {
                        "time": "06:00-08:00",
                        "subject": "수학",
                        "topic": "미적분 개념 복습",
                        "duration": 120
                    },
                    {
                        "time": "09:00-11:00",
                        "subject": "영어",
                        "topic": "독해 문제풀이",
                        "duration": 120
                    }
                ]
            }
        ],
        "recommendations": [
            "수학 약점 분야인 미적분에 더 집중하세요",
            "아침 시간대에 집중력이 높으므로 어려운 과목을 배치했습니다"
        ]
    }
}
```

### 3.3 서비스 구현

```java
@Service
@RequiredArgsConstructor
public class AIPlanService {
    
    private final WebClient geminiWebClient;
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    public Mono<PlanResponse> generatePlan(PlanRequest request) {
        String prompt = buildPlanPrompt(request);
        
        return geminiWebClient.post()
            .uri("/v1beta/models/gemini-pro:generateContent?key=" + apiKey)
            .bodyValue(Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", prompt))
                ))
            ))
            .retrieve()
            .bodyToMono(GeminiResponse.class)
            .map(this::parsePlanResponse);
    }
    
    private String buildPlanPrompt(PlanRequest request) {
        return String.format("""
            학생 정보:
            - 목표 시험: %s
            - 시험 날짜: %s
            - 선택 과목: %s
            - 하루 학습 시간: %d시간
            
            위 정보를 바탕으로 효과적인 주간 학습 계획을 JSON 형식으로 생성해주세요.
            """, request.getTargetExam(), request.getExamDate(), 
            request.getSubjects(), request.getStudyHoursPerDay());
    }
}
```

---

## 4. AI 피드백

### 4.1 기능 설명

평가 완료 후 학생의 성적과 답안을 분석하여 맞춤형 피드백을 제공합니다.

### 4.2 AIFeedbackController

```java
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIFeedbackController {
    
    private final AIFeedbackService aiFeedbackService;
    
    @PostMapping("/feedback")
    public ResponseEntity<ApiResponse<FeedbackResponse>> generateFeedback(
            @RequestBody FeedbackRequest request) {
        FeedbackResponse response = aiFeedbackService.generateFeedback(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
```

### 4.3 AIFeedbackService

```java
@Service
@RequiredArgsConstructor
public class AIFeedbackService {
    
    private final WebClient geminiWebClient;
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    public FeedbackResponse generateFeedback(FeedbackRequest request) {
        // 학생 성적 분석
        double accuracy = calculateAccuracy(request.getResults());
        List<String> weakAreas = identifyWeakAreas(request.getResults());
        
        // Gemini AI 호출
        String prompt = buildFeedbackPrompt(accuracy, weakAreas, request);
        String aiResponse = callGeminiAPI(prompt);
        
        return FeedbackResponse.builder()
            .accuracy(accuracy)
            .grade(calculateGrade(accuracy))
            .weakAreas(weakAreas)
            .aiFeedback(aiResponse)
            .recommendations(parseRecommendations(aiResponse))
            .build();
    }
    
    private String buildFeedbackPrompt(double accuracy, List<String> weakAreas, 
                                        FeedbackRequest request) {
        return String.format("""
            학생 평가 결과:
            - 정답률: %.1f%%
            - 약점 분야: %s
            - 틀린 문제 유형: %s
            
            위 결과를 바탕으로 학습 피드백과 개선 방안을 제시해주세요.
            1. 현재 학습 상태 분석
            2. 약점 분야 개선 방안
            3. 추천 학습 전략
            4. 격려의 말
            """, accuracy, weakAreas, request.getWrongProblemTypes());
    }
}
```

---

## 5. 오답 해설

### 5.1 기능 설명

틀린 문제에 대해 AI가 상세한 풀이 과정과 해설을 제공합니다.

### 5.2 API

```
POST /api/ai/explanation
```

**요청**
```json
{
    "problemId": 1,
    "studentAnswer": "3",
    "correctAnswer": "5"
}
```

**응답**
```json
{
    "success": true,
    "data": {
        "explanation": "이 문제는 지수법칙을 활용하는 문제입니다...",
        "stepByStep": [
            "1단계: 주어진 식을 분석합니다...",
            "2단계: 지수법칙 a^m × a^n = a^(m+n)을 적용합니다...",
            "3단계: 계산 결과 5가 도출됩니다."
        ],
        "commonMistakes": [
            "지수를 곱하는 실수를 범함",
            "음수 지수 처리 오류"
        ],
        "relatedConcepts": ["지수법칙", "지수의 성질"],
        "practiceProblems": [2, 5, 8]
    }
}
```

### 5.3 서비스 구현

```java
public ExplanationResponse generateExplanation(Long problemId, 
                                                String studentAnswer) {
    MathProblem problem = mathProblemRepository.findById(problemId)
        .orElseThrow();
    
    String prompt = String.format("""
        문제 정보:
        - 분야: %s
        - 정답: %s
        - 학생 답안: %s
        - 배점: %d점
        
        이 문제에 대한 상세 풀이를 제공해주세요:
        1. 문제 접근 방법
        2. 단계별 풀이 과정
        3. 학생이 틀린 이유 분석
        4. 유사 문제 대비 팁
        """, problem.getSubjectDetail(), problem.getAnswer(), 
        studentAnswer, problem.getPoints());
    
    String aiResponse = callGeminiAPI(prompt);
    return parseExplanationResponse(aiResponse);
}
```

---

## 6. 학습 회고 (GPT Reflection)

### 6.1 기능 설명

주간/기간별 학습 데이터를 분석하여 AI 기반 학습 회고를 생성합니다.

### 6.2 GPTReflectionService

```java
@Service
@RequiredArgsConstructor
public class GPTReflectionService {
    
    private final WebClient geminiWebClient;
    private final DashboardService dashboardService;
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    public WeeklyReflectionResponse generateWeeklyReflection(
            Long userId, LocalDate weekStart) {
        
        // 주간 학습 데이터 수집
        WeeklyStats stats = dashboardService.getWeeklyStats(userId, weekStart);
        List<Todo> completedTodos = dashboardService.getCompletedTodos(userId, weekStart);
        
        // AI 회고 생성
        String prompt = buildReflectionPrompt(stats, completedTodos);
        String aiResponse = callGeminiAPI(prompt);
        
        return WeeklyReflectionResponse.builder()
            .weekStart(weekStart)
            .totalStudyMinutes(stats.getTotalMinutes())
            .reflection(aiResponse)
            .strengths(parseStrengths(aiResponse))
            .improvements(parseImprovements(aiResponse))
            .recommendations(parseRecommendations(aiResponse))
            .build();
    }
    
    private String buildReflectionPrompt(WeeklyStats stats, List<Todo> todos) {
        return String.format("""
            이번 주 학습 현황:
            - 총 학습 시간: %d분
            - 일별 학습: %s
            - 완료한 목표: %s
            - 과목별 분포: %s
            
            위 데이터를 바탕으로 학습 회고를 작성해주세요:
            1. 이번 주 잘한 점
            2. 개선이 필요한 점
            3. 다음 주 학습 제안
            """, stats.getTotalMinutes(), stats.getDailyBreakdown(), 
            todos.stream().map(Todo::getTitle).collect(Collectors.joining(", ")),
            stats.getSubjectDistribution());
    }
}
```

### 6.3 API 엔드포인트

```java
// 주간 회고
@PostMapping("/dashboard/reflection/weekly")
public ResponseEntity<WeeklyReflectionResponse> getWeeklyReflection(
        @RequestBody WeeklyReflectionRequest request,
        HttpServletRequest httpRequest) {
    return ResponseEntity.ok(
        gptReflectionService.generateWeeklyReflection(
            SessionUtil.getUserId(httpRequest), 
            request.getWeekStart()
        )
    );
}

// 기간별 회고
@PostMapping("/dashboard/reflection/range")
public ResponseEntity<ReflectionResponse> getRangeReflection(
        @RequestBody RangeReflectionRequest request,
        HttpServletRequest httpRequest) {
    return ResponseEntity.ok(
        gptReflectionService.generateRangeReflection(
            SessionUtil.getUserId(httpRequest),
            request.getStartDate(),
            request.getEndDate()
        )
    );
}
```

---

## 7. 목표 제안

### 7.1 기능 설명

사용자의 학습 패턴과 성과를 분석하여 적절한 학습 목표를 제안합니다.

### 7.2 API

```
GET /api/dashboard/goals/suggestion
```

**응답**
```json
{
    "suggestions": [
        {
            "title": "주 30시간 학습 달성",
            "reason": "지난 3주 평균 학습 시간이 25시간입니다. 5시간 증가를 목표로 하세요.",
            "difficulty": "MEDIUM"
        },
        {
            "title": "수학 매일 2시간 학습",
            "reason": "수학 정답률이 60%입니다. 꾸준한 학습이 필요합니다.",
            "difficulty": "HARD"
        }
    ]
}
```

---

## 8. 성능 분석

### 8.1 PerformanceAnalysisService

```java
@Service
@RequiredArgsConstructor
public class PerformanceAnalysisService {
    
    private final MathProblemAttemptRepository attemptRepository;
    private final StudyTimeRepository studyTimeRepository;
    
    public PerformanceAnalysis analyzePerformance(Long userId, LocalDate startDate) {
        // 학습 시간 분석
        List<StudyTime> studyTimes = studyTimeRepository
            .findByUserIdAndDateAfter(userId, startDate);
        
        // 평가 성과 분석
        List<MathProblemAttempt> attempts = attemptRepository
            .findByStudentIdAndDateAfter(userId, startDate);
        
        // AI 종합 분석
        String aiAnalysis = generateAIAnalysis(studyTimes, attempts);
        
        return PerformanceAnalysis.builder()
            .studyTimeStats(calculateStudyTimeStats(studyTimes))
            .evaluationStats(calculateEvaluationStats(attempts))
            .aiAnalysis(aiAnalysis)
            .trend(analyzeTrend(studyTimes, attempts))
            .build();
    }
}
```

---

## 9. 게시글 자동 생성

### 9.1 기능 설명

질문 게시글 작성 시 문제 정보를 기반으로 내용을 자동으로 채워줍니다.

### 9.2 API

```
POST /api/ai/auto-fill
```

**요청**
```json
{
    "problemId": 1,
    "questionType": "풀이 질문"
}
```

**응답**
```json
{
    "success": true,
    "data": {
        "title": "[수학] 2025년 6월 모의평가 5번 문제 풀이 질문",
        "content": "2025년 6월 모의평가 5번 문제에 대해 질문합니다.\n\n문제 분야: 지수법칙\n난이도: 3등급\n\n[질문 내용]\n(여기에 구체적인 질문을 작성해주세요)\n\n[시도한 풀이]\n(시도한 풀이 과정을 작성해주세요)",
        "category": "질문"
    }
}
```

---

## 10. 에러 처리

### 10.1 API 호출 실패

```java
public String callGeminiAPI(String prompt) {
    try {
        return geminiWebClient.post()
            .uri("/v1beta/models/gemini-pro:generateContent?key=" + apiKey)
            .bodyValue(createRequestBody(prompt))
            .retrieve()
            .bodyToMono(String.class)
            .block(Duration.ofSeconds(30));
    } catch (WebClientResponseException e) {
        log.error("Gemini API 호출 실패: {}", e.getMessage());
        throw new AIServiceException("AI 서비스 일시적 오류", e);
    } catch (TimeoutException e) {
        log.error("Gemini API 타임아웃");
        throw new AIServiceException("AI 응답 시간 초과", e);
    }
}
```

### 10.2 폴백 처리

```java
public FeedbackResponse generateFeedbackWithFallback(FeedbackRequest request) {
    try {
        return generateFeedback(request);
    } catch (AIServiceException e) {
        // 기본 피드백 반환
        return FeedbackResponse.builder()
            .accuracy(calculateAccuracy(request.getResults()))
            .grade(calculateGrade(request.getResults()))
            .aiFeedback("AI 피드백을 생성할 수 없습니다. 나중에 다시 시도해주세요.")
            .build();
    }
}
```

---

## 11. 요금 관리

### 11.1 API 호출 제한

```java
@Service
public class AIRateLimiter {
    
    private final Map<Long, Integer> userCallCount = new ConcurrentHashMap<>();
    private static final int MAX_CALLS_PER_DAY = 100;
    
    public boolean canMakeRequest(Long userId) {
        int count = userCallCount.getOrDefault(userId, 0);
        return count < MAX_CALLS_PER_DAY;
    }
    
    public void incrementCount(Long userId) {
        userCallCount.merge(userId, 1, Integer::sum);
    }
}
```
