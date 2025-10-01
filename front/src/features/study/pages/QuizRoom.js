import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import '../styles/QuizRoom.css';
import io from 'socket.io-client';
import { API_BASE_URL_8080 } from "../../../api/apiUrl";

// This hook would be in its own file, e.g., features/rtc/hooks/useP2PRoom.js
// For this example, it's defined here for clarity.
const useP2PRoom = (roomId) => {
    const socketRef = useRef();
    const peersRef = useRef(new Map());
    const [localStream, setLocalStream] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [problem, setProblem] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);

    useEffect(() => {
        const socket = io('http://localhost:4000', { withCredentials: true });
        socketRef.current = socket;

        socket.emit('join-room', { roomId });

        socket.on('all-users', (users) => {
            users.forEach(user => createPeer(user.socketId, socket.id));
            setParticipants(users);
        });

        socket.on('user-joined', (user) => {
            setParticipants(prev => [...prev, user]);
            createPeer(user.socketId, socket.id);
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
                        // If we receive an answer, we must be in 'have-local-offer' state.
                        // If not, it's an unexpected answer.
                        if (peer.signalingState !== 'have-local-offer') {
                            console.warn("Received answer in unexpected signaling state:", peer.signalingState);
                            return;
                        }
                    }
                    await peer.setRemoteDescription(remoteDesc);
                    if (sdp.type === 'offer') {
                        const answer = await peer.createAnswer();
                        await peer.setLocalDescription(answer);
                        socket.emit('signal', { targetSocketId: fromSocketId, sdp: answer });
                    }
                } catch (error) {
                    console.error("Error setting remote description or creating answer:", error);
                }
            } else if (candidate) {
                try {
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
        });

        socket.on('new-message', (message) => setChatMessages(prev => [...prev, message]));
        socket.on('new-problem', (newProblem) => setProblem(newProblem));
        socket.on('ranking-update', (newRanking) => setRanking(newRanking));

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            socket.disconnect();
        };
    }, [roomId]);

    // New useEffect to add local stream tracks to peer connections
    useEffect(() => {
        if (localStream) {
            peersRef.current.forEach(peer => {
                localStream.getTracks().forEach(track => {
                    const sender = peer.getSenders().find(s => s.track === track);
                    if (!sender) {
                        peer.addTrack(track, localStream);
                    }
                });
            });
        }
    }, [localStream]);

    const createPeer = (targetSocketId, initiatorSocketId) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        peer.onicecandidate = e => e.candidate && socketRef.current.emit('signal', { targetSocketId, candidate: e.candidate });

        peer.ontrack = e => {
            setParticipants(prev => prev.map(p =>
                p.socketId === targetSocketId ? { ...p, stream: e.streams[0] } : p
            ));
        };

        peer.onnegotiationneeded = async () => {
            try {
                // Only create offer if we are the initiator or if the signaling state is stable
                // This prevents creating offers when one is already in progress
                if (initiatorSocketId === socketRef.current.id || peer.signalingState === 'stable') {
                    const offer = await peer.createOffer();
                    await peer.setLocalDescription(offer);
                    socketRef.current.emit('signal', { targetSocketId, sdp: peer.localDescription });
                } else {
                    console.warn("Negotiation needed, but not initiating offer. Signaling state:", peer.signalingState);
                }
            } catch (error) {
                console.error("Error during negotiationneeded:", error);
            }
        };

        peersRef.current.set(targetSocketId, peer);
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

    const emitEvent = (eventName, payload) => socketRef.current.emit(eventName, { roomId, ...payload });

    return { participants, chatMessages, problem, ranking, startLocalStream, emitEvent, localStream, socketId: socketRef.current?.id, isCameraOn, isMicOn, toggleCamera, toggleMicrophone };
};

const QuizRoom = () => {
    const { roomId } = useParams();
    const { participants, chatMessages, problem, ranking, startLocalStream, emitEvent, localStream, socketId, isCameraOn, isMicOn, toggleCamera, toggleMicrophone } = useP2PRoom(roomId);

    const [userId, setUserId] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const myVideoRef = useRef();
    const chatRef = useRef();

    useEffect(() => {
        api.get('/users/me').then(res => setUserId(res.data.data.user_id));
        startLocalStream();
    }, []);

    useEffect(() => {
        if (myVideoRef.current && localStream) {
            if (isCameraOn) {
                myVideoRef.current.srcObject = localStream;
            } else {
                myVideoRef.current.srcObject = null;
            }
        }
    }, [isCameraOn, localStream]);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [chatMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        emitEvent('send-message', { message: chatInput });
        setChatInput('');
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;
        emitEvent('submit-answer', { answer: userAnswer });
        setUserAnswer('');
    };

    return (
        <div className="quizroom-wrapper">
            <h1 className="quizroom-title">📘 문제풀이방</h1>
            <div className="quizroom-main-content">
                <section className="quizroom-problem-section">
                    {/* Problem display logic here */}
                    {problem ? (
                        <div>
                            <img src={`${API_BASE_URL_8080}${problem.image_path}`} alt="문제" className="problem-image"/>
                            <form onSubmit={handleSubmitAnswer} className="answer-form">
                                <input type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} />
                                <button type="submit">제출</button>
                            </form>
                        </div>
                    ) : <p>문제를 기다리고 있습니다...</p>}
                </section>

                <section className="quizroom-video-section">
                    <h2>캠 화면</h2>
                    <div className="quizroom-video-grid">
                        <div className="video-tile">
                            {isCameraOn ? (
                                <video ref={myVideoRef} autoPlay muted playsInline />
                            ) : (
                                <div className="camera-off-placeholder">카메라 꺼짐</div>
                            )}
                            <div className="name">나</div>
                            <div className="controls">
                                <button onClick={toggleCamera}>{isCameraOn ? '캠 끄기' : '캠 켜기'}</button>
                                <button onClick={toggleMicrophone}>{isMicOn ? '마이크 끄기' : '마이크 켜기'}</button>
                            </div>
                        </div>
                        {participants.map(p => (
                            <div key={p.socketId} className="video-tile">
                                <video autoPlay playsInline ref={video => { if (video && p.stream) video.srcObject = p.stream; }} />
                                <div className="name">{p.nickname}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="quizroom-chat-section">
                    <div className="quizroom-ranking-wrapper">
                        <h2 className="section-title">📊 정답자 랭킹</h2>
                        <ul className="ranking-list">
                            {ranking.map((user, idx) => <li key={idx}>{idx + 1}등: {user.nickname}</li>)}
                        </ul>
                    </div>
                    <div className="quizroom-chat-wrapper">
                        <h2 className="section-title">💬 채팅</h2>
                        <div className="chat-log" ref={chatRef}>
                            {chatMessages.map((chat, idx) => (
                                <div key={idx} className={`chat-message ${chat.userId === userId ? 'mine' : 'other'}`}>
                                    <strong>{chat.nickname}:</strong> {chat.message}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="chat-input">
                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} />
                            <button type="submit">전송</button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default QuizRoom;
