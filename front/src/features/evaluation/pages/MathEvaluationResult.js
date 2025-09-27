import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PersonalizedStudyPlan from '../components/PersonalizedStudyPlan';
import '../styles/MathEvaluationResult.css';

const MathEvaluationResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        results = [],
        score = 0,
        correctCount = 0,
        totalCount = 0,
        difficultyScores = {},
        unitName = '수학',
        subject = '수학',
        aiAnalysis = null
    } = location.state || {};

    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [showReview, setShowReview] = useState(false);

    // 틀린 문제들만 필터링
    const wrongAnswers = results.filter(result => !result.isCorrect);

    // 성능 분석
    const getPerformanceAnalysis = () => {
        const { easy, medium, hard } = difficultyScores;
        
        let analysis = {
            level: '보통',
            message: '',
            strengths: [],
            weaknesses: [],
            recommendations: []
        };

        // 전체 점수에 따른 레벨 결정
        if (score >= 90) {
            analysis.level = '우수';
            analysis.message = '뛰어난 수학 실력을 보여주었습니다!';
        } else if (score >= 70) {
            analysis.level = '양호';
            analysis.message = '전반적으로 좋은 성과를 거두었습니다.';
        } else if (score >= 50) {
            analysis.level = '보통';
            analysis.message = '기본기는 갖추었지만 더 노력이 필요합니다.';
        } else {
            analysis.level = '미흡';
            analysis.message = '기초부터 차근차근 다시 학습해보세요.';
        }

        // 강점 분석
        if (easy && easy.correct >= 2) {
            analysis.strengths.push('기본 개념 이해가 탄탄합니다');
        }
        if (medium && medium.correct >= 3) {
            analysis.strengths.push('응용 문제 해결 능력이 좋습니다');
        }
        if (hard && hard.correct >= 2) {
            analysis.strengths.push('고난도 문제도 잘 해결합니다');
        }

        // 약점 분석
        if (easy && easy.correct < 2) {
            analysis.weaknesses.push('기본 개념 정리가 필요합니다');
        }
        if (medium && medium.correct < 2) {
            analysis.weaknesses.push('응용 문제 연습이 부족합니다');
        }
        if (hard && hard.correct < 1) {
            analysis.weaknesses.push('고난도 문제 해결 전략을 익혀보세요');
        }

        // 학습 권장사항
        if (analysis.weaknesses.includes('기본 개념 정리가 필요합니다')) {
            analysis.recommendations.push('교과서 기본 예제부터 차근차근 풀어보세요');
            analysis.recommendations.push('개념 정리 노트를 만들어 복습하세요');
        }
        if (analysis.weaknesses.includes('응용 문제 연습이 부족합니다')) {
            analysis.recommendations.push('다양한 유형의 문제를 많이 풀어보세요');
            analysis.recommendations.push('문제 해결 과정을 단계별로 정리하는 연습을 하세요');
        }
        if (analysis.weaknesses.includes('고난도 문제 해결 전략을 익혀보세요')) {
            analysis.recommendations.push('어려운 문제는 여러 방법으로 접근해보세요');
            analysis.recommendations.push('해설을 꼼꼼히 읽고 다른 유형에도 적용해보세요');
        }

        if (analysis.recommendations.length === 0) {
            analysis.recommendations.push('현재 수준을 유지하며 꾸준히 학습하세요');
            analysis.recommendations.push('더 다양한 문제에 도전해보세요');
        }

        return analysis;
    };

    const analysis = getPerformanceAnalysis();

    // 난이도별 색상
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return '#22c55e';
            case 'medium': return '#f59e0b';
            case 'hard': return '#ef4444';
            default: return '#64748b';
        }
    };

    // 레벨별 색상
    const getLevelColor = (level) => {
        switch (level) {
            case '우수': return '#22c55e';
            case '양호': return '#3b82f6';
            case '보통': return '#f59e0b';
            case '미흡': return '#ef4444';
            default: return '#64748b';
        }
    };

    return (
        <div className="math-result-container">
            <div className="result-header">
                <h1>수학 단원평가 결과</h1>
                <div className="result-summary">
                    <div className="score-circle">
                        <div className="score-value">{score}점</div>
                        <div className="score-detail">{correctCount}/{totalCount}</div>
                    </div>
                    <div className="performance-level" style={{ color: getLevelColor(analysis.level) }}>
                        <div className="level-badge" style={{ backgroundColor: getLevelColor(analysis.level) }}>
                            {analysis.level}
                        </div>
                        <div className="level-message">{analysis.message}</div>
                    </div>
                </div>
            </div>

            {/* 난이도별 성과 */}
            <div className="difficulty-breakdown">
                <h2>난이도별 성과</h2>
                <div className="difficulty-stats">
                    <div className="difficulty-stat">
                        <div className="stat-header">
                            <span className="difficulty-label easy">쉬움</span>
                            <span className="stat-score">
                                {difficultyScores.easy?.correct || 0}/{difficultyScores.easy?.total || 3}
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div 
                                className="stat-fill easy"
                                style={{ 
                                    width: `${(difficultyScores.easy?.correct || 0) / (difficultyScores.easy?.total || 3) * 100}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="difficulty-stat">
                        <div className="stat-header">
                            <span className="difficulty-label medium">보통</span>
                            <span className="stat-score">
                                {difficultyScores.medium?.correct || 0}/{difficultyScores.medium?.total || 4}
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div 
                                className="stat-fill medium"
                                style={{ 
                                    width: `${(difficultyScores.medium?.correct || 0) / (difficultyScores.medium?.total || 4) * 100}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                    <div className="difficulty-stat">
                        <div className="stat-header">
                            <span className="difficulty-label hard">어려움</span>
                            <span className="stat-score">
                                {difficultyScores.hard?.correct || 0}/{difficultyScores.hard?.total || 3}
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div 
                                className="stat-fill hard"
                                style={{ 
                                    width: `${(difficultyScores.hard?.correct || 0) / (difficultyScores.hard?.total || 3) * 100}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI 성능 분석 (Gemini 분석 결과가 있을 때) */}
            {aiAnalysis ? (
                <div className="ai-performance-analysis">
                    <h2>🤖 AI 맞춤 분석</h2>
                    <div className="ai-analysis-content">
                        <div className="ai-section overall-assessment">
                            <h3>📊 전반적 평가</h3>
                            <div className="ai-text">{aiAnalysis.overallAssessment}</div>
                        </div>
                        
                        <div className="ai-analysis-grid">
                            <div className="ai-section strengths">
                                <h3>✅ 강점</h3>
                                <div className="ai-text">{aiAnalysis.strengths}</div>
                            </div>
                            
                            <div className="ai-section weaknesses">
                                <h3>📝 약점</h3>
                                <div className="ai-text">{aiAnalysis.weaknesses}</div>
                            </div>
                        </div>

                        <div className="ai-section study-plan">
                            <h3>📚 맞춤 학습 계획</h3>
                            <div className="ai-text">{aiAnalysis.studyPlan}</div>
                        </div>

                        <div className="ai-section recommendations">
                            <h3>💡 추천 학습법</h3>
                            <div className="ai-text">{aiAnalysis.recommendations}</div>
                        </div>
                    </div>
                </div>
            ) : (
                // 기존 성능 분석 (AI 분석이 없을 때)
                <div className="performance-analysis">
                    <h2>성능 분석</h2>
                    <div className="analysis-grid">
                        {analysis.strengths.length > 0 && (
                            <div className="analysis-section strengths">
                                <h3>✅ 잘한 점</h3>
                                <ul>
                                    {analysis.strengths.map((strength, index) => (
                                        <li key={index}>{strength}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {analysis.weaknesses.length > 0 && (
                            <div className="analysis-section weaknesses">
                                <h3>📝 보완할 점</h3>
                                <ul>
                                    {analysis.weaknesses.map((weakness, index) => (
                                        <li key={index}>{weakness}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="analysis-section recommendations">
                            <h3>💡 학습 권장사항</h3>
                            <ul>
                                {analysis.recommendations.map((recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* 틀린 문제 복습 */}
            {wrongAnswers.length > 0 && (
                <div className="wrong-answers-section">
                    <div className="section-header">
                        <h2>틀린 문제 복습</h2>
                        <span className="wrong-count">총 {wrongAnswers.length}개 문제</span>
                    </div>
                    
                    {!showReview ? (
                        <div className="wrong-answers-summary">
                            <div className="wrong-list">
                                {wrongAnswers.map((problem, index) => (
                                    <div key={index} className="wrong-item">
                                        <div className="wrong-problem-info">
                                            <span className="problem-number">
                                                문제 {results.findIndex(r => r.id === problem.id) + 1}
                                            </span>
                                            <span 
                                                className="problem-difficulty"
                                                style={{ color: getDifficultyColor(problem.difficulty) }}
                                            >
                                                {problem.difficulty === 'easy' ? '쉬움' : 
                                                 problem.difficulty === 'medium' ? '보통' : '어려움'}
                                            </span>
                                        </div>
                                        <div className="answer-comparison">
                                            <span className="user-answer wrong">내 답: {problem.userAnswer}</span>
                                            <span className="correct-answer">정답: {problem.correctAnswer}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                className="review-btn"
                                onClick={() => setShowReview(true)}
                            >
                                틀린 문제 상세 복습하기
                            </button>
                        </div>
                    ) : (
                        <div className="detailed-review">
                            <div className="review-navigation">
                                <button
                                    onClick={() => setCurrentReviewIndex(Math.max(0, currentReviewIndex - 1))}
                                    disabled={currentReviewIndex === 0}
                                    className="nav-btn prev"
                                >
                                    이전
                                </button>
                                <span className="review-counter">
                                    {currentReviewIndex + 1} / {wrongAnswers.length}
                                </span>
                                <button
                                    onClick={() => setCurrentReviewIndex(Math.min(wrongAnswers.length - 1, currentReviewIndex + 1))}
                                    disabled={currentReviewIndex === wrongAnswers.length - 1}
                                    className="nav-btn next"
                                >
                                    다음
                                </button>
                            </div>
                            
                            <div className="review-problem">
                                <div className="review-header">
                                    <h3>문제 {results.findIndex(r => r.id === wrongAnswers[currentReviewIndex].id) + 1}</h3>
                                    <span 
                                        className="review-difficulty"
                                        style={{ color: getDifficultyColor(wrongAnswers[currentReviewIndex].difficulty) }}
                                    >
                                        {wrongAnswers[currentReviewIndex].difficulty === 'easy' ? '쉬움' : 
                                         wrongAnswers[currentReviewIndex].difficulty === 'medium' ? '보통' : '어려움'}
                                    </span>
                                </div>
                                
                                <div className="review-image">
                                    <img 
                                        src={`${process.env.PUBLIC_URL}${wrongAnswers[currentReviewIndex].imagePath}`}
                                        alt={`틀린 문제 ${currentReviewIndex + 1}`}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <div className="image-error" style={{display: 'none'}}>
                                        문제 이미지를 불러올 수 없습니다.
                                    </div>
                                </div>
                                
                                <div className="review-answers">
                                    <div className="answer-row user-wrong">
                                        <span className="label">내 답안:</span>
                                        <span className="answer">{wrongAnswers[currentReviewIndex].userAnswer}번</span>
                                    </div>
                                    <div className="answer-row correct">
                                        <span className="label">정답:</span>
                                        <span className="answer">{wrongAnswers[currentReviewIndex].correctAnswer}번</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="close-review-btn"
                                onClick={() => setShowReview(false)}
                            >
                                복습 종료
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 맞춤형 학습계획 섹션 */}
            <div className="study-plan-section">
                <PersonalizedStudyPlan />
            </div>

            {/* 액션 버튼들 */}
            <div className="action-buttons">
                <button 
                    className="action-btn secondary"
                    onClick={() => navigate('/evaluation')}
                >
                    평가 메인으로
                </button>
                <button 
                    className="action-btn primary"
                    onClick={() => navigate('/math-evaluation/start', { state: { unitName, subject } })}
                >
                    다시 도전하기
                </button>
            </div>
        </div>
    );
};

export default MathEvaluationResult;