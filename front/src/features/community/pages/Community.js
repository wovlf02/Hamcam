import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/CommunityMain.css'; // Using the same CSS file
import ActivityDetailModal from '../components/ActivityDetailModal';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiHome, FiAward, FiChevronRight, FiEdit, FiMessageCircle, FiThumbsUp
} from 'react-icons/fi';

const menu = [
    { label: '홈', icon: <FiHome />, path: '/community' },
    { label: '게시판', icon: <FiGrid />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers />, path: '/community/friend' },
];

// Mock Data for the new UI
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
    { id: 9, text: '댓글 5개 작성하기 (2/5)', completed: false },
    { id: 10, text: '스터디 그룹 참여하기 (0/1)', completed: false },
    { id: 11, text: '프로필 사진 변경하기 (1/1)', completed: true },
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
    { id: 4, nickname: '데이브', avatar: `https://ui-avatars.com/api/?name=데이브&background=random` },
    { id: 5, nickname: '엘라', avatar: `https://ui-avatars.com/api/?name=엘라&background=random` },
    { id: 6, nickname: '프랭크', avatar: `https://ui-avatars.com/api/?name=프랭크&background=random` },
    { id: 7, nickname: '그레이스', avatar: `https://ui-avatars.com/api/?name=그레이스&background=random` },
    { id: 8, nickname: '헨리', avatar: `https://ui-avatars.com/api/?name=헨리&background=random` },
    { id: 9, nickname: '아이비', avatar: `https://ui-avatars.com/api/?name=아이비&background=random` },
];
const mockActivityFeed = [
    { id: 1, type: 'post', text: "'JPA N+1 문제..' 글을 작성했습니다." },
    { id: 2, type: 'comment', text: "'React 19 훅..' 글에 댓글을 남겼습니다." },
    { id: 3, type: 'quest', text: "'질문에 답변하기' 퀘스트를 완료했습니다!" },
    { id: 4, type: 'post', text: "'알고리즘 문제 풀이..' 글을 작성했습니다." },
    { id: 5, type: 'comment', text: "'CS 스터디 모집..' 글에 댓글을 남겼습니다." },
    { id: 6, type: 'post', text: "'Spring Boot 최적화..' 글을 작성했습니다." },
    { id: 7, type: 'quest', text: "'출석 체크하기' 퀘스트를 완료했습니다!" },
    { id: 8, type: 'comment', text: "'자바스크립트 클로저..' 글에 댓글을 남겼습니다." },
    { id: 9, type: 'post', text: "'Git 충돌 해결 방법..' 글을 작성했습니다." },
    { id: 10, type: 'quest', text: "'게시글 좋아요 누르기' 퀘스트를 완료했습니다!" },
];

// Mock Data for Modal Details
const mockPostsDetails = [
    {
        title: 'JPA N+1 문제, 이렇게 해결했어요.',
        content: 'JPA를 사용하다 보면 N+1 문제를 자주 마주치게 되는데요, Fetch Join과 Entity Graph를 활용한 해결 방법을 공유합니다.',
        date: '2025.01.12',
        time: '14:23',
        likes: 24,
        comments: 8
    },
    {
        title: 'Spring Boot 최적화 팁 5가지',
        content: '실무에서 바로 적용 가능한 Spring Boot 성능 최적화 방법들을 정리해봤습니다.',
        date: '2025.01.10',
        time: '09:15',
        likes: 18,
        comments: 5
    },
    {
        title: 'REST API 설계 Best Practice',
        content: 'RESTful API를 설계할 때 고려해야 할 핵심 원칙들과 실전 예제를 소개합니다.',
        date: '2025.01.08',
        time: '16:42',
        likes: 31,
        comments: 12
    },
    {
        title: 'Docker 컨테이너 최적화 가이드',
        content: 'Docker 이미지 크기를 줄이고 빌드 시간을 단축하는 실전 팁들을 소개합니다.',
        date: '2025.01.07',
        time: '10:20',
        likes: 15,
        comments: 6
    },
    {
        title: 'TypeScript 제네릭 완벽 정리',
        content: 'TypeScript의 제네릭을 실무에서 어떻게 활용하는지 예제와 함께 설명합니다.',
        date: '2025.01.05',
        time: '15:30',
        likes: 27,
        comments: 9
    },
    {
        title: 'AWS Lambda 서버리스 아키텍처',
        content: '서버리스 아키텍처의 장단점과 Lambda를 활용한 실전 구현 방법을 다룹니다.',
        date: '2025.01.03',
        time: '13:45',
        likes: 22,
        comments: 7
    },
    {
        title: 'GraphQL vs REST API 비교 분석',
        content: '실제 프로젝트에서 경험한 두 API 방식의 장단점을 비교 분석했습니다.',
        date: '2025.01.01',
        time: '11:00',
        likes: 19,
        comments: 11
    },
    {
        title: 'Redis 캐싱 전략 정리',
        content: 'Redis를 활용한 다양한 캐싱 전략과 성능 개선 사례를 공유합니다.',
        date: '2024.12.30',
        time: '16:15',
        likes: 25,
        comments: 8
    },
];

