import React, { useState, useMemo, useEffect } from 'react';
import moment from 'moment';
import api from '../../../api/api';
import '../styles/DashboardTodo.css';

const DashboardTodo = ({ todos, onDataChange, onItemClick, selectedDate }) => {
    const [newTodo, setNewTodo] = useState('');
    const [description, setDescription] = useState('');
    const [newTodoDate, setNewTodoDate] = useState('');
    const [priority, setPriority] = useState('NORMAL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortPriorityOrder, setSortPriorityOrder] = useState('DESC'); // 'DESC', 'ASC'

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null); // State to hold the todo being edited

    const handleAddTodo = async () => {
        if (!newTodo.trim()) {
            alert('할일을 입력해주세요.');
            return;
        }

        try {
            const todoData = {
                title: newTodo,
                description: description,
                date: newTodoDate,
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
        e.stopPropagation(); // Prevent event from bubbling up to parent div
        e.preventDefault();  // Prevent default checkbox behavior (if any propagates)
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

    const handleDeleteTodo = async (e, todoId) => {
        e.stopPropagation(); // Prevent modal from opening
        if (!window.confirm('정말로 이 할일을 삭제하시겠습니까?')) {
            return;
        }
        try {
            await api.post('/dashboard/todos/delete', { todoId: todoId });
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('할일 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleEditTodo = (e, todo) => {
        e.stopPropagation(); // Prevent modal from opening
        setEditingTodo(todo);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTodo(null);
    };

    const handleUpdateTodo = async (updatedTodo) => {
        try {
            const requestData = {
                todoId: updatedTodo.id,
                title: updatedTodo.title,
                description: updatedTodo.description,
                todoDate: updatedTodo.date,
                priority: updatedTodo.priority
            };
            await api.put('/dashboard/todos', requestData);
            if (onDataChange) {
                onDataChange();
            }
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('할일 수정 중 오류가 발생했습니다.');
        }
    };

    const sortedTodos = useMemo(() => {
        const filtered = todos.filter(todo => moment(todo.date).isSame(selectedDate, 'day'));
        const priorityOrder = { 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };

        if (sortPriorityOrder === 'DESC') {
            return filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        } else if (sortPriorityOrder === 'ASC') {
            return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else {
            return filtered;
        }
    }, [todos, selectedDate, sortPriorityOrder]);

    return (
        <div className="dashboard-todo">
            <div className="dashboard-todo-header">
                <h3>{moment(selectedDate).format('MM월 DD일')} 할일</h3>

                <div className="todo-header-controls">
                    <button
                        className={`priority-sort-toggle ${sortPriorityOrder !== 'NONE' ? 'active' : ''}`}
                        onClick={() => {
                            if (sortPriorityOrder === 'DESC') {
                                setSortPriorityOrder('ASC');
                            } else {
                                setSortPriorityOrder('DESC');
                            }
                        }}
                    >
                        {sortPriorityOrder === 'DESC' && '중요도순 ▼'}
                        {sortPriorityOrder === 'ASC' && '중요도순 ▲'}
                    </button>
                    <button onClick={() => {
                        setNewTodoDate(moment(selectedDate).format('YYYY-MM-DD'));
                        setIsModalOpen(true);
                    }}>+ 새 할일</button>
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
                                value={newTodoDate}
                                onChange={(e) => setNewTodoDate(e.target.value)}
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
                        <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`} onClick={(e) => {
                            if (e.target.type !== 'checkbox') {
                                onItemClick(todo);
                            }
                        }}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={(e) => handleToggleTodo(e, todo.id)}
                            />
                            <span className="todo-title">{todo.title}</span>
                            <span className={`priority-badge ${todo.priority.toLowerCase()}`}>
                                {todo.priority}
                            </span>
                            <div className="todo-actions">
                                <button onClick={(e) => handleEditTodo(e, todo)} className="edit-button">수정</button>
                                <button onClick={(e) => handleDeleteTodo(e, todo.id)} className="delete-button">삭제</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Todo Modal */}
            {isEditModalOpen && editingTodo && (
                <EditTodoModal
                    todo={editingTodo}
                    onClose={handleCloseEditModal}
                    onUpdate={handleUpdateTodo}
                />
            )}
        </div>
    );
};

// EditTodoModal Component (placeholder - will be defined separately or inline)
const EditTodoModal = ({ todo, onClose, onUpdate }) => {
    const [editedTitle, setEditedTitle] = useState(todo.title);
    const [editedDescription, setEditedDescription] = useState(todo.description || '');
    const [editedDate, setEditedDate] = useState(moment(todo.date).format('YYYY-MM-DD'));
    const [editedPriority, setEditedPriority] = useState(todo.priority);

    const handleSubmit = () => {
        onUpdate({
            ...todo,
            title: editedTitle,
            description: editedDescription,
            date: editedDate,
            priority: editedPriority
        });
    };

    return (
        <div className="dashboard-modal">
            <div className="dashboard-modal-content">
                <h3>할일 수정</h3>
                <div className="dashboard-modal-input-group">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="할 일을 입력하세요"
                    />
                    <select
                        value={editedPriority}
                        onChange={(e) => setEditedPriority(e.target.value)}
                        className="priority-select"
                    >
                        <option value="LOW">낮음</option>
                        <option value="NORMAL">보통</option>
                        <option value="HIGH">높음</option>
                    </select>
                </div>
                <div className="dashboard-modal-input-group">
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="설명 (선택 사항)"
                        className="dashboard-modal-textarea"
                    />
                </div>
                <div className="date-picker">
                    <input
                        type="date"
                        value={editedDate}
                        onChange={(e) => setEditedDate(e.target.value)}
                    />
                </div>
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>수정</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default DashboardTodo;
