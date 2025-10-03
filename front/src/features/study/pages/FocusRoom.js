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
    const [localStream, setLocalStream] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [focusTimes, setFocusTimes] = useState({});
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [mutedRemoteUsers, setMutedRemoteUsers] = useState(new Map());
    const [pendingPeers, setPendingPeers] = useState([]);

    const toggleRemoteAudio = useCallback((socketId) => {
        setMutedRemoteUsers(prev => {
            const newMutedState = !prev.get(socketId);
            const newMap = new Map(prev);
            newMap.set(socketId, newMutedState);

            const participant = participants.find(p => p.socketId === socketId);
            if (participant && participant.stream) {
                participant.stream.getAudioTracks().forEach(track => {
                    track.enabled = !newMutedState;
                });
            }
            return newMap;
        });
    }, [participants]);

    useEffect(() => {
        const socket = io('http://localhost:4000', { withCredentials: true });
        socketRef.current = socket;

        socket.emit('join-room', { roomId });

        socket.on('all-users', (users) => {
            if (localStream) {
                users.forEach(user => createPeer(user.socketId, socket.id));
            } else {
                setPendingPeers(prev => [...prev, ...users.map(u => u.socketId)]);
            }
            setParticipants(users);
        });

        socket.on('user-joined', (user) => {
            setParticipants(prev => [...prev, user]);
            if (localStream) {
                createPeer(user.socketId, socket.id);
            } else {
                setPendingPeers(prev => [...prev, user.socketId]);
            }
        });

        socket.on('signal', async ({ fromSocketId, sdp, candidate }) => {
            const peer = peersRef.current.get(fromSocketId);
            if (!peer) {
                console.warn("Peer not found for signal from", fromSocketId);
                return;
            }
            if (sdp) {
                try {
                    const remoteDesc = new RTCSessionDescription(sdp);
                    if (remoteDesc.type === 'answer') {
                        if (peer.signalingState !== 'have-local-offer') {
                            console.warn("Received answer in unexpected signaling state:", peer.signalingState);
                            return;
                        }
                    }
                    console.log(`Before setRemoteDescription (type: ${remoteDesc.type}): ${peer.signalingState}`);
                    await peer.setRemoteDescription(remoteDesc);
                    console.log(`After setRemoteDescription (type: ${remoteDesc.type}): ${peer.signalingState}`);

                    if (sdp.type === 'offer') {
                        if (localStream) {
                            localStream.getTracks().forEach(track => {
                                const sender = peer.getSenders().find(s => s.track === track);
                                if (!sender) {
                                    peer.addTrack(track, localStream);
                                }
                            });
                        }

                        console.log(`Before createAnswer: ${peer.signalingState}`);
                        const answer = await peer.createAnswer();
                        console.log(`After createAnswer, Before setLocalDescription: ${peer.signalingState}`);
                        await peer.setLocalDescription(answer);
                        console.log(`After setLocalDescription (answer): ${peer.signalingState}`);
                        socketRef.current.emit('signal', { targetSocketId: fromSocketId, sdp: answer });
                    }
                } catch (error) {
                    console.error("Error setting remote description or creating answer:", error);
                }
            } else if (candidate) {
                try {
                    console.log(`Adding ICE candidate: ${peer.signalingState}`);
                    await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            }
        });

        socket.on('user-left', (socketId) => {
            peersRef.current.get(socketId)?.close();
            peersRef.current.delete(socketId);
            setParticipants(prev => prev.filter(p => p.socketId !== socketId));
            setFocusTimes(prev => {
                const newTimes = { ...prev };
                const user = participants.find(p => p.socketId === socketId);
                if (user) delete newTimes[user.user_id];
                return newTimes;
            });
        });

        socket.on('new-message', (message) => setChatMessages(prev => [...prev, message]));
        socket.on('focus-time-update', ({ userId, time }) => setFocusTimes(prev => ({ ...prev, [userId]: time })));

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            socket.disconnect();
        };
    }, [roomId]);

    // localStream이 준비되면 pending peers 처리
    useEffect(() => {
        if (localStream) {
            console.log(`[useEffect localStream] localStream available. Adding tracks to ${peersRef.current.size} peers.`);
            peersRef.current.forEach(peer => {
                localStream.getTracks().forEach(track => {
                    const sender = peer.getSenders().find(s => s.track === track);
                    if (!sender) {
                        peer.addTrack(track, localStream);
                    }
                });
            });

            if (pendingPeers.length > 0) {
                pendingPeers.forEach(socketId => {
                    createPeer(socketId, socketRef.current.id);
                });
                setPendingPeers([]);
            }
        }
    }, [localStream, pendingPeers]);

    const createPeer = (targetSocketIdParam, initiatorSocketId) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });

        const currentPeerTargetSocketId = targetSocketIdParam;
        console.log(`[createPeer] Called for ${currentPeerTargetSocketId}. localStream available: ${!!localStream}`);

        peer.onicecandidate = e => e.candidate && socketRef.current.emit('signal', { targetSocketId: currentPeerTargetSocketId, candidate: e.candidate });

        peer.ontrack = e => {
            console.log("ONTRACK event received!", e);
            console.log("Stream received:", e.streams[0]);
            setParticipants(prev => prev.map(p =>
                p.socketId === currentPeerTargetSocketId ? { ...p, stream: e.streams[0] } : p
            ));
        };

        peer.onnegotiationneeded = async () => {
            try {
                if (peer.signalingState === 'stable') {
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socketRef.current.emit('signal', { targetSocketId: currentPeerTargetSocketId, sdp: peer.localDescription });
                } else {
                    console.warn("Negotiation needed, but peer not in stable state to create offer. Signaling state:", peer.signalingState);
                }
            } catch (error) {
                console.error("Error during negotiationneeded:", error);
            }
        };

        peersRef.current.set(currentPeerTargetSocketId, peer);
    };

    const startLocalStream = useCallback(async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("카메라/마이크를 사용할 수 없습니다. HTTPS 또는 localhost 환경에서 접속해주세요.");
            throw new Error('getUserMedia is not supported in this browser/context.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        setIsCameraOn(stream.getVideoTracks().some(track => track.enabled));
        setIsMicOn(stream.getAudioTracks().some(track => track.enabled));
        return stream;
    }, []);

    const toggleCamera = () => {
        if (localStream) {
            const videoTracks = localStream.getVideoTracks();
            if (videoTracks.length > 0) {
                const newState = !videoTracks[0].enabled;
                videoTracks.forEach(track => (track.enabled = newState));
                setIsCameraOn(newState);
            }
        }
    };

    const toggleMicrophone = () => {
        if (localStream) {
            const audioTracks = localStream.getAudioTracks();
            if (audioTracks.length > 0) {
                const newState = !audioTracks[0].enabled;
                audioTracks.forEach(track => (track.enabled = newState));
                setIsMicOn(newState);
            }
        }
    };

    const sendMessage = (message) => socketRef.current.emit('send-message', { roomId, message });

    return { participants, chatMessages, startLocalStream, sendMessage, localStream, socketId: socketRef.current?.id, focusTimes, socketRef, isCameraOn, isMicOn, toggleCamera, toggleMicrophone, mutedRemoteUsers, toggleRemoteAudio };
};

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}시 ${m}분 ${s}초`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
};

const FocusRoom = () => {
    const { roomId } = useParams();
    const { participants, chatMessages, startLocalStream, sendMessage, localStream, socketId, focusTimes, socketRef, isCameraOn, isMicOn, toggleCamera, toggleMicrophone, mutedRemoteUsers, toggleRemoteAudio } = useP2PRoom(roomId);

    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [myFocusTime, setMyFocusTime] = useState(0); // 로컬 시간 상태 추가

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
                await startLocalStream();
            } catch (error) {
                console.error('FocusRoom 초기 로딩 오류:', error);
                alert(`초기 로딩 실패: ${error.message}`);
            }
        };
        loadInitialData();
    }, [startLocalStream]);

    useEffect(() => {
        if (myVideoRef.current && localStream) {
            if (isCameraOn) {
                myVideoRef.current.srcObject = localStream;
            } else {
                myVideoRef.current.srcObject = null;
            }
        }
    }, [isCameraOn, localStream]);

    // 캠이 꺼지면 얼굴 인식 상태를 즉시 리셋
    useEffect(() => {
        if (!isCameraOn) {
            setFaceDetected(false);
            console.log('FocusRoom: 캠 꺼짐 - 얼굴 인식 상태를 false로 리셋');
        }
    }, [isCameraOn]);

    useEffect(() => {
        const detectFace = async () => {
            if (!myVideoRef.current) return;
            try {
                const detections = await faceapi.detectAllFaces(myVideoRef.current);
                setFaceDetected(detections.length > 0);
            } catch (error) {
                console.error('FocusRoom 얼굴 감지 오류:', error);
            }
        };

        if (modelsLoaded && isCameraOn) {
            const interval = setInterval(detectFace, 700);
            return () => clearInterval(interval);
        }
    }, [modelsLoaded, isCameraOn]);

    useEffect(() => {
        if (!userId || !socketRef.current) return;

        const interval = setInterval(() => {
            // 캠이 켜져있고 얼굴이 감지되어야만 시간 증가
            if (isCameraOn && faceDetected) {
                console.log(`FocusRoom: 캠 켜짐 + 얼굴 감지됨, 시간 증가 중... 현재: ${myFocusTime}초`);

                // 로컬 시간 상태 증가
                setMyFocusTime(prev => {
                    const newTime = prev + 1;
                    console.log(`FocusRoom: 새로운 시간 ${newTime}초를 서버로 전송`);

                    // 서버로 새로운 시간 전송
                    socketRef.current.emit('focus-time-update', { userId, time: newTime });
                    return newTime;
                });
            } else {
                if (!isCameraOn) {
                    console.log('FocusRoom: 캠이 꺼져있어 시간이 멈춰있습니다.');
                } else if (!faceDetected) {
                    console.log('FocusRoom: 얼굴이 감지되지 않아 시간이 멈춰있습니다.');
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isCameraOn, faceDetected, userId, socketRef, myFocusTime]);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chatMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        sendMessage(chatInput);
        setChatInput('');
    };

    const rankedParticipants = useMemo(() => {
        const all = [...participants];
        if (userId && !all.some(p => p.user_id === userId)) {
            all.push({ user_id: userId, nickname });
        }
        return all.sort((a, b) => {
            // 내 시간은 로컬 상태를 사용하고, 다른 사람은 서버 데이터 사용
            const aTime = a.user_id === userId ? myFocusTime : (focusTimes[a.user_id] || 0);
            const bTime = b.user_id === userId ? myFocusTime : (focusTimes[b.user_id] || 0);
            return bTime - aTime;
        });
    }, [participants, focusTimes, userId, nickname, myFocusTime]);

    const maxFocusTime = useMemo(() => {
        const allTimes = [...Object.values(focusTimes)];
        if (userId) {
            // 내 시간도 최대값 계산에 포함
            allTimes.push(myFocusTime);
        }
        return Math.max(1, ...allTimes);
    }, [focusTimes, myFocusTime, userId]);

    return (
        <div className="focus-room-container">
            <h1 className="focus-room-title">📚 시간 경쟁방</h1>
            <div className="focus-room-main-content">
                <div className="focus-room-left-panel">
                    <div className="video-grid">
                        {/* Local Participant */}
                        <div className={`video-wrapper ${faceDetected ? 'face-detected' : ''}`}>
                            {isCameraOn ? (
                                <video ref={myVideoRef} autoPlay muted playsInline />
                            ) : (
                                <div className="camera-off-placeholder">카메라 꺼짐</div>
                            )}
                            <div className="video-info">
                                <p>나</p>
                            </div>
                            <div className="video-controls">
                                <button onClick={toggleCamera}>{isCameraOn ? '캠 끄기' : '캠 켜기'}</button>
                                <button onClick={toggleMicrophone}>{isMicOn ? '마이크 끄기' : '마이크 켜기'}</button>
                            </div>
                        </div>
                        {/* Remote Participants */}
                        {participants.filter(p => p.socketId !== socketId).map(p => (
                            <div key={p.socketId} className="video-wrapper">
                                {p.stream ? (
                                    <video autoPlay playsInline ref={video => { if (video) video.srcObject = p.stream; }} />
                                ) : (
                                    <div className="camera-off-placeholder">카메라 로딩중...</div>
                                )}
                                <div className="video-info">
                                    <p>{p.nickname}</p>
                                </div>
                                <div className="video-controls">
                                    <button onClick={() => toggleRemoteAudio(p.socketId)}>
                                        {mutedRemoteUsers.get(p.socketId) ? '음소거 해제' : '음소거'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="focus-room-right-panel">
                    <div className="focus-room-ranking">
                        <div className="ranking-header"><h3>✨ 실시간 집중 랭킹</h3></div>
                        <ul className="ranking-list">
                            {rankedParticipants.map((p, index) => {
                                // 내 시간은 로컬 상태를 사용하고, 다른 사람은 서버 데이터 사용
                                const userTime = p.user_id === userId ? myFocusTime : (focusTimes[p.user_id] || 0);
                                const progress = (userTime / maxFocusTime) * 100;

                                // 메달 이모지 결정
                                let medalEmoji = '';
                                if (index === 0) medalEmoji = '🥇';
                                else if (index === 1) medalEmoji = '🥈';
                                else if (index === 2) medalEmoji = '🥉';

                                return (
                                    <li key={p.user_id} className="ranking-item">
                                        <div className="ranking-main-info">
                                            <div className="ranking-user-info">
                                                <span className="rank">{index + 1}</span>
                                                {medalEmoji && <span className="medal">{medalEmoji}</span>}
                                                <span className="nickname">{p.nickname}</span>
                                            </div>
                                            <span className="time">{formatTime(userTime)}</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="focus-room-chat">
                        <div className="chat-header"><h3>💬 채팅</h3></div>
                        <div className="chat-log" ref={chatRef}>
                            {chatMessages.map((chat, index) => (
                                <div key={index} className={`chat-message ${chat.userId === userId ? 'mine' : 'other'}`}>
                                    <span className="chat-nickname">{chat.nickname}</span>
                                    <div className="chat-bubble">{chat.message}</div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="chat-input">
                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="메시지를 입력하세요..." />
                            <button type="submit">전송</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FocusRoom;
