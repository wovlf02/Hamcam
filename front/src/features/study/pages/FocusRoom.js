import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/api';
import '../styles/FocusRoom.css';
import io from 'socket.io-client';
import * as faceapi from 'face-api.js';
import ModelLoader from '../../../utils/ModelLoader';

const useP2PRoom = (roomId) => {
    const socketRef = useRef();
    const peersRef = useRef(new Map());
    const localStreamRef = useRef();
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [focusTimes, setFocusTimes] = useState({});

    useEffect(() => {
        const socket = io('http://localhost:4000', { withCredentials: true });
        socketRef.current = socket;

        socket.emit('join-room', { roomId });

        socket.on('all-users', (users) => {
            setParticipants(users);
            users.forEach(user => {
                if (user.socketId !== socket.id) {
                    createPeer(user.socketId, socket.id);
                }
            });
        });

        socket.on('user-joined', (user) => {
            setParticipants(prev => [...prev, user]);
            createPeer(user.socketId, socket.id);
        });

        socket.on('signal', async ({ fromSocketId, sdp, candidate }) => {
            const peer = peersRef.current.get(fromSocketId);
            if (!peer) return;

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
            setFocusTimes(prev => {
                const newTimes = { ...prev };
                const user = participants.find(p => p.socketId === socketId);
                if (user) delete newTimes[user.user_id];
                return newTimes;
            });
        });

        socket.on('new-message', (message) => {
            setChatMessages(prev => [...prev, message]);
        });

        socket.on('focus-time-update', ({ userId, time }) => {
            setFocusTimes(prev => ({ ...prev, [userId]: time }));
        });

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            socket.disconnect();
        };
    }, [roomId, participants]);

    const createPeer = (targetSocketId, initiatorSocketId) => {
        if (!localStreamRef.current) return;
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        localStreamRef.current.getTracks().forEach(track => {
            peer.addTrack(track, localStreamRef.current);
        });

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('signal', { targetSocketId, candidate: event.candidate });
            }
        };

        peer.ontrack = (event) => {
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

    const startLocalStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        return stream;
    }, []);

    const sendMessage = (message) => {
        socketRef.current.emit('send-message', { roomId, message });
    };

    return { participants, chatMessages, startLocalStream, sendMessage, localStreamRef, socketId: socketRef.current?.id, focusTimes, socketRef };
};

const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const FocusRoom = () => {
    const { roomId } = useParams();
    const { participants, chatMessages, startLocalStream, sendMessage, localStreamRef, socketId, focusTimes, socketRef } = useP2PRoom(roomId);

    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const myVideoRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const userRes = await api.get('/users/me');
                setUserId(userRes.data.data.user_id);
                setNickname(userRes.data.data.nickname);

                await ModelLoader.loadModels();
                setModelsLoaded(true);

                const stream = await startLocalStream();
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('FocusRoom 초기 로딩 오류:', error);
                alert(`초기 로딩 실패: ${error.message}`);
            }
        };
        loadInitialData();
    }, [startLocalStream]);

    useEffect(() => {
        if (!modelsLoaded || !faceapi.nets.tinyFaceDetector.isLoaded) return;

        const faceDetectInterval = setInterval(async () => {
            if (myVideoRef.current) {
                const detections = await faceapi.detectAllFaces(myVideoRef.current, new faceapi.TinyFaceDetectorOptions());
                setFaceDetected(detections.length > 0);
            }
        }, 1000);

        return () => clearInterval(faceDetectInterval);
    }, [modelsLoaded]);

    useEffect(() => {
        if (!userId || !socketRef.current) return;

        const focusTimeInterval = setInterval(() => {
            if (faceDetected) {
                const newTime = (focusTimes[userId] || 0) + 1;
                socketRef.current.emit('focus-time-update', { userId, time: newTime });
            }
        }, 1000);

        return () => clearInterval(focusTimeInterval);
    }, [faceDetected, userId, focusTimes, socketRef]);

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

    const rankedParticipants = useMemo(() => {
        const all = [...participants];
        // Add local user to ranking if not already present
        if (userId && !all.some(p => p.user_id === userId)) {
            all.push({ user_id: userId, nickname });
        }
        return all.sort((a, b) => (focusTimes[b.user_id] || 0) - (focusTimes[a.user_id] || 0));
    }, [participants, focusTimes, userId, nickname]);

    const allParticipantsInGrid = useMemo(() => {
        const remoteParticipants = participants.filter(p => p.socketId !== socketId);
        const localParticipant = {
            user_id: userId,
            nickname,
            socketId,
            isLocal: true
        };
        return [localParticipant, ...remoteParticipants];
    }, [participants, socketId, userId, nickname]);


    return (
        <div className="focus-room-container">
            <h1 className="focus-room-title">📚 시간 경쟁방</h1>
            <div className="focus-room-main-content">
                <div className="focus-room-left-panel">
                    <div className="video-grid">
                        {allParticipantsInGrid.map(p => (
                            <div key={p.socketId || p.user_id} className="video-wrapper">
                                <video
                                    ref={p.isLocal ? myVideoRef : video => { if (video && p.stream) video.srcObject = p.stream; }}
                                    autoPlay
                                    muted={p.isLocal}
                                    playsInline
                                />
                                <p>
                                    {p.nickname}
                                    {p.isLocal ? ` (나) - ${faceDetected ? '집중' : '자리 비움'}` : ''}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="focus-room-right-panel">
                    <div className="focus-room-ranking">
                        <h3>✨ 실시간 집중 랭킹</h3>
                        <ul className="ranking-list">
                            {rankedParticipants.map((p, index) => (
                                <li key={p.user_id} className="ranking-item">
                                    <span>{index + 1}. {p.nickname}</span>
                                    <span className="time">{formatTime(focusTimes[p.user_id] || 0)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="focus-room-chat">
                        <h3>💬 채팅</h3>
                        <div className="chat-log" ref={chatRef}>
                            {chatMessages.map((chat, index) => (
                                <div key={index} className={`chat-message ${chat.userId === userId ? 'mine' : 'other'}`}>
                                    <span className="chat-nickname">{chat.nickname}</span>
                                    <div className="chat-bubble">{chat.message}</div>
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
