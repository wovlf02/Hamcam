# 프론트엔드 API 연동 가이드

**관련 문서**: [API 개요](../05_api/README.md) | [프론트엔드 구조](./frontend-structure.md)

---

## 📋 개요

Hamcam 프론트엔드는 React를 기반으로 하며, Axios를 통해 백엔드 API와 통신합니다.

---

## 📁 API 관련 파일 구조

```
front/src/
├── api/
│   ├── api.js              # Axios 인스턴스 설정
│   └── apiUrl.js           # API 서버 URL 설정
├── features/
│   ├── auth/
│   │   └── pages/
│   │       ├── Login.js    # 로그인 페이지
│   │       └── Register.js # 회원가입 페이지
│   ├── dashboard/
│   │   └── pages/
│   │       └── Dashboard.js # 대시보드
│   ├── community/
│   │   └── pages/
│   │       ├── Community.js # 커뮤니티 메인
│   │       ├── Post.js      # 게시글 상세
│   │       ├── Chat.js      # 채팅
│   │       └── Friend.js    # 친구 관리
│   ├── study/
│   │   └── pages/
│   │       ├── TeamStudy.js    # 팀 스터디
│   │       ├── QuizRoom.js     # 퀴즈방
│   │       └── PersonalStudy.js # 개인 학습
│   ├── evaluation/
│   │   └── pages/
│   │       ├── UnitEvaluation.js        # 단원평가
│   │       └── UnitEvaluationFeedback.js # 평가 피드백
│   ├── plan/
│   │   └── pages/
│   │       └── PlanMenu.js  # AI 학습 계획
│   └── rtc/
│       └── pages/
│           ├── RoomList.js   # 방 목록
│           └── VideoRoom.js  # 화상 스터디방
├── socket.js               # Socket.IO 설정
└── utils/                  # 유틸리티 함수
```

---

## 🔧 Axios 설정 (api.js)

### 기본 설정

```javascript
import axios from 'axios';
import { API_BASE_URL_8080 } from './apiUrl';

// Axios 인스턴스 생성
const api = axios.create({
    baseURL: `${API_BASE_URL_8080}/api`,
    timeout: 10000,
    withCredentials: true,  // ✅ 세션 쿠키 자동 포함 (필수)
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### 요청/응답 인터셉터 (선택)

```javascript
// 요청 인터셉터: 디버깅용
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 인증 실패 시 리디렉션
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.warn('인증 실패: 로그인 페이지로 이동');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

### 파일 업로드 확장 메서드

```javascript
// 단일/다중 파일 업로드 지원
api.upload = async (url, files, extraData = {}) => {
    const formData = new FormData();

    // 파일 배열로 처리
    const fileArray = Array.isArray(files) ? files : [files];
    fileArray.forEach((file) => {
        formData.append('file', file);
    });

    // 추가 데이터 함께 전송
    Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
    });

    return api.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default api;
```

---

## 🔐 인증 API 사용 예시

### 로그인

```javascript
import api from '../../api/api';

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username,
            password
        });
        
        if (response.data.success) {
            // LocalStorage에 사용자 정보 저장
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data.data;
        }
    } catch (error) {
        console.error('로그인 실패:', error);
        throw error;
    }
};
```

### 회원가입 (파일 포함)

```javascript
const register = async (formData, profileImage) => {
    try {
        const formDataObj = new FormData();
        formDataObj.append('request', JSON.stringify(formData));
        
        if (profileImage) {
            formDataObj.append('profileImage', profileImage);
        }
        
        const response = await api.post('/auth/register', formDataObj, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data;
    } catch (error) {
        console.error('회원가입 실패:', error);
        throw error;
    }
};
```

---

## 📊 대시보드 API 사용 예시

### Todo 목록 조회

```javascript
const getTodosByDate = async (date) => {
    try {
        const response = await api.post('/dashboard/todos/date', {
            date: date  // "2025-01-15" 형식
        });
        return response.data;
    } catch (error) {
        console.error('Todo 조회 실패:', error);
        throw error;
    }
};
```

### Todo 생성

```javascript
const createTodo = async (todoData) => {
    try {
        const response = await api.post('/dashboard/todos', {
            title: todoData.title,
            description: todoData.description,
            todoDate: todoData.date,
            priority: todoData.priority  // "LOW", "MEDIUM", "HIGH"
        });
        return response.data;
    } catch (error) {
        console.error('Todo 생성 실패:', error);
        throw error;
    }
};
```

