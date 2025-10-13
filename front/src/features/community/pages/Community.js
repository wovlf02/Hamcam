import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CommunityMain.css'; // Import the new CSS file
import api from '../../../api/api';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiSearch, FiPlus, FiHome, FiAward, FiCheckSquare, FiCoffee
} from 'react-icons/fi';
import PostList from '../components/community/PostList'; // Assuming PostList is reusable

const menu = [
    { label: '홈', icon: <FiHome />, path: '/community' },
    { label: '게시판', icon: <FiGrid />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers />, path: '/community/friend' },
];

// Mock Data for the new UI
const mockUser = {
    nickname: '열공하는햄스터',
    level: 5,
    xp: 850,
    maxXp: 1000,
    avatar: `https://ui-avatars.com/api/?name=열공하는햄스터&background=7B68EE&color=fff`,
};

const mockQuests = [
    { id: 1, text: '질문에 답변하기 (1/1)', completed: true },
    { id: 2, text: '스터디룸 30분 참여 (0/1)', completed: false },
    { id: 3, text: '게시글에 응원 남기기 (3/5)', completed: false },
];

const mockCommunityGoal = {
    title: '함께 키우는 Hamcam 나무',
    current: 1234,
    total: 2000,
    unit: '시간',
};

const Community = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('홈');
    const [activeFeedTab, setActiveFeedTab] = useState('Latest');
    const [posts, setPosts] = useState([]); // To hold posts for the feed

    useEffect(() => {
        // Determine active menu from path
        const currentMenuItem = menu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '홈');

        // Mock fetch posts
        setPosts([
            { postId: 1, category: 'QUESTION', title: 'JPA N+1 문제, 이렇게 해결했어요.', author: '개발왕김코딩', createdAt: '2024-10-24', viewCount: 102, likeCount: 29, commentCount: 5 },
            { postId: 2, category: 'INFO', title: 'React 19 useOptimistic 훅 사용 후기', author: '리액트고수', createdAt: '2024-10-23', viewCount: 340, likeCount: 21, commentCount: 12 },
            { postId: 3, category: 'STUDY', title: 'CS 스터디 주 3회 모집합니다 (온라인)', author: '스터디장', createdAt: '2024-10-22', viewCount: 150, likeCount: 15, commentCount: 8 },
        ]);

    }, [location.pathname]);

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    return (
        <div className="community-page-container">
            {/* Top Navigation Bar */}
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

            <div className="community-body-layout">
                {/* Main Content Feed */}
                <main className="main-content-feed">
                    <div className="main-content-header">
                        <div className="search-bar">
                            <input type="text" placeholder="궁금한 것을 검색해보세요..." />
                        </div>
                        <button className="new-post-btn" onClick={() => navigate('/community/post/write')}>
                            <FiPlus /> 새 게시글
                        </button>
                    </div>

                    <div className="feed-container">
                        <div className="feed-tabs">
                            <span className={`feed-tab ${activeFeedTab === 'Latest' ? 'active' : ''}`} onClick={() => setActiveFeedTab('Latest')}>최신글</span>
                            <span className={`feed-tab ${activeFeedTab === 'Popular' ? 'active' : ''}`} onClick={() => setActiveFeedTab('Popular')}>인기글</span>
                            <span className={`feed-tab ${activeFeedTab === 'Unanswered' ? 'active' : ''}`} onClick={() => setActiveFeedTab('Unanswered')}>미해결 질문</span>
                        </div>
                        <div className="post-feed-container">
                            <PostList posts={posts} />
                        </div>
                    </div>
                </main>

                {/* Right Gamification Panel */}
                <aside className="right-gamification-panel">
                    {/* Player Card */}
                    <div className="player-card clay-panel">
                        <img src={mockUser.avatar} alt="User Avatar" className="player-avatar" />
                        <div className="player-name">{mockUser.nickname}</div>
                        <div className="player-level">Lv. {mockUser.level}</div>
                        <div className="xp-bar-container">
                            <div className="xp-bar" style={{ width: `${(mockUser.xp / mockUser.maxXp) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Quests Module */}
                    <div className="quests-module clay-panel">
                        <h3><FiAward /> 일일 퀘스트</h3>
                        <ul className="quest-list">
                            {mockQuests.map(q => (
                                <li key={q.id} className={`quest-item ${q.completed ? 'completed' : ''}`}>{q.text}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Goal Module */}
                    <div className="community-goal-module clay-panel">
                        <h3><FiCoffee/> {mockCommunityGoal.title}</h3>
                        <div className="community-goal-tree">
                            <img src="/tree-icon.svg" alt="Community Tree" className="tree-image" />
                            <div className="progress-text">
                                총 <strong>{mockCommunityGoal.current.toLocaleString()}</strong> / {mockCommunityGoal.total.toLocaleString()} {mockCommunityGoal.unit} 달성!
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Community;