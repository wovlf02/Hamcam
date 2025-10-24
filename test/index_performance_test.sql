-- ========================================
-- 인덱스 성능 비교 테스트 스크립트
-- ========================================
-- 목적: 인덱스 유무에 따른 쿼리 성능 차이 확인
-- 테스트 항목: 단일 인덱스, 복합 인덱스, 커버링 인덱스
-- ========================================

-- ========================================
-- 1. 테스트 환경 설정
-- ========================================

-- 슬로우 쿼리 로그 활성화 (0.5초 이상 걸리는 쿼리 로깅)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 현재 설정 확인
SHOW VARIABLES LIKE 'slow_query_log%';
SHOW VARIABLES LIKE 'long_query_time';

-- ========================================
-- 2. 인덱스 없는 상태에서 성능 측정
-- ========================================

-- 기존 인덱스 확인
SHOW INDEX FROM post;
SHOW INDEX FROM comments;
SHOW INDEX FROM math_problem_attempts;

-- 테스트 1: 특정 작성자의 게시글 조회 (인덱스 없음)
-- Full Table Scan 발생 예상
EXPLAIN 
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;

-- 실행 시간 측정
SET @start_time = NOW(6);
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- 테스트 2: 카테고리별 게시글 조회 (인덱스 없음)
EXPLAIN 
SELECT * FROM post 
WHERE category = 'QUESTION' 
ORDER BY created_at DESC 
LIMIT 20;

SET @start_time = NOW(6);
SELECT * FROM post 
WHERE category = 'QUESTION' 
ORDER BY created_at DESC 
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- 테스트 3: 학생의 풀이 기록 조회 (인덱스 없음)
EXPLAIN 
SELECT * FROM math_problem_attempts 
WHERE student_id = 50 
ORDER BY attempted_at DESC 
LIMIT 30;

SET @start_time = NOW(6);
SELECT * FROM math_problem_attempts 
WHERE student_id = 50 
ORDER BY attempted_at DESC 
LIMIT 30;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- ========================================
-- 3. 단일 인덱스 추가 및 성능 비교
-- ========================================

-- 단일 인덱스 생성
CREATE INDEX idx_post_writer ON post(writer_id);
CREATE INDEX idx_post_category ON post(category);
CREATE INDEX idx_attempt_student ON math_problem_attempts(student_id);

-- 인덱스 생성 확인
SHOW INDEX FROM post WHERE Key_name LIKE 'idx_post_%';

-- 테스트 4: 단일 인덱스로 조회 (writer_id)
EXPLAIN 
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;

SET @start_time = NOW(6);
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- 테스트 5: 단일 인덱스로 조회 (category)
EXPLAIN 
SELECT * FROM post 
WHERE category = 'QUESTION' 
ORDER BY created_at DESC 
LIMIT 20;

SET @start_time = NOW(6);
SELECT * FROM post 
WHERE category = 'QUESTION' 
ORDER BY created_at DESC 
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- ========================================
-- 4. 복합 인덱스 추가 및 성능 비교
-- ========================================

-- 복합 인덱스 생성 (카디널리티 높은 순서)
CREATE INDEX idx_post_writer_created ON post(writer_id, created_at);
CREATE INDEX idx_post_category_created ON post(category, created_at);
CREATE INDEX idx_attempt_student_attempted ON math_problem_attempts(student_id, attempted_at);

-- 복합 인덱스로 조회 테스트
EXPLAIN 
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;

SET @start_time = NOW(6);
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- JOIN 쿼리 테스트 (복합 인덱스 활용)
EXPLAIN 
SELECT p.id, p.title, p.created_at, p.like_count, u.username, u.nickname
FROM post p
INNER JOIN users u ON p.writer_id = u.id
WHERE p.category = 'STUDY'
ORDER BY p.created_at DESC
LIMIT 20;

SET @start_time = NOW(6);
SELECT p.id, p.title, p.created_at, p.like_count, u.username, u.nickname
FROM post p
INNER JOIN users u ON p.writer_id = u.id
WHERE p.category = 'STUDY'
ORDER BY p.created_at DESC
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- ========================================
-- 5. 커버링 인덱스 테스트
-- ========================================

-- 커버링 인덱스: 쿼리에 필요한 모든 컬럼을 인덱스에 포함
-- (Index Scan만으로 데이터 조회 가능, 테이블 접근 불필요)

-- 일반 인덱스 상태에서 조회 (Using index condition)
EXPLAIN 
SELECT id, title, category, created_at, like_count
FROM post
WHERE category = 'QUESTION'
ORDER BY created_at DESC
LIMIT 20;

-- 커버링 인덱스 생성
CREATE INDEX idx_post_covering ON post(category, created_at, id, title, like_count);

-- 커버링 인덱스로 조회 (Using index 확인)
EXPLAIN 
SELECT id, title, category, created_at, like_count
FROM post
WHERE category = 'QUESTION'
ORDER BY created_at DESC
LIMIT 20;

SET @start_time = NOW(6);
SELECT id, title, category, created_at, like_count
FROM post
WHERE category = 'QUESTION'
ORDER BY created_at DESC
LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;

