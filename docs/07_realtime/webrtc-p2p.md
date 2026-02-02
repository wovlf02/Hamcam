# WebRTC P2P

**관련 문서**: [시그널링 서버](./signaling-server.md) | [WebSocket/STOMP](./websocket.md)

---

## 1. 개요

WebRTC(Web Real-Time Communication)는 브라우저 간 직접 P2P(Peer-to-Peer) 연결을 통해 실시간 음성, 영상, 데이터를 전송하는 기술입니다.

### 1.1 Hamcam에서의 활용

- **팀 스터디 화상 통신**: QuizRoom, FocusRoom에서 참여자 간 화상 통신
- **개인 학습 (Face API)**: 로컬 카메라 스트림 획득

### 1.2 구성 요소

| 구성 요소 | 역할 |
|-----------|------|
| **RTCPeerConnection** | 피어 간 연결 관리 |
| **MediaStream** | 미디어 스트림 (카메라, 마이크) |
| **ICE Candidate** | 연결 후보 정보 |
| **SDP (Session Description Protocol)** | 세션 정보 교환 |
| **Signaling Server** | 시그널 중계 (Socket.IO) |
| **STUN Server** | NAT 우회 (Google STUN) |

---

## 2. 연결 흐름

### 2.1 시그널링 과정

```
┌─────────────┐                 ┌─────────────┐                 ┌─────────────┐
│   Peer A    │                 │  Signaling  │                 │   Peer B    │
│  (Caller)   │                 │   Server    │                 │  (Callee)   │
└──────┬──────┘                 └──────┬──────┘                 └──────┬──────┘
       │                               │                               │
       │──── join-room ───────────────▶│                               │
       │                               │                               │
       │                               │◀────────── join-room ─────────│
       │                               │                               │
       │◀──── user-joined (B) ─────────│                               │
       │                               │                               │
       │  ┌──────────────────────┐     │                               │
       │  │ 1. createOffer()     │     │                               │
       │  │ 2. setLocalDescription│    │                               │
       │  └──────────────────────┘     │                               │
       │                               │                               │
       │──── signal (Offer to B) ─────▶│──── signal (Offer) ──────────▶│
       │                               │                               │
       │                               │     ┌──────────────────────┐  │
       │                               │     │ 1. setRemoteDescription│ │
       │                               │     │ 2. createAnswer()    │  │
       │                               │     │ 3. setLocalDescription│ │
       │                               │     └──────────────────────┘  │
       │                               │                               │
       │◀──── signal (Answer) ─────────│◀──── signal (Answer) ─────────│
       │                               │                               │
       │  ┌──────────────────────┐     │                               │
       │  │ setRemoteDescription │     │                               │
       │  └──────────────────────┘     │                               │
       │                               │                               │
       │──── signal (ICE Candidate) ──▶│──── signal (ICE) ────────────▶│
       │◀──── signal (ICE Candidate) ──│◀──── signal (ICE) ────────────│
       │                               │                               │
       │◀══════════════════════════════════════════════════════════════▶│
       │              Direct P2P Media Connection                      │
       │                               │                               │
```

### 2.2 상태 변화

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│   new     │────▶│connecting │────▶│connected  │────▶│  closed   │
└───────────┘     └───────────┘     └───────────┘     └───────────┘
                        │
                        ▼
                  ┌───────────┐
                  │ failed    │
                  └───────────┘
```

---

## 3. 핵심 API

### 3.1 RTCPeerConnection

```javascript
// STUN 서버 설정
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// PeerConnection 생성
const peerConnection = new RTCPeerConnection(configuration);
```

### 3.2 로컬 미디어 획득

```javascript
// 카메라 + 마이크 스트림 획득
const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
});

// video 요소에 표시
videoElement.srcObject = localStream;
```

### 3.3 트랙 추가

```javascript
// 로컬 스트림의 모든 트랙을 PeerConnection에 추가
localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
});
```

### 3.4 원격 스트림 수신

```javascript
// 원격 트랙 수신 이벤트
peerConnection.ontrack = (event) => {
    const [remoteStream] = event.streams;
    remoteVideoElement.srcObject = remoteStream;
};
```

### 3.5 Offer/Answer 교환

```javascript
// Caller: Offer 생성 및 전송
const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
socket.emit('signal', {
    targetSocketId: remoteSocketId,
    sdp: offer
});

// Callee: Offer 수신 및 Answer 생성
peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
const answer = await peerConnection.createAnswer();
await peerConnection.setLocalDescription(answer);
socket.emit('signal', {
    targetSocketId: callerSocketId,
    sdp: answer
});

