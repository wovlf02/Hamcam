# 실시간 통신 API

**관련 문서**: [API 개요](./README.md) | [학습 API](./07-study.md) | [채팅 API](./05-chat.md)

---

## 📋 개요

Hamcam은 실시간 기능을 위해 Socket.IO를 사용합니다. 시그널링 서버는 Node.js로 구현되어 포트 4000에서 실행됩니다.

---

## 🔌 연결 정보

| 항목 | 값 |
|------|-----|
| 프로토콜 | Socket.IO (WebSocket + HTTP Long Polling) |
| 서버 주소 | `http://localhost:4000` |
| 라이브러리 | socket.io-client |
| 인증 방식 | 세션 쿠키 자동 전송 |

---

## 📡 이벤트 목록

### 클라이언트 → 서버 (Emit)

| 이벤트명 | 설명 | 데이터 |
|---------|------|--------|
| `join-room` | 방 입장 | `{ roomId, token }` |
| `signal` | WebRTC 시그널 | `{ targetSocketId, sdp, candidate }` |
| `send-message` | 채팅 메시지 전송 | `{ roomId, message }` |
| `focus-time-update` | 집중 시간 업데이트 | `{ userId, time }` |
| `start-problem` | 문제 시작 요청 | `{ roomId, subject, unit, level }` |
| `submit-answer` | 답안 제출 | `{ roomId, answer }` |

### 서버 → 클라이언트 (On)

| 이벤트명 | 설명 | 데이터 |
|---------|------|--------|
| `all-users` | 기존 참여자 목록 | `Array<ParticipantInfo>` |
| `user-joined` | 새 사용자 입장 | `ParticipantInfo` |
| `user-left` | 사용자 퇴장 | `socketId` |
| `signal` | WebRTC 시그널 수신 | `{ fromSocketId, sdp, candidate }` |
| `new-message` | 새 채팅 메시지 | `MessageInfo` |
| `focus-time-update` | 집중 시간 변경 | `{ userId, time }` |
| `room-count-update` | 접속자 수 변경 | `{ roomId, count }` |
| `error` | 에러 발생 | `String (errorMessage)` |

---

# 1. 연결 및 방 입장

## 1.1 Socket.IO 연결

### 클라이언트 코드

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
    withCredentials: true,  // 세션 쿠키 자동 포함
    transports: ['websocket', 'polling']
});

socket.on('connect', () => {
    console.log('✅ 시그널링 서버 연결됨:', socket.id);
});

socket.on('disconnect', () => {
    console.log('❌ 시그널링 서버 연결 해제');
});

socket.on('error', (message) => {
    console.error('⚠️ 서버 에러:', message);
});
```

---

## 1.2 방 입장 (join-room)

### 발신 (Emit)

```javascript
socket.emit('join-room', {
    roomId: '1',
    token: 'optional-token'  // 현재는 미사용 (세션 쿠키로 인증)
});
```

### 수신 (On) - 기존 참여자 목록

```javascript
socket.on('all-users', (participants) => {
    console.log('기존 참여자:', participants);
    // [
    //     {
    //         socketId: 'abc123',
    //         user_id: 1,
    //         nickname: '참여자1',
    //         profileImageUrl: '/uploads/profile/1.jpg',
    //         focusedSeconds: 1800,
    //         score: 0
    //     },
    //     ...
    // ]
    
    // 각 참여자와 WebRTC 연결 시작
    participants.forEach(participant => {
        createPeerConnection(participant.socketId);
        createOffer(participant.socketId);
    });
});
```

### 수신 (On) - 새 참여자 입장 알림

```javascript
socket.on('user-joined', (participant) => {
    console.log('새 참여자 입장:', participant);
    // {
    //     socketId: 'def456',
    //     user_id: 2,
    //     nickname: '새참여자',
    //     profileImageUrl: '/uploads/profile/2.jpg',
    //     focusedSeconds: 0,
    //     score: 0
    // }
    
    // 새 참여자와 WebRTC 연결 시작
    createPeerConnection(participant.socketId);
    // offer는 상대방이 보냄 (기존 참여자가 먼저 받음)
});
```

---

# 2. WebRTC 시그널링

## 2.1 시그널 전송 (signal)

### Offer/Answer 전송

```javascript
// Offer 생성 및 전송
const createOffer = async (targetSocketId) => {
    const pc = peerConnections[targetSocketId];
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    socket.emit('signal', {
        targetSocketId: targetSocketId,
        sdp: offer,
        candidate: null
    });
};

