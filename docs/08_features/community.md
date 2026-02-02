# 커뮤니티 기능

**관련 문서**: [WebSocket/STOMP](../07_realtime/websocket.md) | [프론트엔드 구조](../03_architecture/frontend-structure.md)

---

## 1. 개요

커뮤니티는 사용자 간의 소통과 협력 학습을 지원하는 기능입니다.

### 1.1 주요 기능

| 기능 | 설명 |
|------|------|
| **게시판** | 질문, 정보 공유, 학습 자료 공유 |
| **댓글/대댓글** | 게시글에 대한 토론 |
| **좋아요/즐겨찾기** | 유용한 콘텐츠 표시 |
| **친구 관리** | 친구 추가, 온라인 상태 확인 |
| **채팅** | 1:1 및 그룹 채팅 |
| **신고/차단** | 부적절한 콘텐츠 관리 |

---

## 2. 게시판

### 2.1 엔티티 구조

```java
@Entity
public class Post {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;           // 작성자
    
    private String title;        // 제목
    
    @Column(columnDefinition = "TEXT")
    private String content;      // 내용
    
    @Enumerated(EnumType.STRING)
    private PostCategory category;  // 카테고리
    
    private Integer viewCount;   // 조회수
    private Integer likeCount;   // 좋아요 수
    private Boolean isDeleted;   // 삭제 여부
    
    @OneToMany(mappedBy = "post")
    private List<Comment> comments;
    
    @OneToMany(mappedBy = "post")
    private List<Attachment> attachments;
}
```

### 2.2 카테고리

| 카테고리 | 설명 |
|----------|------|
| QUESTION | 질문 |
| INFO | 정보 공유 |
| STUDY | 학습 자료 |
| FREE | 자유 게시판 |
| TIP | 학습 팁 |

### 2.3 API

#### 게시글 목록

```
GET /api/community/post?category={category}&page={page}&size={size}
```

**응답**
```json
{
    "content": [
        {
            "id": 1,
            "title": "수학 문제 질문입니다",
            "category": "QUESTION",
            "authorNickname": "사용자1",
            "authorProfileUrl": "/uploads/profile/1.jpg",
            "viewCount": 150,
            "likeCount": 10,
            "commentCount": 5,
            "createdAt": "2025-01-15T10:00:00"
        }
    ],
    "totalElements": 100,
    "totalPages": 10
}
```

#### 게시글 작성

```
POST /api/community/post
Content-Type: multipart/form-data
```

**요청**
- post: JSON (title, content, category)
- files: 첨부파일 (선택)

#### 게시글 상세

```
GET /api/community/post/{id}
```

**응답**
```json
{
    "id": 1,
    "title": "수학 문제 질문입니다",
    "content": "미적분 문제인데...",
    "category": "QUESTION",
    "author": {
        "id": 1,
        "nickname": "사용자1",
        "profileImageUrl": "/uploads/profile/1.jpg"
    },
    "viewCount": 151,
    "likeCount": 10,
    "isLiked": false,
    "isFavorite": false,
    "attachments": [
        {
            "id": 1,
            "fileName": "problem.png",
            "fileUrl": "/uploads/post/problem.png"
        }
    ],
    "comments": [...],
    "createdAt": "2025-01-15T10:00:00"
}
```

### 2.4 프론트엔드 구현

```javascript
const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(0);
    
    useEffect(() => {
        loadPosts();
    }, [category, page]);
    
    const loadPosts = async () => {
        const response = await api.get('/community/post', {
            params: { category, page, size: 20 }
        });
        setPosts(response.data.content);
    };
    
    return (
        <div className="post-list">
            <CategoryFilter 
                value={category} 
                onChange={setCategory} 
            />
            
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
            
            <Pagination 
                page={page} 
                onChange={setPage} 
            />
        </div>
    );
};
```

---

## 3. 댓글/대댓글

### 3.1 엔티티 구조

```java
@Entity
public class Comment {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Post post;
    
    @ManyToOne
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @OneToMany(mappedBy = "comment")
    private List<Reply> replies;
    
    private Boolean isDeleted;
    private LocalDateTime createdAt;
}

@Entity
public class Reply {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private Comment comment;
    
    @ManyToOne
    private User user;
    
    private String content;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
}
```

### 3.2 CommentSection 컴포넌트

