import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/PersonalStudy.css'; // Import the new CSS file

const PersonalStudy = () => {
    const [unitName, setUnitName] = useState('');
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [showFocusMsg, setShowFocusMsg] = useState(false);
    const navigate = useNavigate();

    // 캠스터디 경고 및 집중 메시지
    const warningMsg = "⚠️ 캠에서 벗어나면 타이머가 멈춥니다. 화면을 벗어나지 말고 집중해 주세요!";
    const focusMsg = "집중해서 공부해보세요! 당신은 할 수 있습니다 💪";

    // 단원명과 시간(분/초) 모두 입력해야 버튼 활성화 (분+초 > 0)
    const isStartEnabled = unitName.trim() !== '' && (minutes > 0 || seconds > 0);

    const handleStart = () => {
        // 단원명, 공부시간(초)을 함께 전달
        navigate('/camstudy', {state: {initialTime: minutes * 60 + seconds, unitName}});
    };

    // 집중 메시지 토글
    const handleFocusMsg = () => setShowFocusMsg(!showFocusMsg);

    // 초 입력은 0~59로 제한
    const handleSecondsChange = (e) => {
        let value = Number(e.target.value);
        if (value < 0) value = 0;
        if (value > 59) value = 59;
        setSeconds(value);
    };

    return (
        <div className="personal-study-wrapper">
            <h1 className="personal-study-title">개인 공부 설정</h1>
            <div className="personal-study-container">
                <div className="personal-study-warning">
                    {warningMsg}
                </div>
                <div className="personal-study-form-group">
                    <label>
                        <span className="personal-study-label">단원명:</span>
                        <input
                            type="text"
                            value={unitName}
                            onChange={e => setUnitName(e.target.value)}
                            placeholder="예: 3단원 함수"
                            className="personal-study-input"
                        />
                    </label>
                </div>
                <div className="personal-study-form-group">
                    <label>
                        <span className="personal-study-label">학습 시간:</span>
                        <div className="personal-study-time-inputs">
                            <input
                                type="number"
                                min="0"
                                value={minutes}
                                onChange={e => setMinutes(Number(e.target.value))}
                                className="personal-study-time-input"
                            />
                            <span className="personal-study-time-unit">분</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={seconds}
                                onChange={handleSecondsChange}
                                className="personal-study-time-input"
                            />
                            <span className="personal-study-time-unit">초</span>
                        </div>
                    </label>
                </div>
                <button
                    onClick={handleStart}
                    disabled={!isStartEnabled}
                    className="personal-study-start-btn"
                >
                    공부 시작
                </button>
                <div>
                    <button
                        onClick={handleFocusMsg}
                        className="personal-study-focus-btn"
                    >
                        {showFocusMsg ? '메시지 숨기기' : '집중 메시지 보기'}
                    </button>
                </div>
                {showFocusMsg && (
                    <div className="personal-study-focus-msg">
                        {focusMsg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalStudy;
