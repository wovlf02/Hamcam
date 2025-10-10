import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../api/api';
import '../styles/QuizRoom.css';
import io from 'socket.io-client';
import { API_BASE_URL_8080 } from "../../../api/apiUrl";
import base_profile from '../../../assets/icons/base_profile.png';

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
    const [pendingPeers, setPendingPeers] = useState([]);
    const [mutedRemoteUsers, setMutedRemoteUsers] = useState(new Map());

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
                    await peer.setRemoteDescription(remoteDesc);

                    if (sdp.type === 'offer') {
                        if (localStream) {
                            localStream.getTracks().forEach(track => {
                                const sender = peer.getSenders().find(s => s.track === track);
                                if (!sender) {
                                    peer.addTrack(track, localStream);
                                }
                            });
                        }

                        const answer = await peer.createAnswer();
                        await peer.setLocalDescription(answer);
                        socketRef.current.emit('signal', { targetSocketId: fromSocketId, sdp: answer });
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

        socket.on('new-message', (message) => {
            console.log('[QuizRoom] new-message received:', message);
            setChatMessages(prev => [...prev, message]);
        });

        socket.on('new-problem', (newProblem) => {
            console.log('[QuizRoom] new-problem received:', newProblem);
            setProblem(newProblem);
        });

        socket.on('ranking-update', (newRanking) => {
            console.log('[QuizRoom] ranking-update received:', newRanking);
            setRanking(newRanking);
        });

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            peersRef.current.forEach(peer => peer.close());
            socket.disconnect();
        };
    }, [roomId]);



    // New useEffect to add local stream tracks to peer connections and process pending peers
    useEffect(() => {
        if (localStream) {
            console.log(`[useEffect localStream] localStream available. Adding tracks to ${peersRef.current.size} peers.`);
            peersRef.current.forEach(peer => {
                localStream.getTracks().forEach(track => {
                    // Check if the track is already added to avoid duplicates
                    const sender = peer.getSenders().find(s => s.track === track);
                    if (!sender) {
                        peer.addTrack(track, localStream);
                    }
                });
            });

            // Process pending peers
            if (pendingPeers.length > 0) { // Only process if there are pending peers
                pendingPeers.forEach(socketId => {
                    createPeer(socketId, socketRef.current.id);
                });
                setPendingPeers([]); // Clear pending peers after processing
            }
        }
    }, [localStream, pendingPeers]);

    const createPeer = (targetSocketIdParam, initiatorSocketId) => {
        const peer = new RTCPeerConnection({ iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] });

        const currentPeerTargetSocketId = targetSocketIdParam;
        console.log(`[createPeer] Called for ${currentPeerTargetSocketId}. localStream available: ${!!localStream}`);


        peer.onicecandidate = e => e.candidate && socketRef.current.emit('signal', { targetSocketId: currentPeerTargetSocketId, candidate: e.candidate });

        peer.ontrack = e => {
            console.log("ONTRAK event received!", e);
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

    const sendMessage = useCallback((message) => {
        if (socketRef.current) {
            console.log('[QuizRoom] Sending message:', { roomId, message });
            socketRef.current.emit('send-message', { roomId, message });
        } else {
            console.error('[QuizRoom] Socket not connected');
        }
    }, [roomId]);

    const emitEvent = (eventName, payload) => {
        if (socketRef.current) {
            console.log(`[QuizRoom] Emitting ${eventName}:`, { roomId, ...payload });
            socketRef.current.emit(eventName, { roomId, ...payload });
        } else {
            console.error(`[QuizRoom] Socket not connected, cannot emit ${eventName}`);
        }
    };

    return {
        participants,
        chatMessages,
        problem,
        ranking,
        startLocalStream,
        sendMessage,
        emitEvent,
        localStream,
        socketId: socketRef.current?.id,
        isCameraOn,
        isMicOn,
        toggleCamera,
        toggleMicrophone,
        mutedRemoteUsers,
        toggleRemoteAudio
    };
};

