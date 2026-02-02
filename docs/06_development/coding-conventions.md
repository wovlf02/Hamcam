# 코딩 컨벤션

**관련 문서**: [개발 환경 설정](./setup.md) | [Git 컨벤션](./git-convention.md)

---

## 1. 공통 규칙

### 1.1 파일 인코딩

- UTF-8 사용
- 파일 끝에 빈 줄 추가
- 들여쓰기: 공백 4칸 (탭 사용 금지)

### 1.2 줄 길이

- 최대 120자 권장
- 불가피한 경우 줄 바꿈

### 1.3 주석

- 영어 또는 한국어 일관성 유지
- 복잡한 로직에는 반드시 주석 추가
- TODO, FIXME 태그 적극 활용

---

## 2. Java (백엔드)

### 2.1 네이밍 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| 클래스 | PascalCase | `AuthController`, `UserService` |
| 메서드 | camelCase | `getUserById()`, `createPost()` |
| 변수 | camelCase | `userName`, `postId` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 패키지 | lowercase | `com.hamcam.back.controller` |

### 2.2 패키지 구조

```
com.hamcam.back/
├── config/          # 설정 클래스
├── controller/      # REST 컨트롤러
├── dto/             # 데이터 전송 객체
│   ├── request/     # 요청 DTO
│   └── response/    # 응답 DTO
├── entity/          # JPA 엔티티
├── repository/      # 데이터 액세스
├── service/         # 비즈니스 로직
└── util/            # 유틸리티
```

### 2.3 클래스 구조

```java
// 1. 패키지 선언
package com.hamcam.back.service;

// 2. import (표준 라이브러리 → 외부 라이브러리 → 프로젝트 내부)
import java.util.List;
import lombok.RequiredArgsConstructor;
import com.hamcam.back.entity.User;

// 3. 클래스 선언
@Service
@RequiredArgsConstructor
public class UserService {

    // 4. 상수
    private static final int MAX_USERS = 100;

    // 5. 필드 (final 먼저)
    private final UserRepository userRepository;

    // 6. 생성자 (Lombok @RequiredArgsConstructor 사용)

    // 7. public 메서드
    public User findById(Long id) { ... }

    // 8. private 메서드
    private void validate(User user) { ... }
}
```

### 2.4 Lombok 사용

```java
// 권장
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User { ... }

// 서비스/컨트롤러
@Slf4j
@RequiredArgsConstructor
public class UserService { ... }
```

### 2.5 API 응답 형식

```java
// 표준 응답 사용
return ResponseEntity.ok(ApiResponse.ok(data));
return ResponseEntity.ok(ApiResponse.ok("성공 메시지", data));
return ResponseEntity.ok(ApiResponse.fail("오류 메시지"));
```

### 2.6 예외 처리

```java
// 커스텀 예외 정의
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("사용자를 찾을 수 없습니다: " + id);
    }
}

// 사용
throw new UserNotFoundException(userId);
```

### 2.7 트랜잭션

```java
// 읽기 전용
@Transactional(readOnly = true)
public List<User> findAll() { ... }

// 쓰기
@Transactional
public User save(User user) { ... }
```

---

## 3. JavaScript/React (프론트엔드)

### 3.1 네이밍 규칙

| 유형 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `LoginPage`, `NavBar` |
| 함수 | camelCase | `handleSubmit`, `fetchData` |
| 변수 | camelCase | `userName`, `isLoading` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 파일 (컴포넌트) | PascalCase.js | `LoginPage.js` |
| 파일 (유틸) | camelCase.js | `apiClient.js` |
| CSS 클래스 | kebab-case | `nav-bar`, `login-form` |

### 3.2 폴더 구조

```
src/
├── api/             # API 통신
├── assets/          # 정적 자원
├── features/        # 기능별 모듈
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       └── styles/
├── global/          # 전역 컴포넌트
├── hooks/           # 전역 훅
└── utils/           # 유틸리티
```

### 3.3 컴포넌트 구조

```javascript
// 1. import (React → 외부 → 내부)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/api';
import './LoginPage.css';

// 2. 컴포넌트 정의
const LoginPage = () => {
    // 3. hooks (useState → useEffect → custom hooks)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    useEffect(() => {
        // 초기화 로직
    }, []);

    // 4. 이벤트 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        // 로그인 처리
    };

    // 5. render
    return (
        <div className="login-page">
            <form onSubmit={handleSubmit}>
                {/* ... */}
            </form>
        </div>
    );
};

// 6. export
export default LoginPage;
```

### 3.4 styled-components

```javascript
import styled from 'styled-components';

// 컴포넌트 정의
const Button = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

// 확장
const PrimaryButton = styled(Button)`
    font-weight: bold;
`;
```

### 3.5 API 호출

```javascript
// api.js 인스턴스 사용
import api from '../../api/api';

// GET 요청
const fetchUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('사용자 조회 실패:', error);
        throw error;
    }
};

// POST 요청
const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};
```

### 3.6 이벤트 핸들러

```javascript
// 권장: handle 접두사
const handleClick = () => { ... };
const handleSubmit = (e) => { ... };
const handleInputChange = (e) => { ... };

// JSX에서 사용
<button onClick={handleClick}>클릭</button>
<form onSubmit={handleSubmit}>
<input onChange={handleInputChange} />
```

---

## 4. CSS

### 4.1 BEM 네이밍 (권장)

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__content { }
.card__footer { }

/* Modifier */
.card--highlighted { }
.card__button--disabled { }
```

### 4.2 순서

```css
.element {
    /* 1. 위치 */
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;

    /* 2. 박스 모델 */
    display: flex;
    width: 100px;
    height: 100px;
    margin: 10px;
    padding: 10px;

    /* 3. 배경/테두리 */
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;

    /* 4. 타이포그래피 */
    font-size: 14px;
    font-weight: bold;
    color: #333;

    /* 5. 기타 */
    cursor: pointer;
    transition: all 0.3s ease;
}
```

---

## 5. Git 커밋 메시지

### 5.1 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 5.2 타입

| 타입 | 설명 |
|------|------|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| docs | 문서 변경 |
| style | 코드 포맷팅 |
| refactor | 리팩토링 |
| test | 테스트 추가 |
| chore | 빌드/설정 변경 |

### 5.3 예시

```
feat(auth): 로그인 기능 구현

- 세션 기반 인증 구현
- LocalStorage에 사용자 정보 저장
- withCredentials 설정 추가

Closes #123
```

---

## 6. 코드 리뷰 가이드

### 6.1 체크리스트

- [ ] 기능이 정상 동작하는가?
- [ ] 코딩 컨벤션을 준수했는가?
- [ ] 불필요한 코드가 없는가?
- [ ] 적절한 에러 처리가 되어있는가?
- [ ] 테스트가 작성되었는가?
- [ ] 문서화가 필요한 부분이 있는가?

### 6.2 리뷰 코멘트 예시

```
// 좋음
[제안] 이 부분은 Optional을 사용하면 null 체크를 간결하게 할 수 있습니다.

// 피드백
[수정 필요] 트랜잭션 어노테이션이 누락되었습니다.

// 질문
[질문] 이 로직의 의도를 설명해 주실 수 있나요?
```
