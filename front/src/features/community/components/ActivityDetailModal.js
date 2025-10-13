import React from 'react';
import { FiX, FiEdit, FiMessageCircle, FiThumbsUp, FiAward, FiCalendar, FiClock } from 'react-icons/fi';
import '../styles/ActivityDetailModal.css';

const ActivityDetailModal = ({ isOpen, onClose, type, data }) => {
    if (!isOpen) return null;

    const modalConfig = {
        posts: {
            title: '작성한 게시글',
            icon: <FiEdit />,
            color: '#7B68EE',
            emptyMessage: '아직 작성한 게시글이 없습니다.',
        },
        comments: {
            title: '작성한 댓글',
            icon: <FiMessageCircle />,
            color: '#20B2AA',
            emptyMessage: '아직 작성한 댓글이 없습니다.',
        },
        likes: {
            title: '받은 좋아요',
            icon: <FiThumbsUp />,
            color: '#FFA07A',
            emptyMessage: '아직 받은 좋아요가 없습니다.',
        },
        quests: {
            title: '완료한 퀘스트',
            icon: <FiAward />,
            color: '#FFD700',
            emptyMessage: '아직 완료한 퀘스트가 없습니다.',
        },
    };

    const config = modalConfig[type] || modalConfig.posts;

    const renderContent = () => {
        if (!data || data.length === 0) {
            return (
                <div className="modal-empty-state">
                    <div className="empty-icon" style={{ color: config.color }}>
                        {config.icon}
                    </div>
                    <p>{config.emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="modal-content-list">
                {data.map((item, index) => (
                    <div key={index} className="modal-content-item" style={{ '--item-color': config.color }}>
                        <div className="item-header">
                            <div className="item-icon" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                                {config.icon}
                            </div>
                            <div className="item-title">{item.title}</div>
                        </div>
                        {item.content && (
                            <div className="item-content">{item.content}</div>
                        )}
                        <div className="item-footer">
                            {item.date && (
                                <span className="item-date">
                                    <FiCalendar size={14} />
                                    {item.date}
                                </span>
                            )}
                            {item.time && (
                                <span className="item-time">
                                    <FiClock size={14} />
                                    {item.time}
                                </span>
                            )}
                            {item.likes !== undefined && (
                                <span className="item-likes">
                                    <FiThumbsUp size={14} />
                                    {item.likes}
                                </span>
                            )}
                            {item.comments !== undefined && (
                                <span className="item-comments">
                                    <FiMessageCircle size={14} />
                                    {item.comments}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="activity-modal-overlay" onClick={onClose}>
            <div className="activity-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="activity-modal-header">
                    <div className="modal-header-left">
                        <div className="modal-header-icon" style={{ backgroundColor: `${config.color}20`, color: config.color }}>
                            {config.icon}
                        </div>
                        <h2>{config.title}</h2>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <div className="activity-modal-body">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ActivityDetailModal;