const QuizRoom = () => {
    const { roomId } = useParams();
    const { participants, chatMessages, problem, ranking, startLocalStream, sendMessage, emitEvent, localStream, isCameraOn, isMicOn, toggleCamera, toggleMicrophone, mutedRemoteUsers, toggleRemoteAudio } = useP2PRoom(roomId);

    const [userId, setUserId] = useState(null);
    const [chatInput, setChatInput] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [showProblemModal, setShowProblemModal] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('중');
    const myVideoRef = useRef();
    const chatRef = useRef();

    useEffect(() => {
        api.get('/users/me').then(res => setUserId(res.data.data.user_id));
        startLocalStream();
        // 과목 목록 불러오기
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            const response = await api.get('/quiz/problems/subjects');
            setSubjects(response.data || []);
        } catch (error) {
            console.error('과목 목록 불러오기 실패:', error);
        }
    };

    const loadUnits = async (subject) => {
        try {
            const response = await api.get(`/quiz/problems/units?subject=${subject}`);
            setUnits(response.data || []);
        } catch (error) {
            console.error('단원 목록 불러오기 실패:', error);
        }
    };

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setSelectedUnit('');
        setUnits([]);
        if (subject) {
            loadUnits(subject);
        }
    };

    const handleFetchProblem = async () => {
        if (!selectedSubject || !selectedUnit || !selectedLevel) {
            alert('과목, 단원, 난이도를 모두 선택해주세요.');
            return;
        }

        try {
            const response = await api.get('/quiz/problems/random', {
                params: {
                    subject: selectedSubject,
                    unit: selectedUnit,
                    level: selectedLevel
                }
            });

            // Socket으로 문제 전달 (방 전체에 브로드캐스트)
            emitEvent('start-problem', { problem: response.data });
            setShowProblemModal(false);
        } catch (error) {
            console.error('문제 불러오기 실패:', error);
            alert('문제를 불러오는데 실패했습니다.');
        }
    };

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
        console.log('[QuizRoom] handleSendMessage called with:', chatInput);
        sendMessage(chatInput);
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
                    <div className="problem-header">
                        <h2>문제</h2>
                        <button
                            className="problem-select-button"
                            onClick={() => setShowProblemModal(true)}
                        >
                            📝 문제 불러오기
                        </button>
                    </div>

                    <div className="problem-scroll">
                        {problem ? (
                            <div>
                                {problem.passage && (
                                    <div className="problem-passage">
                                        <h3>지문</h3>
                                        <p>{problem.passage}</p>
                                    </div>
                                )}
                                <img src={`${API_BASE_URL_8080}${problem.imagePath}`} alt="문제" className="problem-image"/>
                                {problem.choices && problem.choices.length > 0 && (
                                    <div className="problem-choices">
                                        {problem.choices.map((choice, idx) => (
                                            <div key={idx}>{choice}</div>
                                        ))}
                                    </div>
                                )}
                                <div className="answer-input-wrapper">
                                    <label className="answer-label">
                                        정답 입력
                                        <span className="answer-guidance">(예: 1, 2, 3...)</span>
                                    </label>
                                    <form onSubmit={handleSubmitAnswer}>
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={e => setUserAnswer(e.target.value)}
                                            placeholder="정답 번호 입력"
                                        />
                                        <button type="submit">제출</button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="no-problem-placeholder">
                                <p>📝 우측 상단의 "문제 불러오기" 버튼을 눌러 문제를 선택하세요.</p>
                            </div>
                        )}
                    </div>
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
                                <div className="controls">
                                    <button onClick={() => toggleRemoteAudio(p.socketId)}>
                                        {mutedRemoteUsers.get(p.socketId) ? '음소거 해제' : '음소거'}
                                    </button>
                                </div>
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
                            {chatMessages.map((chat, index) => {
                                // 시간 포맷팅 (HH:MM 형식)
                                const formatTime = (timestamp) => {
                                    if (!timestamp) {
                                        const now = new Date();
                                        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                    }
                                    const date = new Date(timestamp);
                                    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
                                };

                                // 프로필 이미지 또는 이니셜 표시
                                const initial = chat.nickname ? chat.nickname.charAt(0).toUpperCase() : '?';
                                const hasProfileImage = chat.profileImageUrl && chat.profileImageUrl.trim() !== '';
                                const profileImageSrc = hasProfileImage
                                    ? `${API_BASE_URL_8080}${chat.profileImageUrl}`
                                    : base_profile;

                                return (
                                    <div key={index} className={`chat-message ${chat.userId === userId ? 'mine' : 'other'}`}>
                                        {/* 프로필 이미지 */}
                                        <div className="chat-profile-img">
                                            {hasProfileImage ? (
                                                <img src={profileImageSrc} alt={chat.nickname} />
                                            ) : (
                                                <span className="chat-profile-initial">{initial}</span>
                                            )}
                                        </div>

                                        {/* 메시지 컨텐츠 */}
                                        <div className="chat-content-wrapper">
                                            {/* 닉네임 - 모든 메시지에 표시 */}
                                            <span className="chat-nickname">{chat.nickname}</span>

                                            {/* 메시지 버블과 시간 */}
                                            <div className="chat-bubble-time-wrapper">
                                                <div className="chat-bubble">{chat.message}</div>
                                                <span className="chat-time">{formatTime(chat.timestamp || chat.time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <form onSubmit={handleSendMessage} className="chat-input">
                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="메시지를 입력하세요..." />
                            <button type="submit">전송</button>
                        </form>
                    </div>
                </section>
            </div>

            {/* 문제 선택 모달 */}
            {showProblemModal && (
                <div className="modal-overlay" onClick={() => setShowProblemModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>📚 문제 선택</h3>

                        <div className="condition-row">
                            <select
                                value={selectedSubject}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                            >
                                <option value="">과목 선택</option>
                                {subjects.map((subject, idx) => (
                                    <option key={idx} value={subject}>{subject}</option>
                                ))}
                            </select>

                            <select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                disabled={!selectedSubject}
                            >
                                <option value="">단원 선택</option>
                                {units.map((unit, idx) => (
                                    <option key={idx} value={unit}>{unit}</option>
                                ))}
                            </select>

                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                            >
                                <option value="최하">최하</option>
                                <option value="하">하</option>
                                <option value="중">중</option>
                                <option value="상">상</option>
                                <option value="최상">최상</option>
                            </select>
                        </div>

                        <div className="modal-buttons">
                            <button className="fetch-button" onClick={handleFetchProblem}>
                                문제 불러오기
                            </button>
                            <button className="cancel-button" onClick={() => setShowProblemModal(false)}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizRoom;
