
import React from 'react';
import { Lock, Users } from 'react-feather'; // Using react-feather for icons

const RoomCard = ({ room, onJoin }) => {
    const { room_id, title, room_type, max_participants, password, currentParticipants } = room;

    const handleJoin = () => {
        onJoin(room_id);
    };

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
                    <span>{`${currentParticipants || 0} / ${max_participants || 10}`}</span>
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

export default RoomCard;
