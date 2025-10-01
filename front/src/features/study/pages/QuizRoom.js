import React, { useEffect, useRef, useState } from 'react';
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
    const localStreamRef = useRef();
    const [participants, setParticipants] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [problem, setProblem] = useState(null);
    const [ranking, setRanking] = useState([]);

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
            peersRef.current.get(socketId)?.close();
            peersRef.current.delete(socketId);
            setParticipants(prev => prev.filter(p => p.socketId !== socketId));
        });

        socket.on('new-message', (message) => setChatMessages(prev => [...prev, message]));
        socket.on('new-problem', (newProblem) => setProblem(newProblem));
        socket.on('ranking-update', (newRanking) => setRanking(newRanking));

        return () => {
            localStreamRef.current?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            socket.disconnect();
        };
    }, [roomId]);

    const createPeer = (targetSocketId, initiatorSocketId) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        localStreamRef.current?.getTracks().forEach(track => peer.addTrack(track, localStreamRef.current));

        peer.onicecandidate = e => e.candidate && socketRef.current.emit('signal', { targetSocketId, candidate: e.candidate });
        
        peer.ontrack = e => {
            setParticipants(prev => prev.map(p => 
                p.socketId === targetSocketId ? { ...p, stream: e.streams[0] } : p
            ));
        };

        if (initiatorSocketId === socketRef.current.id) {
            peer.createOffer()
                .then(offer => peer.setLocalDescription(offer))
                .then(() => socketRef.current.emit('signal', { targetSocketId, sdp: peer.localDescription }));
        }
        
        peersRef.current.set(targetSocketId, peer);
    };

    const startLocalStream = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("카메라/마이크를 사용할 수 없습니다. HTTPS 또는 localhost 환경에서 접속해주세요.");
            throw new Error('getUserMedia is not supported in this browser/context.');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        return stream;
    };

    const emitEvent = (eventName, payload) => socketRef.current.emit(eventName, { roomId, ...payload });

    return { participants, chatMessages, problem, ranking, startLocalStream, emitEvent, localStreamRef, socketId: socketRef.current?.id };
};

const QuizRoom = () => {
    const { roomId } = useParams();
    const { participants, chatMessages, problem, ranking, startLocalStream, emitEvent, localStreamRef, socketId } = useP2PRoom(roomId);

    const [userId, setUserId] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const myVideoRef = useRef();
    const chatRef = useRef();

    useEffect(() => {
        api.get('/users/me').then(res => setUserId(res.data.data.user_id));
        startLocalStream().then(stream => {
            if (myVideoRef.current) myVideoRef.current.srcObject = stream;
        });
    }, [startLocalStream]);

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
                            <video ref={myVideoRef} autoPlay muted playsInline />
                            <div className="name">나</div>
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