// Answer 생성 및 전송
const createAnswer = async (targetSocketId) => {
    const pc = peerConnections[targetSocketId];
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socket.emit('signal', {
        targetSocketId: targetSocketId,
        sdp: answer,
        candidate: null
    });
};
```

### ICE Candidate 전송

```javascript
pc.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit('signal', {
            targetSocketId: targetSocketId,
            sdp: null,
            candidate: event.candidate
        });
    }
};
```

---

## 2.2 시그널 수신 (signal)

```javascript
socket.on('signal', async ({ fromSocketId, sdp, candidate }) => {
    const pc = peerConnections[fromSocketId];
    
    if (!pc) {
        console.warn('PeerConnection이 없습니다:', fromSocketId);
        return;
    }
    
    try {
        // SDP 처리 (Offer 또는 Answer)
        if (sdp) {
            await pc.setRemoteDescription(new RTCSessionDescription(sdp));
            
            // Offer를 받았으면 Answer 생성
            if (sdp.type === 'offer') {
                await createAnswer(fromSocketId);
            }
        }
        
        // ICE Candidate 처리
        if (candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
    } catch (error) {
        console.error('시그널 처리 오류:', error);
    }
});
```

---

# 3. 채팅 메시지

## 3.1 메시지 전송 (send-message)

### 발신

```javascript
const sendMessage = (roomId, message) => {
    socket.emit('send-message', {
        roomId: roomId,
        message: message
    });
};

// 사용 예시
sendMessage('1', '안녕하세요!');
```

---

## 3.2 메시지 수신 (new-message)

### 수신

```javascript
socket.on('new-message', (chatMessage) => {
    console.log('새 메시지:', chatMessage);
    // {
    //     userId: 1,
    //     nickname: '발신자',
    //     profileImageUrl: '/uploads/profile/1.jpg',
    //     message: '안녕하세요!',
    //     timestamp: '2025-01-15T10:30:00.000Z'
    // }
    
    // UI에 메시지 추가
    setChatMessages(prev => [...prev, chatMessage]);
});
```

---

# 4. 집중 시간 추적

## 4.1 집중 시간 전송 (focus-time-update)

### 발신

```javascript
let focusedSeconds = 0;
let focusTimer = null;

const startFocusTimer = () => {
    focusTimer = setInterval(() => {
        focusedSeconds += 1;
        
        // 10초마다 서버에 전송
        if (focusedSeconds % 10 === 0) {
            socket.emit('focus-time-update', {
                userId: currentUserId,
                time: focusedSeconds
            });
        }
    }, 1000);
};

const stopFocusTimer = () => {
    if (focusTimer) {
        clearInterval(focusTimer);
        // 마지막 시간 전송
        socket.emit('focus-time-update', {
            userId: currentUserId,
            time: focusedSeconds
        });
    }
};
```

---

## 4.2 집중 시간 수신 (focus-time-update)

### 수신

```javascript
socket.on('focus-time-update', ({ userId, time }) => {
    console.log(`사용자 ${userId}의 집중 시간: ${time}초`);
    
    // 참여자 목록 업데이트
    setParticipants(prev => 
        prev.map(p => 
            p.user_id === userId 
                ? { ...p, focusedSeconds: time }
                : p
        )
    );
});
```

---

# 5. 접속자 수 추적

## 5.1 접속자 수 변경 (room-count-update)

### 수신

```javascript
socket.on('room-count-update', ({ roomId, count }) => {
    console.log(`방 ${roomId}의 접속자 수: ${count}명`);
    
    // 특정 방의 접속자 수만 업데이트
    if (currentRoomId === roomId) {
        setParticipantCount(count);
    }
    
    // 또는 전체 방 목록 업데이트
    setRoomList(prev => 
        prev.map(room => 
            room.roomId === roomId 
                ? { ...room, currentParticipants: count }
                : room
        )
    );
});
```

---

## 5.2 실시간 접속자 수 조회 (HTTP)

### 요청

```
GET http://localhost:4000/room-counts
```

### 응답

```json
{
    "1": 3,
    "2": 5,
    "3": 1
}
```

### 클라이언트 코드

```javascript
const fetchRoomCounts = async () => {
    const response = await fetch('http://localhost:4000/room-counts');
    const counts = await response.json();
    
    // 방 목록에 접속자 수 반영
    setRoomList(prev => 
        prev.map(room => ({
            ...room,
            currentParticipants: counts[room.roomId] || 0
        }))
    );
};
```

---

# 6. 사용자 퇴장

## 6.1 퇴장 알림 (user-left)

### 수신

```javascript
socket.on('user-left', (socketId) => {
    console.log('사용자 퇴장:', socketId);
    
    // WebRTC 연결 종료
    if (peerConnections[socketId]) {
        peerConnections[socketId].close();
        delete peerConnections[socketId];
    }
    
    // 비디오 엘리먼트 제거
    removeVideoElement(socketId);
    
    // 참여자 목록에서 제거
    setParticipants(prev => 
        prev.filter(p => p.socketId !== socketId)
    );
});
```

---

# 7. 완전한 구현 예시

## VideoRoom 컴포넌트

```javascript
import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

const VideoRoom = ({ roomId }) => {
    const [socket, setSocket] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [focusedSeconds, setFocusedSeconds] = useState(0);
    const peerConnections = useRef({});
    const localStream = useRef(null);
    const focusTimer = useRef(null);
    
    useEffect(() => {
        initSocket();
        initLocalStream();
        
        return () => {
            cleanup();
        };
    }, []);
    
    const initSocket = () => {
        const newSocket = io('http://localhost:4000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        
        newSocket.on('connect', () => {
            console.log('✅ 연결됨:', newSocket.id);
            newSocket.emit('join-room', { roomId, token: null });
        });
        
        newSocket.on('all-users', (users) => {
            setParticipants(users);
            users.forEach(user => {
                createPeerConnection(user.socketId, newSocket);
            });
        });
        
        newSocket.on('user-joined', (user) => {
            setParticipants(prev => [...prev, user]);
            createPeerConnection(user.socketId, newSocket);
        });
        
        newSocket.on('user-left', (socketId) => {
            if (peerConnections.current[socketId]) {
                peerConnections.current[socketId].close();
                delete peerConnections.current[socketId];
            }
            setParticipants(prev => prev.filter(p => p.socketId !== socketId));
        });
        
        newSocket.on('signal', handleSignal);
        newSocket.on('new-message', handleNewMessage);
        newSocket.on('focus-time-update', handleFocusTimeUpdate);
        newSocket.on('room-count-update', handleRoomCountUpdate);
        
        setSocket(newSocket);
    };
    
    const initLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStream.current = stream;
            
            // 로컬 비디오 표시
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.srcObject = stream;
            }
            
            // 집중 시간 타이머 시작
            startFocusTimer();
        } catch (error) {
            console.error('미디어 접근 오류:', error);
        }
    };
    
    const createPeerConnection = (socketId, socketInstance) => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });
        
        // 로컬 스트림 추가
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
                pc.addTrack(track, localStream.current);
            });
        }
        
        // 원격 스트림 수신
        pc.ontrack = (event) => {
            const remoteVideo = document.getElementById(`remote-${socketId}`);
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
            }
        };
        
        // ICE Candidate 전송
        pc.onicecandidate = (event) => {
            if (event.candidate && socketInstance) {
                socketInstance.emit('signal', {
                    targetSocketId: socketId,
                    sdp: null,
                    candidate: event.candidate
                });
            }
        };
        
        peerConnections.current[socketId] = pc;
        
        // Offer 생성 및 전송
        createOffer(socketId, socketInstance);
    };
    
    const createOffer = async (socketId, socketInstance) => {
        const pc = peerConnections.current[socketId];
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            socketInstance.emit('signal', {
                targetSocketId: socketId,
                sdp: offer,
                candidate: null
            });
        } catch (error) {
            console.error('Offer 생성 오류:', error);
        }
    };
    
    const handleSignal = async ({ fromSocketId, sdp, candidate }) => {
        const pc = peerConnections.current[fromSocketId];
        if (!pc) return;
        
        try {
            if (sdp) {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                if (sdp.type === 'offer') {
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.emit('signal', {
                        targetSocketId: fromSocketId,
                        sdp: answer,
                        candidate: null
                    });
                }
            }
            
            if (candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (error) {
            console.error('시그널 처리 오류:', error);
        }
    };
    
    const startFocusTimer = () => {
        focusTimer.current = setInterval(() => {
            setFocusedSeconds(prev => {
                const newTime = prev + 1;
                if (newTime % 10 === 0 && socket) {
                    socket.emit('focus-time-update', {
                        userId: getCurrentUserId(),
                        time: newTime
                    });
                }
                return newTime;
            });
        }, 1000);
    };
    
    const handleNewMessage = (message) => {
        setChatMessages(prev => [...prev, message]);
    };
    
    const handleFocusTimeUpdate = ({ userId, time }) => {
        setParticipants(prev => 
            prev.map(p => 
                p.user_id === userId 
                    ? { ...p, focusedSeconds: time }
                    : p
            )
        );
    };
    
    const handleRoomCountUpdate = ({ roomId: updatedRoomId, count }) => {
        if (updatedRoomId === roomId) {
            console.log(`현재 접속자 수: ${count}명`);
        }
    };
    
    const sendChatMessage = (message) => {
        if (socket) {
            socket.emit('send-message', {
                roomId: roomId,
                message: message
            });
        }
    };
    
    const cleanup = () => {
        // 집중 시간 타이머 정리
        if (focusTimer.current) {
            clearInterval(focusTimer.current);
            if (socket) {
                socket.emit('focus-time-update', {
                    userId: getCurrentUserId(),
                    time: focusedSeconds
                });
            }
        }
        
        // PeerConnection 정리
        Object.values(peerConnections.current).forEach(pc => pc.close());
        
        // 로컬 스트림 정리
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
        }
        
        // Socket 연결 해제
        if (socket) {
            socket.disconnect();
        }
    };
    
    return (
        <div className="video-room">
            <div className="video-grid">
                <video id="local-video" autoPlay muted playsInline />
                {participants.map(p => (
                    <div key={p.socketId} className="participant">
                        <video 
                            id={`remote-${p.socketId}`} 
                            autoPlay 
                            playsInline 
                        />
                        <div className="info">
                            <span>{p.nickname}</span>
                            <span>{formatTime(p.focusedSeconds)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="chat-panel">
                <div className="messages">
                    {chatMessages.map((msg, i) => (
                        <div key={i} className="message">
                            <img src={msg.profileImageUrl} alt="" />
                            <div>
                                <strong>{msg.nickname}</strong>
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <ChatInput onSend={sendChatMessage} />
            </div>
            
            <div className="timer">
                집중 시간: {formatTime(focusedSeconds)}
            </div>
        </div>
    );
};

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.userId || user.user_id;
};
```

---

## 데이터 타입

### ParticipantInfo

```typescript
interface ParticipantInfo {
    socketId: string;           // Socket.IO 소켓 ID
    user_id: number;            // 사용자 DB ID
    nickname: string;           // 닉네임
    profileImageUrl: string;    // 프로필 이미지 URL
    focusedSeconds: number;     // 집중한 시간 (초)
    score: number;              // 퀴즈 점수
}
```

### MessageInfo

```typescript
interface MessageInfo {
    userId: number;             // 발신자 ID
    nickname: string;           // 발신자 닉네임
    profileImageUrl: string;    // 발신자 프로필 이미지
    message: string;            // 메시지 내용
    timestamp: Date;            // 전송 시간
}
```