const mockCommentsDetails = [
    {
        title: 'React 19 useOptimistic 훅 사용 후기',
        content: '정말 유용한 정보 감사합니다! 저도 프로젝트에 바로 적용해봤는데 사용자 경험이 훨씬 좋아졌어요.',
        date: '2025.01.13',
        time: '11:20'
    },
    {
        title: 'CS 스터디 주 3회 모집합니다',
        content: '관심 있습니다! 참여 방법 좀 알려주실 수 있을까요?',
        date: '2025.01.12',
        time: '18:35'
    },
    {
        title: '알고리즘 문제 풀이 도와주실 분',
        content: '이 문제는 동적 프로그래밍으로 접근하면 될 것 같아요. DP 테이블을 이렇게 설계해보세요...',
        date: '2025.01.11',
        time: '22:10'
    },
    {
        title: 'Node.js 비동기 처리 질문',
        content: 'Promise.all()을 사용하면 병렬로 처리할 수 있어요. 성능이 훨씬 좋아집니다!',
        date: '2025.01.10',
        time: '14:50'
    },
    {
        title: 'MongoDB 인덱싱 전략',
        content: '복합 인덱스 설계할 때 쿼리 패턴을 먼저 분석하는 게 중요합니다.',
        date: '2025.01.09',
        time: '09:30'
    },
    {
        title: 'Webpack 설정 최적화',
        content: '빌드 시간을 절반으로 줄인 방법 공유해주셔서 감사합니다!',
        date: '2025.01.08',
        time: '17:20'
    },
    {
        title: 'Git 브랜치 전략 문의',
        content: 'Git Flow가 팀 규모에 따라 적합할 수 있습니다. GitHub Flow도 고려해보세요.',
        date: '2025.01.07',
        time: '12:40'
    },
    {
        title: 'SQL 쿼리 튜닝 팁',
        content: 'EXPLAIN ANALYZE로 실행 계획 보면서 최적화하는 방법이 효과적이었습니다.',
        date: '2025.01.06',
        time: '15:55'
    },
    {
        title: 'Vue 3 Composition API 장점',
        content: '로직 재사용성이 정말 좋아졌네요. 코드가 훨씬 깔끔해졌어요.',
        date: '2025.01.05',
        time: '10:15'
    },
    {
        title: 'Nginx 로드밸런싱 설정',
        content: 'upstream 설정 예제가 정말 도움됐습니다. 바로 적용했어요!',
        date: '2025.01.04',
        time: '13:25'
    },
];

