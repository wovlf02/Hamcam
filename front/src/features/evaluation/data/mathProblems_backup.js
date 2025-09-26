// 2025년 6월, 9월 모의평가 수학 문제 데이터
export const mathProblems = [
    // ===========================================
    // 2025년 6월 모의평가 - 공통 과목 (1-15번 객관식)
    // ===========================================
    {
        id: 1,
        examMonthYear: '2025_06',
        problemNumber: 1,
        subject: '공통',
        subjectDetail: '지수법칙을 이용한 계산',
        difficultyGrade: 5,
        answer: '3',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/features/evaluation/math_image/객관식/2025_06_수학_1번_공통.png',
        difficulty: 'easy',
        correctAnswer: '3'
    },
    {
        id: 2,
        examMonthYear: '2025_06',
        problemNumber: 2,
        subject: '공통',
        subjectDetail: '미분계수 정의를 이용한 값 계산',
        difficultyGrade: 5,
        answer: '2',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/features/evaluation/math_image/객관식/2025_06_수학_2번_공통.png',
        difficulty: 'easy',
        correctAnswer: '2'
    },
    {
        id: 3,
        examMonthYear: '2025_06',
        problemNumber: 3,
        subject: '공통',
        subjectDetail: '삼각함수의 간단한 성질',
        difficultyGrade: 5,
        answer: '4',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_06_수학_3번_공통.png',
        difficulty: 'easy',
        correctAnswer: '4'
    },
    
    // 2025년 6월 공통 과목 - 보통 난이도 (difficultyGrade: 3-4)
    {
        id: 4,
        examMonthYear: '2025_06',
        problemNumber: 7,
        subject: '공통',
        subjectDetail: '삼각함수의 그래프 및 주기',
        difficultyGrade: 4,
        answer: '1',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_06_수학_7번_공통.png',
        difficulty: 'medium',
        correctAnswer: '1'
    },
    {
        id: 5,
        examMonthYear: '2025_06',
        problemNumber: 8,
        subject: '공통',
        subjectDetail: '정적분 계산',
        difficultyGrade: 4,
        answer: '1',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_06_수학_8번_공통.png',
        difficulty: 'medium',
        correctAnswer: '1'
    },
    {
        id: 6,
        examMonthYear: '2025_06',
        problemNumber: 9,
        subject: '공통',
        subjectDetail: '등차수열의 합과 일반항',
        difficultyGrade: 3,
        answer: '5',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_06_수학_9번_공통.png',
        difficulty: 'medium',
        correctAnswer: '5'
    },
    
    // 2025년 6월 공통 과목 - 어려움 난이도 (difficultyGrade: 1-2)
    {
        id: 7,
        examMonthYear: '2025_06',
        problemNumber: 10,
        subject: '공통',
        subjectDetail: '삼차함수의 극대/극소와 그래프 개형 추론',
        difficultyGrade: 2,
        answer: '3',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_06_수학_10번_공통.png',
        difficulty: 'hard',
        correctAnswer: '3'
    },
    {
        id: 8,
        examMonthYear: '2025_06',
        problemNumber: 14,
        subject: '공통',
        subjectDetail: '미분 가능성 및 함수의 추론',
        difficultyGrade: 1,
        answer: '1',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_06_수학_14번_공통.png',
        difficulty: 'hard',
        correctAnswer: '1'
    },
    
    // 2025년 9월 공통 과목 - 쉬움 난이도 (difficultyGrade: 5)
    {
        id: 9,
        examMonthYear: '2025_09',
        problemNumber: 1,
        subject: '공통',
        subjectDetail: '지수법칙을 이용한 계산',
        difficultyGrade: 5,
        answer: '4',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_1번_공통.png',
        difficulty: 'easy',
        correctAnswer: '4'
    },
    {
        id: 10,
        examMonthYear: '2025_09',
        problemNumber: 2,
        subject: '공통',
        subjectDetail: '미분계수의 정의를 이용한 극한값',
        difficultyGrade: 5,
        answer: '4',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_2번_공통.png',
        difficulty: 'easy',
        correctAnswer: '4'
    },
    {
        id: 11,
        examMonthYear: '2025_09',
        problemNumber: 3,
        subject: '공통',
        subjectDetail: '시그마의 정의를 이용한 수열의 합',
        difficultyGrade: 5,
        answer: '5',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_3번_공통.png',
        difficulty: 'easy',
        correctAnswer: '5'
    },
    
    // 2025년 9월 공통 과목 - 보통 난이도 (difficultyGrade: 3-4)
    {
        id: 12,
        examMonthYear: '2025_09',
        problemNumber: 7,
        subject: '공통',
        subjectDetail: '도함수를 활용한 접선의 방정식',
        difficultyGrade: 4,
        answer: '1',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_7번_공통.png',
        difficulty: 'medium',
        correctAnswer: '1'
    },
    {
        id: 13,
        examMonthYear: '2025_09',
        problemNumber: 8,
        subject: '공통',
        subjectDetail: '로그의 성질을 이용한 미지수 값',
        difficultyGrade: 4,
        answer: '1',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_8번_공통.png',
        difficulty: 'medium',
        correctAnswer: '1'
    },
    {
        id: 14,
        examMonthYear: '2025_09',
        problemNumber: 9,
        subject: '공통',
        subjectDetail: '도함수와 부정적분의 정의',
        difficultyGrade: 3,
        answer: '2',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_9번_공통.png',
        difficulty: 'medium',
        correctAnswer: '2'
    },
    
    // 2025년 9월 공통 과목 - 어려움 난이도 (difficultyGrade: 1-2)
    {
        id: 15,
        examMonthYear: '2025_09',
        problemNumber: 14,
        subject: '공통',
        subjectDetail: '삼각함수 그래프와 주기, 넓이 활용',
        difficultyGrade: 1,
        answer: '5',
        type: 'MULTIPLE_CHOICE',
        imagePath: '/math_image/객관식/2025_09_수학_14번_공통.png',
        difficulty: 'hard',
        correctAnswer: '5'
    }
];

// 난이도별 문제 필터링 함수
export const getProblemsByDifficulty = (difficulty) => {
    return mathProblems.filter(problem => problem.difficulty === difficulty);
};

// 과목별 문제 필터링 함수  
export const getProblemsBySubject = (subject) => {
    return mathProblems.filter(problem => problem.subject === subject);
};

// 시험 년월별 문제 필터링 함수
export const getProblemsByExam = (examMonthYear) => {
    return mathProblems.filter(problem => problem.examMonthYear === examMonthYear);
};

// 평가용 문제 세트 생성 (쉬움 3개, 보통 4개, 어려움 3개)
export const generateEvaluationSet = () => {
    const easyProblems = getProblemsByDifficulty('easy');
    const mediumProblems = getProblemsByDifficulty('medium');
    const hardProblems = getProblemsByDifficulty('hard');
    
    // 랜덤 선택
    const selectedEasy = getRandomProblems(easyProblems, 3);
    const selectedMedium = getRandomProblems(mediumProblems, 4);
    const selectedHard = getRandomProblems(hardProblems, 3);
    
    // 합치고 섞기
    const allSelected = [...selectedEasy, ...selectedMedium, ...selectedHard];
    return shuffleArray(allSelected);
};

// 랜덤 문제 선택 함수
const getRandomProblems = (problems, count) => {
    const shuffled = shuffleArray([...problems]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

// 배열 섞기 함수
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default mathProblems;
