import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Community.css';
import api from '../../../api/api';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiSearch, FiPlus, FiHeart, FiAward
} from 'react-icons/fi';

const menu = [
    { label: '게시판', icon: <FiGrid className="menu-icon" />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell className="menu-icon" />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare className="menu-icon" />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers className="menu-icon" />, path: '/community/friend' },
];

const Community = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('게시판');

    const [notices, setNotices] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
        // Mock Data for UI display
        setNotices([
            { id: 1, title: 'Hamcam 서비스 점검 안내 (03:00~04:00)', date: '2024.10.24', views: 102 },
            { id: 2, title: '커뮤니티 이용규칙 업데이트', date: '2024.10.23', views: 340 },
        ]);
        setPopularPosts([
            { postId: 1, title: 'JPA N+1 문제, 이렇게 해결했어요.', authorNickname: '개발왕김코딩', likeCount: 29 },
            { postId: 2, title: 'React 19 useOptimistic 훅 사용 후기', authorNickname: '리액트고수', likeCount: 21 },
            { postId: 3, title: 'CS 스터디 주 3회 모집합니다 (온라인)', authorNickname: '스터디장', likeCount: 15 },
        ]);
        setOnlineFriends([
            { user_id: 1, nickname: '에이스', profile_image_url: '/path/to/avatar1.png' },
            { user_id: 2, nickname: '벨', profile_image_url: '/path/to/avatar2.png' },
            { user_id: 3, nickname: '캐시', profile_image_url: null },
            { user_id: 4, nickname: '데이지', profile_image_url: '/path/to/avatar4.png' },
            { user_id: 5, nickname: '엘라', profile_image_url: '/path/to/avatar5.png' },
        ]);
    }, []);

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    return (
        <div className="community-root">
            {/* Main Content */}
            <main className="community-main-content">
                {/* Top Navigation Bar */}
                <nav className="community-top-nav">
                    <div className="top-nav-menu">
                        {menu.map((item) => (
                            <div
                                key={item.label}
                                className={`top-nav-item ${activeMenu === item.label ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item.path, item.label)}
                                tabIndex={0}
                                role="button"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </nav>

                <header className="main-header">
                    <div className="search-bar">
                        <FiSearch className="search-icon" />
                        <input type="text" placeholder="게시글을 검색해보세요..." />
                    </div>
                    <button className="new-post-btn" onClick={() => navigate('/community/post/write')}>
                        <FiPlus />
                        <span>새 게시글</span>
                    </button>
                </header>

                <section className="community-section">
                    <div className="community-section-header">
                        <h2 className="community-section-title">주요 공지사항</h2>
                        <button className="community-more-btn" onClick={() => navigate('/community/notice')}>
                            더보기
                        </button>
                    </div>
                    <div className="community-notice-list">
                        {notices.map((n) => (
                            <div className="community-notice-row" key={n.id}>
                                <span className="community-notice-title">{n.title}</span>
                                <div className="community-notice-meta">
                                    <span>{n.date}</span>
                                    <span>👁 {n.views}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="community-section">
                    <div className="community-section-header">
                        <h2 className="community-section-title">실시간 인기 게시글</h2>
                        <button className="community-more-btn" onClick={() => navigate('/community/post')}>
                            더보기
                        </button>
                    </div>
                    <div className="community-post-list">
                        {popularPosts.map((p) => (
                            <div className="community-post-row" key={p.postId}>
                                <div>
                                    <div className="community-post-title">{p.title}</div>
                                    <div className="community-post-author">{p.authorNickname}</div>
                                </div>
                                <div className="community-post-likes">
                                    <FiHeart style={{ fontSize: '0.8rem' }} />
                                    <span>{p.likeCount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Right Panel */}
            <aside className="community-right-panel">
                <section className="community-section">
                    <h2 className="community-section-title">접속 중인 친구</h2>
                    <div className="community-friend-list">
                        {onlineFriends.map((f) => (
                            <div className="community-friend" key={f.user_id}>
                                <div className="community-friend-avatar-wrap">
                                    <img
                                        src={f.profile_image_url || `https://ui-avatars.com/api/?name=${f.nickname}&background=random`}
                                        alt={f.nickname}
                                        className="community-friend-avatar"
                                    />
                                    <span className="community-friend-status" />
                                </div>
                                <div className="community-friend-name">{f.nickname}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default Community;