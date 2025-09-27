import React from 'react';
import './EvaluationLoadingScreen.css';

const EvaluationLoadingScreen = ({ 
    title = "평가 결과 분석 중", 
    subtitle = "AI가 여러분의 성과를 분석하고 있습니다...",
    userGrade = null,
    score = null
}) => {
    const loadingMessages = [
        "문제별 정답률을 분석하고 있습니다...",
        "난이도별 성취도를 계산하고 있습니다...",
        "개인 맞춤형 학습 조언을 생성하고 있습니다...",
        "강점과 약점을 파악하고 있습니다...",
        "다음 학습 전략을 수립하고 있습니다..."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [loadingMessages.length]);

    return (
        <div className="evaluation-loading-screen">
            <div className="loading-container">
                <div className="loading-header">
                    <div className="loading-icon">
                        <div className="brain-icon">🧠</div>
                        <div className="ai-particles">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={`particle particle-${i + 1}`}>✨</div>
                            ))}
                        </div>
                    </div>
                    <h2 className="loading-title">{title}</h2>
                    <p className="loading-subtitle">{subtitle}</p>
                </div>

                {(userGrade || score !== null) && (
                    <div className="quick-info">
                        {userGrade && <span className="info-badge">등급: {userGrade}등급</span>}
                        {score !== null && <span className="info-badge">점수: {score}점</span>}
                    </div>
                )}

                <div className="loading-progress">
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                    <div className="loading-percentage">
                        <span className="percentage-text">분석 중...</span>
                    </div>
                </div>

                <div className="loading-message">
                    <div className="message-icon">🔍</div>
                    <p className="current-message">{loadingMessages[currentMessageIndex]}</p>
                </div>

                <div className="loading-footer">
                    <div className="feature-highlights">
                        <div className="feature-item">
                            <span className="feature-icon">🎯</span>
                            <span>정확한 실력 진단</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📊</span>
                            <span>맞춤형 분석</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🚀</span>
                            <span>학습 전략 제시</span>
                        </div>
                    </div>
                    <p className="loading-tip">
                        💡 잠깐만 기다려주세요. AI가 여러분만을 위한 특별한 분석을 준비하고 있어요!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EvaluationLoadingScreen;