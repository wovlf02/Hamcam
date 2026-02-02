# 인증 API

**관련 문서**: [API 개요](./README.md) | [사용자 API](./02-user.md)

---

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/api/auth/register` | 회원가입 | ❌ |
| POST | `/api/auth/login` | 로그인 | ❌ |
| DELETE | `/api/auth/withdraw` | 회원 탈퇴 | ✅ |

---

## 1. 회원가입

### 요청

```
POST /api/auth/register
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파트 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| request | JSON | ✅ | 회원가입 정보 |
| profileImage | File | ❌ | 프로필 이미지 |

### request JSON 구조

```json
{
    "username": "string",      // 로그인 아이디 (필수)
    "password": "string",      // 비밀번호 (필수)
    "name": "string",          // 이름 (필수)
    "nickname": "string",      // 닉네임 (필수)
    "email": "string",         // 이메일 (필수)
    "grade": 1,                // 학년 (필수)
    "studyHabit": "string",    // 학습 습관 (필수)
    "phone": "string",         // 전화번호 (선택)
    "subjects": ["string"]     // 관심 과목 (선택)
}
```

### 응답 (성공)

```json
{
    "success": true,
    "message": "✅ 회원가입이 완료되었습니다.",
    "data": "✅ 회원가입이 완료되었습니다."
}
```

### 응답 (실패)

```json
{
    "success": false,
    "message": "이미 존재하는 아이디입니다.",
    "data": null
}
```

### 예시

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -F "request={\"username\":\"testuser\",\"password\":\"password123\",\"name\":\"테스트\",\"nickname\":\"테스터\",\"email\":\"test@example.com\",\"grade\":1,\"studyHabit\":\"morning\"};type=application/json" \
  -F "profileImage=@/path/to/image.jpg"
```

---

## 2. 로그인

### 요청

```
POST /api/auth/login
Content-Type: application/json
```

### 요청 본문

```json
{
    "username": "string",    // 로그인 아이디 (필수)
    "password": "string"     // 비밀번호 (필수)
}
```

### 응답 (성공)

```json
{
    "success": true,
    "message": null,
    "data": {
        "user_id": 1,
        "username": "testuser",
        "name": "테스트",
        "nickname": "테스터",
        "email": "test@example.com",
        "profile_image_url": "/uploads/profile/image.jpg",
        "grade": 1,
        "study_habit": "morning",
        "phone": "010-1234-5678",
        "subjects": ["수학", "영어"],
        "point": 100,
        "created_at": "2025-01-01T00:00:00",
        "updated_at": "2025-01-01T00:00:00"
    }
}
```

### 응답 (실패)

```json
{
    "success": false,
    "message": "아이디 또는 비밀번호가 일치하지 않습니다.",
    "data": null
}
```

### 세션

- 로그인 성공 시 서버에서 세션 생성
- 응답 헤더에 `Set-Cookie: JSESSIONID=...` 포함
- 클라이언트는 이후 요청에 자동으로 쿠키 포함 (withCredentials: true)

### 예시

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt
```

---

## 3. 회원 탈퇴

### 요청

```
DELETE /api/auth/withdraw
```

### 인증

- 세션 기반 인증 필요
- Cookie: JSESSIONID 필수

### 응답 (성공)

```json
{
    "success": true,
    "message": null,
    "data": null
}
```

### 응답 (실패 - 인증 없음)

```json
{
    "success": false,
    "message": "로그인이 필요합니다.",
    "data": null
}
```

### 예시

```bash
curl -X DELETE http://localhost:8080/api/auth/withdraw \
  -b cookies.txt
```

---

## 인증 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                         로그인 흐름                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 클라이언트 → 서버                                            │
│     POST /api/auth/login                                        │
│     { "username": "...", "password": "..." }                    │
│                                                                 │
│  2. 서버 처리                                                    │
│     - 사용자 조회                                                │
│     - 비밀번호 검증                                              │
│     - HttpSession 생성                                          │
│     - 세션에 userId 저장                                         │
│     - Redis에 세션 저장                                          │
│                                                                 │
│  3. 서버 → 클라이언트                                            │
│     Set-Cookie: JSESSIONID=abc123...                            │
│     { "success": true, "data": { ... } }                        │
│                                                                 │
│  4. 클라이언트 저장                                              │
│     - 브라우저: JSESSIONID 쿠키 자동 저장                         │
│     - LocalStorage: 사용자 정보 저장                             │
│                                                                 │
│  5. 이후 API 요청                                                │
│     - Axios: withCredentials: true                              │
│     - 쿠키 자동 포함                                             │
│     - 서버: SessionUtil.getUserId(request)로 사용자 식별         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 클라이언트 구현 예시

### React (Axios)

```javascript
import api from './api';

// 회원가입
const register = async (formData) => {
    const response = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// 로그인
const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.success) {
        // LocalStorage에 사용자 정보 저장
        localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
};

// 회원 탈퇴
const withdraw = async () => {
    const response = await api.delete('/auth/withdraw');
    if (response.data.success) {
        localStorage.removeItem('user');
    }
    return response.data;
};
```

---

## 주의사항

1. **withCredentials 설정**
   - 모든 API 요청에 `withCredentials: true` 필수
   - 쿠키가 자동으로 포함됨

2. **CORS 설정**
   - 백엔드에서 허용된 Origin만 접근 가능
   - 현재: localhost:3000, 127.0.0.1:3000

3. **비밀번호 저장**
   - 현재: 평문 저장 (프로토타입 목적)
   - 프로덕션: BCrypt 해싱 권장

4. **세션 만료**
   - Redis에서 세션 관리
   - 기본 만료 시간 설정 확인 필요
