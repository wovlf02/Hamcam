import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { getSocket } from '../../../../socket';
import base_profile from '../../../../assets/icons/base_profile.png';
import { FaPaperPlane, FaSmile, FaPaperclip, FaImage, FaEllipsisV, FaPhone, FaVideo, FaInfoCircle } from 'react-icons/fa';
import '../../styles/ChatRoom.css';

// Mock 데이터 - 채팅방별 메시지
const MOCK_ROOM_MESSAGES = {
    1: [ // 프로젝트 팀 채팅
        {
            message_id: 1,
            sender_id: 2,
            sender_nickname: '김철수',
            sender_profile_image_url: base_profile,
            content: '안녕하세요! 오늘 회의 시간 확정됐나요?',
            created_at: '2025-01-13T09:30:00',
            is_read: true,
            unread_count: 0 // 모두 읽음
        },
        {
            message_id: 2,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '네, 오후 2시로 확정됐습니다!',
            created_at: '2025-01-13T09:32:00',
            is_read: true,
            unread_count: 0 // 모두 읽음
        },
        {
            message_id: 3,
            sender_id: 3,
            sender_nickname: '이영희',
            sender_profile_image_url: base_profile,
            content: '좋아요! 회의실은 어디로 잡혔나요?',
            created_at: '2025-01-13T09:35:00',
            is_read: true,
            unread_count: 0 // 모두 읽음
        },
        {
            message_id: 4,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '3층 대회의실입니다. 자료는 제가 미리 준비해둘게요.',
            created_at: '2025-01-13T09:37:00',
            is_read: true,
            unread_count: 1 // 1명이 안 읽음
        },
        {
            message_id: 5,
            sender_id: 4,
            sender_nickname: '박민수',
            sender_profile_image_url: base_profile,
            content: '감사합니다! 그럼 오후 2시에 뵙겠습니다 👍',
            created_at: '2025-01-13T09:40:00',
            is_read: true,
            unread_count: 2 // 2명이 안 읽음
        },
        {
            message_id: 6,
            sender_id: 5,
            sender_nickname: '정지은',
            sender_profile_image_url: base_profile,
            content: '저도 참석하겠습니다!',
            created_at: '2025-01-13T14:30:00',
            is_read: false,
            unread_count: 3 // 3명이 안 읽음
        }
    ],
    2: [ // 알고리즘 스터디
        {
            message_id: 7,
            sender_id: 6,
            sender_nickname: '최유진',
            sender_profile_image_url: base_profile,
            content: '오늘 문제 풀어보셨어요?',
            created_at: '2025-01-13T10:00:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 8,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '아직이요 ㅠㅠ 시간 복잡도가 너무 어려워요',
            created_at: '2025-01-13T10:05:00',
            is_read: true,
            unread_count: 1
        },
        {
            message_id: 9,
            sender_id: 7,
            sender_nickname: '강민호',
            sender_profile_image_url: base_profile,
            content: '저는 이분탐색으로 풀었어요!',
            created_at: '2025-01-13T10:15:00',
            is_read: true,
            unread_count: 3
        },
        {
            message_id: 10,
            sender_id: 6,
            sender_nickname: '최유진',
            sender_profile_image_url: base_profile,
            content: '오늘 문제 정말 어려웠어요 ㅠㅠ',
            created_at: '2025-01-13T13:45:00',
            is_read: false,
            unread_count: 5
        }
    ],
    3: [ // 이영희 (1:1 채팅)
        {
            message_id: 11,
            sender_id: 3,
            sender_nickname: '이영희',
            sender_profile_image_url: base_profile,
            content: '안녕! 요즘 어때?',
            created_at: '2025-01-13T10:00:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 12,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '잘 지내! 너는?',
            created_at: '2025-01-13T10:05:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 13,
            sender_id: 3,
            sender_nickname: '이영희',
            sender_profile_image_url: base_profile,
            content: '나도 잘 지내! 내일 커피 한잔 할래?',
            created_at: '2025-01-13T11:20:00',
            is_read: true,
            unread_count: 0
        }
    ],
    4: [ // 김철수 (1:1 채팅)
        {
            message_id: 14,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '자료 보냈어!',
            created_at: '2025-01-13T09:50:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 15,
            sender_id: 2,
            sender_nickname: '김철수',
            sender_profile_image_url: base_profile,
            content: '자료 확인했어!',
            created_at: '2025-01-13T10:15:00',
            is_read: false,
            unread_count: 1
        }
    ],
    5: [ // CS 스터디
        {
            message_id: 16,
            sender_id: 8,
            sender_nickname: '송지훈',
            sender_profile_image_url: base_profile,
            content: '이번주 주제는 운영체제입니다',
            created_at: '2025-01-12T17:00:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 17,
            sender_id: 9,
            sender_nickname: '윤서아',
            sender_profile_image_url: base_profile,
            content: '좋아요! 프로세스와 스레드부터 시작할까요?',
            created_at: '2025-01-12T17:30:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 18,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '다음주 주제는 네트워크입니다',
            created_at: '2025-01-12T18:30:00',
            is_read: true,
            unread_count: 0
        }
    ],
    6: [ // 박민수 (1:1 채팅)
        {
            message_id: 19,
            sender_id: 4,
            sender_nickname: '박민수',
            sender_profile_image_url: base_profile,
            content: '점심 같이 먹을래?',
            created_at: '2025-01-12T11:00:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 20,
            sender_id: 1,
            sender_nickname: '나',
            sender_profile_image_url: base_profile,
            content: '좋아!',
            created_at: '2025-01-12T11:30:00',
            is_read: true,
            unread_count: 0
        },
        {
            message_id: 21,
            sender_id: 4,
            sender_nickname: '박민수',
            sender_profile_image_url: base_profile,
            content: '오케이!',
            created_at: '2025-01-12T16:00:00',
            is_read: true,
            unread_count: 0
        }
    ]
};

