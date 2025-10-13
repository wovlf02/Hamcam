import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { getSocket } from '../../../../socket';
import base_profile from '../../../../assets/icons/base_profile.png';
import { FaPaperPlane, FaSmile, FaPaperclip, FaImage, FaEllipsisV, FaPhone, FaVideo, FaInfoCircle } from 'react-icons/fa';
import '../../styles/ChatRoom.css';

// Mock 데이터
const MOCK_USER = {
    user_id: 1,
    nickname: '나',
    profile_image_url: base_profile
};

const MOCK_ROOM_INFO = {
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
};

const MOCK_MESSAGES = [
    {
        message_id: 1,
        sender_id: 2,
        sender_nickname: '김철수',
        sender_profile_image_url: base_profile,
        content: '안녕하세요! 오늘 회의 시간 확정됐나요?',
        created_at: '2025-01-13T09:30:00',
        is_read: true
    },
    {
        message_id: 2,
        sender_id: 1,
        sender_nickname: '나',
        sender_profile_image_url: base_profile,
        content: '네, 오후 2시로 확정됐습니다!',
        created_at: '2025-01-13T09:32:00',
        is_read: true
    },
    {
        message_id: 3,
        sender_id: 3,
        sender_nickname: '이영희',
        sender_profile_image_url: base_profile,
        content: '좋아요! 회의실은 어디로 잡혔나요?',
        created_at: '2025-01-13T09:35:00',
        is_read: true
    },
    {
        message_id: 4,
        sender_id: 1,
        sender_nickname: '나',
        sender_profile_image_url: base_profile,
        content: '3층 대회의실입니다. 자료는 제가 미리 준비해둘게요.',
        created_at: '2025-01-13T09:37:00',
        is_read: true
    },
    {
        message_id: 5,
        sender_id: 4,
        sender_nickname: '박민수',
        sender_profile_image_url: base_profile,
        content: '감사합니다! 그럼 오후 2시에 뵙겠습니다 👍',
        created_at: '2025-01-13T09:40:00',
        is_read: true
    },
    {
        message_id: 6,
        sender_id: 5,
        sender_nickname: '정지은',
        sender_profile_image_url: base_profile,
        content: '저도 참석하겠습니다!',
        created_at: '2025-01-13T09:42:00',
        is_read: false
    }
];

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
    const [messages, setMessages] = useState(MOCK_MESSAGES); // Mock 데이터 사용
    const [user] = useState(MOCK_USER); // Mock 데이터 사용
    const [roomInfo] = useState(MOCK_ROOM_INFO); // Mock 데이터 사용
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const scrollRef = useRef(null);
    const socket = getSocket();

    // 실제 API 호출은 주석 처리
    useEffect(() => {
        if (!roomId) return undefined;

        // TODO: 실제 API 연동 시 활성화
        /*
        const fetchInitialData = async () => {
            try {
                const userRes = await api.get('/users/me');
                setUser(userRes.data?.data);

                const detailRes = await api.post('/chat/rooms/detail', { room_id: roomId });
                setRoomInfo(detailRes.data?.data.room_info);
                setMessages(detailRes.data?.data.messages || []);

                if (socket) {
                    socket.emit('join-chat-room', { roomId });
                }
            } catch (err) {
                console.error('❌ 초기 데이터 로딩 실패:', err);
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
    }, [roomId, socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim() || !user) return;

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

    if (!roomInfo || !user) {
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
                {messages.map((msg, index) => {
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
                                        <span className="message-time">{formatMessageTime(msg.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
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
