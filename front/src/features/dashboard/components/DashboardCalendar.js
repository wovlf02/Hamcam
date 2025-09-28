import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../styles/DashboardCalendar.css';

const DashboardCalendar = ({ selectedDate: propSelectedDate, setSelectedDate: propSetSelectedDate, todos = [], examSchedules = [] }) => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(propSelectedDate ? moment(propSelectedDate) : null);

    useEffect(() => {
        if (propSelectedDate) {
            setSelectedDate(moment(propSelectedDate));
        }
    }, [propSelectedDate]);

    const handleDateSelect = (date) => {
        const momentDate = moment(date);
        setSelectedDate(momentDate);
        if (propSetSelectedDate) {
            propSetSelectedDate(momentDate);
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
            const todosForDay = todos.filter(todo => 
                moment(todo.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
            );

            const examsForDay = Array.isArray(examSchedules) ? examSchedules.filter(exam => 
                moment(exam.exam_date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
            ) : [];

            days.push(
                <div
                    key={day.format('YYYY-MM-DD')}
                    className={`calendar-day ${day.month() !== currentDate.month() ? 'other-month' : ''} ${selectedDate && day.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD') ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(day)}
                >
                    <div className="day-number">{day.format('D')}</div>
                    <div className="day-todos">
                        {todosForDay.map(todo => (
                            <div key={todo.id} className={`todo-item priority-${todo.priority}`}>
                                {todo.title}
                            </div>
                        ))}
                        {examsForDay.map(exam => (
                            <div key={exam.id} className="todo-item exam-item">
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