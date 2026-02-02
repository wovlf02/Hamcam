# 팀 스터디 기능

**관련 문서**: [WebRTC P2P](../07_realtime/webrtc-p2p.md) | [시그널링 서버](../07_realtime/signaling-server.md)

---

## 1. 개요

팀 스터디는 WebRTC P2P 기반의 실시간 화상 스터디 기능으로, 여러 사용자가 함께 학습할 수 있는 환경을 제공합니다.

### 1.1 스터디방 유형

| 유형 | 설명 |
|------|------|
| **QuizRoom** | 실시간 문제 풀이 및 경쟁 |
| **FocusRoom** | 집중 시간 측정 및 순위 경쟁 |

### 1.2 핵심 기능

- 실시간 화상 통신 (WebRTC P2P)
- 실시간 채팅
- 참여자 관리
- 집중 시간 측정 및 순위
- 퀴즈 풀이 및 경쟁

---

## 2. 스터디방 관리

### 2.1 엔티티 구조

```java
@Entity
public class StudyRoom {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User host;           // 방장
    
    private String name;         // 방 이름
    private String description;  // 방 설명
    
    @Enumerated(EnumType.STRING)
    private RoomType roomType;   // QUIZ, FOCUS
    
    private Integer maxParticipants;  // 최대 인원 (기본 10)
    private Boolean isActive;
}
```

### 2.2 API

#### 방 목록 조회

```
GET /api/study/team/rooms
```

**응답**
```json
[
    {
        "id": 1,
        "name": "수학 스터디",
        "description": "수능 수학 준비",
        "roomType": "FOCUS",
        "hostNickname": "사용자1",
        "currentParticipants": 3,
        "maxParticipants": 10
    }
]
```

#### 방 생성

```
POST /api/study/team/rooms
```

**요청**
```json
{
    "name": "영어 스터디",
    "description": "토익 준비",
    "roomType": "QUIZ",
    "maxParticipants": 5
}
```

#### 방 입장

```
POST /api/study/team/rooms/{id}/join
```

#### 방 퇴장

```
POST /api/study/team/rooms/{id}/leave
```

---

## 3. QuizRoom (퀴즈 풀이방)

### 3.1 기능

- 실시간 문제 풀이
- 발표자 선정/투표
- 점수 및 랭킹 시스템
- 화상 통신 및 채팅

### 3.2 상태 흐름

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   대기 상태  │────▶│  문제 풀이   │────▶│  결과 확인   │
│  (Waiting)  │     │  (Solving)  │     │  (Result)   │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │                                       │
       └───────────────────────────────────────┘
```

### 3.3 useQuizRoom 훅

```javascript
const useQuizRoom = (roomId) => {
    const [participants, setParticipants] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [presenter, setPresenter] = useState(null);
    const [scores, setScores] = useState({});
    const [gameState, setGameState] = useState('WAITING');
    
    // 문제 시작
    const startProblem = (subject, unit, level) => {
        socket.emit('start-problem', { roomId, subject, unit, level });
    };
    
    // 답안 제출
    const submitAnswer = (answer) => {
        socket.emit('submit-answer', { roomId, answer });
    };
    
    // 발표자 투표
    const votePresenter = (userId) => {
        socket.emit('vote-presenter', { roomId, userId });
    };
    
    return {
        participants,
        currentProblem,
        presenter,
        scores,
        gameState,
        startProblem,
        submitAnswer,
        votePresenter
    };
};
```

### 3.4 QuizRoom 페이지

```javascript
const QuizRoom = () => {
    const { roomId } = useParams();
    const {
        participants,
        currentProblem,
        scores,
        gameState,
        startProblem,
        submitAnswer
    } = useQuizRoom(roomId);
    
    return (
        <div className="quiz-room">
            {/* 화상 통신 영역 */}
            <div className="video-grid">
                {participants.map(p => (
                    <VideoTile key={p.socketId} participant={p} />
                ))}
            </div>
            
            {/* 문제 영역 */}
            <div className="problem-area">
                {currentProblem ? (
                    <ProblemDisplay 
                        problem={currentProblem}
                        onSubmit={submitAnswer}
                    />
                ) : (
                    <ProblemSelector onStart={startProblem} />
                )}
            </div>
            
            {/* 채팅 영역 */}
            <ChatArea roomId={roomId} />
            
            {/* 점수 보드 */}
            <ScoreBoard scores={scores} participants={participants} />
        </div>
    );
};
```

---

## 4. FocusRoom (집중 경쟁방)

### 4.1 기능

- Face API 기반 집중 시간 측정
- 실시간 순위 표시
- 화상 통신 및 채팅
- 목표 시간 설정

### 4.2 집중 시간 동기화

```javascript
// 집중 시간 업데이트 시 서버에 전송
useEffect(() => {
    if (focusedSeconds > 0 && focusedSeconds % 5 === 0) {
        socket.emit('focus-time-update', {
            userId: user.id,
            time: focusedSeconds
        });
    }
}, [focusedSeconds]);

