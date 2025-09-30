import React from 'react';
import api from '../../../api/api';
import '../../dashboard/styles/DashboardStudyTimeCard.css'; // New CSS file for this component

const DashboardStudyTimeCard = ({
                                 weeklyGoalHour,
                                 weeklyGoalMin,
                                 todayGoalHour,
                                 todayGoalMin,
                                 todayStudyHour,
                                 todayStudyMin,
                                 todayRemainMinutes,
                                 weekRemainMinutes,
                                 handleWeeklyGoalChange,
                                 handleTodayGoalChange,
                                 handleTodayStudyChange,
                                 weeklyGoalMinutes,
                                 todayGoalMinutes,
                                 todayStudyMinutes,
                             }) => {

    // ✅ 서버로 목표 시간 저장
    const saveStudyGoal = async (weekly, today) => {
        try {
            await api.post('/dashboard/study-time', {
                weeklyGoalMinutes: weekly,
                todayGoalMinutes: today,
            });
            alert('목표 시간이 저장되었습니다.');
        } catch (err) {
            console.error('목표 시간 저장 실패:', err);
        }
    };

    // ✅ 주간 목표 시간 변경 → 상태만 변경
    const handleWeeklyChange = (type, value) => {
        handleWeeklyGoalChange(type, value);
    };

    // ✅ 오늘 목표 시간 변경 → 상태만 변경
    const handleTodayChange = (type, value) => {
        handleTodayGoalChange(type, value);
    };

    const handleSave = () => {
        saveStudyGoal(weeklyGoalMinutes, todayGoalMinutes);
    };

    return (
        <div className="dashboard-card dashboard-study-time-card-component">
            <div className="dashboard-study-time-header">
                <h3>공부 시간 관리</h3>
                <button onClick={handleSave} className="dashboard-study-time-save-btn">저장</button>
            </div>

            {/* 주간 목표 시간 */}
            <div className="dashboard-time-detail-row">
                <span className="dashboard-time-detail-label">주간 목표시간</span>
                <input
                    type="number"
                    min={0}
                    max={168}
                    className="dashboard-time-detail-input"
                    value={weeklyGoalHour}
                    onChange={(e) => handleWeeklyChange('hour', e.target.value)}
                />
                <span className="time-unit">시간</span>
                <input
                    type="number"
                    min={0}
                    max={59}
                    className="dashboard-time-detail-input"
                    value={weeklyGoalMin}
                    onChange={(e) => handleWeeklyChange('min', e.target.value)}
                />
                <span className="time-unit">분</span>
            </div>

            {/* 오늘 목표 시간 */}
            <div className="dashboard-time-detail-row">
                <span className="dashboard-time-detail-label">오늘 목표시간</span>
                <input
                    type="number"
                    min={0}
                    max={24}
                    className="dashboard-time-detail-input"
                    value={todayGoalHour}
                    onChange={(e) => handleTodayChange('hour', e.target.value)}
                />
                <span className="time-unit">시간</span>
                <input
                    type="number"
                    min={0}
                    max={59}
                    className="dashboard-time-detail-input"
                    value={todayGoalMin}
                    onChange={(e) => handleTodayChange('min', e.target.value)}
                />
                <span className="time-unit">분</span>
            </div>

            {/* 오늘 공부 시간 (프론트 상태만 변경) */}
            <div className="dashboard-time-detail-row">
                <span className="dashboard-time-detail-label">오늘 공부한 시간</span>
                <input
                    type="number"
                    min={0}
                    max={24}
                    className="dashboard-time-detail-input"
                    value={todayStudyHour}
                    onChange={(e) => handleTodayStudyChange('hour', e.target.value)}
                />
                <span className="time-unit">시간</span>
                <input
                    type="number"
                    min={0}
                    max={59}
                    className="dashboard-time-detail-input"
                    value={todayStudyMin}
                    onChange={(e) => handleTodayStudyChange('min', e.target.value)}
                />
                <span className="time-unit">분</span>
            </div>

            {/* 잔여 시간 */}
            <div className="dashboard-time-detail-row time-remain-row">
                <span className="dashboard-time-detail-label time-remain-label">
                    오늘 남은 공부시간
                </span>
                <span className="time-remain-value">
                    {`${Math.floor(todayRemainMinutes / 60)}시간 ${todayRemainMinutes % 60}분`}
                </span>
            </div>
            <div className="progress-bar-wrapper">
                                        <div className="progress-bar-container">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${Math.min(100, Math.max(0, (Number(todayGoalMinutes) || 0) > 0 ? ((Number(todayStudyMinutes) || 0) / (Number(todayGoalMinutes) || 0)) * 100 : 0))}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-percentage">
                                            {Math.min(100, Math.max(0, (Number(todayGoalMinutes) || 0) > 0 ? ((Number(todayStudyMinutes) || 0) / (Number(todayGoalMinutes) || 0)) * 100 : 0)).toFixed(1)}%
                                        </span>            </div>
            <div className="dashboard-time-detail-row time-remain-row">
                <span className="dashboard-time-detail-label time-remain-label">
                    주간 남은 공부시간
                </span>
                <span className="time-remain-value">
                    {`${Math.floor(weekRemainMinutes / 60)}시간 ${weekRemainMinutes % 60}분`}
                </span>
            </div>
            <div className="progress-bar-wrapper">
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(100, Math.max(0, (Number(weeklyGoalMinutes) || 0) > 0 ? ((Number(todayStudyMinutes) || 0) / (Number(weeklyGoalMinutes) || 0)) * 100 : 0))}%` }}
                    ></div>
                </div>
                <span className="progress-percentage">
                    {Math.min(100, Math.max(0, (Number(weeklyGoalMinutes) || 0) > 0 ? ((Number(todayStudyMinutes) || 0) / (Number(weeklyGoalMinutes) || 0)) * 100 : 0)).toFixed(1)}%
                </span>
            </div>
        </div>
    );
};

export default DashboardStudyTimeCard;