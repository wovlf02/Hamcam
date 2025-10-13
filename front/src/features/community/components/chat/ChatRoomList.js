import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
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
    const [chatRooms, setChatRooms] = useState(MOCK_CHAT_ROOMS);
    const [roomSearch, setRoomSearch] = useState('');
    const [myUserId] = useState(MOCK_USER_ID);
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        setChatRooms(MOCK_CHAT_ROOMS);
        if (MOCK_CHAT_ROOMS.length > 0 && !selectedRoomId) {
            const defaultRoomId = MOCK_CHAT_ROOMS[0].roomId;
            setSelectedRoomId(defaultRoomId);
            if (onSelectRoom) onSelectRoom(defaultRoomId);
        }
    }, []);

    useEffect(() => {
        // 전역 클릭 시 컨텍스트 메뉴 닫기
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleRoomClick = (roomId) => {
        if (onSelectRoom) onSelectRoom(roomId);
        setChatRooms(prevRooms =>
            prevRooms.map(room =>
                room.roomId === roomId ? { ...room, unreadCount: 0 } : room
            )
        );
    };

    const handleContextMenu = (e, roomId) => {
        e.preventDefault(); // 기본 우클릭 메뉴 방지
        e.stopPropagation(); // 이벤트 전파 중지
        console.log('우클릭 감지:', roomId); // 디버깅용
        console.log('마우스 위치:', e.clientX, e.clientY); // 디버깅용
        const menuData = {
            x: e.clientX,
            y: e.clientY,
            roomId: roomId
        };
        console.log('설정할 메뉴 데이터:', menuData); // 디버깅용
        setContextMenu(menuData);
    };

    const handleDeleteRoom = async (roomId) => {
        setContextMenu(null);
        if (!window.confirm('정말 이 채팅방을 나가시겠습니까?')) return;

        setChatRooms(prev => prev.filter(room => room.roomId !== roomId));
        if (selectedRoomId === roomId) {
            const remainingRooms = chatRooms.filter(room => room.roomId !== roomId);
            if (remainingRooms.length > 0) {
                setSelectedRoomId(remainingRooms[0].roomId);
                if (onSelectRoom) onSelectRoom(remainingRooms[0].roomId);
            } else {
                setSelectedRoomId(null);
                if (onSelectRoom) onSelectRoom(null);
            }
        }
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
        <>
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
                                    onContextMenu={(e) => handleContextMenu(e, room.roomId)}
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
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* 우클릭 컨텍스트 메뉴 - Portal로 body에 렌더링 */}
            {contextMenu && ReactDOM.createPortal(
                <div
                    className="context-menu"
                    style={{
                        position: 'fixed',
                        top: `${contextMenu.y}px`,
                        left: `${contextMenu.x}px`,
                        zIndex: 99999,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="context-menu-item danger"
                        onClick={() => handleDeleteRoom(contextMenu.roomId)}
                    >
                        <FaTrash size={14} />
                        <span>채팅방 나가기</span>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ChatRoomList;