// Mock 채팅방 정보
const MOCK_ROOM_INFO_MAP = {
    1: {
        room_id: 1,
        room_name: '프로젝트 팀 채팅',
        room_type: 'GROUP',
        participant_count: 5,
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 2, nickname: '김철수', profile_image_url: base_profile },
            { user_id: 3, nickname: '이영희', profile_image_url: base_profile },
            { user_id: 4, nickname: '박민수', profile_image_url: base_profile },
            { user_id: 5, nickname: '정지은', profile_image_url: base_profile }
        ]
    },
    2: {
        room_id: 2,
        room_name: '알고리즘 스터디',
        room_type: 'GROUP',
        participant_count: 8,
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 6, nickname: '최유진', profile_image_url: base_profile },
            { user_id: 7, nickname: '강민호', profile_image_url: base_profile }
        ]
    },
    3: {
        room_id: 3,
        room_name: '이영희',
        room_type: 'DIRECT',
        participant_count: 2,
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 3, nickname: '이영희', profile_image_url: base_profile }
        ]
    },
    4: {
        room_id: 4,
        room_name: '김철수',
        room_type: 'DIRECT',
        participant_count: 2,
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 2, nickname: '김철수', profile_image_url: base_profile }
        ]
    },
    5: {
        room_id: 5,
        room_name: 'CS 스터디',
        room_type: 'GROUP',
        participant_count: 6,
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 8, nickname: '송지훈', profile_image_url: base_profile },
            { user_id: 9, nickname: '윤서아', profile_image_url: base_profile }
        ]
    },
    6: {
        room_id: 6,
        room_name: '박민수',
        room_type: 'DIRECT',
        participant_count: 2,
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 4, nickname: '박민수', profile_image_url: base_profile }
        ]
    }
};

const MOCK_USER = {
    user_id: 1,
    nickname: '나',
    profile_image_url: base_profile
};

