import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRandomMathProblems } from '../data/mathProblems';
import '../styles/MathEvaluationStart.css';

const MathEvaluationStart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { unitName = '수학', subject = '수학' } = location.state || {};

    const [problems, setProblems] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(1800); // 30분
    const [showConfirm, setShowConfirm] = useState(false);

    // 문제 초기화
    useEffect(() => {
        const selectedProblems = getRandomMathProblems(10);
        setProblems(selectedProblems);
    }, []);

    // 타이머 설정
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // 키보드 입력 처리 (1-5 숫자키)
    useEffect(() => {
        const handleKeyPress = (e) => {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 5) {
                handleAnswer(num.toString());
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIdx]);

    // 답안 선택
    const handleAnswer = (answer) => {
        setAnswers(prev => ({
            ...prev,
            [currentIdx]: answer
        }));
    };

    // 다음 문제로 이동
    const goNext = () => {
        if (currentIdx < problems.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    // 이전 문제로 이동
    const goPrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    // 특정 문제로 이동
    const goToQuestion = (index) => {
        setCurrentIdx(index);
    };

    // 제출 처리
    const handleSubmit = () => {
        const unansweredQuestions = problems
            .map((_, index) => index)
            .filter(index => !answers[index]);

        if (unansweredQuestions.length > 0) {
            setShowConfirm(true);
            return;
        }

        submitEvaluation();
    };

    // 강제 제출
    const handleForceSubmit = () => {
        setShowConfirm(false);
        submitEvaluation();
    };

    // 평가 제출 및 결과 계산
    const submitEvaluation = () => {
        let correctCount = 0;
        let easyCorrect = 0, mediumCorrect = 0, hardCorrect = 0;

        const results = problems.map((problem, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === problem.correctAnswer;
            
            if (isCorrect) {
                correctCount++;
                switch (problem.difficulty) {
                    case 'easy':
                        easyCorrect++;
                        break;
                    case 'medium':
                        mediumCorrect++;
                        break;
                    case 'hard':
                        hardCorrect++;
                        break;
                }
            }

            return {
                ...problem,
                userAnswer: userAnswer || '미답',
                isCorrect
            };
        });

        const score = Math.round((correctCount / problems.length) * 100);
        
        // 결과 페이지로 이동
        navigate('/math-evaluation/result', {
            state: {
                results,
                score,
                correctCount,
                totalCount: problems.length,
                difficultyScores: {
                    easy: { correct: easyCorrect, total: 3 },
                    medium: { correct: mediumCorrect, total: 4 },
                    hard: { correct: hardCorrect, total: 3 }
                },
                unitName,
                subject
            }
        });
    };

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 로딩 중
    if (problems.length === 0) {
        return (
            <div className="math-eval-loading">
                <div>수학 문제를 준비하고 있습니다...</div>
            </div>
        );
    }

    const currentProblem = problems[currentIdx];

    return (
        <div className="math-eval-container">
            {/* 사이드바 - 문제 네비게이션 */}
            <div className="math-eval-sidebar">
                <div className="sidebar-title">문제 목록</div>
                <div className="question-grid">
                    {problems.map((_, index) => (
                        <button
                            key={index}
                            className={`question-btn ${currentIdx === index ? 'active' : ''} ${answers[index] ? 'answered' : ''}`}
                            onClick={() => goToQuestion(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="sidebar-stats">
                    <div>답안 완료: {Object.keys(answers).length}/{problems.length}</div>
                    <div className="timer">남은 시간: {formatTime(timeLeft)}</div>
                </div>
            </div>

            {/* 메인 영역 */}
            <div className="math-eval-main">
                <div className="eval-header">
                    <h2>수학 단원평가</h2>
                    <div className="eval-meta">
                        <span>단원: {unitName}</span>
                        <span>문제: {currentIdx + 1}/{problems.length}</span>
                        <span className={`difficulty difficulty-${currentProblem.difficulty}`}>
                            {currentProblem.difficulty === 'easy' ? '쉬움' : 
                             currentProblem.difficulty === 'medium' ? '보통' : '어려움'}
                        </span>
                    </div>
                </div>

                {/* 문제 이미지 */}
                <div className="problem-image-container">
                    <img 
                        src={`http://localhost:8080/api/images/${currentProblem.type === 'MULTIPLE_CHOICE' ? '객관식' : '단답형'}/${currentProblem.examMonthYear}_수학_${currentProblem.problemNumber}번_${currentProblem.subject}.png`}
                        alt={`수학 문제 ${currentIdx + 1}`}
                        className="problem-image"
                        onError={(e) => {
                            // 이미지 로딩 실패 시 대체 텍스트
                            console.error('이미지 로드 실패:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div className="image-error" style={{display: 'none'}}>
                        문제 이미지를 불러올 수 없습니다.
                        <br />
                        <small>({`http://localhost:8080/api/images/${currentProblem.type === 'MULTIPLE_CHOICE' ? '객관식' : '단답형'}/${currentProblem.examMonthYear}_수학_${currentProblem.problemNumber}번_${currentProblem.subject}.png`})</small>
                    </div>
                </div>

                {/* 답안 선택 */}
                <div className="answer-section">
                    <h3>답안을 선택하세요</h3>
                    <div className="answer-choices">
                        {[1, 2, 3, 4, 5].map(choice => (
                            <button
                                key={choice}
                                className={`answer-choice ${answers[currentIdx] === choice.toString() ? 'selected' : ''}`}
                                onClick={() => handleAnswer(choice.toString())}
                            >
                                {choice}번
                            </button>
                        ))}
                    </div>
                    <div className="answer-hint">
                        키보드 1-5 숫자키로도 선택할 수 있습니다.
                    </div>
                </div>

                {/* 네비게이션 버튼 */}
                <div className="nav-buttons">
                    <button 
                        className="nav-btn prev" 
                        onClick={goPrev}
                        disabled={currentIdx === 0}
                    >
                        이전
                    </button>
                    <button 
                        className="nav-btn next" 
                        onClick={goNext}
                        disabled={currentIdx === problems.length - 1}
                    >
                        다음
                    </button>
                </div>

                {/* 제출 버튼 */}
                <div className="submit-section">
                    <button className="submit-btn" onClick={handleSubmit}>
                        평가 제출하기
                    </button>
                </div>
            </div>

            {/* 미완료 문제 확인 모달 */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>미완료 문제가 있습니다!</h3>
                        <p>
                            {problems
                                .map((_, index) => index)
                                .filter(index => !answers[index])
                                .map(index => index + 1)
                                .join(', ')}번 문제
                        </p>
                        <div className="modal-buttons">
                            <button 
                                className="modal-btn continue" 
                                onClick={() => setShowConfirm(false)}
                            >
                                계속 풀기
                            </button>
                            <button 
                                className="modal-btn submit" 
                                onClick={handleForceSubmit}
                            >
                                제출하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MathEvaluationStart;