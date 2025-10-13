import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Chat.css';
import ChatRoom from '../components/chat/ChatRoom';
import ChatRoomList from '../components/chat/ChatRoomList';
import CreateGroupModal from '../components/chat/CreateGroupModal';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiHome, FiChevronRight
} from 'react-icons/fi';

const menu = [
    { label: '홈', icon: <FiHome />, path: '/community' },
    { label: '게시판', icon: <FiGrid />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers />, path: '/community/friend' },
];

const Chat = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [activeMenu, setActiveMenu] = useState('채팅');

    useEffect(() => {
        // 더 긴 경로부터 매칭하도록 정렬하여 정확한 메뉴 활성화
        const sortedMenu = [...menu].sort((a, b) => b.path.length - a.path.length);
        const currentMenuItem = sortedMenu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '채팅');
    }, [location.pathname]);

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    return (
        <div className="chat-page-container clay-panel">
            {/* 상단 네비게이션 바 */}
            <nav className="community-top-nav">
                {menu.map((item) => (
                    <div
                        key={item.label}
                        className={`top-nav-item ${activeMenu === item.label ? 'active' : ''}`}
                        onClick={() => handleMenuClick(item.path, item.label)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                ))}
            </nav>

            {/* Breadcrumb */}
            <div className="chat-page-header">
                <div className="chat-breadcrumb">
                    <FiHome className="chat-breadcrumb-icon" />
                    커뮤니티
                    <FiChevronRight />
                    채팅
                </div>
            </div>

            {/* 채팅 메인 영역 */}
            <div className="chat-main">
                {/* 왼쪽: 채팅방 목록 */}
                <div className="chat-room-list-panel">
                    <ChatRoomList
                        selectedRoomId={selectedRoomId}
                        setSelectedRoomId={setSelectedRoomId}
                        onOpenCreateModal={() => setShowCreateModal(true)}
                        onSelectRoom={setSelectedRoomId}
                    />
                </div>
                {/* 오른쪽: 채팅방 본문 */}
                <div className="chat-room-panel">
                    <ChatRoom
                        roomId={selectedRoomId}
                        onReadAllMessages={() => {}}
                    />
                </div>
            </div>

            {/* 그룹채팅 생성 모달 */}
            {showCreateModal && (
                <CreateGroupModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
};

export default Chat;