// Caller: Answer 수신
peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
```

### 3.6 ICE Candidate 교환

```javascript
// ICE Candidate 생성 이벤트
peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
        socket.emit('signal', {
            targetSocketId: remoteSocketId,
            candidate: event.candidate
        });
    }
};

// ICE Candidate 수신 및 추가
socket.on('signal', ({ fromSocketId, candidate }) => {
    if (candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
});
```

---

## 4. Hamcam 구현

### 4.1 피어 관리

```javascript
// 소켓 ID별 PeerConnection 관리
const peers = new Map();

// 새 피어 연결 생성
const createPeerConnection = (remoteSocketId) => {
    const pc = new RTCPeerConnection(configuration);
    
    // 로컬 트랙 추가
    localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
    });
    
    // 원격 트랙 수신
    pc.ontrack = (event) => {
        setRemoteStream(remoteSocketId, event.streams[0]);
    };
    
    // ICE Candidate 전송
    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('signal', {
                targetSocketId: remoteSocketId,
                candidate: event.candidate
            });
        }
    };
    
    peers.set(remoteSocketId, pc);
    return pc;
};
```

### 4.2 방 입장 시 연결

```javascript
// 기존 참여자 목록 수신
socket.on('all-users', (users) => {
    users.forEach(async (user) => {
        const pc = createPeerConnection(user.socketId);
        
        // Offer 생성 및 전송 (Caller)
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('signal', {
            targetSocketId: user.socketId,
            sdp: offer
        });
    });
});

// 새 참여자 입장 (Callee 역할)
socket.on('user-joined', (user) => {
    createPeerConnection(user.socketId);
    // Callee는 Offer를 기다림
});
```

### 4.3 시그널 처리

```javascript
socket.on('signal', async ({ fromSocketId, sdp, candidate }) => {
    let pc = peers.get(fromSocketId);
    
    if (!pc) {
        pc = createPeerConnection(fromSocketId);
    }
    
    if (sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        
        if (sdp.type === 'offer') {
            // Answer 생성 및 전송
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('signal', {
                targetSocketId: fromSocketId,
                sdp: answer
            });
        }
    }
    
    if (candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
});
```

### 4.4 연결 해제

```javascript
socket.on('user-left', (socketId) => {
    const pc = peers.get(socketId);
    if (pc) {
        pc.close();
        peers.delete(socketId);
    }
    // UI에서 원격 비디오 제거
    removeRemoteVideo(socketId);
});
```

---

## 5. 미디어 제어

### 5.1 카메라 on/off

```javascript
const toggleCamera = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
    }
};
```

### 5.2 마이크 on/off

```javascript
const toggleMicrophone = () => {
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
    }
};
```

### 5.3 스트림 종료

```javascript
const stopStream = () => {
    localStream.getTracks().forEach(track => track.stop());
};
```

---

## 6. STUN/TURN 서버

### 6.1 STUN 서버

NAT 환경에서 공인 IP를 알아내기 위한 서버

```javascript
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};
```

### 6.2 TURN 서버 (필요 시)

STUN으로 P2P 연결이 불가능한 경우 미디어 중계

```javascript
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:your-turn-server.com:3478',
            username: 'user',
            credential: 'password'
        }
    ]
};
```

---

## 7. 디버깅

### 7.1 연결 상태 확인

```javascript
peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState);
    // 'new', 'connecting', 'connected', 'disconnected', 'failed', 'closed'
};

peerConnection.oniceconnectionstatechange = () => {
    console.log('ICE state:', peerConnection.iceConnectionState);
};
```

### 7.2 Chrome WebRTC 내부 페이지

```
chrome://webrtc-internals
```

### 7.3 일반적인 문제

| 문제 | 원인 | 해결 |
|------|------|------|
| 연결 실패 | STUN 서버 접근 불가 | 다른 STUN 서버 시도 |
| 미디어 없음 | 권한 거부 | 카메라/마이크 권한 확인 |
| 한쪽만 보임 | SDP 교환 오류 | 시그널링 순서 확인 |
| 끊김 | 네트워크 불안정 | ICE restart 시도 |

---

## 8. 성능 최적화

### 8.1 비디오 제약 조건

```javascript
const constraints = {
    video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 30 }
    },
    audio: {
        echoCancellation: true,
        noiseSuppression: true
    }
};
```

### 8.2 대역폭 제한

```javascript
const sender = peerConnection.getSenders().find(s => s.track.kind === 'video');
const params = sender.getParameters();
params.encodings[0].maxBitrate = 500000; // 500 kbps
sender.setParameters(params);
```
