# 🧪 JMeter 성능 테스트 가이드

## 📋 개요

이 문서는 Hamcam 프로젝트의 DB 성능 최적화를 위한 JMeter 테스트 계획 사용법을 설명합니다.

---

## 📂 테스트 파일

### 1. `performance_test.jmx` (신규, 권장) ⭐
- **용도**: 3장 실습 미션 - 커넥션 풀, 인덱스, 캐시 성능 테스트
- **시나리오**:
  - 인덱스 테스트 (게시글 조회)
  - 커넥션 풀 부하 테스트
  - 검색 쿼리 성능 테스트
  - 쓰기 작업 부하 테스트

### 2. `코딩코딩 JMeter.jmx` (기존)
- **용도**: 간단한 공지사항 조회 테스트
- **시나리오**: GET /api/dashboard/notices

---

## 🚀 JMeter 설치

### macOS
```bash
# Homebrew로 설치
brew install jmeter

# 버전 확인
jmeter --version
```

### 수동 설치
```bash
# Apache JMeter 다운로드
# https://jmeter.apache.org/download_jmeter.cgi

# 압축 해제
tar -xzf apache-jmeter-5.6.3.tgz

# 실행
cd apache-jmeter-5.6.3/bin
./jmeter
```

---

## 📝 테스트 실행 방법

### GUI 모드 (테스트 설계 및 디버깅)

```bash
# JMeter GUI 실행
jmeter

# 또는 파일 직접 열기
jmeter -t /Users/songdongjun/Desktop/Hamcam/test/performance_test.jmx
```

**GUI에서 할 일:**
1. 파일 → 열기 → `performance_test.jmx` 선택
2. 변수 확인/수정:
   - HOST: localhost (또는 테스트 서버 IP)
   - PORT: 8080
3. 테스트 시나리오 선택 (Thread Group 활성화/비활성화)
4. 실행: 초록색 ▶️ 버튼 클릭
5. 결과 확인: 리스너 탭들 확인

### CLI 모드 (실제 부하 테스트) ⭐ 권장

```bash
# 기본 실행
jmeter -n -t test/performance_test.jmx -l results/test_results.jtl

# 결과를 HTML 리포트로 생성
jmeter -n -t test/performance_test.jmx \
  -l results/test_results.jtl \
  -e -o results/html_report

# 변수 오버라이드
jmeter -n -t test/performance_test.jmx \
  -JHOST=192.168.1.100 \
  -JPORT=8080 \
  -l results/test_results.jtl \
  -e -o results/html_report
```

**옵션 설명:**
- `-n`: Non-GUI 모드
- `-t`: 테스트 계획 파일 경로
- `-l`: 결과 파일 경로 (.jtl)
- `-e`: 테스트 후 리포트 생성
- `-o`: HTML 리포트 출력 디렉토리
- `-J`: 변수 설정

---

## 🎯 테스트 시나리오별 설정

### 시나리오 1: 인덱스 성능 테스트

**목적**: 인덱스 유무에 따른 쿼리 성능 비교

**설정:**
- Thread Group: `[인덱스 테스트] 게시글 조회`
- Users: 50명
- Ramp-up: 10초
- Loop: 10회

**테스트 순서:**
1. **인덱스 없는 상태**에서 실행
2. 결과 저장: `results/index_before.jtl`
3. **인덱스 생성** (SQL 스크립트)
4. **인덱스 있는 상태**에서 재실행
5. 결과 저장: `results/index_after.jtl`
6. 성능 비교

```bash
# 1단계: 인덱스 없이 테스트
jmeter -n -t test/performance_test.jmx \
  -l results/index_before.jtl \
  -Jthreadgroup.name="[인덱스 테스트] 게시글 조회"

# MySQL에서 인덱스 생성
mysql -u root -p hamcam <<EOF
CREATE INDEX idx_post_writer_created ON post(writer_id, created_at);
CREATE INDEX idx_post_category_created ON post(category, created_at);
EOF

# 2단계: 인덱스 있는 상태 테스트
jmeter -n -t test/performance_test.jmx \
  -l results/index_after.jtl \
  -Jthreadgroup.name="[인덱스 테스트] 게시글 조회"
```

### 시나리오 2: 커넥션 풀 크기 비교

**목적**: 커넥션 풀 크기에 따른 TPS/응답시간 변화 측정

**테스트 순서:**

```bash
# 1. 커넥션 풀 크기 5로 설정
# application.yml 수정:
# spring.datasource.hikari.maximum-pool-size: 5

./gradlew bootRun &
sleep 10

jmeter -n -t test/performance_test.jmx \
  -l results/pool_size_5.jtl \
  -e -o results/html_pool_5

# 서버 재시작
pkill -f "java.*hamcam"

# 2. 커넥션 풀 크기 10으로 설정
# application.yml 수정: maximum-pool-size: 10

./gradlew bootRun &
sleep 10

jmeter -n -t test/performance_test.jmx \
  -l results/pool_size_10.jtl \
  -e -o results/html_pool_10

# 3, 4단계 반복 (20, 40)
```

### 시나리오 3: 동시 사용자 증가 테스트

**목적**: 동시 사용자 수에 따른 시스템 한계 파악

```bash
# 50명
jmeter -n -t test/performance_test.jmx \
  -Jthreads=50 \
  -l results/users_50.jtl

# 100명
jmeter -n -t test/performance_test.jmx \
  -Jthreads=100 \
  -l results/users_100.jtl

# 200명
jmeter -n -t test/performance_test.jmx \
  -Jthreads=200 \
  -l results/users_200.jtl

# 500명
jmeter -n -t test/performance_test.jmx \
  -Jthreads=500 \
  -l results/users_500.jtl
```

