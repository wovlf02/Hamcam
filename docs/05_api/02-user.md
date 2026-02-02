# 사용자 API

**관련 문서**: [API 개요](./README.md) | [인증 API](./01-auth.md)

---

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/api/users/me` | 내 정보 조회 | ✅ |
| PUT | `/api/users/me` | 프로필 수정 | ✅ |
| PUT | `/api/users/me/password` | 비밀번호 변경 | ✅ |
| PUT | `/api/users/me/profile-image` | 프로필 이미지 변경 | ✅ |

---

## 1. 내 정보 조회

### 요청

```
GET /api/users/me
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
        "profile_image_url": "/uploads/profile/1.jpg",
        "grade": 3,
        "study_habit": "morning",
        "phone": "010-1234-5678",
        "subjects": ["수학", "영어"],
        "point": 150,
        "created_at": "2025-01-01T00:00:00",
        "updated_at": "2025-01-15T10:00:00"
    }
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 |
|------|------|------|
| user_id | Long | 사용자 고유 ID |
| username | String | 로그인 아이디 |
| name | String | 이름 |
| nickname | String | 닉네임 |
| email | String | 이메일 |
| profile_image_url | String | 프로필 이미지 URL |
| grade | Integer | 학년 |
| study_habit | String | 학습 습관 |
| phone | String | 전화번호 |
| subjects | Array | 관심 과목 목록 |
| point | Integer | 누적 포인트 |
| created_at | DateTime | 가입일시 |
| updated_at | DateTime | 수정일시 |

---

## 2. 프로필 수정

### 요청

```
PUT /api/users/me
Content-Type: application/json
```

### 요청 본문

```json
{
    "nickname": "새닉네임",
    "grade": 2,
    "studyHabit": "night",
    "phone": "010-9876-5432",
    "subjects": ["수학", "국어", "영어"]
}
```

### 수정 가능 필드

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| nickname | String | ❌ | 닉네임 |
| grade | Integer | ❌ | 학년 (1-6) |
| studyHabit | String | ❌ | 학습 습관 |
| phone | String | ❌ | 전화번호 |
| subjects | Array | ❌ | 관심 과목 |

### 응답 (성공)

```json
{
    "success": true,
    "message": "프로필이 수정되었습니다.",
    "data": {
        "user_id": 1,
        "nickname": "새닉네임",
        "grade": 2,
        ...
    }
}
```

---

## 3. 비밀번호 변경

### 요청

```
PUT /api/users/me/password
Content-Type: application/json
```

### 요청 본문

```json
{
    "currentPassword": "현재비밀번호",
    "newPassword": "새비밀번호",
    "confirmPassword": "새비밀번호"
}
```

### 검증 규칙

- 현재 비밀번호가 일치해야 함
- 새 비밀번호와 확인 비밀번호가 일치해야 함
- 새 비밀번호 최소 길이: 8자

### 응답 (성공)

```json
{
    "success": true,
    "message": "비밀번호가 변경되었습니다.",
    "data": null
}
```

### 응답 (실패 - 현재 비밀번호 불일치)

```json
{
    "success": false,
    "message": "현재 비밀번호가 일치하지 않습니다.",
    "data": null
}
```

---

## 4. 프로필 이미지 변경

### 요청

```
PUT /api/users/me/profile-image
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| file | File | ✅ | 이미지 파일 |

### 지원 형식

- JPEG/JPG
- PNG
- GIF
- 최대 크기: 5MB

### 응답 (성공)

```json
{
    "success": true,
    "message": "프로필 이미지가 변경되었습니다.",
    "data": {
        "profileImageUrl": "/uploads/profile/1_20250115.jpg"
    }
}
```

---

## 5. 클라이언트 구현 예시

### React (Axios)

```javascript
import api from '../../api/api';

// 내 정보 조회
const getMyProfile = async () => {
    const response = await api.get('/users/me');
    return response.data.data;
};

// 프로필 수정
const updateProfile = async (profileData) => {
    const response = await api.put('/users/me', profileData);
    if (response.data.success) {
        // LocalStorage 업데이트
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
            ...user,
            ...response.data.data
        }));
    }
    return response.data;
};

// 비밀번호 변경
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.put('/users/me/password', {
        currentPassword,
        newPassword,
        confirmPassword
    });
    return response.data;
};

// 프로필 이미지 변경
const updateProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.put('/users/me/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    if (response.data.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        user.profile_image_url = response.data.data.profileImageUrl;
        localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
};
```

---

## 6. MyPage 구현 예시

```javascript
const MyPage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        loadProfile();
    }, []);
    
    const loadProfile = async () => {
        const profile = await getMyProfile();
        setUser(profile);
    };
    
    const handleSave = async (formData) => {
        const result = await updateProfile(formData);
        if (result.success) {
            setUser(result.data);
            setIsEditing(false);
        }
    };
    
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const result = await updateProfileImage(file);
            if (result.success) {
                setUser(prev => ({
                    ...prev,
                    profile_image_url: result.data.profileImageUrl
                }));
            }
        }
    };
    
    return (
        <div className="my-page">
            <div className="profile-header">
                <label className="profile-image-wrapper">
                    <img src={user?.profile_image_url || '/default-profile.png'} alt="" />
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        hidden 
                    />
                    <span className="edit-overlay">📷</span>
                </label>
                <h2>{user?.nickname}</h2>
                <span className="point">🏆 {user?.point} 포인트</span>
            </div>
            
            {isEditing ? (
                <ProfileEditForm 
                    user={user} 
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <ProfileView 
                    user={user}
                    onEdit={() => setIsEditing(true)}
                />
            )}
        </div>
    );
};
```
