import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Dashboard.css';
import DashboardCalendar from "../components/DashboardCalendar";
import DashboardDday from "../components/DashboardDday";
import DashboardGrowth from "../components/DashboardGrowth";
import DashboardNotice from "../components/DashboardNotice";
import DashboardTodo from "../components/DashboardTodo";
import DashboardStudyTimeCard from "../components/DashboardStudyTimeCard";
import api from '../../../api/api';
import moment from 'moment';

function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // State lifted from children components
    const [todos, setTodos] = useState([]);
    const [examSchedules, setExamSchedules] = useState([]);

    const [weeklyGoalMinutes, setWeeklyGoalMinutes] = useState(20 * 60);
    const [todayGoalMinutes, setTodayGoalMinutes] = useState(Math.floor(weeklyGoalMinutes / 7));
    const [todayStudyMinutes, setTodayStudyMinutes] = useState(0);

    const [notices, setNotices] = useState([]);
    const [growth, setGrowth] = useState([]);

    // Fetching functions for lifted state
    const fetchTodos = useCallback(async () => {
        try {
            const response = await api.get('/dashboard/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    }, []);

    const fetchExamSchedules = useCallback(async () => {
        try {
            const response = await api.get('/dashboard/exams');
            if (response.data && response.data.success) {
                setExamSchedules(response.data.data || []);
            } else {
                setExamSchedules([]);
            }
        } catch (error) {
            console.error('Failed to fetch exam schedules:', error);
            setExamSchedules([]);
        }
    }, []);

    // Combined refresh function
    const refreshDashboardData = useCallback(() => {
        fetchTodos();
        fetchExamSchedules();
    }, [fetchTodos, fetchExamSchedules]);

    // Initial data fetch
    useEffect(() => {
        refreshDashboardData();
    }, [refreshDashboardData]);

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

    // Other state calculations and handlers remain the same...
    const weeklyGoalHour = Math.floor(weeklyGoalMinutes / 60);
    const weeklyGoalMin = weeklyGoalMinutes % 60;
    const todayGoalHour = Math.floor(todayGoalMinutes / 60);
    const todayGoalMin = todayGoalMinutes % 60;
    const todayStudyHour = Math.floor(todayStudyMinutes / 60);
    const todayStudyMin = todayStudyMinutes % 60;

    const todayRemainMinutes = Math.max(todayGoalMinutes - todayStudyMinutes, 0);
    const weekRemainMinutes = Math.max(weeklyGoalMinutes - todayStudyMinutes, 0);

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

            <div className="dashboard-board-grid">
                <DashboardCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    todos={todos} // Pass state down
                    examSchedules={examSchedules} // Pass state down
                />

                <div className="dashboard-right-panel">
                    <DashboardDday 
                        examSchedules={examSchedules} // Pass state down
                        onDataChange={refreshDashboardData} // Pass callback down
                    />
                    <DashboardTodo 
                        selectedDate={selectedDate} 
                        todos={todos} // Pass state down
                        onDataChange={refreshDashboardData} // Pass callback down
                    />
                </div>

                <div className="dashboard-notice-growth-panel">
                    <DashboardNotice notices={notices} />
                    <DashboardGrowth growth={growth} />
                </div>
                <DashboardStudyTimeCard
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
                    weeklyGoalMinutes={weeklyGoalMinutes}
                    todayGoalMinutes={todayGoalMinutes}
                    todayStudyMinutes={todayStudyMinutes}
                />
            </div>
        </div>
    );
}

export default Dashboard;