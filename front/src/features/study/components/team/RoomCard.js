import React from 'react';
import { Lock, Users } from 'react-feather'; // Using react-feather for icons

const RoomCard = ({ room, onJoin, realTimeCount }) => {
    const { room_id, title, room_type, max_participants, password, currentParticipants } = room;

    const handleJoin = () => {
        onJoin(room_id);
    };

    // 🔹 실시간 접속자 수 우선 사용, 없으면 DB 기준 사용
    const displayCount = realTimeCount !== undefined ? realTimeCount : (currentParticipants || 0);

    return (
        <li className="room-card" onClick={handleJoin}>
            <div className="card-header">
                <h3>{title}</h3>
                <span className={`card-badge ${room_type.toLowerCase()}`}>
                    {room_type === 'QUIZ' ? '문제풀이' : '시간경쟁'}
                </span>
            </div>
            <div className="card-body">
                <p>참여하여 함께 성장하는 공간입니다. 지금 바로 참여해보세요!</p>
            </div>
            <div className="card-footer">
                <div className="participants">
                    <Users size={16} />
                    <span>
                        {displayCount} / {max_participants || 10}
                        {realTimeCount !== undefined && <span className="real-time-badge"> 실시간</span>}
                    </span>
                </div>
                {password && (
                    <div className="lock-status">
                        <Lock size={16} />
                        <span>비공개</span>
                    </div>
                )}
            </div>
        </li>
    );
};

// 🚀 React.memo로 감싸서 props가 변경되지 않은 카드는 리렌더링 방지
export default React.memo(RoomCard, (prevProps, nextProps) => {
    // room_id, realTimeCount, onJoin만 비교 (얕은 비교)
    return (
        prevProps.room.room_id === nextProps.room.room_id &&
        prevProps.realTimeCount === nextProps.realTimeCount &&
        prevProps.onJoin === nextProps.onJoin
    );
});
