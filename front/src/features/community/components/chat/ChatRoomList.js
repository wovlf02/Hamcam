import React, { useEffect, useState } from 'react';
import '../../styles/ChatRoomList.css';
import { FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import base_profile from '../../../../assets/icons/base_profile.png';
import moment from 'moment';

// Mock 데이터
const MOCK_USER_ID = 1;

const MOCK_CHAT_ROOMS = [
    {
        roomId: 1,
        roomName: '프로젝트 팀 채팅',
        roomType: 'GROUP',
        profileImageUrl: base_profile,
        participantCount: 5,
        unreadCount: 3,
        lastMessage: '회의 시간이 2시로 확정됐습니다!',
        lastMessageAt: '2025-01-13T14:30:00',
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 2, nickname: '김철수', profile_image_url: base_profile },
            { user_id: 3, nickname: '이영희', profile_image_url: base_profile },
            { user_id: 4, nickname: '박민수', profile_image_url: base_profile },
            { user_id: 5, nickname: '정지은', profile_image_url: base_profile }
        ]
    },
    {
        roomId: 2,
        roomName: '알고리즘 스터디',
        roomType: 'GROUP',
        profileImageUrl: base_profile,
        participantCount: 8,
        unreadCount: 12,
        lastMessage: '오늘 문제 정말 어려웠어요 ㅠㅠ',
        lastMessageAt: '2025-01-13T13:45:00',
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 6, nickname: '최유진', profile_image_url: base_profile },
            { user_id: 7, nickname: '강민호', profile_image_url: base_profile }
        ]
    },
    {
        roomId: 3,
        roomName: '이영희',
        roomType: 'DIRECT',
        profileImageUrl: base_profile,
        participantCount: 2,
        unreadCount: 0,
        lastMessage: '내일 커피 한잔 할래?',
        lastMessageAt: '2025-01-13T11:20:00',
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 3, nickname: '이영희', profile_image_url: base_profile }
        ]
    },
    {
        roomId: 4,
        roomName: '김철수',
        roomType: 'DIRECT',
        profileImageUrl: base_profile,
        participantCount: 2,
        unreadCount: 1,
        lastMessage: '자료 확인했어!',
        lastMessageAt: '2025-01-13T10:15:00',
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 2, nickname: '김철수', profile_image_url: base_profile }
        ]
    },
    {
        roomId: 5,
        roomName: 'CS 스터디',
        roomType: 'GROUP',
        profileImageUrl: base_profile,
        participantCount: 6,
        unreadCount: 0,
        lastMessage: '다음주 주제는 네트워크입니다',
        lastMessageAt: '2025-01-12T18:30:00',
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 8, nickname: '송지훈', profile_image_url: base_profile },
            { user_id: 9, nickname: '윤서아', profile_image_url: base_profile }
        ]
    },
    {
        roomId: 6,
        roomName: '박민수',
        roomType: 'DIRECT',
        profileImageUrl: base_profile,
        participantCount: 2,
        unreadCount: 0,
        lastMessage: '오케이!',
        lastMessageAt: '2025-01-12T16:00:00',
        participants: [
            { user_id: 1, nickname: '나', profile_image_url: base_profile },
            { user_id: 4, nickname: '박민수', profile_image_url: base_profile }
        ]
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

const ChatRoomList = ({ selectedRoomId, setSelectedRoomId, onOpenCreateModal, onSelectRoom }) => {
    const [chatRooms, setChatRooms] = useState(MOCK_CHAT_ROOMS); // Mock 데이터 사용
    const [roomSearch, setRoomSearch] = useState('');
    const [myUserId] = useState(MOCK_USER_ID); // Mock 사용자 ID

    useEffect(() => {
        // Mock 데이터로 초기화
        setChatRooms(MOCK_CHAT_ROOMS);
        if (MOCK_CHAT_ROOMS.length > 0 && !selectedRoomId) {
            const defaultRoomId = MOCK_CHAT_ROOMS[0].roomId;
            setSelectedRoomId(defaultRoomId);
            if (onSelectRoom) onSelectRoom(defaultRoomId);
        }

        // TODO: 실제 API 호출은 주석 처리
        /*
        api.get('/users/me', { withCredentials: true }).then(res => {
            setMyUserId(res.data?.data?.user_id);
        });
        */
    }, []);

    useEffect(() => {
        // fetchChatRooms(); // Mock 데이터 사용으로 주석 처리
    }, []);

    const fetchChatRooms = async () => {
        // TODO: 실제 API 호출은 주석 처리
        /*
        try {
            const res = await api.get('/chat/rooms/my');
            const rooms = res.data?.data || [];
            const mappedRooms = rooms.map(room => ({
                roomId: room.room_id,
                roomName: room.room_name,
                roomType: room.room_type,
                profileImageUrl: room.profile_image_url,
                participantCount: room.participant_count,
                unreadCount: room.unread_count,
                lastMessage: room.last_message,
                lastMessageAt: room.last_message_at,
                participants: room.participants,
            }));
            setChatRooms(mappedRooms);
            if (mappedRooms.length > 0 && !selectedRoomId) {
                const defaultRoomId = mappedRooms[0].roomId;
                setSelectedRoomId(defaultRoomId);
                if (onSelectRoom) onSelectRoom(defaultRoomId);
            }
        } catch (err) {
            setChatRooms([]);
        }
        */
    };

    const handleRoomClick = (roomId) => {
        if (onSelectRoom) onSelectRoom(roomId);

        // 채팅방 클릭 시 읽음 처리
        setChatRooms(prevRooms =>
            prevRooms.map(room =>
                room.roomId === roomId
                    ? { ...room, unreadCount: 0 }
                    : room
            )
        );

        // TODO: 실제 읽음 처리 API 호출
        /*
        try {
            await api.post('/chat/messages/read', { room_id: roomId });
        } catch (err) {
            console.error('읽음 처리 실패:', err);
        }
        */
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm('정말 이 채팅방을 삭제하시겠습니까?')) return;

        // Mock 데이터에서 삭제
        setChatRooms(prev => prev.filter(room => room.roomId !== roomId));
        if (selectedRoomId === roomId) {
            const remainingRooms = chatRooms.filter(room => room.roomId !== roomId);
            if (remainingRooms.length > 0) {
                setSelectedRoomId(remainingRooms[0].roomId);
                if (onSelectRoom) onSelectRoom(remainingRooms[0].roomId);
            } else {
                setSelectedRoomId(null);
            }
        }

        // TODO: 실제 API 호출은 주석 처리
        /*
        try {
            await api.delete(`/chat/rooms/${roomId}`);
        } catch (err) {
            alert('채팅방 삭제 실패');
        }
        */
    };

    const getRoomProfileAndName = (room) => {
        if (!room.participants || !myUserId) {
            return {
                name: room.roomName,
                profile: getProfileUrl(room.profileImageUrl),
                count: room.participantCount
            };
        }
        const others = room.participants.filter(p => String(p.user_id) !== String(myUserId));
        if (room.roomType === 'DIRECT' && others.length === 1) {
            return {
                name: others[0].nickname,
                profile: getProfileUrl(others[0].profile_image_url),
                count: room.participants.length
            };
        }
        return {
            name: room.roomName,
            profile: getProfileUrl(room.profileImageUrl),
            count: room.participants.length
        };
    };

    const getPreviewMessage = (msg) => {
        if (!msg) return '(아직 메시지 없음)';
        const lowered = msg.toLowerCase();
        if (
            lowered.startsWith('/uploads') ||
            lowered.endsWith('.jpg') ||
            lowered.endsWith('.png') ||
            lowered.endsWith('.pdf')
        ) return '[파일]';
        return msg;
    };

    const formatLastMessageTime = (dateString) => {
        if (!dateString) return '';
        const date = moment(dateString);
        const today = moment().startOf('day');
        const yesterday = moment().subtract(1, 'day').startOf('day');

        if (date.isSame(today, 'd')) {
            return date.format('HH:mm');
        } else if (date.isSame(yesterday, 'd')) {
            return '어제';
        } else if (date.isAfter(moment().subtract(7, 'days'))) {
            return date.format('ddd');
        } else {
            return date.format('MM/DD');
        }
    };

    const filteredRooms = chatRooms.filter(room =>
        getRoomProfileAndName(room).name.toLowerCase().includes(roomSearch.toLowerCase())
    );

    return (
        <div className="chat-room-list-panel modern">
            <div className="chat-room-header-row top">
                <h4>Messages</h4>
                <button className="chat-create-btn" onClick={onOpenCreateModal} title="새 채팅방 만들기">
                    <FaPlus />
                </button>
            </div>
            <div className="chat-room-search-row">
                <input
                    type="text"
                    className="chat-room-search-input"
                    placeholder="🔍 채팅방/대화상대 검색"
                    value={roomSearch}
                    onChange={(e) => setRoomSearch(e.target.value)}
                />
            </div>
            <div className="chat-room-list-container">
                {filteredRooms.length === 0 ? (
                    <div className="friend-empty">채팅방이 없습니다.</div>
                ) : (
                    filteredRooms.map(room => {
                        const { name, profile, count } = getRoomProfileAndName(room);
                        return (
                            <div
                                key={room.roomId}
                                className={`chat-room-item modern-card ${room.roomId === selectedRoomId ? 'selected' : ''}`}
                                onClick={() => handleRoomClick(room.roomId)}
                            >
                                <img
                                    src={profile}
                                    alt={name}
                                    className="modern-profile"
                                    onError={(e) => { e.target.src = base_profile; }}
                                />
                                <div className="modern-info">
                                    <div className="modern-top">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                                            <span className="modern-name">{name}</span>
                                            {count > 2 && (
                                                <span className="chat-room-participants">
                                                    <FaUsers size={10} />
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                        <span className="modern-time">
                                            {formatLastMessageTime(room.lastMessageAt)}
                                        </span>
                                    </div>
                                    <div className="modern-bottom">
                                        <span className="modern-preview">
                                            {getPreviewMessage(room.lastMessage)}
                                        </span>
                                        {room.unreadCount > 0 && (
                                            <span className="modern-badge">{room.unreadCount}</span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    className="chat-delete-btn"
                                    title="채팅방 삭제"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDeleteRoom(room.roomId);
                                    }}
                                >
                                    <FaTrash size={13} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatRoomList;
