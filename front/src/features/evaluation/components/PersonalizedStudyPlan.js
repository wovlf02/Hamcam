import React, { useState, useEffect } from 'react';
import './PersonalizedStudyPlan.css';

const PersonalizedStudyPlan = () => {
    const [studyPlan, setStudyPlan] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPersonalizedStudyPlan();
    }, []);

    const generateDefaultStudyPlan = () => {
        return `**🎯 맞춤형 학습계획**

단원평가를 통해 더 정확한 맞춤형 학습계획을 제공받으세요!

**📚 기본 학습 가이드**
• 매일 30분씩 수학 기본 개념 복습
• 주 3회 문제 풀이 연습 (난이도별 접근)
• 틀린 문제는 반드시 오답노트 작성
• 주 1회 종합 복습 및 자가진단

**🔥 추천 학습 순서**
1. 기본 개념 이해 및 정리
2. 예제 문제로 개념 적용 연습  
3. 유형별 문제 풀이
4. 단원평가로 실력 확인

**💡 효과적인 학습법**
• 이해되지 않는 부분은 즉시 질문하기
• 공식 암기보다는 원리 이해에 집중
• 실생활 예시와 연결하여 학습
• 꾸준한 복습으로 장기기억 정착

**📈 다음 단계**
지금 단원평가를 완료하면 AI가 분석한 개인별 맞춤 학습계획을 받아보실 수 있습니다!`;
    };

    const fetchPersonalizedStudyPlan = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/evaluation/study-plan', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                throw new Error('학습계획을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            
            // 평가 기록이 없는 경우 기본 학습계획 제공
            if (!data.studyPlan || data.studyPlan.includes('평가 기록이 없습니다')) {
                setStudyPlan(generateDefaultStudyPlan());
            } else {
                setStudyPlan(data.studyPlan);
            }
        } catch (err) {
            console.error('학습계획 조회 실패:', err);
            // 에러 발생 시에도 기본 학습계획 제공
            setStudyPlan(generateDefaultStudyPlan());
            setError(null); // 에러를 표시하지 않고 기본 계획을 보여줌
        } finally {
            setLoading(false);
        }
    };

    const formatStudyPlan = (planText) => {
        if (!planText) return null;

        // 마크다운 스타일 텍스트를 HTML로 간단 변환
        return planText
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    // 굵은 글씨
                    return <h3 key={index} className="plan-heading">{line.replace(/\*\*/g, '')}</h3>;
                } else if (line.startsWith('• ') || line.startsWith('- ')) {
                    // 리스트 아이템
                    return <li key={index} className="plan-item">{line.substring(2)}</li>;
                } else if (line.trim() === '') {
                    // 빈 줄
                    return <br key={index} />;
                } else if (line.match(/^\d+주차:/)) {
                    // 주차별 계획
                    return <div key={index} className="plan-week">{line}</div>;
                } else {
                    // 일반 텍스트
                    return <p key={index} className="plan-text">{line}</p>;
                }
            });
    };

    if (loading) {
        return (
            <div className="study-plan-container">
                <div className="study-plan-loading">
                    <div className="loading-spinner"></div>
                    <p>맞춤형 학습계획을 생성하고 있습니다...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="study-plan-container">
                <div className="study-plan-error">
                    <h3>⚠️ 학습계획을 불러올 수 없습니다</h3>
                    <p>{error}</p>
                    <button onClick={fetchPersonalizedStudyPlan} className="retry-button">
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="study-plan-container">
            <div className="study-plan-header">
                <h2>🎯 나만의 맞춤형 학습계획</h2>
                <p className="study-plan-subtitle">최근 평가 결과를 바탕으로 생성된 개인별 학습 가이드입니다</p>
                <button onClick={fetchPersonalizedStudyPlan} className="refresh-button">
                    🔄 계획 새로고침
                </button>
            </div>
            
            <div className="study-plan-content">
                {studyPlan ? (
                    <div className="plan-text-container">
                        {formatStudyPlan(studyPlan)}
                    </div>
                ) : (
                    <div className="no-plan-message">
                        <h3>📚 학습계획이 준비되지 않았습니다</h3>
                        <p>먼저 단원평가를 완료하시면 맞춤형 학습계획을 받아보실 수 있습니다.</p>
                        <button 
                            onClick={() => window.location.href = '/unit-evaluation'} 
                            className="start-evaluation-button"
                        >
                            단원평가 시작하기
                        </button>
                    </div>
                )}
            </div>
            
            <div className="study-plan-footer">
                <div className="plan-tip">
                    💡 <strong>Tip:</strong> 학습계획은 여러분의 등급과 최근 성과를 바탕으로 AI가 개인별로 맞춤 제작한 것입니다. 
                    꾸준히 따라하시면 실력 향상을 경험하실 수 있을 거예요!
                </div>
            </div>
        </div>
    );
};

export default PersonalizedStudyPlan;