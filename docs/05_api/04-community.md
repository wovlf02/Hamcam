# 커뮤니티 API

**관련 문서**: [API 개요](./README.md) | [사용자 API](./02-user.md)

---

## 📋 개요

커뮤니티 기능은 게시판, 댓글, 좋아요, 친구, 채팅, 공지사항 등을 포함합니다.

---

## 📁 엔드포인트 구조

```
/api/community/
├── posts/          # 게시글 관리
├── comments/       # 댓글 관리
├── replies/        # 대댓글 관리
├── notices/        # 공지사항
└── ...

/api/friends/       # 친구 관리
/api/chat/          # 채팅 관리
```

---

# 1. 게시글 API (`/api/community/posts`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/posts/create` | 게시글 생성 | ✅ |
| POST | `/posts/update` | 게시글 수정 | ✅ |
| POST | `/posts/delete` | 게시글 삭제 | ✅ |
| POST | `/posts/list` | 게시글 목록 조회 | ✅ |
| POST | `/posts/detail` | 게시글 상세 조회 | ✅ |
| GET | `/posts/popular` | 인기 게시글 조회 | ✅ |
| POST | `/posts/favorite/add` | 즐겨찾기 추가 | ✅ |
| POST | `/posts/favorite/remove` | 즐겨찾기 제거 | ✅ |
| GET | `/posts/favorites` | 즐겨찾기 목록 | ✅ |
| PATCH | `/posts/view` | 조회수 증가 | ✅ |
| POST | `/posts/auto-fill` | 문제 기반 자동완성 | ✅ |

---

## 1.1 게시글 생성

### 요청

```
POST /api/community/posts/create
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파트 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| title | String | ✅ | 게시글 제목 |
| content | String | ✅ | 게시글 본문 |
| category | String | ✅ | 카테고리 |
| tag | String | ❌ | 태그 (쉼표 구분) |
| file | File | ❌ | 첨부 파일 |

### 카테고리 종류

| 값 | 설명 |
|----|------|
| INFO | 정보 공유 |
| QUESTION | 질문 |
| STUDY | 스터디 모집 |
| FREE | 자유 게시판 |
| TIP | 학습 팁 |

### 응답 (성공)

```json
{
    "message": "게시글이 등록되었습니다.",
    "data": 1
}
```

### 예시

```bash
curl -X POST http://localhost:8080/api/community/posts/create \
  -F "title=수학 질문입니다" \
  -F "content=미적분 문제 풀이 방법을 알려주세요" \
  -F "category=QUESTION" \
  -F "tag=수학,미적분" \
  -b cookies.txt