```javascript
const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    
    const loadComments = async () => {
        const response = await api.get(`/community/comment/post/${postId}`);
        setComments(response.data);
    };
    
    const submitComment = async () => {
        await api.post('/community/comment', {
            postId,
            content: newComment
        });
        setNewComment('');
        loadComments();
    };
    
    return (
        <div className="comment-section">
            <h3>댓글 {comments.length}개</h3>
            
            {/* 댓글 입력 */}
            <div className="comment-input">
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={submitComment}>등록</button>
            </div>
            
            {/* 댓글 목록 */}
            {comments.map(comment => (
                <CommentItem 
                    key={comment.id} 
                    comment={comment}
                    onReply={loadComments}
                />
            ))}
        </div>
    );
};

const CommentItem = ({ comment, onReply }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    
    const submitReply = async () => {
        await api.post('/community/reply', {
            commentId: comment.id,
            content: replyContent
        });
        setReplyContent('');
        setShowReplyInput(false);
        onReply();
    };
    
    return (
        <div className="comment-item">
            <div className="comment-header">
                <img src={comment.authorProfileUrl} alt="" />
                <span>{comment.authorNickname}</span>
                <span>{formatDate(comment.createdAt)}</span>
            </div>
            <p>{comment.content}</p>
            <button onClick={() => setShowReplyInput(!showReplyInput)}>
                답글
            </button>
            
            {showReplyInput && (
                <div className="reply-input">
                    <textarea 
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <button onClick={submitReply}>등록</button>
                </div>
            )}
            
            {/* 대댓글 목록 */}
            {comment.replies.map(reply => (
                <div key={reply.id} className="reply-item">
                    <span>{reply.authorNickname}</span>
                    <p>{reply.content}</p>
                </div>
            ))}
        </div>
    );
};
```

---

## 4. 좋아요/즐겨찾기

### 4.1 좋아요 API

```
POST /api/community/like/post/{postId}      # 게시글 좋아요
DELETE /api/community/like/post/{postId}    # 게시글 좋아요 취소
POST /api/community/like/comment/{commentId} # 댓글 좋아요
```

### 4.2 즐겨찾기 API

```
POST /api/community/favorite/{postId}    # 즐겨찾기 추가
DELETE /api/community/favorite/{postId}  # 즐겨찾기 삭제
GET /api/community/favorite              # 즐겨찾기 목록
```

### 4.3 구현

```javascript
const LikeButton = ({ postId, isLiked, likeCount }) => {
    const [liked, setLiked] = useState(isLiked);
    const [count, setCount] = useState(likeCount);
    
    const toggleLike = async () => {
        if (liked) {
            await api.delete(`/community/like/post/${postId}`);
            setCount(count - 1);
        } else {
            await api.post(`/community/like/post/${postId}`);
            setCount(count + 1);
        }
        setLiked(!liked);
    };
    
    return (
        <button 
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={toggleLike}
        >
            {liked ? '❤️' : '🤍'} {count}
        </button>
    );
};
```

---

## 5. 친구 관리

### 5.1 엔티티 구조

```java
@Entity
public class Friend {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private User friend;
    
    private LocalDateTime createdAt;
}

@Entity
public class FriendRequest {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User sender;
    
    @ManyToOne
    private User receiver;
    
    @Enumerated(EnumType.STRING)
    private FriendRequestStatus status;  // PENDING, ACCEPTED, REJECTED
    
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}
```

### 5.2 API

```
GET /api/community/friend                    # 친구 목록
POST /api/community/friend/request           # 친구 요청
GET /api/community/friend/requests/received  # 받은 요청 목록
POST /api/community/friend/accept/{id}       # 요청 수락
POST /api/community/friend/reject/{id}       # 요청 거절
DELETE /api/community/friend/{id}            # 친구 삭제
POST /api/community/friend/block/{id}        # 친구 차단
```

### 5.3 Friend 페이지

```javascript
const Friend = () => {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        loadFriends();
        loadRequests();
    }, []);
    
    const loadFriends = async () => {
        const response = await api.get('/community/friend');
        setFriends(response.data);
    };
    
    const loadRequests = async () => {
        const response = await api.get('/community/friend/requests/received');
        setRequests(response.data);
    };
    
    const acceptRequest = async (requestId) => {
        await api.post(`/community/friend/accept/${requestId}`);
        loadFriends();
        loadRequests();
    };
    
    return (
        <div className="friend-page">
            {/* 친구 요청 섹션 */}
            {requests.length > 0 && (
                <div className="requests-section">
                    <h3>친구 요청 ({requests.length})</h3>
                    {requests.map(req => (
                        <div key={req.id} className="request-item">
                            <img src={req.senderProfileUrl} alt="" />
                            <span>{req.senderNickname}</span>
                            <button onClick={() => acceptRequest(req.id)}>
                                수락
                            </button>
                            <button onClick={() => rejectRequest(req.id)}>
                                거절
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* 친구 검색 */}
            <div className="search-section">
                <input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="친구 검색..."
                />
            </div>
            
            {/* 친구 목록 */}
            <div className="friends-list">
                {friends.map(friend => (
                    <FriendItem key={friend.id} friend={friend} />
                ))}
            </div>
        </div>
    );
};
```