const mockLikesDetails = [
    {
        title: '내가 작성한 "JPA N+1 문제 해결"',
        content: '개발왕김코딩님 외 23명이 좋아합니다.',
        date: '2025.01.13',
        likes: 24
    },
    {
        title: '내가 작성한 "Spring Boot 최적화"',
        content: '리액트고수님 외 17명이 좋아합니다.',
        date: '2025.01.12',
        likes: 18
    },
    {
        title: '내가 작성한 "REST API 설계"',
        content: 'API마스터님 외 30명이 좋아합니다.',
        date: '2025.01.11',
        likes: 31
    },
    {
        title: '내가 작성한 "Docker 최적화"',
        content: '클라우드전문가님 외 14명이 좋아합니다.',
        date: '2025.01.10',
        likes: 15
    },
    {
        title: '내가 작성한 "TypeScript 제네릭"',
        content: 'TS고수님 외 26명이 좋아합니다.',
        date: '2025.01.09',
        likes: 27
    },
];

const mockQuestsDetails = [
    {
        title: '질문에 답변하기',
        content: '다른 사용자의 질문에 답변을 남겨 도움을 주었습니다.',
        date: '2025.01.13',
        time: '14:30'
    },
    {
        title: '출석 체크하기',
        content: '오늘도 햄캠에 출석했습니다!',
        date: '2025.01.13',
        time: '09:00'
    },
    {
        title: '프로필 사진 변경하기',
        content: '프로필을 새롭게 꾸몄습니다.',
        date: '2025.01.11',
        time: '15:45'
    },
    {
        title: '게시글 5개 작성하기',
        content: '유익한 게시글을 작성하여 커뮤니티에 기여했습니다.',
        date: '2025.01.10',
        time: '18:20'
    },
    {
        title: '댓글 10개 달기',
        content: '활발하게 소통하며 커뮤니티를 활성화했습니다.',
        date: '2025.01.09',
        time: '12:30'
    },
    {
        title: '친구 5명 추가하기',
        content: '새로운 친구들과 네트워킹을 확장했습니다.',
        date: '2025.01.08',
        time: '16:45'
    },
    {
        title: '스터디 그룹 참여하기',
        content: '스터디 그룹에 참여하여 함께 성장하고 있습니다.',
        date: '2025.01.07',
        time: '10:00'
    },
    {
        title: '좋아요 20개 받기',
        content: '작성한 콘텐츠로 많은 분들께 도움을 드렸습니다.',
        date: '2025.01.06',
        time: '14:15'
    },
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

const StatCard = ({ icon, value, label, onClick }) => (
    <button className="stat-card" onClick={onClick}>
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
    </button>
);

const Community = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('홈');
    const [modalState, setModalState] = useState({
        isOpen: false,
        type: null,
        data: []
    });

    useEffect(() => {
        const currentMenuItem = menu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '홈');
    }, [location.pathname]);

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    const openModal = (type, data) => {
        setModalState({
            isOpen: true,
            type,
            data
        });
    };

    const closeModal = () => {
        setModalState({
            isOpen: false,
            type: null,
            data: []
        });
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
                                    <StatCard
                                        icon={<FiEdit />}
                                        value={mockUserStats.posts}
                                        label="게시글"
                                        onClick={() => openModal('posts', mockPostsDetails)}
                                    />
                                    <StatCard
                                        icon={<FiMessageCircle />}
                                        value={mockUserStats.comments}
                                        label="댓글"
                                        onClick={() => openModal('comments', mockCommentsDetails)}
                                    />
                                    <StatCard
                                        icon={<FiThumbsUp />}
                                        value={mockUserStats.likesReceived}
                                        label="받은 좋아요"
                                        onClick={() => openModal('likes', mockLikesDetails)}
                                    />
                                    <StatCard
                                        icon={<FiAward />}
                                        value={mockUserStats.questsCompleted}
                                        label="퀘스트 완료"
                                        onClick={() => openModal('quests', mockQuestsDetails)}
                                    />
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

            {/* Activity Detail Modal */}
            <ActivityDetailModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                type={modalState.type}
                data={modalState.data}
            />
        </div>
    );
};

export default Community;
