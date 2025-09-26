import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mathProblems, getProblemsByDifficulty, getProblemsByExam, getProblemsBySubject } from '../data/mathProblems';
import './MathEvaluationMain.css';

const MathEvaluationMain = () => {
    const [stats, setStats] = useState({
        totalProblems: 0,
        examCount: 0,
        subjects: [],
        difficultyStats: {
            easy: 0,
            medium: 0,
            hard: 0
        }
    });

    useEffect(() => {
        // 통계 계산
        const totalProblems = mathProblems.length;
        const uniqueExams = [...new Set(mathProblems.map(p => p.examMonthYear))];
        const uniqueSubjects = [...new Set(mathProblems.map(p => p.subject))];
        
        const easyCount = getProblemsByDifficulty('easy').length;
        const mediumCount = getProblemsByDifficulty('medium').length;
        const hardCount = getProblemsByDifficulty('hard').length;

        setStats({
            totalProblems,
            examCount: uniqueExams.length,
            subjects: uniqueSubjects,
            difficultyStats: {
                easy: easyCount,
                medium: mediumCount,
                hard: hardCount
            }
        });
    }, []);

    const examOptions = [
        {
            id: '2025_06',
            title: '2025년 6월 모의평가',
            subtitle: '6월 모의고사 기출문제',
            color: 'blue',
            problems: getProblemsByExam('2025_06').length
        },
        {
            id: '2025_09',
            title: '2025년 9월 모의평가',
            subtitle: '9월 모의고사 기출문제',
            color: 'green',
            problems: getProblemsByExam('2025_09').length
        }
    ];

    const subjectOptions = [
        {
            id: '공통',
            title: '수학 공통',
            subtitle: '수학 I, II 공통 영역',
            color: 'purple',
            problems: getProblemsBySubject('공통').length
        },
        {
            id: '미적분',
            title: '미적분',
            subtitle: '미적분 선택과목',
            color: 'orange',
            problems: getProblemsBySubject('미적분').length || 0
        },
        {
            id: '확률과통계',
            title: '확률과 통계',
            subtitle: '확률과 통계 선택과목',
            color: 'teal',
            problems: getProblemsBySubject('확률과통계').length || 0
        },
        {
            id: '기하',
            title: '기하',
            subtitle: '기하 선택과목',
            color: 'red',
            problems: getProblemsBySubject('기하').length || 0
        }
    ];

    const difficultyOptions = [
        {
            id: 'easy',
            title: '쉬움 (5등급)',
            subtitle: '기초 개념 확인 문제',
            color: 'green',
            problems: stats.difficultyStats.easy,
            icon: '😊'
        },
        {
            id: 'medium',
            title: '보통 (3-4등급)',
            subtitle: '중간 수준 응용 문제',
            color: 'yellow',
            problems: stats.difficultyStats.medium,
            icon: '🤔'
        },
        {
            id: 'hard',
            title: '어려움 (1-2등급)',
            subtitle: '고난도 심화 문제',
            color: 'red',
            problems: stats.difficultyStats.hard,
            icon: '😤'
        }
    ];

    return (
        <div className="math-evaluation-main">
            <div className="header-section">
                <h1>🧮 수학 문제 평가</h1>
                <p className="subtitle">2025년 모의평가 기출문제로 실력을 점검해보세요</p>
                
                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-number">{stats.totalProblems}</div>
                        <div className="stat-label">총 문제 수</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.examCount}</div>
                        <div className="stat-label">모의평가 회차</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.subjects.length}</div>
                        <div className="stat-label">과목 수</div>
                    </div>
                </div>
            </div>

            <div className="evaluation-options">
                {/* 종합 평가 */}
                <section className="option-section">
                    <h2>🎯 종합 평가</h2>
                    <div className="option-grid">
                        <Link to="/evaluation/math/comprehensive" className="option-card featured">
                            <div className="option-icon">🚀</div>
                            <div className="option-content">
                                <h3>종합 실력 평가</h3>
                                <p>쉬움 3문제 + 보통 4문제 + 어려움 3문제</p>
                                <div className="option-stats">
                                    <span>총 10문제</span>
                                    <span>예상 소요시간: 30분</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* 시험별 연습 */}
                <section className="option-section">
                    <h2>📝 시험별 연습</h2>
                    <div className="option-grid">
                        {examOptions.map(exam => (
                            <Link 
                                key={exam.id} 
                                to={`/evaluation/math/exam/${exam.id}`} 
                                className={`option-card ${exam.color}`}
                            >
                                <div className="option-content">
                                    <h3>{exam.title}</h3>
                                    <p>{exam.subtitle}</p>
                                    <div className="option-stats">
                                        <span>{exam.problems}문제 수록</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 과목별 연습 */}
                <section className="option-section">
                    <h2>📚 과목별 연습</h2>
                    <div className="option-grid">
                        {subjectOptions.map(subject => (
                            <Link 
                                key={subject.id} 
                                to={`/evaluation/math/subject/${subject.id}`} 
                                className={`option-card ${subject.color} ${subject.problems === 0 ? 'disabled' : ''}`}
                            >
                                <div className="option-content">
                                    <h3>{subject.title}</h3>
                                    <p>{subject.subtitle}</p>
                                    <div className="option-stats">
                                        <span>
                                            {subject.problems > 0 ? `${subject.problems}문제 수록` : '준비 중'}
                                        </span>
                                    </div>
                                </div>
                                {subject.problems === 0 && (
                                    <div className="coming-soon">Coming Soon</div>
                                )}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 난이도별 연습 */}
                <section className="option-section">
                    <h2>⚡ 난이도별 연습</h2>
                    <div className="option-grid">
                        {difficultyOptions.map(difficulty => (
                            <Link 
                                key={difficulty.id} 
                                to={`/evaluation/math/difficulty/${difficulty.id}`} 
                                className={`option-card ${difficulty.color}`}
                            >
                                <div className="option-icon">{difficulty.icon}</div>
                                <div className="option-content">
                                    <h3>{difficulty.title}</h3>
                                    <p>{difficulty.subtitle}</p>
                                    <div className="option-stats">
                                        <span>{difficulty.problems}문제 수록</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <div className="additional-info">
                <div className="info-card">
                    <h3>📊 평가 특징</h3>
                    <ul>
                        <li>실제 2025년 모의평가 기출문제 활용</li>
                        <li>난이도별 맞춤형 문제 추천</li>
                        <li>실시간 정답률 및 소요시간 측정</li>
                        <li>상세한 결과 분석 및 학습 가이드 제공</li>
                    </ul>
                </div>
                
                <div className="info-card">
                    <h3>🎯 학습 가이드</h3>
                    <ul>
                        <li><strong>초급자:</strong> 쉬움 단계부터 차근차근</li>
                        <li><strong>중급자:</strong> 보통 단계로 실력 점검</li>
                        <li><strong>고급자:</strong> 어려움 단계로 실전 대비</li>
                        <li><strong>수험생:</strong> 종합 평가로 전체 실력 확인</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MathEvaluationMain;