const getProfileUrl = (url) => {
    if (!url || url === "" || url === "프로필 사진이 없습니다") return base_profile;
    if (url.startsWith('C:\\FinalProject')) {
        const webUrl = url.replace('C:\\FinalProject', '').replace(/\\/g, '/');
        return `http://localhost:8080${webUrl}`;
    }
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:8080${url}`;
    return base_profile;
};

const ChatRoom = ({ roomId }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user] = useState(MOCK_USER);
    const [roomInfo, setRoomInfo] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null);
    const socket = getSocket();

    // 채팅방 변경 시 데이터 로드
    useEffect(() => {
        if (!roomId) {
            setIsLoading(true);
            return undefined;
        }

        setIsLoading(true);

        // Mock 데이터 로드
        const loadRoomData = () => {
            const roomData = MOCK_ROOM_INFO_MAP[roomId];
            const roomMessages = MOCK_ROOM_MESSAGES[roomId] || [];

            if (roomData) {
                setRoomInfo(roomData);
                setMessages(roomMessages);

                // 읽음 처리 (Mock)
                const updatedMessages = roomMessages.map(msg => ({
                    ...msg,
                    is_read: true
                }));
                setMessages(updatedMessages);
            }

            setIsLoading(false);
        };

        // 실제 로딩 효과를 위한 약간의 지연
        const timer = setTimeout(loadRoomData, 300);

        // TODO: 실제 API 호출은 주석 처리
        /*
        const fetchInitialData = async () => {
            try {
                const userRes = await api.get('/users/me');
                setUser(userRes.data?.data);

                const detailRes = await api.post('/chat/rooms/detail', { room_id: roomId });
                setRoomInfo(detailRes.data?.data.room_info);
                setMessages(detailRes.data?.data.messages || []);

                // 읽음 처리 API 호출
                await api.post('/chat/messages/read', { room_id: roomId });

                if (socket) {
                    socket.emit('join-chat-room', { roomId });
                }

                setIsLoading(false);
            } catch (err) {
                console.error('❌ 초기 데이터 로딩 실패:', err);
                setIsLoading(false);
            }
        };

        fetchInitialData();

        if (socket) {
            const handleNewMessage = (newMessage) => {
                setMessages(prev => [...prev, newMessage]);
            };
            socket.on('new-chat-message', handleNewMessage);
            return () => {
                socket.off('new-chat-message', handleNewMessage);
                socket.emit('leave-chat-room', { roomId });
            };
        }
        */

        return () => clearTimeout(timer);
    }, [roomId, socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim() || !user || !roomInfo) return;

        // Mock 메시지 추가
        const newMessage = {
            message_id: messages.length + 1,
            sender_id: user.user_id,
            sender_nickname: user.nickname,
            sender_profile_image_url: user.profile_image_url,
            content: message,
            created_at: new Date().toISOString(),
            is_read: false
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // TODO: 실제 소켓 전송은 주석 처리
        /*
        if (socket) {
            const payload = {
                roomId,
                content: message,
            };
            socket.emit('send-chat-message', payload);
        }
        */
    };

    const formatMessageTime = (dateString) => {
        return moment(dateString).format('HH:mm');
    };

    const formatMessageDate = (dateString) => {
        const date = moment(dateString);
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'day').startOf('day');

        if (date.isSame(today, 'd')) return '오늘';
        if (date.isSame(yesterday, 'd')) return '어제';
        return date.format('YYYY년 M월 D일');
    };

    const shouldShowDateDivider = (currentMsg, prevMsg) => {
        if (!prevMsg) return true;
        return !moment(currentMsg.created_at).isSame(moment(prevMsg.created_at), 'day');
    };

    if (isLoading || !roomInfo || !user) {
        return (
            <div className="chat-room-loading">
                <div className="loading-spinner"></div>
                <p>채팅방을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="chat-room-container">
            {/* 채팅방 헤더 */}
            <div className="chat-room-header">
                <div className="chat-room-header-left">
                    <div className="chat-room-avatar-group">
                        {roomInfo.participants.slice(0, 3).map((participant, index) => (
                            <img
                                key={participant.user_id}
                                src={getProfileUrl(participant.profile_image_url)}
                                alt={participant.nickname}
                                className="chat-room-avatar"
                                style={{ zIndex: 3 - index }}
                            />
                        ))}
                    </div>
                    <div className="chat-room-info">
                        <h3 className="chat-room-title">{roomInfo.room_name}</h3>
                        <p className="chat-room-participants">{roomInfo.participant_count}명</p>
                    </div>
                </div>
                <div className="chat-room-header-actions">
                    <button className="chat-room-action-btn" title="음성 통화">
                        <FaPhone />
                    </button>
                    <button className="chat-room-action-btn" title="영상 통화">
                        <FaVideo />
                    </button>
                    <button className="chat-room-action-btn" title="채팅방 정보">
                        <FaInfoCircle />
                    </button>
                    <button className="chat-room-action-btn" title="더보기">
                        <FaEllipsisV />
                    </button>
                </div>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="chat-room-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty-state">
                        <p>첫 메시지를 보내보세요! 🎉</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const showDate = shouldShowDateDivider(msg, messages[index - 1]);
                        const isMyMessage = msg.sender_id === user.user_id;

                        return (
                            <React.Fragment key={msg.message_id}>
                                {showDate && (
                                    <div className="chat-date-divider">
                                        <span>{formatMessageDate(msg.created_at)}</span>
                                    </div>
                                )}
                                <div className={`chat-message-wrapper ${isMyMessage ? 'my-message' : 'other-message'}`}>
                                    {!isMyMessage && (
                                        <img
                                            src={getProfileUrl(msg.sender_profile_image_url)}
                                            alt={msg.sender_nickname}
                                            className="message-avatar"
                                        />
                                    )}
                                    <div className="message-content-wrapper">
                                        {!isMyMessage && (
                                            <span className="message-sender-name">{msg.sender_nickname}</span>
                                        )}
                                        <div className="message-bubble-wrapper">
                                            <div className="message-bubble">
                                                {msg.content}
                                            </div>
                                            <div className="message-meta">
                                                {isMyMessage && msg.unread_count > 0 && (
                                                    <span className="message-unread-count">{msg.unread_count}</span>
                                                )}
                                                <span className="message-time">{formatMessageTime(msg.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* 메시지 입력 영역 */}
            <div className="chat-room-input-container">
                <div className="chat-room-input-wrapper">
                    <button className="input-action-btn" title="파일 첨부">
                        <FaPaperclip />
                    </button>
                    <button className="input-action-btn" title="이미지 첨부">
                        <FaImage />
                    </button>
                    <input
                        type="text"
                        className="chat-message-input"
                        placeholder="메시지를 입력하세요..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button
                        className="input-action-btn"
                        title="이모티콘"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                        <FaSmile />
                    </button>
                    <button
                        className="send-message-btn"
                        onClick={handleSend}
                        disabled={!message.trim()}
                    >
                        <FaPaperPlane />
                        <span>전송</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
