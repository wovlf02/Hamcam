// src/pages/community/NoticePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Notice.css';
import api from '../../../api/api';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiHome, FiChevronRight, FiEye, FiCalendar, FiAlertCircle, FiTrendingUp
} from 'react-icons/fi';

const menu = [
    { label: '홈', icon: <FiHome />, path: '/community' },
    { label: '게시판', icon: <FiGrid />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers />, path: '/community/friend' },
];

// Mock 데이터
const MOCK_NOTICES = [
    {
        id: 1,
        title: '🎉 Hamcam 2.0 업데이트 안내',
        content: '새로운 화상 스터디 기능과 AI 학습 추천 시스템이 추가되었습니다. 더욱 향상된 학습 환경에서 공부하세요!',
        date: '2025.01.13',
        views: 1245,
        isNew: true,
        isImportant: true,
        category: '업데이트'
    },
    {
        id: 2,
        title: '🔧 서버 점검 안내 (1월 15일 03:00 ~ 04:00)',
        content: '안정적인 서비스 제공을 위한 정기 서버 점검이 진행됩니다. 점검 시간 동안 일시적으로 서비스 이용이 제한될 수 있습니다.',
        date: '2025.01.12',
        views: 856,
        isNew: true,
        isImportant: true,
        category: '점검'
    },
    {
        id: 3,
        title: '📚 커뮤니티 이용규칙 업데이트',
        content: '보다 건전한 커뮤니티 문화 조성을 위해 이용규칙이 업데이트되었습니다. 악의적인 댓글 및 게시글은 제재될 수 있습니다.',
        date: '2025.01.11',
        views: 632,
        isNew: true,
        isImportant: false,
        category: '정책'
    },
    {
        id: 4,
        title: '💰 1월 마일리지 지급 완료 안내',
        content: '1월 활동에 대한 마일리지가 지급되었습니다. 마이페이지에서 확인하실 수 있습니다.',
        date: '2025.01.10',
        views: 1523,
        isNew: false,
        isImportant: false,
        category: '이벤트'
    },
    {
        id: 5,
        title: '🔐 개인정보 처리방침 개정 안내',
        content: '개인정보 보호법 개정에 따라 개인정보 처리방침이 일부 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
        date: '2025.01.09',
        views: 445,
        isNew: false,
        isImportant: true,
        category: '정책'
    },
    {
        id: 6,
        title: '✨ 신규 스터디 그룹 기능 오픈!',
        content: '함께 공부할 스터디 그룹을 만들고 관리할 수 있는 기능이 추가되었습니다. 지금 바로 그룹을 만들어보세요!',
        date: '2025.01.08',
        views: 982,
        isNew: false,
        isImportant: false,
        category: '기능'
    },
    {
        id: 7,
        title: '📱 모바일 앱 베타 테스터 모집',
        content: 'Hamcam 모바일 앱 베타 버전 테스터를 모집합니다. 참여하시면 소정의 리워드가 제공됩니다.',
        date: '2025.01.07',
        views: 1876,
        isNew: false,
        isImportant: false,
        category: '이벤트'
    },
    {
        id: 8,
        title: '🎯 2025년 1분기 업데이트 로드맵',
        content: '올해 1분기에 예정된 주요 기능 업데이트와 개선사항을 공유합니다. 여러분의 의견을 기다립니다!',
        date: '2025.01.05',
        views: 723,
        isNew: false,
        isImportant: false,
        category: '업데이트'
    }
];

