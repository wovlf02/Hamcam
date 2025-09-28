import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import DashboardCalendar from "../components/DashboardCalendar";
import DashboardDday from "../components/DashboardDday";
import DashboardGrowth from "../components/DashboardGrowth";
import DashboardNotice from "../components/DashboardNotice";
import DashboardTimeDetail from "../components/DashboardTimeDetail";
import DashboardTodo from "../components/DashboardTodo";
import api from '../../../api/api';
import moment from 'moment';

function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [highlightedDates, setHighlightedDates] = useState([]);

    const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(20 * 60);
    const [todayGoalMinutes, setTodayGoalMinutes] = useState(Math.floor(weeklyGoalMinutes / 7));
    const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);

    const [showTimeDetail, setShowTimeDetail] = useState(false);

    const [notices, setNotices] = useState([]);
    const [growth, setGrowth] = useState([]);

    // ✅ 시/분 분리
    const weeklyGoalHour = Math.floor(weeklyGoalMinutes / 60);
    const weeklyGoalMin = weeklyGoalMinutes % 60;
    const todayGoalHour = Math.floor(todayGoalMinutes / 60);
    const todayGoalMin = todayGoalMinutes % 60;
    const todayStudyHour = Math.floor(todayStudyMinutes / 60);
    const todayStudyMin = todayStudyMinutes % 60;

    const todayRemainMinutes = Math.max(todayGoalMinutes - todayStudyMinutes, 0);
    const weekRemainMinutes = Math.max(weeklyGoalMinutes - todayStudyMinutes, 0);

    // ✅ 캘린더 일정 하이라이트
    useEffect(() => {
        const fetchCalendarHighlights = async () => {
            try {
                const res = await api.post('/dashboard/calendar', {
                    month: moment(selectedDate).format('YYYY-MM')
                });
                const dates = res.data.map(event => event.date);
                setHighlightedDates(dates);
            } catch (err) {
                console.error("📅 캘린더 일정 조회 실패:", err);
            }
        };

        fetchCalendarHighlights();
    }, [selectedDate]);

    // ✅ 공지사항 불러오기
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await api.get('/dashboard/notices');
                setNotices(res.data);
            } catch (err) {
                console.error("📢 공지사항 조회 실패:", err);
            }
        };
        fetchNotices();
    }, []);

    // ✅ 주간 성장률 불러오기
    useEffect(() => {
        const fetchGrowth = async () => {
            try {
                const res = await api.post('/dashboard/stats/weekly');
                const subjectGrowth = res.data?.subjectGrowth || [];
                setGrowth(subjectGrowth);
            } catch (err) {
                console.error("📈 주간 성장률 조회 실패:", err);
            }
        };
        fetchGrowth();
    }, []);

    // ✅ 목표 시간 핸들러
    const handleWeeklyGoalChange = (type, value) => {
        const hour = type === 'hour' ? Number(value) : Math.floor(weeklyGoalMinutes / 60);
        const min = type === 'min' ? Number(value) : weeklyGoalMinutes % 60;
        setWeeklyGoalMinutes(hour * 60 + min);
    };

    const handleTodayGoalChange = (type, value) => {
        const hour = type === 'hour' ? Number(value) : Math.floor(todayGoalMinutes / 60);
        const min = type === 'min' ? Number(value) : todayGoalMinutes % 60;
        setTodayGoalMinutes(hour * 60 + min);
    };

    const handleTodayStudyChange = (type, value) => {
        const hour = type === 'hour' ? Number(value) : Math.floor(todayStudyMinutes / 60);
        const min = type === 'min' ? Number(value) : todayStudyMinutes % 60;
        setTodayStudyMinutes(hour * 60 + min);
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-main-title">학습 대시보드</h2>

            {/* ✅ D-Day 영역 */}
            <div>
                <DashboardDday />
            </div>

            <div className="dashboard-board-grid">
                <DashboardCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    highlightedDates={highlightedDates}
                />

                {/* ✅ 공부 시간 박스 */}
                <div className="dashboard-card dashboard-study-time-card">
                    <div className="card-title">공부 시간</div>
                    <div className="study-time-item">오늘 공부한 시간: <span className="study-time-value">{todayStudyHour}시간 {todayStudyMin}분</span></div>
                    <div className="study-time-item">오늘 목표 시간: <span className="study-time-value">{todayGoalHour}시간 {todayGoalMin}분</span></div>
                    <div className="study-time-item">주간 목표 시간: <span className="study-time-value">{weeklyGoalHour}시간 {weeklyGoalMin}분</span></div>
                    <button className="btn-primary" onClick={() => setShowTimeDetail(true)}>
                        상세 설정
                    </button>
                </div>

                {/* ✅ 상세 설정 모달 */}
                {showTimeDetail && (
                    <DashboardTimeDetail
                        weeklyGoalHour={weeklyGoalHour}
                        weeklyGoalMin={weeklyGoalMin}
                        todayGoalHour={todayGoalHour}
                        todayGoalMin={todayGoalMin}
                        todayStudyHour={todayStudyHour}
                        todayStudyMin={todayStudyMin}
                        todayRemainMinutes={todayRemainMinutes}
                        weekRemainMinutes={weekRemainMinutes}
                        handleWeeklyGoalChange={handleWeeklyGoalChange}
                        handleTodayGoalChange={handleTodayGoalChange}
                        handleTodayStudyChange={handleTodayStudyChange}
                        setShowTimeDetail={setShowTimeDetail}
                        weeklyGoalMinutes={weeklyGoalMinutes}
                        todayGoalMinutes={todayGoalMinutes}
                    />
                )}

                <DashboardTodo selectedDate={selectedDate} />
                <DashboardNotice notices={notices} />
                <DashboardGrowth growth={growth} />
            </div>
        </div>
    );
}

export default Dashboard;
