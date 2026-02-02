# 파일 API

**관련 문서**: [API 개요](./README.md) | [커뮤니티 API](./04-community.md)

---

## 📋 개요

파일 업로드 및 이미지 서빙 관련 API입니다.

---

# 1. 파일 업로드 API (`/api/files`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/files/upload` | 파일 업로드 | ✅ |

---

## 1.1 파일 업로드

### 요청

```
POST /api/files/upload
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| file | File | ✅ | 업로드할 파일 |

### 응답 (성공)

```json
{
    "message": "✅ 파일이 업로드되었습니다.",
    "data": "/upload/1/abc123_document.pdf"
}
```

### 응답 (실패 - 파일 없음)

```json
{
    "message": "❌ 업로드할 파일이 없습니다."
}
```

### 응답 (실패 - 파일명 오류)

```json
{
    "message": "❌ 파일명이 유효하지 않습니다."
}
```

### 저장 경로

- 기본 경로: `C:/upload` (Windows) 또는 `/upload` (Linux/Mac)
- 사용자별 폴더: `/upload/{userId}/`
- 파일명: `{UUID}_{원본파일명}`

---

# 2. 이미지 서빙 API (`/api/images`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/images/{type}/{fileName}` | 이미지 조회 | ❌ |

---

## 2.1 이미지 조회

### 요청

```
GET /api/images/{type}/{fileName}
```

### 경로 변수

| 변수 | 타입 | 설명 |
|------|------|------|
| type | String | 이미지 타입 (폴더명) |
| fileName | String | 파일명 |

### 예시

```
GET /api/images/problems/problem_001.png
GET /api/images/solutions/solution_001.png
```

### 응답 (성공)

- Content-Type: `image/png`
- Content-Disposition: `inline; filename="problem_001.png"`
- Body: 이미지 바이너리

### 응답 (실패 - 파일 없음)

```
HTTP 404 Not Found
```

---

## 지원 이미지 형식

| 확장자 | MIME Type |
|--------|-----------|
| .png | image/png |
| .jpg, .jpeg | image/jpeg |
| .gif | image/gif |
| .webp | image/webp |
| .svg | image/svg+xml |

---

## 클라이언트 구현 예시

### React - 파일 업로드

```javascript
import api from '../../api/api';

// 단일 파일 업로드
const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// 다중 파일 업로드 (api.upload 사용)
const uploadMultipleFiles = async (files) => {
    const response = await api.upload('/files/upload', files);
    return response.data;
};

// 이미지 URL 생성
const getImageUrl = (type, fileName) => {
    return `${API_BASE_URL}/api/images/${type}/${fileName}`;
};
```

### 파일 업로드 컴포넌트

```javascript
const FileUploader = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        try {
            const result = await uploadFile(file);
            onUploadComplete(result.data);
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            alert('파일 업로드에 실패했습니다.');
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div className="file-uploader">
            <input 
                type="file" 
                onChange={handleFileChange}
                disabled={uploading}
            />
            {uploading && (
                <div className="upload-progress">
                    업로드 중...
                </div>
            )}
        </div>
    );
};
```

---

## 파일 크기 제한

| 파일 타입 | 최대 크기 |
|----------|-----------|
| 이미지 | 5MB |
| 문서 | 10MB |
| 기타 | 20MB |

---

## 보안 고려사항

1. **파일 확장자 검증**
   - 허용된 확장자만 업로드 가능
   - 실행 파일 업로드 차단

2. **파일명 처리**
   - UUID를 접두어로 사용하여 중복 방지
   - 특수문자 제거

3. **경로 순회 공격 방지**
   - `../` 등의 경로 순회 문자 차단
   - 절대 경로 사용

4. **용량 제한**
   - Spring Boot `multipart.max-file-size` 설정
   - 사용자별 총 용량 제한 고려
