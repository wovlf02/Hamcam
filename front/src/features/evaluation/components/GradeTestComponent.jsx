import React, { useState } from 'react';
import { generateEvaluationSetByGrade, getStudentGradeDifficultyMapping } from '../data/mathProblems';

const GradeTestComponent = () => {
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [problemSet, setProblemSet] = useState([]);
    const [showProblems, setShowProblems] = useState(false);

    const handleGradeChange = (grade) => {
        setSelectedGrade(grade);
        const problems = generateEvaluationSetByGrade(grade, 10);
        setProblemSet(problems);
        setShowProblems(true);
    };

    const getDifficultyName = (difficultyGrade) => {
        switch (difficultyGrade) {
            case 1: return '최고난도';
            case 2: return '어려움';
            case 3: return '보통';
            case 4: return '쉬움';
            case 5: return '가장쉬움';
            default: return '알 수 없음';
        }
    };

    const getDifficultyStats = () => {
        const stats = {};
        problemSet.forEach(problem => {
            const grade = problem.difficultyGrade;
            stats[grade] = (stats[grade] || 0) + 1;
        });
        return stats;
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>학생 등급별 문제 난이도 테스트</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>학생 등급 선택:</h3>
                {[1, 2, 3, 4, 5].map(grade => (
                    <button
                        key={grade}
                        onClick={() => handleGradeChange(grade)}
                        style={{
                            margin: '5px',
                            padding: '10px 15px',
                            backgroundColor: selectedGrade === grade ? '#007bff' : '#f8f9fa',
                            color: selectedGrade === grade ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {grade}등급
                    </button>
                ))}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>{selectedGrade}등급 학생 문제 난이도 범위:</h3>
                <p>허용된 난이도: {getStudentGradeDifficultyMapping(selectedGrade).map(d => getDifficultyName(d)).join(', ')}</p>
                <p>난이도 등급: {getStudentGradeDifficultyMapping(selectedGrade).join(', ')}</p>
            </div>

            {showProblems && (
                <div>
                    <h3>생성된 문제 세트 (총 {problemSet.length}개)</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h4>난이도별 분포:</h4>
                        {Object.entries(getDifficultyStats()).map(([grade, count]) => (
                            <div key={grade}>
                                <strong>{getDifficultyName(parseInt(grade))}</strong> (난이도 {grade}): {count}개
                            </div>
                        ))}
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
                        <h4>문제 목록:</h4>
                        {problemSet.map((problem, index) => (
                            <div key={problem.id} style={{ 
                                marginBottom: '15px', 
                                padding: '10px', 
                                border: '1px solid #eee',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <div><strong>문제 {index + 1}</strong></div>
                                <div>ID: {problem.id}</div>
                                <div>시험: {problem.examMonthYear}</div>
                                <div>문제번호: {problem.problemNumber}번</div>
                                <div>과목: {problem.subject}</div>
                                <div>세부분야: {problem.subjectDetail}</div>
                                <div>난이도: <strong>{getDifficultyName(problem.difficultyGrade)} ({problem.difficultyGrade})</strong></div>
                                <div>정답: {problem.answer}</div>
                                <div>유형: {problem.type === 'MULTIPLE_CHOICE' ? '객관식' : '단답형'}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeTestComponent;