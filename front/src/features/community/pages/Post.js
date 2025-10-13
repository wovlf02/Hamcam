import React, { useEffect, useState } from 'react';
import '../styles/Post.css';
import '../styles/PostNew.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api/api';
import {
    FiHome, FiChevronRight, FiEdit, FiClock, FiEye, FiThumbsUp, FiMessageCircle,
    FiTrendingUp, FiBookOpen, FiHash, FiBell, FiMessageSquare, FiGrid, FiUsers
} from 'react-icons/fi';

const menu = [
    { label: '홈', icon: <FiHome />, path: '/community' },
    { label: '게시판', icon: <FiGrid />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers />, path: '/community/friend' },
];

const categories = ['전체', '일반', '질문', '정보공유', '스터디', '익명'];

const CATEGORY_ENUM = {
    '질문': 'QUESTION',
    '정보공유': 'INFO',
    '스터디': 'STUDY',
    '익명': 'ANONYMOUS',
    '일반': 'GENERAL',
};

const searchOptions = [
    { value: 'title', label: '제목' },
    { value: 'content', label: '내용' },
    { value: 'title_content', label: '제목+내용' },
    { value: 'author', label: '작성자' },
];

const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'views', label: '조회수' },
    { value: 'likes', label: '좋아요' },
    { value: 'comments', label: '댓글수' },
];

const POSTS_PER_PAGE = 10;