### Todo 완료 토글

```javascript
const toggleTodoCompletion = async (todoId) => {
    try {
        const response = await api.put('/dashboard/todos/complete', {
            todoId: todoId
        });
        return response.data;
    } catch (error) {
        console.error('Todo 완료 토글 실패:', error);
        throw error;
    }
};
```

---

## 💬 커뮤니티 API 사용 예시

### 게시글 목록 조회

```javascript
const getPostList = async (page = 1, category = null, keyword = null) => {
    try {
        const response = await api.post('/community/posts/list', {
            page,
            size: 10,
            category,
            searchType: keyword ? 'title_content' : null,
            keyword
        });
        return response.data;
    } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
        throw error;
    }
};
```

### 게시글 작성 (파일 포함)

```javascript
const createPost = async (title, content, category, tag, file) => {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        
        if (tag) formData.append('tag', tag);
        if (file) formData.append('file', file);
        
        const response = await api.post('/community/posts/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        return response.data;
    } catch (error) {
        console.error('게시글 작성 실패:', error);
        throw error;
    }
};
```

### 댓글 작성

```javascript
const createComment = async (postId, content) => {
    try {
        const response = await api.post('/community/comments/create', {
            postId,
            content
        });
        return response.data;
    } catch (error) {
        console.error('댓글 작성 실패:', error);
        throw error;
    }
};
```

---

## 📱 채팅 API 사용 예시

### 채팅방 생성

```javascript
const createChatRoom = async (roomName, invitedUserIds, image = null) => {
    try {
        if (image) {
            const formData = new FormData();
            formData.append('request', JSON.stringify({ roomName, invitedUserIds }));
            formData.append('image', image);
            
            const response = await api.post('/chat/rooms', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data.data;
        } else {
            const response = await api.post('/chat/rooms', {
                roomName,
                invitedUserIds
            });
            return response.data.data;
        }
    } catch (error) {
        console.error('채팅방 생성 실패:', error);
        throw error;
    }
};
```

### 1:1 채팅 시작

```javascript
const startDirectChat = async (targetUserId) => {
    try {
        const response = await api.post('/chat/direct/start', { targetUserId });
        return response.data.data;
    } catch (error) {
        console.error('1:1 채팅 시작 실패:', error);
        throw error;
    }
};
```

---

## 👥 친구 API 사용 예시

### 친구 요청 전송

```javascript
const sendFriendRequest = async (targetUserId) => {
    try {
        const response = await api.post('/friends/request', { targetUserId });
        return response.data;
    } catch (error) {
        console.error('친구 요청 실패:', error);
        throw error;
    }
};
```

### 친구 목록 조회

```javascript
const getFriendList = async () => {
    try {
        const response = await api.get('/friends/list');
        return response.data;
    } catch (error) {
        console.error('친구 목록 조회 실패:', error);
        throw error;
    }
};
```

### 사용자 검색

```javascript
const searchUsers = async (nickname) => {
    try {
        const response = await api.post('/friends/search', { nickname });
        return response.data;
    } catch (error) {
        console.error('사용자 검색 실패:', error);
        throw error;
    }
};
```

---

## 📚 학습 API 사용 예시

### 팀방 생성

```javascript
const createTeamRoom = async (roomData) => {
    try {
        const response = await api.post('/study/team/create', {
            title: roomData.title,
            roomType: roomData.roomType,  // "FOCUS" or "QUIZ"
            password: roomData.password,
            maxParticipants: roomData.maxParticipants,
            targetTime: roomData.targetTime,
            subject: roomData.subject,
            grade: roomData.grade
        });
        return response.data;
    } catch (error) {
        console.error('팀방 생성 실패:', error);
        throw error;
    }
};
```

### AI 학습 계획 생성

```javascript
const generateStudyPlan = async (subject, grade, weeks, range) => {
    try {
        const response = await api.post('/plan/generate', {
            subject,
            grade,
            weeks,
            range
        });
        return response.data;
    } catch (error) {
        console.error('학습 계획 생성 실패:', error);
        throw error;
    }
};
```

---

## 📝 평가 API 사용 예시

### 단원평가 시작

```javascript
const startEvaluation = async (subject, unitName) => {
    try {
        const response = await api.post('/evaluation/start', {
            subject,
            unitName
        });
        return response.data;
    } catch (error) {
        console.error('단원평가 시작 실패:', error);
        throw error;
    }
};
```

