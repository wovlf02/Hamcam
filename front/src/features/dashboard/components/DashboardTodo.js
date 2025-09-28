import React, { useState, useMemo } from 'react';
import moment from 'moment';
import api from '../../../api/api';
import '../styles/DashboardTodo.css';

const DashboardTodo = ({ todos, onDataChange, onItemClick }) => {
    const [newTodo, setNewTodo] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [priority, setPriority] = useState('NORMAL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('NEWEST'); // NEW: State for sorting order

    const handleAddTodo = async () => {
        if (!newTodo.trim()) {
            alert('할일을 입력해주세요.');
            return;
        }

        try {
            const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

            const todoData = {
                title: newTodo,
                description: description,
                date: formattedDate,
                priority: priority
            };

            await api.post('/dashboard/todos', todoData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setNewTodo('');
            setDescription('');
            setIsModalOpen(false);
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            console.error('Error adding todo:', error);
            alert(error.response?.data?.message || '할일 추가 중 오류가 발생했습니다.');
        }
    };

    const handleToggleTodo = async (e, todoId) => {
        e.stopPropagation(); // Prevent modal from opening
        try {
            const requestData = { todoId: Number(todoId) };
            await api.put('/dashboard/todos/complete', requestData);
            
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            console.error('Error toggling todo:', error);
            alert('할일 상태 변경 중 오류가 발생했습니다.');
        }
    };

    // NEW: Memoized sorted todos
    const sortedTodos = useMemo(() => {
        const sorted = [...todos];
        switch (sortOrder) {
            case 'NEWEST':
                return sorted.sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf());
            case 'OLDEST':
                return sorted.sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
            case 'PRIORITY':
                const priorityOrder = { 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
                return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            default:
                return sorted;
        }
    }, [todos, sortOrder]);

    return (
        <div className="dashboard-todo">
            <div className="dashboard-todo-header">
                <h3>할일 목록</h3>
                <div className="todo-header-controls">
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="todo-sort-select">
                        <option value="NEWEST">최신순</option>
                        <option value="OLDEST">오래된순</option>
                        <option value="PRIORITY">중요도순</option>
                    </select>
                    <button onClick={() => setIsModalOpen(true)}>+ 새 할일</button>
                </div>
            </div>

            {isModalOpen && (
                <div className="dashboard-modal">
                    <div className="dashboard-modal-content">
                        <h3>할일 추가</h3>
                        <div className="dashboard-modal-input-group">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="할 일을 입력하세요"
                            />
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="priority-select"
                            >
                                <option value="LOW">낮음</option>
                                <option value="NORMAL">보통</option>
                                <option value="HIGH">높음</option>
                            </select>
                        </div>
                        <div className="dashboard-modal-input-group">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="설명 (선택 사항)"
                                className="dashboard-modal-textarea"
                            />
                        </div>
                        <div className="date-picker">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleAddTodo}>추가</button>
                            <button onClick={() => setIsModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="todo-list">
                {sortedTodos.length === 0 ? (
                    <div className="no-todos">등록된 할일이 없습니다.</div>
                ) : (
                    sortedTodos.map((todo) => (
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`} onClick={() => onItemClick(todo)}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={(e) => handleToggleTodo(e, todo.id)}
                            />
                            <span className="todo-title">{todo.title}</span>
                            <span className={`priority-badge ${todo.priority.toLowerCase()}`}>
                                {todo.priority}
                            </span>
                            <span className="todo-date">{moment(todo.date).format('YYYY-MM-DD')}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DashboardTodo;