const Post = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [posts, setPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [popularTags, setPopularTags] = useState([]);
    const [studyList, setStudyList] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchType, setSearchType] = useState('title');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('latest');
    const [page, setPage] = useState(1);
    const [activeMenu, setActiveMenu] = useState('게시판');

    // 🔹 Mock 게시글 데이터 생성
    const generateMockPosts = () => {
        const categories = ['GENERAL', 'QUESTION', 'INFO', 'STUDY', 'ANONYMOUS'];
        const categoryLabels = {
            'GENERAL': '일반',
            'QUESTION': '질문',
            'INFO': '정보공유',
            'STUDY': '스터디',
            'ANONYMOUS': '익명'
        };

        const titles = [
            'React 19 useOptimistic 훅 사용 후기',
            'JPA N+1 문제 해결 방법 공유합니다',
            'TypeScript 제네릭 완벽 정리',
            'Spring Boot 3.0 마이그레이션 가이드',
            '알고리즘 스터디 주 3회 모집합니다',
            'Next.js 13 App Router 실전 경험담',
            'CS 면접 준비 어떻게 하셨나요?',
            'Docker Compose로 개발 환경 구축하기',
            '코딩테스트 준비 로드맵 공유',
            'Git 브랜치 전략 고민중입니다',
            'Tailwind CSS vs Styled-components',
            'MSA 아키텍처 설계 경험담',
            'Redis 캐싱 전략 정리',
            'GraphQL vs REST API 비교',
            'AWS Lambda 성능 최적화 팁',
            'Kubernetes 입문 가이드',
            'MongoDB 인덱싱 최적화',
            'React Query 실전 사용법',
            'Webpack에서 Vite로 마이그레이션',
            'CI/CD 파이프라인 구축 경험',
            '클린 코드 작성 습관 만들기',
            'TDD 실천 방법론',
            '프론트엔드 성능 최적화 체크리스트',
            '백엔드 API 설계 원칙',
            '데이터베이스 정규화 실전 예제',
            'OAuth 2.0 인증 구현하기',
            'WebSocket 실시간 채팅 구현',
            'Elasticsearch 검색 엔진 도입기',
            'gRPC vs REST API 성능 비교',
            'Kafka 메시지 큐 활용 사례'
        ];
        const authors = [
            '개발왕김코딩', '리액트고수', '스터디장', '알고리즘꿈나무',
            '백엔드마스터', '프론트엔드닌자', 'DB전문가', '인프라엔지니어',
            '풀스택개발자', '자바스크립트러버', '타입스크립트찬양자', '스프링부트러버'
        ];

        const mockData = [];
        const now = new Date();

        for (let i = 0; i < 30; i++) {
            const createdDate = new Date(now - Math.random() * 30 * 24 * 60 * 60 * 1000); // 최근 30일 내
            const categoryKey = categories[Math.floor(Math.random() * categories.length)];
            mockData.push({
                postId: i + 1,
                title: titles[i],
                content: `${titles[i]}에 대한 상세한 내용입니다. 이 게시글은 실전 경험을 바탕으로 작성되었습니다.`,
                category: categoryKey,
                categoryLabel: categoryLabels[categoryKey],
                viewCount: Math.floor(Math.random() * 500) + 10,
                createdAt: createdDate.toISOString(),
                author: authors[Math.floor(Math.random() * authors.length)],
                likeCount: Math.floor(Math.random() * 100),
                commentCount: Math.floor(Math.random() * 50)
            });
        }

        return mockData;
    };

    // 🔹 게시글 목록
    const fetchPosts = async () => {
        try {
            // Mock 데이터 사용
            const mockPosts = generateMockPosts();

            // 카테고리 필터링
            let filtered = mockPosts;
            if (selectedCategory !== '전체') {
                const categoryKey = CATEGORY_ENUM[selectedCategory];
                filtered = mockPosts.filter(post => post.category === categoryKey);
            }

            setPosts(filtered);

            // 실제 API 호출 (주석 처리)
            /*
            const requestData = {
                page: 0,
                size: 100,
                ...(selectedCategory !== '전체' && {
                    category: CATEGORY_ENUM[selectedCategory],
                }),
            };

            const res = await api.post('/community/posts/list', requestData);

            const mappedPosts = (res.data.posts || []).map((post) => ({
                postId: post.post_id,
                title: post.title,
                content: post.content,
                category: post.category,
                viewCount: post.view_count,
                createdAt: post.created_at,
                author: post.writer_nickname,
                likeCount: post.like_count,
                commentCount: post.comment_count,
            }));

            setPosts(mappedPosts);
            */
        } catch (err) {
            console.error('❌ 게시글 목록 조회 실패:', err);
        }
    };

    // 🔹 인기 게시글
    const fetchPopularPosts = async () => {
        try {
            const res = await api.get('/community/posts/popular');
            const mapped = (res.data.posts || []).map((post) => ({
                postId: post.post_id,
                title: post.title,
                authorNickname: post.writer_nickname,
                likeCount: post.like_count,
            }));
            setPopularPosts(mapped);
        } catch (err) {
            console.error('❌ 인기 게시글 조회 실패:', err);
        }
    };

    // 🔹 인기 태그
    const fetchPopularTags = async () => {
        try {
            const res = await api.get('/community/posts/sidebar/tags');
            setPopularTags(res.data.tags || []);
        } catch (err) {
            console.error('❌ 인기 태그 조회 실패:', err);
        }
    };

    // 🔹 진행 중인 스터디
    const fetchStudyList = async () => {
        try {
            const res = await api.get('/community/posts/sidebar/studies');
            const ongoing = res.data.studies?.filter((s) => s.status === '모집중') || [];
            setStudyList(ongoing);
        } catch (err) {
            console.error('❌ 스터디 목록 조회 실패:', err);
        }
    };

    useEffect(() => {
        fetchPopularPosts();
        fetchPopularTags();
        fetchStudyList();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    useEffect(() => {
        // 더 긴 경로부터 매칭하도록 정렬하여 정확한 메뉴 활성화
        const sortedMenu = [...menu].sort((a, b) => b.path.length - a.path.length);
        const currentMenuItem = sortedMenu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '게시판');
    }, [location.pathname]);

    // 🔹 검색 필터링
    const filteredPosts = posts.filter((post) => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        const target = {
            title: post.title,
            content: post.content,
            title_content: `${post.title} ${post.content}`,
            author: post.author,
        }[searchType] || '';
        return target.toLowerCase().includes(term);
    });

    // 🔹 정렬
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch (sortType) {
            case 'latest':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'views':
                return b.viewCount - a.viewCount;
            case 'likes':
                return b.likeCount - a.likeCount;
            case 'comments':
                return b.commentCount - a.commentCount;
            default:
                return 0;
        }
    });

    // 🔹 페이지네이션
    const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = sortedPosts.slice(
        (page - 1) * POSTS_PER_PAGE,
        page * POSTS_PER_PAGE
    );
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setPage(1);
    };

    const handleSortTypeChange = (e) => {
        setSortType(e.target.value);
        setPage(1);
    };

    const handleTagClick = (tag) => {
        setSearchType('title_content');
        setSearchTerm(tag);
        setPage(1);
    };

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) return '방금 전';
        if (hours < 24) return `${hours}시간 전`;

        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="post-page-container clay-panel">
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

            {/* Breadcrumb만 표시 */}
            <div className="post-page-header">
                <div className="post-breadcrumb">
                    <FiHome className="post-breadcrumb-icon" />
                    커뮤니티
                    <FiChevronRight />
                    게시판
                </div>
            </div>

            {/* 메인 레이아웃 */}
            <div className="post-page-body">
                {/* 왼쪽: 게시판 */}
                <div className="post-main-content">
                    {/* 상단: 카테고리 탭 + 정렬 + 검색 + 글쓰기 버튼 */}
                    <div className="post-top-bar">
                        <div className="post-category-tabs">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`post-category-tab ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setPage(1);
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="post-search-section">
                            <select
                                className="post-sort-select"
                                value={sortType}
                                onChange={handleSortTypeChange}
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="post-search-select"
                                value={searchType}
                                onChange={handleSearchTypeChange}
                            >
                                {searchOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="post-search-input"
                                placeholder={`${searchOptions.find((opt) => opt.value === searchType)?.label}으로 검색`}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button className="post-write-btn" onClick={() => navigate('/write')}>
                                <FiEdit />
                                글쓰기
                            </button>
                        </div>
                    </div>

                    {/* 게시글 리스트 */}
                    <div className="post-list-container">
                        {paginatedPosts.map((post) => (
                            <div
                                key={post.postId}
                                className="post-card"
                                onClick={() => navigate(`/community/post/${post.postId}`)}
                            >
                                <div className="post-card-header">
                                    <span className={`post-card-category ${post.category}`}>
                                        {post.categoryLabel || post.category}
                                    </span>
                                    <div className="post-card-meta">
                                        <span className="post-card-meta-item">
                                            <FiClock size={14} />
                                            {formatDate(post.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="post-card-title">{post.title}</div>
                                <div className="post-card-meta">
                                    <span className="post-card-author">{post.author}</span>
                                </div>
                                <div className="post-card-stats">
                                    <span className="post-card-stat">
                                        <FiEye className="post-card-stat-icon" size={16} />
                                        {post.viewCount}
                                    </span>
                                    <span className="post-card-stat">
                                        <FiThumbsUp className="post-card-stat-icon" size={16} />
                                        {post.likeCount}
                                    </span>
                                    <span className="post-card-stat">
                                        <FiMessageCircle className="post-card-stat-icon" size={16} />
                                        {post.commentCount}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 하단: 페이지네이션만 */}
                    <div className="post-bottom-section">
                        <div className="post-pagination">
                            {pageNumbers.map((num) => (
                                <button
                                    key={num}
                                    className={`post-pagination-btn ${page === num ? 'active' : ''}`}
                                    onClick={() => setPage(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 사이드바 */}
                <aside className="post-sidebar">
                    {/* 인기 게시글 */}
                    <div className="post-sidebar-box">
                        <h3 className="post-sidebar-title">
                            <FiTrendingUp className="post-sidebar-title-icon" />
                            인기 게시글
                        </h3>
                        <ul className="popular-post-list">
                            {popularPosts.map((p) => (
                                <li
                                    key={p.postId}
                                    className="popular-post-item"
                                    onClick={() => navigate(`/community/post/${p.postId}`)}
                                >
                                    <div className="popular-post-title">{p.title}</div>
                                    <div className="popular-post-meta">
                                        <span>{p.authorNickname}</span>
                                        <span className="popular-post-likes">
                                            <FiThumbsUp size={12} /> {p.likeCount}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 진행 중인 스터디 */}
                    <div className="post-sidebar-box">
                        <h3 className="post-sidebar-title">
                            <FiBookOpen className="post-sidebar-title-icon" />
                            진행 중인 스터디
                        </h3>
                        <div className="study-list">
                            {studyList.map((s) => (
                                <div
                                    className="study-item"
                                    key={s.studyId}
                                    onClick={() => navigate(`/study/${s.study_id}`)}
                                >
                                    <div className="study-item-header">
                                        <div className="study-item-name">{s.name}</div>
                                        <span className="study-item-tag">{s.tag}</span>
                                    </div>
                                    <div className="study-item-info">{s.info}</div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="study-view-all-btn"
                            onClick={() => navigate('/study')}
                        >
                            전체 스터디 보기
                        </button>
                    </div>

                    {/* 인기 태그 */}
                    <div className="post-sidebar-box">
                        <h3 className="post-sidebar-title">
                            <FiHash className="post-sidebar-title-icon" />
                            인기 태그
                        </h3>
                        <div className="tag-list">
                            {popularTags.length === 0 ? (
                                <div className="tag-empty">태그가 없습니다.</div>
                            ) : (
                                popularTags.map((tag) => (
                                    <span
                                        className="tag-item"
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                    >
                                        #{tag}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Post;
