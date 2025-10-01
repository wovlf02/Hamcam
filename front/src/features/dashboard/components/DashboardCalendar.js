import React, { useState } from 'react';
import moment from 'moment';
import '../styles/DashboardCalendar.css';

const DashboardCalendar = ({ selectedDate, setSelectedDate, todos = [], examSchedules = [], onItemClick }) => {
    const [currentDate, setCurrentDate] = useState(moment());

    const handleDateSelect = (date) => {
        if (setSelectedDate) {
            setSelectedDate(date.toDate()); // Pass Date object up to parent
        }
    };

    const renderCalendar = () => {
        const startOfMonth = currentDate.clone().startOf('month');
        const endOfMonth = currentDate.clone().endOf('month');
        const startDate = startOfMonth.clone().startOf('week');
        const endDate = endOfMonth.clone().endOf('week');
        const days = [];
        let day = startDate;

        while (day <= endDate) {
            const currentDay = day.clone(); // Important for the onClick closure
            const todosForDay = todos.filter(todo => 
                moment(todo.date).isSame(currentDay, 'day')
            );

            const examsForDay = Array.isArray(examSchedules) ? examSchedules.filter(exam => 
                moment(exam.exam_date).isSame(currentDay, 'day')
            ) : [];

            days.push(
                <div
                    key={currentDay.format('YYYY-MM-DD')}
                    className={`calendar-day ${currentDay.month() !== currentDate.month() ? 'other-month' : ''} ${selectedDate && moment(selectedDate).isSame(currentDay, 'day') ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(currentDay)}
                >
                    <div className="day-number">{currentDay.format('D')}</div>
                    <div className="day-todos">
                        {todosForDay.map(todo => (
                            <div key={todo.id} className={`todo-item priority-${todo.priority}`} onClick={(e) => { e.stopPropagation(); onItemClick(todo); }}>
                                <span className="todo-icon">✓</span>
                                {todo.title}
                            </div>
                        ))}
                        {examsForDay.map(exam => (
                            <div key={exam.id} className="todo-item exam-item" onClick={(e) => { e.stopPropagation(); onItemClick(exam); }}>
                                <span className="exam-icon">📝</span>
                                {exam.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
            day = day.clone().add(1, 'day');
        }

        return days;
    };

    return (
        <div className="dashboard-calendar">
            <div className="calendar-header">
                <button onClick={() => setCurrentDate(currentDate.clone().subtract(1, 'month'))}>
                    &lt;
                </button>
                <h2>{currentDate.format('YYYY년 MM월')}</h2>
                <button onClick={() => setCurrentDate(currentDate.clone().add(1, 'month'))}>
                    &gt;
                </button>
            </div>
            <div className="calendar-weekdays">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
            <div className="calendar-grid">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default DashboardCalendar;