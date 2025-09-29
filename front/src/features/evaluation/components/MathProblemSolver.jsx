import React, { useState, useEffect } from 'react';
import { mathProblems, generateEvaluationSet, generateEvaluationSetByGrade } from '../data/mathProblems';
import api from '../../../api/api';
import './MathProblemSolver.css';

const MathProblemSolver = ({ studentGrade = 3, problemCount = 10, useBackend = true }) => {
    const [currentProblem, setCurrentProblem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [problemSet, setProblemSet] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 백엔드에서 학년별 문제 불러오기
    const fetchProblemsByGrade = async (grade, count) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`학년 ${grade}에 대해 ${count}개 문제 요청`);
            
            const response = await api.get(`/api/math/problems/grade/${grade}?count=${count}`);
            console.log('백엔드 응답:', response.data);
            
            if (response.data && response.data.length > 0) {
                return response.data;
            } else {
                console.warn('백엔드에서 문제를 받아오지 못함, 로컬 데이터 사용');
                return generateEvaluationSetByGrade(grade, count);
            }
        } catch (error) {
            console.error('백엔드 문제 불러오기 실패:', error);
            console.log('로컬 데이터로 대체');
            return generateEvaluationSetByGrade(grade, count);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 문제 세트 생성
    useEffect(() => {
        const initializeProblems = async () => {
            let newProblemSet;
            
            if (useBackend) {
                newProblemSet = await fetchProblemsByGrade(studentGrade, problemCount);
            } else {
                newProblemSet = generateEvaluationSetByGrade(studentGrade, problemCount);
            }
            
            setProblemSet(newProblemSet);
            if (newProblemSet.length > 0) {
                setCurrentProblem(newProblemSet[0]);
                setStartTime(Date.now());
            }
        };
        
        initializeProblems();
    }, [studentGrade, problemCount, useBackend]);

    // 시간 측정
    useEffect(() => {
        if (startTime && !showResult) {
            const interval = setInterval(() => {
                setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [startTime, showResult]);

    // 답안 제출
    const handleSubmitAnswer = () => {
        if (!currentProblem || !userAnswer) {
            setFeedback('답을 입력해주세요.');
            return;
        }

        const isCorrect = userAnswer.trim() === currentProblem.correctAnswer;
        
        if (isCorrect) {
            setScore(score + 1);
            setFeedback('정답입니다! 🎉');
        } else {
            setFeedback(`오답입니다. 정답은 ${currentProblem.correctAnswer}번입니다.`);
        }

        setIsAnswered(true);

        // 백엔드로 답안 제출
        if (useBackend) {
            submitAnswerToServer(currentProblem.id, userAnswer, isCorrect);
        }
    };

    // 다음 문제로 이동
    const handleNextProblem = () => {
        if (currentIndex < problemSet.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentProblem(problemSet[nextIndex]);
            setUserAnswer('');
            setFeedback('');
            setIsAnswered(false);
        } else {
            // 마지막 문제 완료
            setShowResult(true);
        }
    };

    // 백엔드로 답안 제출
    const submitAnswerToServer = async (problemId, answer, isCorrect) => {
        try {
            const response = await api.post('/api/math/submit-answer', {
                problemId: problemId,
                submittedAnswer: answer,
                isCorrect: isCorrect,
                timeSpent: Math.floor((Date.now() - startTime) / 1000)
            });
            console.log('답안 제출 완료:', response.data);
        } catch (error) {
            console.error('답안 제출 실패:', error);
        }
    };

    // 문제 재시작
    const handleRestart = async () => {
        let newProblemSet;
        
        if (useBackend) {
            newProblemSet = await fetchProblemsByGrade(studentGrade, problemCount);
        } else {
            newProblemSet = generateEvaluationSetByGrade(studentGrade, problemCount);
        }
        
        setProblemSet(newProblemSet);
        if (newProblemSet.length > 0) {
            setCurrentProblem(newProblemSet[0]);
        }
        setCurrentIndex(0);
        setUserAnswer('');
        setFeedback('');
        setScore(0);
        setIsAnswered(false);
        setShowResult(false);
        setTimeSpent(0);
        setStartTime(Date.now());
    };

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 점수에 따른 등급 계산
    const getGrade = () => {
        const percentage = (score / problemSet.length) * 100;
        if (percentage >= 90) return { grade: 1, description: '최우수' };
        if (percentage >= 80) return { grade: 2, description: '우수' };
        if (percentage >= 70) return { grade: 3, description: '보통' };
        if (percentage >= 60) return { grade: 4, description: '노력 필요' };
        return { grade: 5, description: '더 많은 연습 필요' };
    };

    if (showResult) {
        const gradeInfo = getGrade();
        return (
            <div className="math-problem-solver">
                <div className="result-container">
                    <h2>🎯 평가 완료!</h2>
                    <div className="result-stats">
                        <div className="stat-item">
                            <span className="stat-label">점수</span>
                            <span className="stat-value">{score} / {problemSet.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">정답률</span>
                            <span className="stat-value">{Math.round((score / problemSet.length) * 100)}%</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">소요 시간</span>
                            <span className="stat-value">{formatTime(timeSpent)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">등급</span>
                            <span className={`stat-value grade-${gradeInfo.grade}`}>
                                {gradeInfo.grade}등급 ({gradeInfo.description})
                            </span>
                        </div>
                    </div>
                    <div className="result-actions">
                        <button onClick={handleRestart} className="btn-primary">
                            다시 도전하기
                        </button>
                        <button onClick={() => window.location.href = '/evaluation'} className="btn-secondary">
                            평가 메인으로
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 로딩 상태 처리
    if (loading) {
        return (
            <div className="math-problem-solver">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h3>🧮 수학 문제를 준비하고 있습니다...</h3>
                    <p>학년 {studentGrade}에 맞는 {problemCount}개의 문제를 불러오는 중입니다.</p>
                </div>
            </div>
        );
    }

    // 에러 상태 처리
    if (error) {
        return (
            <div className="math-problem-solver">
                <div className="error-container">
                    <h3>❌ 문제를 불러오는 중 오류가 발생했습니다</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (!currentProblem) {
        return <div className="loading">문제를 불러오는 중...</div>;
    }

    return (
        <div className="math-problem-solver">
            <div className="problem-header">
                <div className="problem-info">
                    <span className="problem-number">
                        문제 {currentIndex + 1} / {problemSet.length}
                    </span>
                    <span className="exam-info">
                        {currentProblem.examMonthYear.replace('_', '년 ')}월 모의평가
                    </span>
                    <span className="subject-info">
                        {currentProblem.subject} - {currentProblem.subjectDetail}
                    </span>
                </div>
                <div className="timer">
                    ⏱️ {formatTime(timeSpent)}
                </div>
            </div>

            <div className="problem-content">
                <div className="difficulty-badge difficulty-{currentProblem.difficulty}">
                    난이도: {currentProblem.getDifficultyDescription?.() || 
                             currentProblem.difficultyGrade + '등급'}
                </div>
                
                <div className="problem-image">
                    <img 
                        src={`/math_image/${currentProblem.type === 'MULTIPLE_CHOICE' ? '객관식' : '단답형'}/${currentProblem.examMonthYear}_수학_${currentProblem.problemNumber}번_${currentProblem.subject}.png`}
                        alt={`${currentProblem.examMonthYear} ${currentProblem.problemNumber}번 문제`}
                        onError={(e) => {
                            console.error('이미지 로드 실패:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div className="image-fallback" style={{display: 'none'}}>
                        <p>문제 이미지를 불러올 수 없습니다.</p>
                        <p>경로: /math_image/{currentProblem.type === 'MULTIPLE_CHOICE' ? '객관식' : '단답형'}/{currentProblem.examMonthYear}_수학_{currentProblem.problemNumber}번_{currentProblem.subject}.png</p>
                    </div>
                </div>

                <div className="answer-section">
                    {currentProblem.type === 'MULTIPLE_CHOICE' ? (
                        // 객관식 문제 - 선택형 버튼
                        <div className="multiple-choice-section">
                            <label>답을 선택하세요:</label>
                            <div className="choice-buttons">
                                {[1, 2, 3, 4, 5].map(choice => (
                                    <button
                                        key={choice}
                                        className={`choice-btn ${userAnswer === choice.toString() ? 'selected' : ''}`}
                                        onClick={() => setUserAnswer(choice.toString())}
                                        disabled={isAnswered}
                                    >
                                        {choice}번
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // 단답형 문제 - 자유 입력
                        <div className="short-answer-section">
                            <label htmlFor="userAnswer">답:</label>
                            <input
                                type="text"
                                id="userAnswer"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="답을 입력하세요 (숫자만)"
                                disabled={isAnswered}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !isAnswered) {
                                        handleSubmitAnswer();
                                    }
                                }}
                            />
                        </div>
                    )}
                    
                    {!isAnswered ? (
                        <button 
                            onClick={handleSubmitAnswer}
                            className="btn-submit"
                            disabled={!userAnswer}
                        >
                            제출
                        </button>
                    ) : (
                        <button 
                            onClick={handleNextProblem}
                            className="btn-next"
                        >
                            {currentIndex < problemSet.length - 1 ? '다음 문제' : '결과 보기'}
                        </button>
                    )}
                </div>

                {feedback && (
                    <div className={`feedback ${isAnswered ? 'show' : ''}`}>
                        {feedback}
                    </div>
                )}
            </div>

            <div className="progress-bar">
                <div 
                    className="progress-fill"
                    style={{ width: `${((currentIndex + 1) / problemSet.length) * 100}%` }}
                ></div>
            </div>

            <div className="score-display">
                현재 점수: {score} / {currentIndex + (isAnswered ? 1 : 0)}
            </div>
        </div>
    );
};

export default MathProblemSolver;