```

---

## 1.2 게시글 수정

### 요청

```
POST /api/community/posts/update
Content-Type: multipart/form-data
```

### 요청 파라미터

| 파트 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| postId | Long | ✅ | 게시글 ID |
| title | String | ❌ | 수정할 제목 |
| content | String | ❌ | 수정할 본문 |
| category | String | ❌ | 수정할 카테고리 |
| tag | String | ❌ | 수정할 태그 |
| file | File | ❌ | 새 첨부 파일 |

### 응답 (성공)

```json
{
    "message": "게시글이 수정되었습니다."
}
```

---

## 1.3 게시글 삭제

### 요청

```
POST /api/community/posts/delete
Content-Type: application/json
```

### 요청 본문

```json
{
    "postId": 1
}
```

### 응답 (성공)

```json
{
    "message": "게시글이 삭제되었습니다."
}
```

---

## 1.4 게시글 목록 조회

### 요청

```
POST /api/community/posts/list
Content-Type: application/json
```

### 요청 본문

```json
{
    "page": 1,
    "size": 10,
    "category": "QUESTION",
    "searchType": "title",
    "keyword": "수학"
}
```

### 검색 타입

| 값 | 설명 |
|----|------|
| title | 제목 검색 |
| content | 내용 검색 |
| title_content | 제목+내용 검색 |
| author | 작성자 검색 |

### 응답 (성공)

```json
{
    "posts": [
        {
            "postId": 1,
            "title": "수학 질문입니다",
            "category": "QUESTION",
            "writerNickname": "테스터",
            "profileImageUrl": "/uploads/profile/1.jpg",
            "likeCount": 5,
            "viewCount": 120,
            "commentCount": 3,
            "createdAt": "2025-01-15T10:00:00"
        }
    ],
    "totalPages": 5,
    "totalElements": 48,
    "currentPage": 1
}
```

---

## 1.5 게시글 상세 조회

### 요청

```
POST /api/community/posts/detail
Content-Type: application/json
```

### 요청 본문

```json
{
    "postId": 1
}
```

### 응답 (성공)

```json
{
    "postId": 1,
    "title": "수학 질문입니다",
    "content": "미적분 문제 풀이 방법을 알려주세요...",
    "category": "QUESTION",
    "writerId": 1,
    "writerNickname": "테스터",
    "profileImageUrl": "/uploads/profile/1.jpg",
    "likeCount": 5,
    "liked": false,
    "favorite": false,
    "viewCount": 121,
    "attachmentCount": 1,
    "commentCount": 3,
    "createdAt": "2025-01-15T10:00:00",
    "updatedAt": "2025-01-15T10:00:00",
    "attachmentUrls": [
        "/uploads/community/abc123_image.jpg"
    ]
}
```

---

## 1.6 인기 게시글 조회

### 요청

```
GET /api/community/posts/popular
```

### 응답 (성공)

```json
{
    "posts": [
        {
            "postId": 1,
            "title": "인기 게시글 제목",
            "likeCount": 100,
            "viewCount": 500,
            "createdAt": "2025-01-10T10:00:00"
        }
    ]
}
```

---

## 1.7 즐겨찾기 추가/제거

### 즐겨찾기 추가

```
POST /api/community/posts/favorite/add
Content-Type: application/json
```

### 요청 본문

```json
{
    "postId": 1
}
```

### 응답 (성공)

```json
{
    "message": "즐겨찾기에 추가되었습니다.",
    "data": true
}
```

### 즐겨찾기 제거

```
POST /api/community/posts/favorite/remove
Content-Type: application/json
```

### 응답 (성공)

```json
{
    "message": "즐겨찾기에서 제거되었습니다.",
    "data": false
}
```

---

## 1.8 즐겨찾기 목록 조회

### 요청

```
GET /api/community/posts/favorites
```

### 응답 (성공)

```json
{
    "posts": [
        {
            "postId": 1,
            "title": "즐겨찾기한 게시글",
            "category": "INFO",
            "createdAt": "2025-01-15T10:00:00"
        }
    ]
}
```

---

# 2. 댓글 API (`/api/community`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| POST | `/comments/create` | 댓글 등록 | ✅ |
| POST | `/replies/create` | 대댓글 등록 | ✅ |
| PUT | `/comments/update` | 댓글 수정 | ✅ |
| PUT | `/replies/update` | 대댓글 수정 | ✅ |
| DELETE | `/comments/delete` | 댓글 삭제 | ✅ |
| DELETE | `/replies/delete` | 대댓글 삭제 | ✅ |
| POST | `/comments/by-post` | 게시글 댓글 조회 | ✅ |

---

## 2.1 댓글 등록

### 요청

```
POST /api/community/comments/create
Content-Type: application/json
```

### 요청 본문

```json
{
    "postId": 1,
    "content": "좋은 질문이네요!"
}
```

### 응답 (성공)

```json
{
    "message": "✅ 댓글이 등록되었습니다.",
    "data": 1
}
```

---

## 2.2 대댓글 등록

### 요청

```
POST /api/community/replies/create
Content-Type: application/json
```

### 요청 본문

```json
{
    "commentId": 1,
    "content": "저도 같은 생각입니다!"
}
```

### 응답 (성공)

```json
{
    "message": "✅ 대댓글이 등록되었습니다.",
    "data": 1
}
```

---

## 2.3 댓글/대댓글 수정

### 댓글 수정

```
PUT /api/community/comments/update
Content-Type: application/json
```

### 요청 본문

```json
{
    "commentId": 1,
    "content": "수정된 댓글 내용"
}
```

### 대댓글 수정

```
PUT /api/community/replies/update
Content-Type: application/json
```

### 요청 본문

```json
{
    "replyId": 1,
    "content": "수정된 대댓글 내용"
}
```

---

## 2.4 댓글/대댓글 삭제

### 댓글 삭제

```
DELETE /api/community/comments/delete
Content-Type: application/json
```

### 요청 본문

```json
{
    "commentId": 1
}
```

### 대댓글 삭제

```
DELETE /api/community/replies/delete
Content-Type: application/json
```

### 요청 본문

```json
{
    "replyId": 1
}
```

---

## 2.5 게시글 댓글 조회

### 요청

```
POST /api/community/comments/by-post
Content-Type: application/json
```

### 요청 본문

```json
{
    "postId": 1
}
```

### 응답 (성공)

```json
{
    "message": "💬 댓글 목록 조회 성공",
    "data": {
        "comments": [
            {
                "commentId": 1,
                "content": "좋은 질문이네요!",
                "writerId": 2,
                "writerNickname": "사용자A",
                "profileImageUrl": "/uploads/profile/2.jpg",
                "createdAt": "2025-01-15T11:00:00",
                "replies": [
                    {
                        "replyId": 1,
                        "content": "저도 같은 생각입니다!",
                        "writerId": 3,
                        "writerNickname": "사용자B",
                        "profileImageUrl": "/uploads/profile/3.jpg",
                        "createdAt": "2025-01-15T11:30:00"
                    }
                ]
            }
        ],
        "totalCount": 5
    }
}
```

---

# 3. 공지사항 API (`/api/community/notices`)

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/notices` | 전체 공지사항 조회 | ❌ |
| GET | `/notices/main` | 주요 공지사항 조회 | ❌ |