// 다른 참여자 시간 수신
socket.on('focus-time-update', ({ userId, time }) => {
    setParticipants(prev => prev.map(p => 
        p.userId === userId ? { ...p, focusedSeconds: time } : p
    ).sort((a, b) => b.focusedSeconds - a.focusedSeconds));
});
```

### 4.3 FocusRoom 페이지

```javascript
const FocusRoom = () => {
    const { roomId } = useParams();
    const videoRef = useRef(null);
    const [participants, setParticipants] = useState([]);
    const [focusedSeconds, setFocusedSeconds] = useState(0);
    const [isStudying, setIsStudying] = useState(false);
    
    // Face API 감지 루프
    useEffect(() => {
        if (!isModelLoaded) return;
        
        const interval = setInterval(async () => {
            const faceDetected = await detectFace(videoRef);
            
            if (faceDetected) {
                if (!isStudying) setIsStudying(true);
                setFocusedSeconds(prev => prev + 1);
            } else {
                if (isStudying) setIsStudying(false);
            }
        }, 1000);
        
        return () => clearInterval(interval);
    }, [isModelLoaded, isStudying]);
    
    return (
        <div className="focus-room">
            {/* 화상 통신 영역 */}
            <div className="video-grid">
                <div className="my-video">
                    <video ref={videoRef} autoPlay muted />
                    <div className="status">
                        {isStudying ? '🟢 집중 중' : '🔴 일시정지'}
                    </div>
                    <div className="my-time">
                        {formatTime(focusedSeconds)}
                    </div>
                </div>
                {participants.map(p => (
                    <VideoTile key={p.socketId} participant={p} />
                ))}
            </div>
            
            {/* 순위 보드 */}
            <RankingBoard participants={participants} />
            
            {/* 채팅 영역 */}
            <ChatArea roomId={roomId} />
        </div>
    );
};
```

### 4.4 순위 보드

```javascript
const RankingBoard = ({ participants }) => {
    const sorted = [...participants].sort(
        (a, b) => b.focusedSeconds - a.focusedSeconds
    );
    
    return (
        <div className="ranking-board">
            <h3>🏆 집중 시간 순위</h3>
            {sorted.map((p, index) => (
                <div key={p.socketId} className={`rank-item rank-${index + 1}`}>
                    <span className="rank">{index + 1}</span>
                    <img src={p.profileImageUrl} alt="" />
                    <span className="nickname">{p.nickname}</span>
                    <span className="time">{formatTime(p.focusedSeconds)}</span>
                </div>
            ))}
        </div>
    );
};
```

---

## 5. 화상 통신

### 5.1 VideoTile 컴포넌트

```javascript
const VideoTile = ({ participant, localStream }) => {
    const videoRef = useRef(null);
    
    useEffect(() => {
        if (participant.stream && videoRef.current) {
            videoRef.current.srcObject = participant.stream;
        }
    }, [participant.stream]);
    
    return (
        <div className="video-tile">
            <video 
                ref={videoRef} 
                autoPlay 
                muted={participant.isLocal}
            />
            <div className="participant-info">
                <img src={participant.profileImageUrl} alt="" />
                <span>{participant.nickname}</span>
            </div>
            {participant.focusedSeconds !== undefined && (
                <div className="focus-time">
                    {formatTime(participant.focusedSeconds)}
                </div>
            )}
        </div>
    );
};
```

### 5.2 미디어 제어

```javascript
const MediaControls = ({ localStream, onToggleCamera, onToggleMic }) => {
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    
    const toggleCamera = () => {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    };
    
    const toggleMic = () => {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };
    
    return (
        <div className="media-controls">
            <button onClick={toggleCamera}>
                {isCameraOn ? '📹' : '📷'}
            </button>
            <button onClick={toggleMic}>
                {isMicOn ? '🎤' : '🔇'}
            </button>
            <button onClick={onLeave}>
                🚪 나가기
            </button>
        </div>
    );
};
```

---

## 6. 채팅

### 6.1 ChatArea 컴포넌트

```javascript
const ChatArea = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    
    useEffect(() => {
        socket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });
        
        return () => socket.off('new-message');
    }, []);
    
    const sendMessage = () => {
        if (!inputMessage.trim()) return;
        
        socket.emit('send-message', {
            roomId,
            message: inputMessage
        });
        setInputMessage('');
    };
    
    return (
        <div className="chat-area">
            <div className="messages">
                {messages.map((msg, i) => (
                    <div key={i} className="message">
                        <img src={msg.profileImageUrl} alt="" />
                        <div className="message-content">
                            <span className="nickname">{msg.nickname}</span>
                            <p>{msg.message}</p>
                            <span className="time">
                                {formatMessageTime(msg.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="메시지 입력..."
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
};
```

---

## 7. 라우팅

### 7.1 URL 구조

| URL | 컴포넌트 | 설명 |
|-----|----------|------|
| `/teamStudy` | TeamStudy | 스터디방 목록 |
| `/team-study/quiz/:roomId` | QuizRoom | 퀴즈 풀이방 |
| `/team-study/focus/:roomId` | FocusRoom | 집중 경쟁방 |

### 7.2 방 입장 흐름

```
TeamStudy (목록)
    │
    │ 방 선택
    ▼
┌─────────────┐
│ 방 입장 API │
└──────┬──────┘
       │
       ├── roomType === 'QUIZ' ──▶ QuizRoom
       │
       └── roomType === 'FOCUS' ─▶ FocusRoom
```

---

## 8. 접속자 수 관리

### 8.1 실시간 업데이트

```javascript
// TeamStudy 목록 페이지에서
useEffect(() => {
    socket.on('room-count-update', ({ roomId, count }) => {
        setRooms(prev => prev.map(room => 
            room.id === roomId 
                ? { ...room, currentParticipants: count }
                : room
        ));
    });
    
    return () => socket.off('room-count-update');
}, []);
```

### 8.2 효율성 개선

- HTTP 폴링 → Socket.IO 이벤트 기반
- 네트워크 효율성 98.3% 개선
- 평균 지연 시간 2.5초 → 0.1초

---

## 9. 에러 처리

### 9.1 연결 실패

```javascript
socket.on('error', (message) => {
    alert(message);
    navigate('/teamStudy');
});
```

### 9.2 방 가득 참

```javascript
const joinRoom = async (roomId) => {
    try {
        await api.post(`/study/team/rooms/${roomId}/join`);
        navigate(`/team-study/${roomType}/${roomId}`);
    } catch (error) {
        if (error.response?.status === 409) {
            navigate('/room-full');
        }
    }
};
```
