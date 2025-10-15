import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/RoomFull.css';

const RoomFull = () => {
    const navigate = useNavigate();

    return (
        <div className="room-full-container">
            <h1>방이 가득 찼습니다!</h1>
            <p>다른 방에 참여하거나 새로운 방을 만들어주세요.</p>
            <button onClick={() => navigate('/team-study')} className="room-full-btn">
                팀 학습 페이지로 이동
            </button>
        </div>
    );
};

export default RoomFull;
