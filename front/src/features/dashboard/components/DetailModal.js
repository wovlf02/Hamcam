import React from 'react';
import moment from 'moment';
import '../styles/DetailModal.css';

const DetailModal = ({ item, onClose }) => {
    if (!item) return null;

    // Determine if the item is a todo or an exam schedule
    const isTodo = 'priority' in item;
    const isExam = 'exam_date' in item;

    const title = item.title;
    const description = item.description || '작성된 설명이 없습니다.';
    const date = isTodo ? item.todoDate : item.exam_date;

    const calculateDday = (d) => {
        if (!d) return null;
        const today = moment().startOf('day');
        const target = moment(d).startOf('day');
        const diff = target.diff(today, 'days');
        if (diff > 0) return `D-${diff}`;
        if (diff === 0) return 'D-DAY';
        return `D+${Math.abs(diff)}`;
    };

    return (
        <div className="detail-modal-overlay" onClick={onClose}>
            <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="detail-modal-header">
                    <h3 className="detail-modal-title">{title}</h3>
                    <button className="detail-modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="detail-modal-body">
                    <div className="detail-item">
                        <span className="detail-label">날짜</span>
                        <span className="detail-value">{moment(date).format('YYYY년 MM월 DD일')}</span>
                    </div>

                    {isTodo && (
                        <div className="detail-item">
                            <span className="detail-label">우선순위</span>
                            <span className={`detail-value priority-badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
                        </div>
                    )}

                    {isExam && (
                        <div className="detail-item">
                            <span className="detail-label">D-Day</span>
                            <span className="detail-value">{calculateDday(date)}</span>
                        </div>
                    )}

                    <div className="detail-item description-item">
                        <span className="detail-label">설명</span>
                        <p className="detail-description">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="detail-modal-footer">
                    <button className="detail-modal-confirm-btn" onClick={onClose}>확인</button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
