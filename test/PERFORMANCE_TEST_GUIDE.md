# 📊 대용량 테스트 데이터 생성 및 성능 테스트 가이드

## 목차
1. [개요](#개요)
2. [사전 준비](#사전-준비)
3. [테스트 데이터 생성 방법](#테스트-데이터-생성-방법)
4. [인덱스 성능 테스트](#인덱스-성능-테스트)
5. [성능 측정 방법](#성능-측정-방법)
6. [결과 분석 가이드](#결과-분석-가이드)

---

## 개요

이 가이드는 3장 실습 미션을 위한 대용량 테스트 데이터를 생성하고, 인덱스 최적화 및 쿼리 성능을 측정하는 방법을 설명합니다.

### 생성되는 데이터
- 👥 Users: 10,000명
- 📚 Students: 5,000명
- 📝 Posts: 50,000개
- 💬 Comments: 100,000개
- 📊 Math Problem Attempts: 100,000개
- ❤️ Likes: 50,000개

### 테스트 항목
- ✅ 인덱스 없음 vs 인덱스 있음
- ✅ 단일 인덱스 vs 복합 인덱스
- ✅ 일반 인덱스 vs 커버링 인덱스
- ✅ Full Table Scan 방지

---

## 사전 준비

### 1. 데이터베이스 백업
```bash
# 현재 데이터베이스 백업 (중요!)
mysqldump -u root -p hamcam > hamcam_backup_$(date +%Y%m%d).sql
```

### 2. MySQL 설정 확인
```sql
-- 현재 데이터베이스 사용
USE hamcam;

-- 테이블 확인
SHOW TABLES;

-- 기존 데이터 개수 확인
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'post', COUNT(*) FROM post
UNION ALL SELECT 'comments', COUNT(*) FROM comments
UNION ALL SELECT 'math_problem_attempts', COUNT(*) FROM math_problem_attempts;
```

### 3. 슬로우 쿼리 로그 설정
```sql
-- 슬로우 쿼리 로그 활성화
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;  -- 0.5초 이상 걸리는 쿼리 로깅
SET GLOBAL log_queries_not_using_indexes = 'ON';

-- 설정 확인
SHOW VARIABLES LIKE 'slow_query_log%';
SHOW VARIABLES LIKE 'long_query_time';
```

---

## 테스트 데이터 생성 방법

### 방법 1: SQL 스크립트 사용 (권장) ⭐

#### 1-1. 스크립트 실행
```bash
# MySQL에 접속
mysql -u root -p hamcam

# SQL 스크립트 실행
source /Users/songdongjun/Desktop/Hamcam/test/generate_test_data.sql
```

#### 1-2. 개별 프로시저 실행
```sql
-- 원하는 개수로 조정 가능
CALL generate_users(10000);      -- 10,000명 (약 10초)
CALL generate_students(5000);    -- 5,000명 (약 5초)
CALL generate_posts(50000);      -- 50,000개 (약 30초)
CALL generate_comments(100000);  -- 100,000개 (약 1분)
CALL generate_math_attempts(100000);  -- 100,000개 (약 1분)
CALL generate_likes(50000);      -- 50,000개 (약 30초)
```

#### 1-3. 생성 결과 확인
```sql
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
```

### 방법 2: Java 애플리케이션 사용

#### 2-1. 프로파일 설정
`application.yml` 또는 실행 시 프로파일 지정
```yaml
spring:
  profiles:
    active: test-data  # 테스트 데이터 생성 프로파일
```

#### 2-2. 애플리케이션 실행
```bash
cd /Users/songdongjun/Desktop/Hamcam/back
./gradlew bootRun --args='--spring.profiles.active=test-data'
```

또는

```bash
# JAR 빌드 후 실행
./gradlew bootJar
java -jar -Dspring.profiles.active=test-data build/libs/back-0.0.1-SNAPSHOT.jar
```

#### 2-3. 로그 확인
```
========================================
🚀 테스트 데이터 생성 시작
========================================
👥 사용자 10000명 생성 중...
   - 1000명 처리 완료
   - 2000명 처리 완료
   ...
✅ 사용자 생성 완료: 10000명
========================================
✅ 테스트 데이터 생성 완료!
⏱️  소요 시간: 120초
========================================
```

---

## 인덱스 성능 테스트

### 1. 테스트 준비
```sql
-- 인덱스 성능 테스트 스크립트 실행
USE hamcam;
source /Users/songdongjun/Desktop/Hamcam/test/index_performance_test.sql
```

### 2. 인덱스 없는 상태 테스트

#### 2-1. 실행 계획 확인 (EXPLAIN)
```sql
-- Full Table Scan 발생 확인
EXPLAIN 
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;
```

**주목할 항목:**
- `type`: ALL (Full Table Scan)
- `rows`: 검사하는 행 수 (많을수록 느림)
- `Extra`: Using filesort (정렬에 추가 작업 필요)

#### 2-2. 실행 시간 측정
```sql
SET @start_time = NOW(6);

SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;

SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;
```

**결과 기록:**
```
실행시간: _____ ms
검사한 행: _____
Type: ALL
```

### 3. 단일 인덱스 추가 후 테스트

#### 3-1. 인덱스 생성
```sql
CREATE INDEX idx_post_writer ON post(writer_id);
CREATE INDEX idx_post_category ON post(category);
CREATE INDEX idx_attempt_student ON math_problem_attempts(student_id);
```

#### 3-2. 성능 재측정
```sql
-- 실행 계획 확인
EXPLAIN 
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;

-- 실행 시간 측정
SET @start_time = NOW(6);
SELECT * FROM post WHERE writer_id = 100 ORDER BY created_at DESC LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;
```

**예상 결과:**
- `type`: ref (인덱스 범위 스캔)
- `rows`: 줄어든 검사 행 수
- 실행시간 개선

### 4. 복합 인덱스 테스트

#### 4-1. 복합 인덱스 생성
```sql
-- WHERE 절과 ORDER BY를 모두 커버하는 복합 인덱스
CREATE INDEX idx_post_writer_created ON post(writer_id, created_at);
CREATE INDEX idx_post_category_created ON post(category, created_at);
```

#### 4-2. 성능 재측정
```sql
EXPLAIN 
SELECT * FROM post 
WHERE writer_id = 100 
ORDER BY created_at DESC 
LIMIT 20;

SET @start_time = NOW(6);
SELECT * FROM post WHERE writer_id = 100 ORDER BY created_at DESC LIMIT 20;
SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;
```

**주목할 점:**
- `Extra`에 "Using filesort" 사라짐 → 정렬 최적화
- 실행시간 추가 개선

### 5. 커버링 인덱스 테스트

#### 5-1. 일반 조회 (인덱스만)
```sql
-- 일반 인덱스 사용
EXPLAIN 
SELECT id, title, category, created_at, like_count
FROM post
WHERE category = 'QUESTION'
ORDER BY created_at DESC
LIMIT 20;
```

**결과:** `Extra: Using index condition` (테이블 접근 필요)

#### 5-2. 커버링 인덱스 생성
```sql
-- 쿼리에 필요한 모든 컬럼을 인덱스에 포함
CREATE INDEX idx_post_covering 
ON post(category, created_at, id, title, like_count);
```

#### 5-3. 성능 비교
```sql
EXPLAIN 
SELECT id, title, category, created_at, like_count
FROM post
WHERE category = 'QUESTION'
ORDER BY created_at DESC
LIMIT 20;
```

**결과:** `Extra: Using index` (테이블 접근 불필요, 인덱스만으로 처리)

---

## 성능 측정 방법

### 1. EXPLAIN 분석

```sql
EXPLAIN SELECT ... ;
```

**중요 컬럼:**

| 컬럼 | 의미 | 좋은 값 | 나쁜 값 |
|------|------|---------|---------|
| `type` | 접근 방식 | const, eq_ref, ref | ALL (Full Scan) |
| `possible_keys` | 사용 가능한 인덱스 | 있음 | NULL |
| `key` | 실제 사용된 인덱스 | 있음 | NULL |
| `rows` | 검사할 예상 행 수 | 적을수록 좋음 | 많음 |
| `Extra` | 추가 정보 | Using index | Using filesort, Using temporary |

### 2. 실행 시간 측정 (마이크로초 단위)

```sql
SET @start_time = NOW(6);

-- 테스트할 쿼리
SELECT ... ;

SELECT TIMESTAMPDIFF(MICROSECOND, @start_time, NOW(6)) / 1000 as execution_time_ms;
```

### 3. 프로파일링

```sql
-- 프로파일링 활성화
SET profiling = 1;

-- 테스트 쿼리 실행
SELECT * FROM post WHERE writer_id = 100 LIMIT 20;

-- 프로파일 결과 확인
SHOW PROFILES;

-- 상세 정보 확인
SHOW PROFILE FOR QUERY 1;
```

### 4. 인덱스 통계 확인

```sql
-- 인덱스 사용률
SELECT 
    table_name,
    index_name,
    cardinality,
    column_name
FROM information_schema.statistics
WHERE table_schema = 'hamcam'
AND table_name = 'post'
ORDER BY table_name, index_name;

-- 인덱스 크기
SELECT 
    table_name,
    index_name,
    ROUND(stat_value * @@innodb_page_size / 1024 / 1024, 2) AS size_mb
FROM mysql.innodb_index_stats
WHERE database_name = 'hamcam'
AND table_name = 'post'
AND stat_name = 'size';
```

---

## 결과 분석 가이드

### 1. 성능 개선률 계산

```
개선률(%) = ((이전 실행시간 - 현재 실행시간) / 이전 실행시간) × 100
```

**예시:**
- 인덱스 없음: 250ms
- 단일 인덱스: 50ms
- 개선률: ((250 - 50) / 250) × 100 = 80%

### 2. 결과 기록 템플릿

```markdown
## 테스트 결과

### 환경
- 데이터베이스: MySQL 8.0.x
- 테스트 데이터: Post 50,000건
- 서버: MacBook Pro M1, 16GB RAM

### 테스트 케이스 1: 특정 작성자의 게시글 조회

| 인덱스 상태 | 실행시간 | Type | Rows | Extra | 개선률 |
|------------|---------|------|------|-------|-------|
| 없음 | 250ms | ALL | 50000 | Using filesort | - |
| 단일 인덱스 | 50ms | ref | 120 | Using filesort | 80% |
| 복합 인덱스 | 15ms | ref | 120 | Using index | 94% |

### 테스트 케이스 2: 커버링 인덱스

| 인덱스 상태 | 실행시간 | Extra | 개선률 |
|------------|---------|-------|-------|
| 일반 인덱스 | 35ms | Using index condition | - |
| 커버링 인덱스 | 12ms | Using index | 66% |

### 결론
1. **단일 인덱스**: Full Table Scan 방지, 80% 성능 개선
2. **복합 인덱스**: 정렬 최적화, 추가 14% 개선
3. **커버링 인덱스**: 테이블 접근 제거, 66% 개선

### 트레이드오프
- 인덱스 크기: 약 50MB 추가
- INSERT 성능: 약 10% 감소 (인덱스 유지 비용)
- 쿼리 성능: 평균 85% 개선
```

### 3. 주요 분석 포인트

#### ✅ 좋은 인덱스 설계
- WHERE 절에 자주 사용되는 컬럼
- 카디널리티가 높은 컬럼 (중복 값이 적은)
- JOIN 조건에 사용되는 컬럼
- ORDER BY, GROUP BY에 사용되는 컬럼

#### ❌ 피해야 할 경우
- 작은 테이블 (1000건 이하)
- 카디널리티가 낮은 컬럼 (성별, boolean 등)
- 자주 UPDATE되는 컬럼
- 너무 많은 복합 인덱스 (유지 비용 증가)

### 4. 커넥션 풀 크기 결정 가이드

```
권장 풀 크기 = ((코어 수 * 2) + 효과적인 스핀들 수)
```

**예시:**
- CPU: 8 Core
- Disk: SSD 1개
- 권장 크기: (8 × 2) + 1 = 17

**실험 결과를 바탕으로 조정:**
```sql
-- application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 10
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

---

## 추가 테스트 시나리오

### 1. 동시성 테스트 (JMeter)
```xml
<!-- 스레드 그룹 설정 -->
<ThreadGroup>
  <stringProp name="ThreadGroup.num_threads">100</stringProp>
  <stringProp name="ThreadGroup.ramp_time">10</stringProp>
  <stringProp name="ThreadGroup.duration">60</stringProp>
</ThreadGroup>
```

### 2. 캐시 적용 전후 비교
```java
// 캐시 없음
@GetMapping("/posts/{id}")
public Post getPost(@PathVariable Long id) {
    return postRepository.findById(id).orElseThrow();
}

// 캐시 적용
@Cacheable(value = "posts", key = "#id")
@GetMapping("/posts/{id}")
public Post getPost(@PathVariable Long id) {
    return postRepository.findById(id).orElseThrow();
}
```

### 3. N+1 문제 해결
```java
// N+1 문제 발생
List<Post> posts = postRepository.findAll();
posts.forEach(post -> System.out.println(post.getWriter().getName()));

// 해결: Fetch Join
@Query("SELECT p FROM Post p JOIN FETCH p.writer")
List<Post> findAllWithWriter();
```

---

## 문제 해결

### Q1: 프로시저 실행 중 오류
```sql
-- 외래 키 제약 조건 확인
SHOW CREATE TABLE post;

-- 참조 무결성 검사 일시 비활성화 (개발 환경만)
SET FOREIGN_KEY_CHECKS = 0;
-- 데이터 생성...
SET FOREIGN_KEY_CHECKS = 1;
```

### Q2: 메모리 부족
```sql
-- 배치 크기 줄이기
CALL generate_posts(10000);  -- 50000 → 10000

-- 또는 여러 번 나눠서 실행
CALL generate_posts(10000);
CALL generate_posts(10000);
CALL generate_posts(10000);
```

### Q3: 데이터 삭제 후 재생성
```sql
-- 테스트 데이터만 삭제 (주의!)
DELETE FROM math_problem_attempts WHERE student_id > 0;
DELETE FROM comments WHERE id > 0;
DELETE FROM post WHERE title LIKE '[테스트]%';
DELETE FROM students WHERE username LIKE 'student%';
DELETE FROM users WHERE username LIKE 'testuser%';

-- AUTO_INCREMENT 초기화
ALTER TABLE post AUTO_INCREMENT = 1;
```

---

## 참고 자료

- [MySQL EXPLAIN 문서](https://dev.mysql.com/doc/refman/8.0/en/explain-output.html)
- [인덱스 설계 가이드](https://use-the-index-luke.com/)
- [HikariCP 설정](https://github.com/brettwooldridge/HikariCP#configuration-knobs-baby)
- [JMeter 사용법](https://jmeter.apache.org/usermanual/index.html)

---

## 체크리스트

- [ ] 데이터베이스 백업 완료
- [ ] 슬로우 쿼리 로그 활성화
- [ ] 테스트 데이터 생성 (10만건 이상)
- [ ] 인덱스 없는 상태 성능 측정
- [ ] 단일 인덱스 성능 측정
- [ ] 복합 인덱스 성능 측정
- [ ] 커버링 인덱스 성능 측정
- [ ] EXPLAIN 결과 분석
- [ ] 실행시간 비교 및 개선률 계산
- [ ] 결과 보고서 작성
- [ ] 트레이드오프 분석
- [ ] 최적 설정값 도출

---

**작성일:** 2025-10-24  
**버전:** 1.0  
**작성자:** Hamcam Team
