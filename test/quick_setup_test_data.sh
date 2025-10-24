#!/bin/bash

# ========================================
# 대용량 테스트 데이터 생성 스크립트
# ========================================
# 사용법: ./quick_setup_test_data.sh
# ========================================

set -e  # 오류 발생 시 스크립트 중단

# 색상 코드
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정값
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="hamcam"
DB_USER="root"
DB_PASSWORD="merk"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 대용량 테스트 데이터 생성 시작${NC}"
echo -e "${BLUE}========================================${NC}"

# MySQL 접속 확인
echo -e "\n${YELLOW}📡 MySQL 접속 확인 중...${NC}"
if ! mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &>/dev/null; then
    echo -e "${RED}❌ MySQL 접속 실패${NC}"
    echo -e "${RED}설정을 확인해주세요: ${DB_USER}@${DB_HOST}:${DB_PORT}${NC}"
    exit 1
fi
echo -e "${GREEN}✅ MySQL 접속 성공${NC}"

# 데이터베이스 백업
echo -e "\n${YELLOW}💾 데이터베이스 백업 중...${NC}"
BACKUP_FILE="hamcam_backup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null
echo -e "${GREEN}✅ 백업 완료: ${BACKUP_FILE}${NC}"

# 기존 데이터 개수 확인
echo -e "\n${YELLOW}📊 기존 데이터 개수 확인${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
SELECT 
    '👥 Users: ' as '', COUNT(*) as count FROM users
UNION ALL
SELECT '📚 Students: ', COUNT(*) FROM students
UNION ALL
SELECT '📝 Posts: ', COUNT(*) FROM post
UNION ALL
SELECT '💬 Comments: ', COUNT(*) FROM comments
UNION ALL
SELECT '📊 Math Attempts: ', COUNT(*) FROM math_problem_attempts;
EOF

# 사용자 확인
echo -e "\n${YELLOW}⚠️  테스트 데이터를 생성하시겠습니까?${NC}"
echo -e "${YELLOW}생성할 데이터:${NC}"
echo -e "  - Users: 10,000명"
echo -e "  - Students: 5,000명"
echo -e "  - Posts: 50,000개"
echo -e "  - Comments: 100,000개"
echo -e "  - Math Attempts: 100,000개"
echo -e "  - Likes: 50,000개"
echo -e "\n${YELLOW}예상 소요 시간: 약 3-5분${NC}"
read -p "계속하시겠습니까? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 중단됨${NC}"
    exit 1
fi

# SQL 스크립트 실행
echo -e "\n${BLUE}🔧 테스트 데이터 생성 중...${NC}"
echo -e "${YELLOW}이 작업은 몇 분 정도 소요될 수 있습니다...${NC}"

mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<'EOF'
-- 프로시저 생성
DELIMITER $$

DROP PROCEDURE IF EXISTS generate_users$$
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
            created_at, updated_at, phone, point
        ) VALUES (
            CONCAT('testuser', i),
            CONCAT('테스트유저', i),
            '$2a$10$dummypasswordhashfortest1234567890',
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
            random_point
        );
        
        SET i = i + 1;
    END WHILE;
END$$

DROP PROCEDURE IF EXISTS generate_students$$
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
END$$

DROP PROCEDURE IF EXISTS generate_posts$$
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
            CONCAT('이것은 테스트용 게시글 내용입니다. 게시글 번호: ', i),
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
END$$

DROP PROCEDURE IF EXISTS generate_comments$$
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
            CONCAT('테스트 댓글 내용입니다. 댓글 번호: ', i),
            FLOOR(1 + RAND() * max_user_id),
            FLOOR(1 + RAND() * max_post_id),
            NOW() - INTERVAL FLOOR(RAND() * 180) DAY,
            NOW() - INTERVAL FLOOR(RAND() * 30) DAY,
            FLOOR(RAND() * 20)
        );
        
        SET i = i + 1;
    END WHILE;
END$$

DROP PROCEDURE IF EXISTS generate_math_attempts$$
CREATE PROCEDURE generate_math_attempts(IN attempt_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE max_student_id INT;
    
    SELECT MAX(id) INTO max_student_id FROM students;
    
    WHILE i <= attempt_count DO
        INSERT INTO math_problem_attempts (
            student_id, math_problem_id, student_answer,
            is_correct, time_spent, attempts_count, type,
            feedback, hints_used, attempted_at
        ) VALUES (
            FLOOR(1 + RAND() * max_student_id),
            FLOOR(1 + RAND() * 100),
            CONCAT('답안_', FLOOR(RAND() * 100)),
            RAND() > 0.3,
            FLOOR(30 + RAND() * 600),
            FLOOR(1 + RAND() * 3),
            CASE FLOOR(RAND() * 3)
                WHEN 0 THEN 'PRACTICE'
                WHEN 1 THEN 'EVALUATION'
                ELSE 'REVIEW'
            END,
            '테스트 피드백',
            FLOOR(RAND() * 3),
            NOW() - INTERVAL FLOOR(RAND() * 180) DAY
        );
        
        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- 데이터 생성 실행
SELECT '1/6 👥 사용자 생성 중...' as status;
CALL generate_users(10000);

SELECT '2/6 📚 학생 생성 중...' as status;
CALL generate_students(5000);

SELECT '3/6 📝 게시글 생성 중...' as status;
CALL generate_posts(50000);

SELECT '4/6 💬 댓글 생성 중...' as status;
CALL generate_comments(100000);

SELECT '5/6 📊 수학 문제 풀이 기록 생성 중...' as status;
CALL generate_math_attempts(100000);

SELECT '6/6 ✅ 완료!' as status;
EOF

# 결과 확인
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ 테스트 데이터 생성 완료!${NC}"
echo -e "${GREEN}========================================${NC}"

echo -e "\n${BLUE}📊 생성된 데이터 확인${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
SELECT 
    '👥 Users: ' as '', COUNT(*) as count FROM users
UNION ALL
SELECT '📚 Students: ', COUNT(*) FROM students
UNION ALL
SELECT '📝 Posts: ', COUNT(*) FROM post
UNION ALL
SELECT '💬 Comments: ', COUNT(*) FROM comments
UNION ALL
SELECT '📊 Math Attempts: ', COUNT(*) FROM math_problem_attempts;
EOF

# 슬로우 쿼리 로그 설정
echo -e "\n${YELLOW}🔧 슬로우 쿼리 로그 활성화 중...${NC}"
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;
SET GLOBAL log_queries_not_using_indexes = 'ON';
EOF
echo -e "${GREEN}✅ 슬로우 쿼리 로그 활성화 완료${NC}"

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}다음 단계:${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "1. 인덱스 성능 테스트:"
echo -e "   ${YELLOW}mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME < test/index_performance_test.sql${NC}"
echo -e ""
echo -e "2. 상세 가이드 확인:"
echo -e "   ${YELLOW}cat test/PERFORMANCE_TEST_GUIDE.md${NC}"
echo -e ""
echo -e "3. 백업 파일 위치:"
echo -e "   ${YELLOW}$BACKUP_FILE${NC}"
echo -e "${BLUE}========================================${NC}"