const Notice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notices, setNotices] = useState(MOCK_NOTICES); // Mock 데이터 사용
    const [activeMenu, setActiveMenu] = useState('공지사항');
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        // Mock 데이터로 초기화
        setNotices(MOCK_NOTICES);

        // TODO: 실제 API 호출은 주석 처리
        // fetchNotices();
    }, []);

    useEffect(() => {
        const sortedMenu = [...menu].sort((a, b) => b.path.length - a.path.length);
        const currentMenuItem = sortedMenu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '공지사항');
    }, [location.pathname]);

    const fetchNotices = async () => {
        // TODO: 실제 API 호출
        /*
        try {
            const res = await api.get('/community/notices');
            const mapped = (res.data || []).map((n) => ({
                id: n.id,
                title: n.title,
                content: n.content,
                date: n.created_at.slice(0, 10).replace(/-/g, '.',
                views: n.views,
            }));
            setNotices(mapped);
        } catch (err) {
            console.error('❌ 공지사항 목록 조회 실패:', err);
        }
        */
    };

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
    };

    const handleNoticeClick = (notice) => {
        setSelectedNotice(notice);
        // 조회수 증가 (Mock)
        setNotices(prev => prev.map(n =>
            n.id === notice.id ? { ...n, views: n.views + 1 } : n
        ));
    };

    const getCategoryColor = (category) => {
        const colors = {
            '업데이트': 'linear-gradient(135deg, #7B68EE, #6B5FD8)',
            '점검': 'linear-gradient(135deg, #FF6B6B, #EE5A5A)',
            '정책': 'linear-gradient(135deg, #20B2AA, #1A9B94)',
            '이벤트': 'linear-gradient(135deg, #FFD700, #FFA500)',
            '기능': 'linear-gradient(135deg, #FFA07A, #FF8C5A)'
        };
        return colors[category] || 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
    };

    return (
        <div className="notice-page-container clay-panel">
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
            <div className="notice-page-header">
                <div className="notice-breadcrumb">
                    <FiHome className="notice-breadcrumb-icon" />
                    커뮤니티
                    <FiChevronRight />
                    공지사항
                </div>
            </div>

            {/* 공지사항 리스트 */}
            <div className="notice-content">
                <div className="notice-title-section">
                    <h2 className="notice-main-title">
                        <FiBell className="notice-title-icon" />
                        공지사항
                    </h2>
                    <p className="notice-subtitle">Hamcam의 중요한 소식을 확인하세요</p>

                    {/* 통계 정보 */}
                    <div className="notice-stats">
                        <div className="notice-stat-card">
                            <FiAlertCircle className="stat-icon important" />
                            <div className="stat-info">
                                <span className="stat-label">중요 공지</span>
                                <span className="stat-value">{notices.filter(n => n.isImportant).length}개</span>
                            </div>
                        </div>
                        <div className="notice-stat-card">
                            <FiTrendingUp className="stat-icon new" />
                            <div className="stat-info">
                                <span className="stat-label">신규 공지</span>
                                <span className="stat-value">{notices.filter(n => n.isNew).length}개</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="notice-list">
                    {notices.map((notice) => (
                        <div
                            key={notice.id}
                            className={`notice-card ${notice.isImportant ? 'important' : ''}`}
                            onClick={() => handleNoticeClick(notice)}
                        >
                            <div className="notice-card-header">
                                <div className="notice-badges">
                                    <span
                                        className="notice-category-badge"
                                        style={{ background: getCategoryColor(notice.category) }}
                                    >
                                        {notice.category}
                                    </span>
                                    {notice.isNew && <span className="notice-new-badge">NEW</span>}
                                    {notice.isImportant && <span className="notice-important-badge">중요</span>}
                                </div>
                                <div className="notice-card-meta">
                                    <span className="notice-meta-item">
                                        <FiCalendar size={14} />
                                        {notice.date}
                                    </span>
                                    <span className="notice-meta-item">
                                        <FiEye size={14} />
                                        {notice.views.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <h4 className="notice-card-title">{notice.title}</h4>
                            <p className="notice-card-content">{notice.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 공지사항 상세 모달 */}
            {selectedNotice && (
                <div className="notice-modal-overlay" onClick={() => setSelectedNotice(null)}>
                    <div className="notice-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="notice-modal-header">
                            <div className="notice-modal-badges">
                                <span
                                    className="notice-category-badge"
                                    style={{ background: getCategoryColor(selectedNotice.category) }}
                                >
                                    {selectedNotice.category}
                                </span>
                                {selectedNotice.isNew && <span className="notice-new-badge">NEW</span>}
                                {selectedNotice.isImportant && <span className="notice-important-badge">중요</span>}
                            </div>
                            <button className="notice-modal-close" onClick={() => setSelectedNotice(null)}>
                                ✕
                            </button>
                        </div>
                        <h3 className="notice-modal-title">{selectedNotice.title}</h3>
                        <div className="notice-modal-meta">
                            <span className="notice-meta-item">
                                <FiCalendar size={16} />
                                {selectedNotice.date}
                            </span>
                            <span className="notice-meta-item">
                                <FiEye size={16} />
                                조회수 {selectedNotice.views.toLocaleString()}
                            </span>
                        </div>
                        <div className="notice-modal-content">
                            {selectedNotice.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notice;
