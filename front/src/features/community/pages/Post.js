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

const categories = ['전체', '질문', '정보공유', '스터디', '익명', '일반', '공지사항'];

const CATEGORY_ENUM = {
    '질문': 'QUESTION',
    '정보공유': 'INFO',
    '스터디': 'STUDY',
    '익명': 'ANONYMOUS',
    '일반': 'GENERAL',
    '공지사항': 'NOTICE',
};

const searchOptions = [
    { value: 'title', label: '제목' },
    { value: 'content', label: '내용' },
    { value: 'title_content', label: '제목+내용' },
    { value: 'author', label: '작성자' },
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
    const [page, setPage] = useState(1);
    const [activeMenu, setActiveMenu] = useState('게시판');

    // 🔹 게시글 목록
    const fetchPosts = async () => {
        try {
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
                content: post.content, // 필터링용으로만 사용
                category: post.category,
                viewCount: post.view_count,
                createdAt: post.created_at,
                author: post.writer_nickname,
                likeCount: post.like_count,
                commentCount: post.comment_count,
            }));

            setPosts(mappedPosts);
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

    // 🔹 페이지네이션
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
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

            {/* Breadcrumb & 글쓰기 버튼 */}
            <div className="post-page-header">
                <div className="post-breadcrumb">
                    <FiHome className="post-breadcrumb-icon" />
                    커뮤니티
                    <FiChevronRight />
                    게시판
                </div>
                <button className="post-write-btn" onClick={() => navigate('/write')}>
                    <FiEdit />
                    글쓰기
                </button>
            </div>

            {/* 메인 레이아웃 */}
            <div className="post-page-body">
                {/* 왼쪽: 게시판 */}
                <div className="post-main-content">
                    {/* 카테고리 탭 */}
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
                                        {post.category}
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

                    {/* 하단: 페이지네이션 + 검색 */}
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
                        <div className="post-search-section">
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
