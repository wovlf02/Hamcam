import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import '../styles/FocusRoom.css';
import io from 'socket.io-client';
import * as faceapi from 'face-api.js';
import ModelLoader from '../../../utils/ModelLoader';

// A custom hook to encapsulate P2P and Socket.IO logic
const useP2PRoom = (roomId) => {
    const socketRef = useRef();
    const peersRef = useRef(new Map());
    const localStreamRef = useRef();
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:4000', { withCredentials: true });
        socketRef.current = socket;

        // Initial connection
        socket.emit('join-room', { roomId });

        socket.on('all-users', (users) => {
            // Create peer connections for all existing users
            users.forEach(user => {
                createPeer(user.socketId, socket.id);
            });
            setParticipants(users);
        });

        socket.on('user-joined', (user) => {
            setParticipants(prev => [...prev, user]);
            createPeer(user.socketId, socket.id);
        });

        socket.on('signal', async ({ fromSocketId, sdp, candidate }) => {
            const peer = peersRef.current.get(fromSocketId);
            if (sdp) {
                await peer.setRemoteDescription(new RTCSessionDescription(sdp));
                if (sdp.type === 'offer') {
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);
                    socket.emit('signal', { targetSocketId: fromSocketId, sdp: answer });
                }
            } else if (candidate) {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        socket.on('user-left', (socketId) => {
            const peer = peersRef.current.get(socketId);
            if (peer) peer.close();
            peersRef.current.delete(socketId);
            setParticipants(prev => prev.filter(p => p.socketId !== socketId));
        });

        socket.on('new-message', (message) => {
            setChatMessages(prev => [...prev, message]);
        });

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            socket.disconnect();
        };
    }, [roomId]);

    const createPeer = (targetSocketId, initiatorSocketId) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        localStreamRef.current.getTracks().forEach(track => {
            peer.addTrack(track, localStreamRef.current);
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('signal', { targetSocketId, candidate: event.candidate });
            }
        };

        peer.ontrack = (event) => {
            // This is where you would handle the remote stream
            // For simplicity, we'll update participant state, and the component will render it
            setParticipants(prev => prev.map(p => 
                p.socketId === targetSocketId ? { ...p, stream: event.streams[0] } : p
            ));
        };

        if (initiatorSocketId === socketRef.current.id) {
            peer.createOffer()
                .then(offer => peer.setLocalDescription(offer))
                .then(() => {
                    socketRef.current.emit('signal', { targetSocketId, sdp: peer.localDescription });
                });
        }
        
        peersRef.current.set(targetSocketId, peer);
    };

    const startLocalStream = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        return stream;
    };

    const sendMessage = (message) => {
        socketRef.current.emit('send-message', { roomId, message });
    };

    return { participants, chatMessages, startLocalStream, sendMessage, localStreamRef, socketId: socketRef.current?.id };
};

const FocusRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { participants, chatMessages, startLocalStream, sendMessage, localStreamRef, socketId } = useP2PRoom(roomId);

    const [userId, setUserId] = useState(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [camOn, setCamOn] = useState(true);
    const [chatInput, setChatInput] = useState('');

    const myVideoRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        api.get('/users/me').then(res => setUserId(res.data.data.user_id));
        ModelLoader.loadModels().then(() => setModelsLoaded(true));
        startLocalStream().then(stream => {
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
            }
        }).catch(() => setCamOn(false));
    }, [startLocalStream]);

    useEffect(() => {
        if (!modelsLoaded || !camOn) return;
        const intervalId = setInterval(async () => {
            if (myVideoRef.current) {
                const detections = await faceapi.detectAllFaces(myVideoRef.current, new faceapi.TinyFaceDetectorOptions());
                setFaceDetected(detections.length > 0);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [modelsLoaded, camOn]);
    
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        sendMessage(chatInput);
        setChatInput('');
    };

    return (
        <div className="focus-room-container">
            <h1>📚 시간 경쟁방</h1>
            <div className="main-content">
                <div id="video-container" className="video-grid">
                    <div className="video-wrapper">
                        <video ref={myVideoRef} autoPlay muted playsInline />
                        <p>내 캠 (얼굴 {faceDetected ? '인식됨' : '미인식'})</p>
                    </div>
                    {participants.map(p => {
                        if (p.socketId === socketId) return null; // 수정된 부분
                        return (
                            <div key={p.socketId} className="video-wrapper">
                                <video 
                                    autoPlay 
                                    playsInline 
                                    ref={video => { if (video && p.stream) video.srcObject = p.stream; }}
                                />
                                <p>{p.nickname}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="side-section">
                    {/* Ranking and Chat sections would be updated based on new socket events */}
                    <div className="chat-section">
                         <div className="chat-log" ref={chatRef}>
                            {chatMessages.map((chat, index) => (
                                <div key={index} className={`chat-message ${chat.userId === userId ? 'mine' : 'other'}`}>
                                    {/* Simplified chat bubble for demonstration */}
                                    <strong>{chat.nickname}:</strong> {chat.message}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="chat-input">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                            />
                            <button type="submit">전송</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusRoom;