-- 커버링 인덱스 효과 비교: COUNT 쿼리
-- 일반 쿼리 (커버링 인덱스 없음)
EXPLAIN SELECT COUNT(*) FROM post WHERE category = 'QUESTION';

-- 커버링 인덱스 활용 (Using index)
EXPLAIN SELECT COUNT(id) FROM post WHERE category = 'QUESTION';

-- ========================================
-- 6. 인덱스 효율성 분석
-- ========================================

-- 인덱스 사용률 확인
SELECT 
    table_name,
    index_name,
    cardinality,
    seq_in_index,
    column_name
FROM information_schema.statistics
WHERE table_schema = 'hamcam'
AND table_name IN ('post', 'comments', 'math_problem_attempts')
ORDER BY table_name, index_name, seq_in_index;

-- 인덱스 크기 확인
SELECT 
    table_name,
    index_name,
    ROUND(stat_value * @@innodb_page_size / 1024 / 1024, 2) AS size_mb
FROM mysql.innodb_index_stats
WHERE database_name = 'hamcam'
AND table_name IN ('post', 'comments', 'math_problem_attempts')
AND stat_name = 'size';

-- ========================================
-- 7. 성능 비교 종합 테스트
-- ========================================

-- 성능 측정용 프로시저
DELIMITER $$

DROP PROCEDURE IF EXISTS measure_query_performance$$
CREATE PROCEDURE measure_query_performance(
    IN test_name VARCHAR(100),
    IN query_text TEXT
)
BEGIN
    DECLARE start_time DATETIME(6);
    DECLARE end_time DATETIME(6);
    DECLARE exec_time_ms DECIMAL(10,2);
    
    SET start_time = NOW(6);
    
    -- 동적 쿼리 실행
    SET @sql = query_text;
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SET end_time = NOW(6);
    SET exec_time_ms = TIMESTAMPDIFF(MICROSECOND, start_time, end_time) / 1000;
    
    SELECT 
        test_name as '테스트명',
        exec_time_ms as '실행시간(ms)',
        NOW() as '측정시간';
END$$

DELIMITER ;

-- 사용 예시
-- CALL measure_query_performance(
--     '게시글 조회 - 인덱스 없음',
--     'SELECT * FROM post WHERE writer_id = 100 ORDER BY created_at DESC LIMIT 20'
-- );

-- ========================================
-- 8. 인덱스 최적화 권장사항
-- ========================================

-- 중복 인덱스 확인 (최적화 대상)
SELECT 
    a.table_name,
    a.index_name as index1,
    b.index_name as index2,
    a.column_name
FROM information_schema.statistics a
JOIN information_schema.statistics b 
    ON a.table_schema = b.table_schema
    AND a.table_name = b.table_name
    AND a.column_name = b.column_name
    AND a.index_name < b.index_name
WHERE a.table_schema = 'hamcam'
ORDER BY a.table_name, a.index_name;

-- 사용하지 않는 인덱스 확인
SELECT 
    object_schema,
    object_name,
    index_name
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
AND count_star = 0
AND object_schema = 'hamcam'
ORDER BY object_name, index_name;

-- ========================================
-- 9. 인덱스 삭제 (테스트 완료 후)
-- ========================================

-- 테스트용 인덱스 삭제
-- DROP INDEX idx_post_writer ON post;
-- DROP INDEX idx_post_category ON post;
-- DROP INDEX idx_post_writer_created ON post;
-- DROP INDEX idx_post_category_created ON post;
-- DROP INDEX idx_post_covering ON post;
-- DROP INDEX idx_attempt_student ON math_problem_attempts;
-- DROP INDEX idx_attempt_student_attempted ON math_problem_attempts;

-- ========================================
-- 10. 성능 테스트 결과 기록 템플릿
-- ========================================

/*
===========================================
성능 테스트 결과
===========================================

1. 테스트 환경
- 데이터베이스: MySQL 8.0
- 테스트 데이터: Post 50,000건, Comment 100,000건
- 서버 스펙: [CPU/RAM/Disk 정보]

2. 테스트 케이스별 결과

테스트 1: 특정 작성자의 게시글 조회
- 인덱스 없음: [실행시간]ms, Rows examined: [숫자], Type: ALL
- 단일 인덱스: [실행시간]ms, Rows examined: [숫자], Type: ref
- 복합 인덱스: [실행시간]ms, Rows examined: [숫자], Type: ref
- 성능 개선: [%]

테스트 2: 카테고리별 게시글 조회
- 인덱스 없음: [실행시간]ms, Type: ALL
- 단일 인덱스: [실행시간]ms, Type: ref
- 복합 인덱스: [실행시간]ms, Type: ref
- 성능 개선: [%]

테스트 3: 커버링 인덱스
- 일반 조회: [실행시간]ms, Extra: Using index condition
- 커버링 인덱스: [실행시간]ms, Extra: Using index
- 성능 개선: [%]

3. 결론
- 단일 인덱스 효과: [설명]
- 복합 인덱스 효과: [설명]
- 커버링 인덱스 효과: [설명]
- 권장 인덱스: [목록]

4. 트레이드오프
- 인덱스 추가로 인한 INSERT/UPDATE 성능 영향: [분석]
- 인덱스 크기: [MB]
- 메모리 사용량 증가: [분석]
*/
