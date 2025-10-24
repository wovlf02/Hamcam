# 🚀 빠른 시작 가이드

## 대용량 테스트 데이터 생성 (3가지 방법)

### 방법 1: 자동화 스크립트 (가장 빠름) ⭐ 권장
```bash
cd /Users/songdongjun/Desktop/Hamcam/test
./quick_setup_test_data.sh
```

### 방법 2: SQL 스크립트 직접 실행
```bash
mysql -u root -p hamcam < test/generate_test_data.sql
```

### 방법 3: Java 애플리케이션
```bash
cd back
./gradlew bootRun --args='--spring.profiles.active=test-data'
```

---

## 인덱스 성능 테스트

```bash
# MySQL 접속 후
mysql -u root -p hamcam

# 테스트 스크립트 실행
source /Users/songdongjun/Desktop/Hamcam/test/index_performance_test.sql
```

---

## 생성되는 데이터

- 👥 **Users**: 10,000명
- 📚 **Students**: 5,000명
- 📝 **Posts**: 50,000개
- 💬 **Comments**: 100,000개
- 📊 **Math Problem Attempts**: 100,000개
- ❤️ **Likes**: 50,000개

**예상 소요 시간**: 3-5분

---

## 상세 가이드

전체 실습 가이드는 다음 문서를 참고하세요:
```bash
cat test/PERFORMANCE_TEST_GUIDE.md
```

또는 마크다운 뷰어로 열기:
```bash
code test/PERFORMANCE_TEST_GUIDE.md
```

---

## 주의사항

⚠️ **중요**: 실행 전 데이터베이스를 백업하세요!
```bash
mysqldump -u root -p hamcam > hamcam_backup_$(date +%Y%m%d).sql
```

⚠️ **프로덕션 환경 주의**: test-data 프로파일은 개발 환경에서만 사용하세요!

---

## 문제 해결

### MySQL 접속 오류
```bash
# MySQL 서비스 상태 확인
mysql.server status

# MySQL 시작
mysql.server start
```

### 권한 오류
```bash
# 스크립트 실행 권한 부여
chmod +x test/quick_setup_test_data.sh
```

### 외래 키 제약 조건 오류
```sql
-- MySQL에서 실행
SET FOREIGN_KEY_CHECKS = 0;
-- 데이터 생성...
SET FOREIGN_KEY_CHECKS = 1;
```

---

## 테스트 데이터 삭제

```sql
-- 테스트 데이터만 삭제
DELETE FROM math_problem_attempts WHERE student_id IN (SELECT id FROM students WHERE username LIKE 'student%');
DELETE FROM comments WHERE writer_id IN (SELECT id FROM users WHERE username LIKE 'testuser%');
DELETE FROM post WHERE writer_id IN (SELECT id FROM users WHERE username LIKE 'testuser%');
DELETE FROM students WHERE username LIKE 'student%';
DELETE FROM users WHERE username LIKE 'testuser%';
```

---

## 파일 구조

```
test/
├── README.md                          # 이 파일 (빠른 시작)
├── PERFORMANCE_TEST_GUIDE.md          # 상세 실습 가이드
├── JMETER_GUIDE.md                    # JMeter 사용 가이드 ⭐
├── generate_test_data.sql             # SQL 데이터 생성 스크립트
├── index_performance_test.sql         # 인덱스 성능 테스트
├── quick_setup_test_data.sh           # 자동화 스크립트
├── performance_test.jmx               # JMeter 성능 테스트 계획 ⭐
└── 코딩코딩 JMeter.jmx                # 기존 JMeter 테스트 (간단)
```

---

## 다음 단계

1. ✅ 테스트 데이터 생성
2. 📊 인덱스 없는 상태 성능 측정
3. 🔧 인덱스 추가
4. 📈 성능 비교 분석
5. 🧪 JMeter로 부하 테스트 (선택)
6. 📝 결과 보고서 작성

### JMeter 부하 테스트 (선택)
```bash
# JMeter 설치
brew install jmeter

# GUI로 열기
jmeter -t test/performance_test.jmx

# CLI로 실행
jmeter -n -t test/performance_test.jmx -l results/test.jtl -e -o results/report

# 상세 가이드
cat test/JMETER_GUIDE.md
```

자세한 내용은 `PERFORMANCE_TEST_GUIDE.md`와 `JMETER_GUIDE.md`를 참고하세요!
