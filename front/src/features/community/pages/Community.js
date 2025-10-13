import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CommunityMain.css'; // Using the same CSS file
import api from '../../../api/api';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiHome, FiAward, FiChevronRight, FiEdit, FiMessageCircle, FiStar, FiThumbsUp
} from 'react-icons/fi';

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
    avatar: `https://ui-avatars.com/api/?name=열공하는햄스터&background=7B68EE&color=fff`,
};
const mockUserStats = {
    posts: 23,
    comments: 157,
    likesReceived: 42,
    questsCompleted: 12,
};
const mockQuests = [
    { id: 1, text: '질문에 답변하기 (1/1)', completed: true },
    { id: 2, text: '스터디룸 30분 참여 (0/1)', completed: false },
    { id: 3, text: '게시글에 좋아요 누르기 (0/5)', completed: false },
    { id: 4, text: '새로운 친구 1명 추가하기 (0/1)', completed: false },
    { id: 5, text: '커뮤니티 게시글 작성 (0/1)', completed: false },
    { id: 6, text: '출석 체크하기 (1/1)', completed: true },
    { id: 7, text: '단원평가 1회 응시 (0/1)', completed: false },
    { id: 8, text: '알고리즘 문제 풀기 (0/3)', completed: false },
];
const mockNotices = [
    { id: 1, title: 'Hamcam 서비스 점검 안내 (03:00~04:00)' },
    { id: 2, title: '커뮤니티 이용규칙 업데이트' },
    { id: 3, title: '10월 마일리지 지급 안내' },
    { id: 4, title: '개인정보 처리방침 개정 안내' },
    { id: 5, title: '신규 스터디 그룹 기능 오픈!' },
];
const mockPosts = [
    { id: 1, title: 'JPA N+1 문제, 이렇게 해결했어요.', author: '개발왕김코딩' },
    { id: 2, title: 'React 19 useOptimistic 훅 사용 후기', author: '리액트고수' },
    { id: 3, title: 'CS 스터디 주 3회 모집합니다 (온라인)', author: '스터디장' },
    { id: 4, title: '알고리즘 문제 풀이 도와주실 분', author: '알고리즘꿈나무' },
    { id: 5, title: '자바스크립트 클로저 질문있습니다!', author: '자바스크립트초보' },
];
const mockOnlineFriends = [
    { id: 1, nickname: '에이스', avatar: `https://ui-avatars.com/api/?name=에이스&background=random` },
    { id: 2, nickname: '벨', avatar: `https://ui-avatars.com/api/?name=벨&background=random` },
    { id: 3, nickname: '캐시', avatar: `https://ui-avatars.com/api/?name=캐시&background=random` },
];
const mockActivityFeed = [
    { id: 1, type: 'post', text: "'JPA N+1 문제..' 글을 작성했습니다." },
    { id: 2, type: 'comment', text: "'React 19 훅..' 글에 댓글을 남겼습니다." },
    { id: 3, type: 'quest', text: "'질문에 답변하기' 퀘스트를 완료했습니다!" },
    { id: 4, type: 'post', text: "'알고리즘 문제 풀이..' 글을 작성했습니다." },
];

const SummaryItem = ({ title, author, onClick }) => (
    <div className="summary-item" onClick={onClick}>
        <span className="summary-item-title">{title}</span>
        {author && <span className="summary-item-author">{author}</span>}
    </div>
);

const ActivityItem = ({ type, text }) => {
    const iconMap = {
        post: <FiEdit />,
        comment: <FiMessageCircle />,
        quest: <FiAward />,
    };
    return (
        <div className="activity-item">
            <span className="activity-item-icon">{iconMap[type]}</span>
            <span className="activity-item-text">{text}</span>
        </div>
    );
};

const StatCard = ({ icon, value, label }) => (
    <div className="stat-card">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
    </div>
);

const Community = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('홈');

    useEffect(() => {
        const currentMenuItem = menu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '홈');
    }, [location.pathname]);

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    return (
        <div className="community-page-container clay-panel">
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
                {/* Main Content Area */}
                <main className="main-content-feed">
                    <div className="community-main-content-wrapper">
                        <div className="community-posts-and-notices">
                            {/* My Activity Summary */}
                            <div className="activity-summary-panel clay-panel">
                                <div className="stat-card-list">
                                    <StatCard icon={<FiEdit />} value={mockUserStats.posts} label="게시글" />
                                    <StatCard icon={<FiMessageCircle />} value={mockUserStats.comments} label="댓글" />
                                    <StatCard icon={<FiThumbsUp />} value={mockUserStats.likesReceived} label="받은 좋아요" />
                                    <StatCard icon={<FiAward />} value={mockUserStats.questsCompleted} label="퀘스트 완료" />
                                </div>
                            </div>

                            {/* Notices Summary */}
                            <div className="summary-panel clay-panel">
                                <header className="summary-header">
                                    <h2>주요 공지사항</h2>
                                    <button className="more-btn" onClick={() => navigate('/community/notice')}>
                                        더보기 <FiChevronRight />
                                    </button>
                                </header>
                                <div className="summary-list">
                                    {mockNotices.slice(0, 5).map(notice => (
                                        <SummaryItem key={notice.id} title={notice.title} onClick={() => navigate(`/community/notice/${notice.id}`)} />
                                    ))}
                                </div>
                            </div>

                            {/* Posts Summary */}
                            <div className="summary-panel clay-panel">
                                <header className="summary-header">
                                    <h2>최신 게시글</h2>
                                    <button className="more-btn" onClick={() => navigate('/community/post')}>
                                        더보기 <FiChevronRight />
                                    </button>
                                </header>
                                <div className="summary-list">
                                    {mockPosts.slice(0, 5).map(post => (
                                        <SummaryItem key={post.id} title={post.title} author={post.author} onClick={() => navigate(`/community/post/${post.id}`)} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <aside className="right-gamification-panel">
                            {/* My Activity Feed */}
                            <div className="activity-feed-panel clay-panel">
                                <h3>내 활동 피드</h3>
                                <div className="activity-feed-list">
                                    {mockActivityFeed.map(activity => (
                                        <ActivityItem key={activity.id} type={activity.type} text={activity.text} />
                                    ))}
                                </div>
                            </div>

                            {/* Online Friends */}
                            <div className="online-friends-panel clay-panel">
                                <h3><FiUsers /> 접속 중인 친구</h3>
                                <div className="online-friends-list">
                                    {mockOnlineFriends.map(friend => (
                                        <div key={friend.id} className="online-friend-item">
                                            <div className="online-friend-avatar-container">
                                                <img src={friend.avatar} alt={friend.nickname} className="online-friend-avatar" />
                                                <div className="online-status-dot"></div>
                                            </div>
                                            <span>{friend.nickname}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Quests */}
                            <div className="quests-module clay-panel">
                                <h3><FiAward /> 일일 퀘스트</h3>
                                <ul className="quest-list">
                                    {mockQuests.map(q => (
                                        <li key={q.id} className={`quest-item ${q.completed ? 'completed' : ''}`}>{q.text}</li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Community;