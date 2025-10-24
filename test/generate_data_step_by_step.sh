#!/bin/bash
# 테스트 데이터 생성 (수정된 버전)

echo "📊 1/5 사용자 10,000명 생성 중..."
mysql -u root -pmerk hamcam <<'EOF'
DELIMITER //
DROP PROCEDURE IF EXISTS generate_users//
CREATE PROCEDURE generate_users(IN user_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_grade INT;
    DECLARE random_point INT;
    
    WHILE i <= user_count DO
        SET random_grade = FLOOR(1 + RAND() * 12);
        SET random_point = FLOOR(RAND() * 10000);
        
        INSERT INTO users (
            username, name, password, nickname, email, 
            profile_image_url, grade, study_habit, 
            created_at, updated_at, phone, point, is_deleted, email_verified
        ) VALUES (
            CONCAT('testuser', i + 1000),
            CONCAT('테스트유저', i),
            '$2a$10$dummypasswordhashfortest1234567890',
            CONCAT('닉네임', i),
            CONCAT('testuser', i + 1000, '@test.com'),
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
END//
DELIMITER ;
CALL generate_users(10000);
EOF

echo "✅ 사용자 생성 완료!"
echo ""

echo "📚 2/5 학생 5,000명 생성 중..."
mysql -u root -pmerk hamcam <<'EOF'
DELIMITER //
DROP PROCEDURE IF EXISTS generate_students//
CREATE PROCEDURE generate_students(IN student_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE random_grade INT;
    DECLARE random_solved INT;
    DECLARE random_correct INT;
    
    WHILE i <= student_count DO
        SET random_grade = FLOOR(1 + RAND() * 12);
        SET random_solved = FLOOR(RAND() * 500);
        SET random_correct = FLOOR(random_solved * (0.5 + RAND() * 0.4));
        
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
            FLOOR(1 + RAND() * 10),
            FLOOR(1 + RAND() * 40),
            CASE FLOOR(RAND() * 5)
                WHEN 0 THEN 'BEGINNER'
                WHEN 1 THEN 'ELEMENTARY'
                WHEN 2 THEN 'MIDDLE'
                WHEN 3 THEN 'HIGH'
                ELSE 'ADVANCED'
            END,
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
END//
DELIMITER ;
CALL generate_students(5000);
EOF

echo "✅ 학생 생성 완료!"
echo ""

echo "📝 3/5 게시글 50,000개 생성 중 (시간이 걸립니다...)..."
mysql -u root -pmerk hamcam <<'EOF'
DELIMITER //
DROP PROCEDURE IF EXISTS generate_posts//
CREATE PROCEDURE generate_posts(IN post_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_user_id INT;
    DECLARE random_user_id INT;
    
    SELECT MAX(id) INTO max_user_id FROM users;
    
    WHILE i <= post_count DO
        SET random_user_id = FLOOR(1 + RAND() * max_user_id);
        
        INSERT INTO post (
            title, category, content, tag, writer_id,
            created_at, updated_at, like_count, view_count, comment_count
        ) VALUES (
            CONCAT('[테스트] 게시글 제목 ', i),
            CASE FLOOR(RAND() * 4)
                WHEN 0 THEN 'INFO'
                WHEN 1 THEN 'QUESTION'
                WHEN 2 THEN 'STUDY'
                ELSE 'FREE'
            END,
            CONCAT('이것은 테스트용 게시글 내용입니다. 게시글 번호: ', i, '. 성능 테스트를 위한 더미 데이터입니다. ', REPEAT('테스트 내용입니다. ', 20)),
            CONCAT('태그', FLOOR(RAND() * 10)),
            random_user_id,
            NOW() - INTERVAL FLOOR(RAND() * 365) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            FLOOR(RAND() * 100),
            FLOOR(RAND() * 1000),
            FLOOR(RAND() * 50)
        );
        
        SET i = i + 1;
    END WHILE;
END//
DELIMITER ;
CALL generate_posts(50000);
EOF

echo "✅ 게시글 생성 완료!"
echo ""

echo "💬 4/5 댓글 100,000개 생성 중 (가장 오래 걸립니다...)..."
mysql -u root -pmerk hamcam <<'EOF'
DELIMITER //
DROP PROCEDURE IF EXISTS generate_comments//
CREATE PROCEDURE generate_comments(IN comment_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_user_id INT;
    DECLARE max_post_id INT;
    
    SELECT MAX(id) INTO max_user_id FROM users;
    SELECT MAX(id) INTO max_post_id FROM post;
    
    WHILE i <= comment_count DO
        INSERT INTO comments (
            content, writer_id, post_id, 
            created_at, updated_at, like_count
        ) VALUES (
            CONCAT('테스트 댓글 내용입니다. 댓글 번호: ', i, '. ', 'This is dummy comment. ', REPEAT('댓글 내용 ', 5)),
            FLOOR(1 + RAND() * max_user_id),
            FLOOR(1 + RAND() * max_post_id),
            NOW() - INTERVAL FLOOR(RAND() * 180) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            FLOOR(RAND() * 20)
        );
        
        SET i = i + 1;
    END WHILE;
END//
DELIMITER ;
CALL generate_comments(100000);
EOF

echo "✅ 댓글 생성 완료!"
echo ""

echo "📊 5/5 데이터 생성 완료! 통계 확인..."
mysql -u root -pmerk hamcam -e "
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'post', COUNT(*) FROM post
UNION ALL SELECT 'comments', COUNT(*) FROM comments;
"

echo ""
echo "========================================="
echo "✅ 모든 테스트 데이터 생성 완료!"
echo "========================================="
