import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateEvaluationSetByGrade } from '../data/mathProblems';
import EvaluationLoadingScreen from '../components/EvaluationLoadingScreen';
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
    const [userGrade, setUserGrade] = useState(5); // 기본값: 5등급
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/users/me', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const grade = data.data?.grade || 5; // 기본값: 5등급
                    setUserGrade(grade);
                    console.log('사용자 등급:', grade);
                } else {
                    console.warn('사용자 정보를 가져올 수 없습니다. 기본 5등급으로 설정합니다.');
                }
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
                console.warn('기본 5등급으로 설정합니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    // 문제 초기화 - 사용자 등급 기반
    useEffect(() => {
        if (!loading && userGrade) {
            console.log(`${userGrade}등급에 맞는 문제를 선택합니다.`);
            const selectedProblems = generateEvaluationSetByGrade(userGrade, 10);
            setProblems(selectedProblems);
            console.log('선택된 문제들의 난이도 분포:', 
                selectedProblems.reduce((acc, p) => {
                    acc[p.difficultyGrade] = (acc[p.difficultyGrade] || 0) + 1;
                    return acc;
                }, {})
            );
        }
    }, [loading, userGrade]);

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
    const submitEvaluation = async () => {
        setIsSubmitting(true);

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
        
        const difficultyScores = {
            easy: { correct: easyCorrect, total: 3 },
            medium: { correct: mediumCorrect, total: 4 },
            hard: { correct: hardCorrect, total: 3 }
        };

        // Gemini API를 통한 분석 요청
        try {
            const wrongAnswers = results
                .map((result, index) => ({
                    problemNumber: result.problemNumber || index + 1,
                    difficulty: result.difficulty,
                    topic: result.topic || '일반',
                    subjectDetail: result.subjectDetail || result.topic || '수학 문제',
                    examMonthYear: result.examMonthYear || '2025_06',
                    userAnswer: result.userAnswer,
                    correctAnswer: result.correctAnswer
                }))
                .filter(result => result.userAnswer !== result.correctAnswer);

            const analysisRequest = {
                userGrade: userGrade,
                score: score,
                correctCount: correctCount,
                totalCount: problems.length,
                difficultyScores: {
                    easy: { correct: difficultyScores.easy.correct, total: difficultyScores.easy.total },
                    medium: { correct: difficultyScores.medium.correct, total: difficultyScores.medium.total },
                    hard: { correct: difficultyScores.hard.correct, total: difficultyScores.hard.total }
                },
                wrongAnswers: wrongAnswers,
                unitName: unitName
            };

            console.log('분석 요청 데이터:', analysisRequest);

            const response = await fetch('/api/math-evaluation/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(analysisRequest)
            });

            let aiAnalysis = null;
            if (response.ok) {
                const analysisResult = await response.json();
                aiAnalysis = analysisResult.data;
                console.log('AI 분석 결과:', aiAnalysis);
            } else {
                console.warn('AI 분석 요청 실패:', response.status);
            }

            // 결과 페이지로 이동
            navigate('/math-evaluation/result', {
                state: {
                    results,
                    score,
                    correctCount,
                    totalCount: problems.length,
                    difficultyScores,
                    unitName,
                    subject,
                    aiAnalysis // Gemini 분석 결과 추가
                }
            });

        } catch (error) {
            console.error('분석 요청 중 오류:', error);
            
            // 오류 발생 시 기본 결과 페이지로 이동
            navigate('/math-evaluation/result', {
                state: {
                    results,
                    score,
                    correctCount,
                    totalCount: problems.length,
                    difficultyScores,
                    unitName,
                    subject,
                    aiAnalysis: null
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 시간 포맷팅
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 로딩 중
    if (loading || problems.length === 0) {
        return (
            <div className="math-eval-loading">
                <div>
                    {loading ? '사용자 등급 정보를 확인하고 있습니다...' : '등급에 맞는 수학 문제를 준비하고 있습니다...'}
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                    {userGrade && !loading && `현재 등급: ${userGrade}등급`}
                </div>
            </div>
        );
    }

    // 제출 중 로딩 화면
    if (isSubmitting) {
        let correctCount = 0;
        problems.forEach((problem, index) => {
            if (answers[index] === problem.correctAnswer) {
                correctCount++;
            }
        });
        const estimatedScore = Math.round((correctCount / problems.length) * 100);

        return (
            <EvaluationLoadingScreen 
                grade={userGrade}
                score={estimatedScore}
            />
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