### 답안 제출

```javascript
const submitAnswers = async (evaluationId, answers) => {
    try {
        const response = await api.post('/evaluation/submit', {
            evaluationId,
            answers  // [{ problemId, selectedAnswer, timeSpent }]
        });
        return response.data;
    } catch (error) {
        console.error('답안 제출 실패:', error);
        throw error;
    }
};
```

---

## 🔌 Socket.IO 연동

### socket.js 설정

```javascript
import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
    if (!socket) {
        socket = io('http://localhost:4000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        
        socket.on('connect', () => {
            console.log('✅ Socket 연결됨:', socket.id);
        });
        
        socket.on('disconnect', () => {
            console.log('❌ Socket 연결 해제');
        });
    }
    
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
```

### 방 입장

```javascript
import { getSocket } from '../../socket';

const joinRoom = (roomId) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('join-room', {
            roomId: roomId.toString(),
            token: null
        });
    }
};
```

### 메시지 전송

```javascript
const sendMessage = (roomId, message) => {
    const socket = getSocket();
    if (socket) {
        socket.emit('send-message', {
            roomId: roomId.toString(),
            message
        });
    }
};
```

---

## 🎯 Custom Hooks 예시

### useApi Hook

```javascript
import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await apiFunc(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunc]);
    
    return { data, loading, error, execute };
};

// 사용 예시
const { data, loading, error, execute } = useApi(getPostList);

useEffect(() => {
    execute(1, 'QUESTION', null);
}, []);
```

---

## ⚠️ 에러 처리

### 공통 에러 핸들러

```javascript
const handleApiError = (error) => {
    if (error.response) {
        // 서버가 응답을 보낸 경우
        switch (error.response.status) {
            case 400:
                alert('잘못된 요청입니다.');
                break;
            case 401:
                alert('로그인이 필요합니다.');
                window.location.href = '/login';
                break;
            case 403:
                alert('권한이 없습니다.');
                break;
            case 404:
                alert('요청한 리소스를 찾을 수 없습니다.');
                break;
            case 500:
                alert('서버 오류가 발생했습니다.');
                break;
            default:
                alert('알 수 없는 오류가 발생했습니다.');
        }
    } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        alert('서버와 연결할 수 없습니다.');
    } else {
        // 요청 설정 중 오류가 발생한 경우
        alert('요청 중 오류가 발생했습니다.');
    }
};
```

---

## 💡 모범 사례

### 1. 환경 변수 사용

```javascript
// .env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_SOCKET_URL=http://localhost:4000

// apiUrl.js
export const API_BASE_URL_8080 = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';
```

### 2. API 함수 모듈화

```javascript
// services/postService.js
import api from '../api/api';

export const postService = {
    getList: (page, category, keyword) => 
        api.post('/community/posts/list', { page, size: 10, category, keyword }),
    
    getDetail: (postId) => 
        api.post('/community/posts/detail', { postId }),
    
    create: (title, content, category, tag, file) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        if (tag) formData.append('tag', tag);
        if (file) formData.append('file', file);
        return api.post('/community/posts/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    
    update: (postId, data) => 
        api.post('/community/posts/update', { postId, ...data }),
    
    delete: (postId) => 
        api.post('/community/posts/delete', { postId })
};
```

### 3. 로딩 상태 관리

```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
    setLoading(true);
    try {
        const result = await api.get('/some-endpoint');
        setData(result.data);
    } catch (error) {
        handleApiError(error);
    } finally {
        setLoading(false);
    }
};

return (
    <div>
        {loading ? <LoadingSpinner /> : <Content data={data} />}
    </div>
);
```

### 4. 낙관적 업데이트

```javascript
const toggleTodo = async (todoId) => {
    // UI 먼저 업데이트
    setTodos(prev => 
        prev.map(todo => 
            todo.id === todoId 
                ? { ...todo, completed: !todo.completed }
                : todo
        )
    );
    
    try {
        // 서버에 요청
        await api.put('/dashboard/todos/complete', { todoId });
    } catch (error) {
        // 실패 시 롤백
        setTodos(prev => 
            prev.map(todo => 
                todo.id === todoId 
                    ? { ...todo, completed: !todo.completed }
                    : todo
            )
        );
        handleApiError(error);
    }
};
```