---

## 📊 결과 분석

### 1. JTL 파일 분석

```bash
# JTL 파일을 HTML 리포트로 변환
jmeter -g results/test_results.jtl -o results/html_report

# 브라우저로 열기
open results/html_report/index.html
```

### 2. 주요 메트릭

| 메트릭 | 설명 | 좋은 값 |
|--------|------|---------|
| **샘플 수 (# Samples)** | 총 요청 수 | - |
| **평균 (Average)** | 평균 응답시간 (ms) | < 500ms |
| **중앙값 (Median)** | 50% 응답시간 | < 300ms |
| **90% Line** | 90번째 백분위수 | < 1000ms |
| **95% Line** | 95번째 백분위수 | < 1500ms |
| **99% Line** | 99번째 백분위수 | < 2000ms |
| **최소 (Min)** | 최소 응답시간 | - |
| **최대 (Max)** | 최대 응답시간 | < 5000ms |
| **오류율 (Error %)** | 실패한 요청 비율 | < 1% |
| **처리량 (Throughput)** | TPS (요청/초) | 높을수록 좋음 |
| **수신 KB/sec** | 네트워크 대역폭 | - |

### 3. CSV 결과 파일 생성

```bash
# 요약 통계를 CSV로 저장
jmeter -n -t test/performance_test.jmx \
  -l results/test_results.jtl \
  -j results/jmeter.log

# JTL을 CSV로 변환 (Python 스크립트)
# results/analyze_results.py 참고
```

---

## 📈 성능 비교 예시

### 인덱스 최적화 전후 비교

| 메트릭 | 인덱스 없음 | 단일 인덱스 | 복합 인덱스 | 개선률 |
|--------|------------|------------|------------|--------|
| 평균 응답시간 | 850ms | 180ms | 65ms | **92.4%** |
| 90% Line | 1200ms | 250ms | 95ms | **92.1%** |
| TPS | 45/s | 220/s | 580/s | **1188%** |
| 오류율 | 2.5% | 0.3% | 0.1% | - |

### 커넥션 풀 크기별 비교

| 풀 크기 | 평균 응답시간 | TPS | 오류율 | 비고 |
|---------|--------------|-----|--------|------|
| 5 | 320ms | 150/s | 5.2% | ❌ 부족 |
| 10 | 180ms | 280/s | 1.1% | ⚠️ 한계치 |
| 20 | 95ms | 420/s | 0.2% | ✅ 최적 |
| 40 | 90ms | 425/s | 0.1% | ⚠️ 과도 (자원 낭비) |

---

## 🔧 문제 해결

### 1. 연결 오류
```
Connection refused
```

**해결:**
```bash
# 서버가 실행 중인지 확인
curl http://localhost:8080/api/health

# 서버 시작
cd back
./gradlew bootRun
```

### 2. 포트 변경
```bash
# JMeter에서 포트 변경
jmeter -n -t test/performance_test.jmx -JPORT=9090
```

### 3. 타임아웃 오류
```
Read timed out
```

**해결:**
- Thread Group의 Ramp-up 시간 늘리기
- 동시 사용자 수 줄이기
- 서버 성능 확인

### 4. 메모리 부족
```bash
# JMeter 힙 메모리 증가
export HEAP="-Xms1g -Xmx4g"
jmeter -n -t test/performance_test.jmx
```

---

## 📋 체크리스트

### 테스트 전
- [ ] 테스트 데이터 생성 완료 (265,000건)
- [ ] 서버 실행 중
- [ ] JMeter 설치 완료
- [ ] 결과 디렉토리 생성 (`mkdir -p results`)
- [ ] 데이터베이스 백업

### 테스트 중
- [ ] 서버 로그 모니터링
- [ ] DB 커넥션 상태 확인
- [ ] CPU/메모리 사용률 확인

### 테스트 후
- [ ] 결과 파일 저장
- [ ] HTML 리포트 생성
- [ ] 메트릭 비교 분석
- [ ] 결과 보고서 작성

---

## 🎓 실습 예제

### 예제 1: 간단한 부하 테스트

```bash
# 1. 서버 시작
cd back
./gradlew bootRun &

# 2. JMeter 테스트 실행
cd ..
jmeter -n -t test/performance_test.jmx \
  -l results/simple_test.jtl \
  -e -o results/simple_report

# 3. 결과 확인
open results/simple_report/index.html

# 4. 서버 종료
pkill -f "java.*hamcam"
```

### 예제 2: 커넥션 풀 비교 스크립트

```bash
#!/bin/bash

POOL_SIZES=(5 10 20 40)

for size in "${POOL_SIZES[@]}"; do
    echo "Testing with pool size: $size"
    
    # application.yml 수정
    sed -i '' "s/maximum-pool-size: .*/maximum-pool-size: $size/" \
        back/src/main/resources/application.yml
    
    # 서버 재시작
    pkill -f "java.*hamcam"
    cd back && ./gradlew bootRun &
    sleep 15
    
    # JMeter 테스트
    cd ..
    jmeter -n -t test/performance_test.jmx \
        -l "results/pool_$size.jtl" \
        -e -o "results/pool_$size"
    
    echo "Completed pool size: $size"
    sleep 5
done

# 서버 종료
pkill -f "java.*hamcam"
echo "All tests completed!"
```

---

## 📚 참고 자료

- [Apache JMeter 공식 문서](https://jmeter.apache.org/usermanual/index.html)
- [JMeter Best Practices](https://jmeter.apache.org/usermanual/best-practices.html)
- [성능 테스트 가이드](https://www.blazemeter.com/blog/jmeter-tutorial)

---

**작성일:** 2025-10-24  
**버전:** 1.0
