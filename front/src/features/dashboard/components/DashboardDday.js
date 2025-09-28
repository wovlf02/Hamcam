import React, { useState } from 'react';
import moment from 'moment';
import api from '../../../api/api';
import '../styles/DashboardTodo.css';

const DashboardDday = ({ examSchedules, onDataChange, onItemClick }) => {
    const [newExamTitle, setNewExamTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null); // State to hold the exam being edited

    const handleAddExam = async () => {
        if (!newExamTitle.trim()) {
            alert('시험 이름을 입력해주세요.');
            return;
        }

        try {
            const formattedDate = moment(selectedDate).format('YYYY-MM-DD');

            const examData = {
                title: newExamTitle,
                description: description,
                exam_date: formattedDate,
            };

            const response = await api.post('/dashboard/exams/register', examData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setNewExamTitle('');
                setDescription('');
                setIsModalOpen(false);
                if (onDataChange) {
                    onDataChange();
                }
            } else {
                alert(response.data.message || '시험 일정 추가 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error adding exam schedule:', error);
            alert(error.response?.data?.message || '시험 일정 추가 중 오류가 발생했습니다.');
        }
    };

    const calculateDday = (date) => {
        if (!date) return 0;
        const today = moment().startOf('day');
        const target = moment(date).startOf('day');
        return target.diff(today, 'days');
    };

    const handleDeleteExam = async (e, examId) => {
        e.stopPropagation(); // Prevent modal from opening
        if (!window.confirm('정말로 이 시험 일정을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await api.delete(`/dashboard/exams/${examId}`);
            if (response.data.success) {
                if (onDataChange) {
                    onDataChange();
                }
            } else {
                alert(response.data.message || '시험 일정 삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('📅 시험 일정 삭제 실패:', err);
            alert('시험 일정 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleEditExam = (e, exam) => {
        e.stopPropagation(); // Prevent modal from opening
        setEditingExam(exam);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingExam(null);
    };

    const handleUpdateExam = async (updatedExam) => {
        try {
            const requestData = {
                id: updatedExam.id,
                title: updatedExam.title,
                description: updatedExam.description,
                examDate: updatedExam.exam_date, // Assuming 'exam_date' in frontend maps to 'examDate' in backend
            };
            // Assuming there's a PUT /dashboard/exams endpoint for updating exams
            await api.put('/dashboard/exams', requestData);
            if (onDataChange) {
                onDataChange();
            }
            handleCloseEditModal();
        } catch (error) {
            console.error('Error updating exam schedule:', error);
            alert('시험 일정 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="dashboard-todo">
            <div className="dashboard-todo-header">
                <h3>시험 일정</h3>
                <button onClick={() => setIsModalOpen(true)}>+ 새 시험</button>
            </div>

            {isModalOpen && (
                <div className="dashboard-modal">
                    <div className="dashboard-modal-content">
                        <h3>시험 일정 추가</h3>
                        <div className="dashboard-modal-input-group">
                            <input
                                type="text"
                                value={newExamTitle}
                                onChange={(e) => setNewExamTitle(e.target.value)}
                                placeholder="시험 이름을 입력하세요"
                            />
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
                            <button onClick={handleAddExam}>추가</button>
                            <button onClick={() => setIsModalOpen(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="todo-list">
                {examSchedules.length === 0 ? (
                    <div className="no-todos">등록된 시험 일정이 없습니다.</div>
                ) : (
                    examSchedules.map((exam) => {
                        const dDay = calculateDday(exam.exam_date);
                        const isPastExam = dDay < 0;
                        return (
                            <div key={exam.id} className={`todo-item ${isPastExam ? 'completed' : ''}`} onClick={() => onItemClick(exam)}>
                                <span className="todo-title">{exam.title}</span>
                                <span className="todo-date">{moment(exam.exam_date).format('YYYY-MM-DD')}</span>
                                <span className={`priority-badge ${dDay === 0 ? 'high' : (dDay > 0 && dDay <= 7 ? 'normal' : 'low')}`}>
                                    {dDay > 0 ? `D-${dDay}` : (dDay === 0 ? 'D-DAY' : `D+${Math.abs(dDay)}`)}
                                </span>
                                <div className="todo-actions">
                                    <button onClick={(e) => handleEditExam(e, exam)} className="edit-button">수정</button>
                                    <button
                                        className="delete-button"
                                        onClick={(e) => handleDeleteExam(e, exam.id)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Edit Exam Modal */}
            {isEditModalOpen && editingExam && (
                <EditExamModal
                    exam={editingExam}
                    onClose={handleCloseEditModal}
                    onUpdate={handleUpdateExam}
                />
            )}
        </div>
    );
};

// EditExamModal Component (placeholder - will be defined separately or inline)
const EditExamModal = ({ exam, onClose, onUpdate }) => {
    const [editedTitle, setEditedTitle] = useState(exam.title);
    const [editedDescription, setEditedDescription] = useState(exam.description || '');
    const [editedExamDate, setEditedExamDate] = useState(moment(exam.exam_date).format('YYYY-MM-DD'));

    const handleSubmit = () => {
        onUpdate({
            ...exam,
            title: editedTitle,
            description: editedDescription,
            exam_date: editedExamDate,
        });
    };

    return (
        <div className="dashboard-modal">
            <div className="dashboard-modal-content">
                <h3>시험 일정 수정</h3>
                <div className="dashboard-modal-input-group">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        placeholder="시험 이름을 입력하세요"
                    />
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
                        value={editedExamDate}
                        onChange={(e) => setEditedExamDate(e.target.value)}
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

export default DashboardDday;