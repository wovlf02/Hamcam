import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import api from '../../../../api/api';
import { getSocket } from '../../../../socket'; // 전역 소켓 가져오기
import base_profile from '../../../../assets/icons/base_profile.png';
import { FaPaperPlane, FaSmile, FaPaperclip, FaMicrophone, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/ChatRoom.css';

// ... (getProfileUrl 함수는 동일)

const ChatRoom = ({ roomId, onReadAllMessages }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [roomInfo, setRoomInfo] = useState(null);
    const scrollRef = useRef(null);
    const socket = getSocket();

    useEffect(() => {
        if (!roomId || !socket) return;

        const fetchInitialData = async () => {
            try {
                const userRes = await api.get('/users/me');
                setUser(userRes.data?.data);

                const detailRes = await api.post('/chat/rooms/detail', { room_id: roomId });
                setRoomInfo(detailRes.data?.data.room_info);
                setMessages(detailRes.data?.data.messages || []);

                // Socket.IO 서버에 채팅방 입장 알림
                socket.emit('join-chat-room', { roomId });

            } catch (err) {
                console.error('❌ 초기 데이터 로딩 실패:', err);
            }
        };

        fetchInitialData();

        const handleNewMessage = (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
        };

        socket.on('new-chat-message', handleNewMessage);

        return () => {
            // 컴포넌트 언마운트 시 리스너 정리
            socket.off('new-chat-message', handleNewMessage);
            socket.emit('leave-chat-room', { roomId });
        };
    }, [roomId, socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!message.trim() || !user || !socket) return;

        const payload = {
            roomId,
            content: message,
        };
        socket.emit('send-chat-message', payload);
        setMessage('');
    };

    // ... (UI 렌더링 로직은 기존과 유사하게 유지, 핸들러만 변경)
    if (!roomInfo || !user) return <div>Loading...</div>;

    return (
        <div className="chat-room modern-chat">
            {/* 헤더 및 메시지 목록 UI 등 기존 구조 활용 */}
            <div className="modern-chat-body">
                {messages.map((msg, index) => (
                    <div key={index} className={`modern-message-wrapper ${msg.sender_id === user.user_id ? 'right' : 'left'}`}>
                        {/* 메시지 버블 UI */}
                    </div>
                ))}
                <div ref={scrollRef} />
            </div>
            <div className="modern-chat-input">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                />
                <button onClick={handleSend} className="modern-send-btn">
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    );
};

export default ChatRoom;
