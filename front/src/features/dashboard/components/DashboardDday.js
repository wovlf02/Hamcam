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
            <div className="dday-header">
                <h2>시험 일정</h2>
                <button className="add-exam-button" onClick={() => setShowModal(true)}>
                    + 시험 일정 추가
                </button>
            </div>
            <div className="exam-list">
                {examList.length > 0 ? (
                    <div className="exam-grid">
                        {examList.map((exam) => (
                                                        <div key={exam.id} className={`exam-item ${calculateDday(exam.exam_date) < 0 ? 'past-exam' : ''}`}>
                                                            <div className="exam-info">
                                                                <div className="exam-title-section">
                                                                    <span className="exam-title">{exam.title}</span>
                                                                </div>
                                                                <div className="exam-date-section">
                                                                    <span className="exam-date">
                                                                        {moment(exam.exam_date).format('YYYY년 MM월 DD일')}
                                                                    </span>
                                                                                                            <span className={`d-day ${calculateDday(exam.exam_date) === 0 ? 'd-day-zero' : ''}`}>
                                                                                                                {calculateDday(exam.exam_date) > 0
                                                                                                                    ? `D-${calculateDday(exam.exam_date)}`
                                                                                                                    : calculateDday(exam.exam_date) === 0
                                                                                                                        ? 'D-DAY'
                                                                                                                        : `D+${Math.abs(calculateDday(exam.exam_date))}`}
                                                                                                            </span>                                                                </div>
                                                            </div>
                                                            <button
                                                                className="delete-button"
                                                                onClick={() => deleteExam(exam.id)}
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>                        ))}
                    </div>
                ) : (
                    <div className="no-exam">
                        <p>등록된 시험 일정이 없습니다.</p>
                        <p className="no-exam-sub">시험 일정을 추가하여 D-Day를 관리해보세요.</p>
                    </div>
                )}
            </div>
            {showModal && (
                <div className="dashboard-modal-overlay">
                    <div className="dashboard-modal-card">
                        <h3>시험 일정 추가</h3>
                        <div className="dashboard-modal-content">
                            <div className="dashboard-modal-row">
                                <label>시험명</label>
                                <input
                                    type="text"
                                    value={examTitle}
                                    onChange={(e) => setExamTitle(e.target.value)}
                                    placeholder="예: 중간고사"
                                />
                            </div>
                            <div className="dashboard-modal-row">
                                <label>시험 날짜</label>
                                <input
                                    type="date"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    min={moment().format('YYYY-MM-DD')}
                                />
                            </div>
                        </div>
                        <div className="dashboard-modal-buttons">
                            <button className="cancel-button" onClick={() => {
                                setShowModal(false);
                                setExamTitle('');
                                setExamDate('');
                            }}>취소</button>
                            <button className="save-button" onClick={saveExamSetting}>저장</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardDday;
