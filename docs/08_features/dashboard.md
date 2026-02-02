# 대시보드 기능

**관련 문서**: [대시보드 API](../05_api/03-dashboard.md) | [프론트엔드 구조](../03_architecture/frontend-structure.md)

---

## 1. 개요

대시보드는 사용자의 학습 현황을 한눈에 파악하고 관리할 수 있는 중앙 허브입니다.

### 1.1 주요 기능

- **Todo 관리**: 할 일 목록 CRUD 및 완료 상태 관리
- **D-Day 관리**: 시험 일정 및 남은 일수 표시
- **학습 통계**: 전체/과목별/주간/월간 학습 통계 시각화
- **목표 설정**: AI 기반 목표 제안 및 수동 설정
- **캘린더**: 월별 학습 일정 관리
- **AI 회고**: 주간/기간별 학습 회고 생성

---

## 2. UI 구성

### 2.1 레이아웃

```
┌─────────────────────────────────────────────────────────────────┐
│  대시보드                                                        │
├─────────────────────────────┬───────────────────────────────────┤
│                             │                                   │
│  ┌───────────────────────┐  │  ┌─────────────────────────────┐  │
│  │    D-Day / 시험일정    │  │  │       학습 통계 차트        │  │
│  │    수능까지 300일      │  │  │       (Recharts)           │  │
│  └───────────────────────┘  │  │                             │  │
│                             │  └─────────────────────────────┘  │
│  ┌───────────────────────┐  │                                   │
│  │      오늘의 Todo       │  │  ┌─────────────────────────────┐  │
│  │  □ 수학 문제 풀기      │  │  │        목표 진행률          │  │
│  │  ☑ 영어 단어 암기      │  │  │        주 30시간           │  │
│  └───────────────────────┘  │  └─────────────────────────────┘  │
│                             │                                   │
│  ┌───────────────────────┐  │  ┌─────────────────────────────┐  │
│  │       캘린더          │  │  │      학습 시간 요약         │  │
│  │    (react-calendar)   │  │  │      오늘: 3시간 20분       │  │
│  └───────────────────────┘  │  └─────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

---

## 3. Todo 관리

### 3.1 기능 상세

| 기능 | 설명 |
|------|------|
| 생성 | 제목, 설명, 날짜, 우선순위 입력 |
| 조회 | 날짜별 Todo 목록 조회 |
| 수정 | 제목, 설명, 우선순위 수정 |
| 삭제 | Todo 삭제 |
| 완료 토글 | 완료/미완료 상태 전환 |

### 3.2 우선순위

| 우선순위 | 표시 | 색상 |
|----------|------|------|
| HIGH | 🔴 | 빨간색 |
| MEDIUM | 🟡 | 노란색 |
| LOW | 🟢 | 초록색 |

### 3.3 컴포넌트 구현

```javascript
const TodoItem = ({ todo, onToggle, onDelete }) => {
    return (
        <div className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
            <input 
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onToggle(todo.id)}
            />
            <span className={`priority priority-${todo.priority.toLowerCase()}`}>
                {getPriorityIcon(todo.priority)}
            </span>
            <span className="title">{todo.title}</span>
            <button onClick={() => onDelete(todo.id)}>삭제</button>
        </div>
    );
};
```

---

## 4. D-Day (시험 일정)

### 4.1 기능 상세

- 시험 일정 등록/삭제
- D-Day 자동 계산
- 가장 가까운 시험 강조 표시

### 4.2 D-Day 표시

```javascript
const DDayDisplay = ({ exam }) => {
    const today = new Date();
    const examDate = new Date(exam.examDate);
    const diffTime = examDate - today;
    const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (
        <div className="dday-display">
            <h3>{exam.title}</h3>
            <div className={`dday-count ${dDay <= 30 ? 'urgent' : ''}`}>
                {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-Day' : `D+${Math.abs(dDay)}`}
            </div>
            <span className="exam-date">{exam.examDate}</span>
        </div>
    );
};
```

---

## 5. 학습 통계

### 5.1 통계 유형

| 유형 | 설명 |
|------|------|
| 전체 통계 | 총 학습 시간, 일평균, 과목별 분포 |
| 주간 통계 | 이번 주 일별 학습 시간 |
| 월간 통계 | 이번 달 일별 학습 시간 |
| 최고 집중일 | 가장 많이 학습한 날 |

### 5.2 차트 구현 (Recharts)

```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const WeeklyChart = ({ data }) => {
    return (
        <LineChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" stroke="#8884d8" />
        </LineChart>
    );
};
```

### 5.3 과목별 분포 (PieChart)

```javascript
import { PieChart, Pie, Cell } from 'recharts';

const SubjectDistribution = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                cx={200}
                cy={200}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
            >
                {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    );
};
```

---

## 6. 캘린더

### 6.1 react-calendar 사용

```javascript
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StudyCalendar = ({ events, onDateClick }) => {
    const [value, setValue] = useState(new Date());
    
    const tileContent = ({ date }) => {
        const dayEvents = events.filter(e => 
            isSameDay(new Date(e.date), date)
        );
        
        return (
            <div className="tile-content">
                {dayEvents.map((event, i) => (
                    <span key={i} className={`event-dot event-${event.type}`} />
                ))}
            </div>
        );
    };
    
    return (
        <Calendar
            value={value}
            onChange={setValue}
            onClickDay={onDateClick}
            tileContent={tileContent}
        />
    );
};
```

### 6.2 이벤트 표시

| 이벤트 타입 | 색상 | 설명 |
|-------------|------|------|
| TODO | 파란색 | 할 일 |
| EXAM | 빨간색 | 시험 |
| STUDY | 초록색 | 학습 기록 |

---

## 7. 목표 관리

### 7.1 목표 설정

```javascript
const GoalSetting = ({ onSave }) => {
    const [goals, setGoals] = useState([]);
    
    const handleAddGoal = (title, targetDate) => {
        setGoals([...goals, { title, targetDate, isAchieved: false }]);
    };
    
    const handleAISuggestion = async () => {
        const response = await api.get('/dashboard/goals/suggestion');
        // AI 제안 목표 표시
    };
    
    return (
        <div className="goal-setting">
            <h3>목표 설정</h3>
            <button onClick={handleAISuggestion}>AI 목표 제안</button>
            {/* 목표 입력 폼 */}
        </div>
    );
};
```

### 7.2 진행률 표시

```javascript
const GoalProgress = ({ goal }) => {
    const progress = calculateProgress(goal);
    
    return (
        <div className="goal-progress">
            <span>{goal.title}</span>
            <div className="progress-bar">
                <div 
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <span>{progress}%</span>
        </div>
    );
};
```

---

## 8. 학습 시간 표시

### 8.1 오늘 학습 시간

```javascript
const TodayStudyTime = ({ minutes }) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return (
        <div className="today-study-time">
            <h4>오늘 학습 시간</h4>
            <div className="time-display">
                {hours}시간 {mins}분
            </div>
        </div>
    );
};
```

### 8.2 학습 세션 기록

- Face API를 통해 자동 측정된 시간
- 수동으로 입력한 학습 시간
- 팀 스터디 참여 시간

---

## 9. AI 회고

### 9.1 기능

- 주간 학습 회고 자동 생성
- 기간별 맞춤 회고 생성
- 강점/약점 분석
- 개선 방안 제시

### 9.2 회고 표시

```javascript
const AIReflection = ({ reflection }) => {
    return (
        <div className="ai-reflection">
            <h3>📝 AI 학습 회고</h3>
            
            <div className="reflection-content">
                <ReactMarkdown>{reflection.content}</ReactMarkdown>
            </div>
            
            <div className="strengths">
                <h4>💪 잘한 점</h4>
                <ul>
                    {reflection.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            </div>
            
            <div className="improvements">
                <h4>📈 개선점</h4>
                <ul>
                    {reflection.improvements.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
```

---

## 10. 페이지 컴포넌트

### 10.1 Dashboard.js 구조

```javascript
const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [exams, setExams] = useState([]);
    const [stats, setStats] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    
    useEffect(() => {
        loadDashboardData();
    }, []);
    
    const loadDashboardData = async () => {
        const [todosRes, examsRes, statsRes] = await Promise.all([
            api.post('/dashboard/todos/date', { date: today }),
            api.get('/dashboard/exams'),
            api.get('/dashboard/stats/weekly')
        ]);
        
        setTodos(todosRes.data);
        setExams(examsRes.data);
        setStats(statsRes.data);
    };
    
    return (
        <div className="dashboard">
            <div className="left-column">
                <DDaySection exams={exams} />
                <TodoSection todos={todos} setTodos={setTodos} />
                <CalendarSection events={calendarEvents} />
            </div>
            <div className="right-column">
                <StatsSection stats={stats} />
                <GoalsSection />
                <StudyTimeSection />
            </div>
        </div>
    );
};
```