---

## 3.1 전체 공지사항 조회

### 요청

```
GET /api/community/notices
```

### 응답 (성공)

```json
[
    {
        "id": 1,
        "title": "시스템 점검 안내",
        "content": "2025년 1월 20일 새벽 2시~4시 점검 예정입니다.",
        "createdAt": "2025-01-15T10:00:00",
        "isPinned": true
    }
]
```

---

## 3.2 주요 공지사항 조회

### 요청

```
GET /api/community/notices/main
```

### 응답 (성공)

```json
[
    {
        "id": 1,
        "title": "시스템 점검 안내",
        "createdAt": "2025-01-15T10:00:00"
    }
]
```

---

# 4. 스터디 사이드바 API

## 엔드포인트 요약

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|:----:|
| GET | `/posts/sidebar/studies` | 진행 중인 스터디 목록 | ✅ |
| POST | `/posts/sidebar/studies/create` | 스터디 생성 | ✅ |
| GET | `/posts/sidebar/studies/{id}` | 스터디 상세 조회 | ✅ |
| POST | `/posts/sidebar/studies/apply` | 스터디 참여 신청 | ✅ |
| GET | `/posts/sidebar/studies/{id}/applications` | 신청자 목록 조회 | ✅ |
| POST | `/posts/sidebar/studies/approve` | 신청 수락/거절 | ✅ |
| GET | `/posts/sidebar/tags` | 인기 태그 목록 | ✅ |

---

## 4.1 진행 중인 스터디 목록

### 요청

```
GET /api/community/posts/sidebar/studies
```

### 응답 (성공)

```json
{
    "studies": [
        {
            "studyId": 1,
            "title": "수학 스터디 모집",
            "description": "매일 저녁 7시 수학 문제 풀이",
            "creatorNickname": "스터디장",
            "currentMembers": 3,
            "maxMembers": 5,
            "status": "RECRUITING",
            "createdAt": "2025-01-10T10:00:00"
        }
    ]
}
```

---

## 4.2 스터디 생성

### 요청

```
POST /api/community/posts/sidebar/studies/create
Content-Type: application/json
```

### 요청 본문

```json
{
    "title": "영어 스터디 모집",
    "description": "TOEIC 900점 목표 스터디",
    "maxMembers": 5
}
```

### 응답 (성공)

```json
{
    "message": "스터디가 생성되었습니다."
}
```

---

## 4.3 스터디 참여 신청

### 요청

```
POST /api/community/posts/sidebar/studies/apply
Content-Type: application/json
```

### 요청 본문

```json
{
    "studyId": 1
}
```

### 응답 (성공)

```json
{
    "message": "스터디 참여 신청이 완료되었습니다."
}
```

---

## 4.4 신청 수락/거절

### 요청

```
POST /api/community/posts/sidebar/studies/approve
Content-Type: application/json
```

### 요청 본문

```json
{
    "studyId": 1,
    "userId": 5,
    "approve": true
}
```

### 응답 (성공)

```json
{
    "message": "신청이 수락되었습니다."
}
```

---

# 5. 인기 태그 조회

### 요청

```
GET /api/community/posts/sidebar/tags
```

### 응답 (성공)

```json
{
    "tags": [
        { "name": "수학", "count": 150 },
        { "name": "영어", "count": 120 },
        { "name": "미적분", "count": 80 },
        { "name": "물리", "count": 65 }
    ]
}
```

---

## 데이터 타입

### PostCategory (게시글 카테고리)

| 값 | 설명 |
|----|------|
| INFO | 정보 공유 |
| QUESTION | 질문 |
| STUDY | 스터디 모집 |
| FREE | 자유 게시판 |
| TIP | 학습 팁 |

### StudyApplicationStatus (스터디 신청 상태)

| 값 | 설명 |
|----|------|
| PENDING | 대기 중 |
| APPROVED | 승인됨 |
| REJECTED | 거절됨 |

---

## 클라이언트 구현 예시

### React - 게시글 목록 조회

```javascript
import api from '../../api/api';

// 게시글 목록 조회
const getPostList = async (page = 1, category = null, keyword = null) => {
    const response = await api.post('/community/posts/list', {
        page,
        size: 10,
        category,
        searchType: keyword ? 'title_content' : null,
        keyword
    });
    return response.data;
};

// 게시글 상세 조회
const getPostDetail = async (postId) => {
    const response = await api.post('/community/posts/detail', { postId });
    return response.data;
};

// 게시글 생성
const createPost = async (title, content, category, tag, file) => {
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
};

// 댓글 등록
const createComment = async (postId, content) => {
    const response = await api.post('/community/comments/create', {
        postId,
        content
    });
    return response.data;
};
```
