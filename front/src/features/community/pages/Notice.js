// src/pages/community/NoticePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Notice.css';
import api from '../../../api/api';
import {
    FiBell, FiMessageSquare, FiGrid, FiUsers, FiHome, FiChevronRight, FiEye, FiCalendar
} from 'react-icons/fi';

const menu = [
    { label: '홈', icon: <FiHome />, path: '/community' },
    { label: '게시판', icon: <FiGrid />, path: '/community/post' },
    { label: '공지사항', icon: <FiBell />, path: '/community/notice' },
    { label: '채팅', icon: <FiMessageSquare />, path: '/community/chat' },
    { label: '친구', icon: <FiUsers />, path: '/community/friend' },
];

const Notice = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notices, setNotices] = useState([]);
    const [activeMenu, setActiveMenu] = useState('공지사항');

    useEffect(() => {
        fetchNotices();
    }, []);

    useEffect(() => {
        // 더 긴 경로부터 매칭하도록 정렬하여 정확한 메뉴 활성화
        const sortedMenu = [...menu].sort((a, b) => b.path.length - a.path.length);
        const currentMenuItem = sortedMenu.find(item => location.pathname.startsWith(item.path));
        setActiveMenu(currentMenuItem ? currentMenuItem.label : '공지사항');
    }, [location.pathname]);

    const fetchNotices = async () => {
        try {
            const res = await api.get('/community/notices');
            const mapped = (res.data || []).map((n) => ({
                id: n.id,
                title: n.title,
                content: n.content,
                date: n.created_at.slice(0, 10).replace(/-/g, '.'), // yyyy.MM.dd
                views: n.views,
            }));
            console.log("공지사항 목록", res)
            setNotices(mapped);
        } catch (err) {
            console.error('❌ 공지사항 목록 조회 실패:', err);
        }
    };

    const handleMenuClick = (path, label) => {
        setActiveMenu(label);
        navigate(path);
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
                </div>

                <div className="notice-list">
                    {notices.map((notice) => (
                        <div key={notice.id} className="notice-card">
                            <div className="notice-card-header">
                                <span className="notice-badge">공지</span>
                                <div className="notice-card-meta">
                                    <span className="notice-meta-item">
                                        <FiCalendar size={14} />
                                        {notice.date}
                                    </span>
                                    <span className="notice-meta-item">
                                        <FiEye size={14} />
                                        {notice.views}
                                    </span>
                                </div>
                            </div>
                            <h4 className="notice-card-title">{notice.title}</h4>
                            <p className="notice-card-content">{notice.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notice;