---

## 6. 채팅

### 6.1 채팅방 유형

| 유형 | 설명 |
|------|------|
| PRIVATE | 1:1 채팅 |
| GROUP | 그룹 채팅 |

### 6.2 Chat 페이지

```javascript
const Chat = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    
    useEffect(() => {
        loadRooms();
    }, []);
    
    const loadRooms = async () => {
        const response = await api.get('/community/chat/rooms');
        setRooms(response.data);
    };
    
    return (
        <div className="chat-page">
            {/* 채팅방 목록 */}
            <div className="room-list">
                {rooms.map(room => (
                    <div 
                        key={room.id}
                        className={`room-item ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                        onClick={() => setSelectedRoom(room)}
                    >
                        <img src={room.thumbnailUrl} alt="" />
                        <div className="room-info">
                            <span className="name">{room.name}</span>
                            <span className="last-message">{room.lastMessage}</span>
                        </div>
                        {room.unreadCount > 0 && (
                            <span className="unread-badge">{room.unreadCount}</span>
                        )}
                    </div>
                ))}
            </div>
            
            {/* 채팅 영역 */}
            {selectedRoom && (
                <ChatRoom roomId={selectedRoom.id} />
            )}
        </div>
    );
};
```

---

## 7. 신고/차단

### 7.1 신고 API

```
POST /api/community/report
```

**요청**
```json
{
    "reportType": "POST",       // POST, COMMENT, USER
    "targetId": 1,
    "reason": "부적절한 내용입니다."
}
```

### 7.2 차단 API

```
POST /api/community/block
```

**요청**
```json
{
    "blockType": "USER",        // USER, POST, COMMENT
    "targetId": 1
}
```

### 7.3 차단 효과

- 차단된 사용자의 게시글/댓글 숨김
- 차단된 사용자와 채팅 불가
- 차단 목록에서 해제 가능

---

## 8. 공지사항

### 8.1 Notice 페이지

```javascript
const Notice = () => {
    const [notices, setNotices] = useState([]);
    
    useEffect(() => {
        loadNotices();
    }, []);
    
    const loadNotices = async () => {
        const response = await api.get('/community/notice');
        setNotices(response.data);
    };
    
    return (
        <div className="notice-page">
            <h2>📢 공지사항</h2>
            {notices.map(notice => (
                <div 
                    key={notice.id} 
                    className={`notice-item ${notice.isPinned ? 'pinned' : ''}`}
                >
                    {notice.isPinned && <span className="pin-badge">📌</span>}
                    <h3>{notice.title}</h3>
                    <p>{notice.content}</p>
                    <span className="date">{formatDate(notice.createdAt)}</span>
                    <span className="views">조회 {notice.viewCount}</span>
                </div>
            ))}
        </div>
    );
};
```

---

## 9. 스터디 그룹

### 9.1 엔티티 구조

```java
@Entity
public class SidebarStudy {
    @Id @GeneratedValue
    private Long id;
    
    private String name;
    private String description;
    
    @ManyToOne
    private User leader;
    
    private Integer maxMembers;
    
    @OneToMany(mappedBy = "study")
    private List<StudyParticipant> participants;
}

@Entity
public class StudyApplication {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private SidebarStudy study;
    
    @ManyToOne
    private User applicant;
    
    @Enumerated(EnumType.STRING)
    private StudyApplicationStatus status;
    
    private String message;
}
```

### 9.2 스터디 목록 페이지

```javascript
const StudyListPage = () => {
    const [studies, setStudies] = useState([]);
    
    return (
        <div className="study-list-page">
            <h2>스터디 그룹</h2>
            <Link to="/study/create">
                <button>새 스터디 만들기</button>
            </Link>
            
            <div className="study-grid">
                {studies.map(study => (
                    <StudyCard key={study.id} study={study} />
                ))}
            </div>
        </div>
    );
};

const StudyCard = ({ study }) => {
    return (
        <div className="study-card">
            <h3>{study.name}</h3>
            <p>{study.description}</p>
            <div className="study-info">
                <span>👤 {study.leaderNickname}</span>
                <span>👥 {study.currentMembers}/{study.maxMembers}</span>
            </div>
            <Link to={`/study/${study.id}`}>
                <button>상세 보기</button>
            </Link>
        </div>
    );
};
```
