import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import moment from 'moment';

const DashboardDday = () => {
    const [examTitle, setExamTitle] = useState('');
    const [examDate, setExamDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [examList, setExamList] = useState([]);

    // ✅ D-Day 계산
    const calculateDday = (date) => {
        if (!date) return 0;
        const today = new Date();
        const target = new Date(date);
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);
        return Math.floor((target - today) / (1000 * 60 * 60 * 24));
    };

    // ✅ 시험 목록 조회
    const fetchExamList = async () => {
        try {
            const response = await api.get('/dashboard/exams');
            if (response.data.success) {
                const examList = response.data.data;
                setExamList(examList);
            }
        } catch (error) {
            console.error('시험 일정 조회 실패:', error);
        }
    };

    // ✅ 최초 로딩 시 시험 정보 요청
    useEffect(() => {
        fetchExamList();
    }, []);

    // ✅ 시험 설정 열기
    const openExamSetting = () => {
        setShowModal(true);
    };

    // ✅ 서버로 시험 정보 저장
    const saveExamSetting = async () => {
        if (!examTitle || !examDate) {
            alert('제목과 시험일을 모두 입력해주세요.');
            return;
        }

        const formattedDate = moment(examDate).format('YYYY-MM-DD');
        console.log('Original date:', examDate);
        console.log('Formatted date:', formattedDate);

        const requestData = {
            title: examTitle,
            exam_date: formattedDate,
            description: "",
            location: ""
        };

        console.log('Request data:', requestData);

        try {
            const response = await api.post('/dashboard/exams/register', requestData);
            console.log('Server response:', response.data);
            
            if (response.data.success) {
                setShowModal(false);
                setExamTitle('');
                setExamDate('');
                await fetchExamList(); // 시험 목록 새로고침
            } else {
                console.error('시험 등록 실패:', response.data);
            }
        } catch (error) {
            console.error('시험 등록 실패:', error);
        }
    };

    // ✅ 시험 삭제
    const deleteExam = async (examId) => {
        if (!window.confirm('정말로 이 시험 일정을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await api.delete(`/dashboard/exams/${examId}`);
            if (response.data.success) {
                await fetchExamList(); // 시험 목록 새로고침
            } else {
                alert(response.data.message || '시험 일정 삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('📅 시험 일정 삭제 실패:', err);
            alert('시험 일정 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="dashboard-dday">
            <div className="dashboard-todo-header">
                <h3>시험 일정</h3>
                <button onClick={() => setShowModal(true)}>
                    + 새 시험
                </button>
            </div>
            <div className="exam-list">
                {examList.length > 0 ? (
                    examList.map((exam) => (
                        <div key={exam.id} className={`exam-item ${calculateDday(exam.exam_date) < 0 ? 'past-exam' : ''}`}>
                            <span className="exam-title">{exam.title}</span>
                            <span className="exam-date">{moment(exam.exam_date).format('YYYY-MM-DD')}</span>
                            <span className={`d-day-badge ${calculateDday(exam.exam_date) === 0 ? 'd-day-zero' : ''}`}>
                                {calculateDday(exam.exam_date) > 0
                                    ? `D-${calculateDday(exam.exam_date)}`
                                    : calculateDday(exam.exam_date) === 0
                                        ? 'D-DAY'
                                        : `D+${Math.abs(calculateDday(exam.exam_date))}`}
                            </span>
                            <button
                                className="delete-button"
                                onClick={() => deleteExam(exam.id)}
                            >
                                삭제
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-exam">
                        <p>등록된 시험 일정이 없습니다.</p>
                        <p className="no-exam-sub">시험 일정을 추가하여 D-Day를 관리해보세요.</p>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="dashboard-modal">
                    <h3>시험 일정 추가</h3>
                    <div className="dashboard-modal-content">
                        <div className="dashboard-modal-input-group"> {/* Added input-group for consistency */}
                            <input
                                type="text"
                                value={examTitle}
                                onChange={(e) => setExamTitle(e.target.value)}
                                placeholder="예: 중간고사"
                            />
                        </div>
                        <div className="dashboard-modal-input-group"> {/* Added input-group for consistency */}
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                min={moment().format('YYYY-MM-DD')}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={saveExamSetting}>추가</button> {/* Changed text to '추가' for consistency */}
                            <button onClick={() => { // Removed class names, will be styled by .modal-buttons button
                                setShowModal(false);
                                setExamTitle('');
                                setExamDate('');
                            }}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardDday;
