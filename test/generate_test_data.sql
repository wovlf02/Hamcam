-- ========================================
-- 대용량 테스트 데이터 생성 스크립트
-- ========================================
-- 목적: DB 성능 테스트를 위한 대용량 데이터 생성
-- 포함: Users, Students, Posts, Comments, MathProblems, MathProblemAttempts
-- ========================================

-- 1. 프로시저 생성: 대량의 사용자 생성
DELIMITER $$

DROP PROCEDURE IF EXISTS generate_users$$
CREATE PROCEDURE generate_users(IN user_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_grade INT;
    DECLARE random_point INT;
    
    WHILE i <= user_count DO
        SET random_grade = FLOOR(1 + RAND() * 12);  -- 1~12학년
        SET random_point = FLOOR(RAND() * 10000);   -- 0~10000 포인트
        
        INSERT INTO users (
            username, name, password, nickname, email, 
            profile_image_url, grade, study_habit, 
            created_at, updated_at, phone, point, is_deleted, email_verified
        ) VALUES (
            CONCAT('testuser', i),
            CONCAT('테스트유저', i),
            '$2a$10$dummypasswordhashfortest1234567890',  -- BCrypt 형식
            CONCAT('닉네임', i),
            CONCAT('testuser', i, '@test.com'),
            CONCAT('/profiles/', i, '.jpg'),
            random_grade,
            CASE FLOOR(RAND() * 4)
                WHEN 0 THEN '아침형'
                WHEN 1 THEN '저녁형'
                WHEN 2 THEN '주말형'
                ELSE '자유형'
            END,
            NOW() - INTERVAL FLOOR(RAND() * 365) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            CONCAT('010', LPAD(FLOOR(RAND() * 100000000), 8, '0')),
            random_point,
            0,
            1
        );
        
        SET i = i + 1;
    END WHILE;
END$$

-- 2. 프로시저 생성: 대량의 학생 데이터 생성
DROP PROCEDURE IF EXISTS generate_students$$
CREATE PROCEDURE generate_students(IN student_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_grade INT;
    DECLARE random_class INT;
    DECLARE random_number INT;
    DECLARE random_solved INT;
    DECLARE random_correct INT;
    DECLARE random_level VARCHAR(20);
    
    WHILE i <= student_count DO
        SET random_grade = FLOOR(1 + RAND() * 12);
        SET random_class = FLOOR(1 + RAND() * 10);
        SET random_number = FLOOR(1 + RAND() * 40);
        SET random_solved = FLOOR(RAND() * 500);
        SET random_correct = FLOOR(random_solved * (0.5 + RAND() * 0.4));  -- 50~90% 정답률
        
        SET random_level = CASE FLOOR(RAND() * 5)
            WHEN 0 THEN 'BEGINNER'
            WHEN 1 THEN 'ELEMENTARY'
            WHEN 2 THEN 'MIDDLE'
            WHEN 3 THEN 'HIGH'
            ELSE 'ADVANCED'
        END;
        
        INSERT INTO students (
            username, email, name, school, grade, class_number, student_number,
            current_math_level, total_solved_problems, total_correct_answers,
            average_accuracy, streak_count, max_streak_count, is_active,
            created_at, updated_at
        ) VALUES (
            CONCAT('student', i),
            CONCAT('student', i, '@school.com'),
            CONCAT('학생', i),
            CONCAT('테스트중학교', FLOOR(1 + RAND() * 5)),
            random_grade,
            random_class,
            random_number,
            random_level,
            random_solved,
            random_correct,
            IF(random_solved > 0, (random_correct / random_solved) * 100, 0),
            FLOOR(RAND() * 20),
            FLOOR(RAND() * 50),
            TRUE,
            NOW() - INTERVAL FLOOR(RAND() * 365) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY
        );
        
        SET i = i + 1;
    END WHILE;
END$$

-- 3. 프로시저 생성: 대량의 게시글 생성
DROP PROCEDURE IF EXISTS generate_posts$$
CREATE PROCEDURE generate_posts(IN post_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_user_id INT;
    DECLARE random_user_id INT;
    DECLARE random_category VARCHAR(20);
    DECLARE random_view_count INT;
    DECLARE random_like_count INT;
    DECLARE random_comment_count INT;
    
    SELECT MAX(id) INTO max_user_id FROM users;
    
    WHILE i <= post_count DO
        SET random_user_id = FLOOR(1 + RAND() * max_user_id);
        SET random_category = CASE FLOOR(RAND() * 4)
            WHEN 0 THEN 'INFO'
            WHEN 1 THEN 'QUESTION'
            WHEN 2 THEN 'STUDY'
            ELSE 'FREE'
        END;
        SET random_view_count = FLOOR(RAND() * 1000);
        SET random_like_count = FLOOR(RAND() * 100);
        SET random_comment_count = FLOOR(RAND() * 50);
        
        INSERT INTO post (
            title, category, content, tag, writer_id,
            created_at, updated_at, like_count, view_count, comment_count
        ) VALUES (
            CONCAT('[테스트] 게시글 제목 ', i),
            random_category,
            CONCAT('이것은 테스트용 게시글 내용입니다. 게시글 번호: ', i, 
                   '. 성능 테스트를 위한 더미 데이터입니다. ',
                   REPEAT('테스트 내용입니다. ', 20)),
            CONCAT('태그', FLOOR(RAND() * 10), ',태그', FLOOR(RAND() * 10)),
            random_user_id,
            NOW() - INTERVAL FLOOR(RAND() * 365) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            random_like_count,
            random_view_count,
            random_comment_count
        );
        
        SET i = i + 1;
    END WHILE;
END$$

-- 4. 프로시저 생성: 대량의 댓글 생성
DROP PROCEDURE IF EXISTS generate_comments$$
CREATE PROCEDURE generate_comments(IN comment_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_user_id INT;
    DECLARE max_post_id INT;
    DECLARE random_user_id INT;
    DECLARE random_post_id INT;
    DECLARE random_like_count INT;
    
    SELECT MAX(id) INTO max_user_id FROM users;
    SELECT MAX(id) INTO max_post_id FROM post;
    
    IF max_post_id IS NULL OR max_post_id = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '게시글이 없습니다. 먼저 게시글을 생성해주세요.';
    END IF;
    
    WHILE i <= comment_count DO
        SET random_user_id = FLOOR(1 + RAND() * max_user_id);
        SET random_post_id = FLOOR(1 + RAND() * max_post_id);
        SET random_like_count = FLOOR(RAND() * 20);
        
        INSERT INTO comments (
            content, writer_id, post_id, 
            created_at, updated_at, like_count
        ) VALUES (
            CONCAT('테스트 댓글 내용입니다. 댓글 번호: ', i, '. ',
                   '이것은 성능 테스트를 위한 더미 댓글입니다. ',
                   REPEAT('댓글 내용 ', 10)),
            random_user_id,
            random_post_id,
            NOW() - INTERVAL FLOOR(RAND() * 180) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            random_like_count
        );
        
        SET i = i + 1;
    END WHILE;
END$$

-- 5. 프로시저 생성: 수학 문제 풀이 기록 생성
DROP PROCEDURE IF EXISTS generate_math_attempts$$
CREATE PROCEDURE generate_math_attempts(IN attempt_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_student_id INT;
    DECLARE random_student_id INT;
    DECLARE random_problem_id INT;
    DECLARE random_time_spent INT;
    DECLARE random_is_correct BOOLEAN;
    DECLARE random_type VARCHAR(20);
    
    SELECT MAX(id) INTO max_student_id FROM students;
    
    IF max_student_id IS NULL OR max_student_id = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '학생 데이터가 없습니다. 먼저 학생을 생성해주세요.';
    END IF;
    
    WHILE i <= attempt_count DO
        SET random_student_id = FLOOR(1 + RAND() * max_student_id);
        SET random_problem_id = FLOOR(1 + RAND() * 100);  -- 문제 ID 1~100
        SET random_time_spent = FLOOR(30 + RAND() * 600);  -- 30초~630초
        SET random_is_correct = RAND() > 0.3;  -- 70% 정답률
        SET random_type = CASE FLOOR(RAND() * 3)
            WHEN 0 THEN 'PRACTICE'
            WHEN 1 THEN 'EVALUATION'
            ELSE 'REVIEW'
        END;
        
        INSERT INTO math_problem_attempts (
            student_id, math_problem_id, student_answer,
            is_correct, time_spent, attempts_count, type,
            feedback, hints_used, attempted_at
        ) VALUES (
            random_student_id,
            random_problem_id,
            CONCAT('답안_', FLOOR(RAND() * 100)),
            random_is_correct,
            random_time_spent,
            FLOOR(1 + RAND() * 3),
            random_type,
            IF(random_is_correct, '정답입니다!', '다시 한번 생각해보세요.'),
            FLOOR(RAND() * 3),
            NOW() - INTERVAL FLOOR(RAND() * 180) DAY
        );
        
        SET i = i + 1;
    END WHILE;
END$$

-- 6. 프로시저 생성: 좋아요 데이터 생성
DROP PROCEDURE IF EXISTS generate_likes$$
CREATE PROCEDURE generate_likes(IN like_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_user_id INT;
    DECLARE max_post_id INT;
    DECLARE random_user_id INT;
    DECLARE random_post_id INT;
    
    SELECT MAX(id) INTO max_user_id FROM users;
    SELECT MAX(id) INTO max_post_id FROM post;
    
    IF max_post_id IS NULL OR max_post_id = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = '게시글이 없습니다. 먼저 게시글을 생성해주세요.';
    END IF;
    
    WHILE i <= like_count DO
        SET random_user_id = FLOOR(1 + RAND() * max_user_id);
        SET random_post_id = FLOOR(1 + RAND() * max_post_id);
        
        -- 중복 방지를 위한 INSERT IGNORE 사용
        INSERT IGNORE INTO `like` (
            user_id, post_id, comment_id, created_at
        ) VALUES (
            random_user_id,
            random_post_id,
            NULL,
            NOW() - INTERVAL FLOOR(RAND() * 180) DAY
        );
        
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- ========================================
-- 실행 섹션
-- ========================================

-- 기존 테스트 데이터 삭제 (주의: 실제 운영 데이터 삭제 방지)
-- TRUNCATE 대신 DELETE 사용 (FK 제약 조건 고려)
-- DELETE FROM math_problem_attempts WHERE student_id > 0;
-- DELETE FROM comments WHERE id > 0;
-- DELETE FROM `like` WHERE id > 0;
-- DELETE FROM post WHERE id > 0;
-- DELETE FROM students WHERE id > 0;
-- DELETE FROM users WHERE id > 0;

-- 대용량 데이터 생성 (원하는 개수로 조정)
-- 사용 예시:

-- 1단계: 사용자 10,000명 생성 (약 10초)
CALL generate_users(10000);

-- 2단계: 학생 5,000명 생성 (약 5초)
CALL generate_students(5000);

-- 3단계: 게시글 50,000개 생성 (약 30초)
CALL generate_posts(50000);

-- 4단계: 댓글 100,000개 생성 (약 1분)
CALL generate_comments(100000);

-- 5단계: 수학 문제 풀이 기록 100,000개 생성 (약 1분)
CALL generate_math_attempts(100000);

-- 6단계: 좋아요 50,000개 생성 (약 30초)
CALL generate_likes(50000);

-- ========================================
-- 데이터 생성 확인 쿼리
-- ========================================

SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'posts', COUNT(*) FROM post
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'math_problem_attempts', COUNT(*) FROM math_problem_attempts
UNION ALL
SELECT 'likes', COUNT(*) FROM `like`;

-- ========================================
-- 인덱스 추가 예시 (성능 테스트용)
-- ========================================

-- 게시글 조회 성능 향상
-- CREATE INDEX idx_post_category_created ON post(category, created_at);
-- CREATE INDEX idx_post_writer_created ON post(writer_id, created_at);

-- 댓글 조회 성능 향상
-- CREATE INDEX idx_comment_post_created ON comments(post_id, created_at);

-- 수학 문제 풀이 기록 조회 성능 향상
-- CREATE INDEX idx_attempt_student_problem ON math_problem_attempts(student_id, math_problem_id);
-- CREATE INDEX idx_attempt_student_attempted ON math_problem_attempts(student_id, attempted_at);

-- 복합 인덱스 예시
-- CREATE INDEX idx_post_category_writer_created ON post(category, writer_id, created_at);

-- ========================================
-- 성능 테스트 쿼리 예시
-- ========================================

-- 1. 특정 사용자의 게시글 조회 (인덱스 활용)
-- EXPLAIN SELECT * FROM post WHERE writer_id = 100 ORDER BY created_at DESC LIMIT 10;

-- 2. 특정 카테고리의 게시글 조회
-- EXPLAIN SELECT * FROM post WHERE category = 'QUESTION' ORDER BY created_at DESC LIMIT 20;

-- 3. 특정 학생의 풀이 기록 조회
-- EXPLAIN SELECT * FROM math_problem_attempts WHERE student_id = 50 ORDER BY attempted_at DESC LIMIT 30;

-- 4. 좋아요 많은 게시글 조회
-- EXPLAIN SELECT * FROM post ORDER BY like_count DESC LIMIT 10;

-- 5. JOIN 쿼리 테스트
-- EXPLAIN SELECT p.*, u.username, u.nickname 
-- FROM post p 
-- JOIN users u ON p.writer_id = u.id 
-- WHERE p.category = 'STUDY' 
-- ORDER BY p.created_at DESC 
-- LIMIT 20;

-- ========================================
-- 정리 (테스트 완료 후 프로시저 삭제)
-- ========================================

-- DROP PROCEDURE IF EXISTS generate_users;
-- DROP PROCEDURE IF EXISTS generate_students;
-- DROP PROCEDURE IF EXISTS generate_posts;
-- DROP PROCEDURE IF EXISTS generate_comments;
-- DROP PROCEDURE IF EXISTS generate_math_attempts;
-- DROP PROCEDURE IF EXISTS generate_likes;
