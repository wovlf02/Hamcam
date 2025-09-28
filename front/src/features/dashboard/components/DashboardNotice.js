import React, { useEffect, useState } from 'react';
import api from '../../../api/api'; // ✅ 공통 axios 인스턴스 사용
import '../styles/DashboardNotice.css'; // Import the new CSS file

const DashboardNotice = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await api.get('/dashboard/notices');
                setNotices(res.data); // ✅ 공지사항 목록 세팅
            } catch (err) {
                console.error('공지사항 조회 실패:', err);
            }
        };

        fetchNotices();
    }, []);

    return (
        <div className="dashboard-card dashboard-notice-card">
            <div className="card-title">공지사항</div>
            <ul className="dashboard-notice-list">
                {notices.length === 0 ? (
                    <li className="no-notices">공지사항이 없습니다.</li>
                ) : (
                    notices.map((n, i) => (
                        <li key={i}>
                            <span className={`notice-type-badge type-${n.type}`}>{n.type}</span>
                            <span className="notice-text">{n.text}</span>
                            <span className="notice-date">{n.date}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default DashboardNotice;
