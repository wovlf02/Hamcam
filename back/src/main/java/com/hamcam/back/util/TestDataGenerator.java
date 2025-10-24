package com.hamcam.back.util;

import com.hamcam.back.entity.MathProblem;
import com.hamcam.back.entity.MathProblemAttempt;
import com.hamcam.back.entity.Student;
import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.community.Comment;
import com.hamcam.back.entity.community.Post;
import com.hamcam.back.entity.community.PostCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 대용량 테스트 데이터 생성 유틸리티
 * 
 * 사용 방법:
 * 1. application.yml에 spring.profiles.active=test-data 추가
 * 2. 애플리케이션 실행 시 자동으로 데이터 생성
 * 
 * 주의: 프로덕션 환경에서는 절대 활성화하지 말것!
 */
@Slf4j
@Component
@Profile("test-data")  // test-data 프로파일에서만 실행
@RequiredArgsConstructor
public class TestDataGenerator implements CommandLineRunner {

    private final EntityManager entityManager;
    private final Random random = new Random();

    // 배치 크기 설정
    private static final int BATCH_SIZE = 1000;

    @Override
    public void run(String... args) throws Exception {
        log.info("========================================");
        log.info("🚀 테스트 데이터 생성 시작");
        log.info("========================================");

        long startTime = System.currentTimeMillis();

        try {
            // 데이터 생성 순서 (FK 제약 조건 고려)
            generateUsers(10000);           // 10,000명
            generateStudents(5000);         // 5,000명
            generatePosts(50000);           // 50,000개
            generateComments(100000);       // 100,000개
            generateMathAttempts(100000);   // 100,000개

            long endTime = System.currentTimeMillis();
            long duration = (endTime - startTime) / 1000;

            log.info("========================================");
            log.info("✅ 테스트 데이터 생성 완료!");
            log.info("⏱️  소요 시간: {}초", duration);
            log.info("========================================");

            // 생성된 데이터 확인
            printDataStatistics();

        } catch (Exception e) {
            log.error("❌ 테스트 데이터 생성 중 오류 발생", e);
            throw e;
        }
    }

    /**
     * 사용자 대량 생성
     */
    @Transactional
    public void generateUsers(int count) {
        log.info("👥 사용자 {}명 생성 중...", count);

        List<User> users = new ArrayList<>();
        String[] studyHabits = {"아침형", "저녁형", "주말형", "자유형"};

        for (int i = 1; i <= count; i++) {
            User user = User.builder()
                    .username("testuser" + i)
                    .name("테스트유저" + i)
                    .password("$2a$10$dummypasswordhashfortest1234567890")
                    .nickname("닉네임" + i)
                    .email("testuser" + i + "@test.com")
                    .profileImageUrl("/profiles/" + i + ".jpg")
                    .grade(1 + random.nextInt(12))
                    .studyHabit(studyHabits[random.nextInt(studyHabits.length)])
                    .phone("010" + String.format("%08d", random.nextInt(100000000)))
                    .point(random.nextInt(10000))
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(365)))
                    .updatedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .build();

            users.add(user);

            // 배치 처리
            if (i % BATCH_SIZE == 0) {
                saveBatch(users);
                users.clear();
                log.info("   - {}명 처리 완료", i);
            }
        }

        // 남은 데이터 저장
        if (!users.isEmpty()) {
            saveBatch(users);
        }

        log.info("✅ 사용자 생성 완료: {}명", count);
    }

    /**
     * 학생 데이터 대량 생성
     */
    @Transactional
    public void generateStudents(int count) {
        log.info("📚 학생 {}명 생성 중...", count);

        List<Student> students = new ArrayList<>();
        Student.MathLevel[] levels = Student.MathLevel.values();
        String[] schools = {"테스트중학교1", "테스트중학교2", "테스트중학교3", "테스트중학교4", "테스트중학교5"};

        for (int i = 1; i <= count; i++) {
            int totalSolved = random.nextInt(500);
            int totalCorrect = (int) (totalSolved * (0.5 + random.nextDouble() * 0.4));

            Student student = Student.builder()
                    .username("student" + i)
                    .email("student" + i + "@school.com")
                    .name("학생" + i)
                    .school(schools[random.nextInt(schools.length)])
                    .grade(1 + random.nextInt(12))
                    .classNumber(1 + random.nextInt(10))
                    .studentNumber(1 + random.nextInt(40))
                    .currentMathLevel(levels[random.nextInt(levels.length)])
                    .totalSolvedProblems(totalSolved)
                    .totalCorrectAnswers(totalCorrect)
                    .averageAccuracy(totalSolved > 0 ? (double) totalCorrect / totalSolved * 100 : 0.0)
                    .streakCount(random.nextInt(20))
                    .maxStreakCount(random.nextInt(50))
                    .isActive(true)
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(365)))
                    .updatedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .build();

            students.add(student);

            if (i % BATCH_SIZE == 0) {
                saveBatch(students);
                students.clear();
                log.info("   - {}명 처리 완료", i);
            }
        }

        if (!students.isEmpty()) {
            saveBatch(students);
        }

        log.info("✅ 학생 생성 완료: {}명", count);
    }

    /**
     * 게시글 대량 생성
     */
    @Transactional
    public void generatePosts(int count) {
        log.info("📝 게시글 {}개 생성 중...", count);

        List<Post> posts = new ArrayList<>();
        PostCategory[] categories = PostCategory.values();

        // 사용자 ID 범위 조회
        Long maxUserId = entityManager
                .createQuery("SELECT MAX(u.id) FROM User u", Long.class)
                .getSingleResult();

        if (maxUserId == null || maxUserId == 0) {
            log.error("❌ 사용자 데이터가 없습니다. 먼저 사용자를 생성해주세요.");
            return;
        }

        for (int i = 1; i <= count; i++) {
            Long randomUserId = 1 + (long) (random.nextDouble() * maxUserId);
            User writer = entityManager.getReference(User.class, randomUserId);

            String content = "이것은 테스트용 게시글 내용입니다. 게시글 번호: " + i + ". " +
                    "성능 테스트를 위한 더미 데이터입니다. " +
                    "테스트 내용입니다. ".repeat(20);

            Post post = Post.builder()
                    .title("[테스트] 게시글 제목 " + i)
                    .category(categories[random.nextInt(categories.length)])
                    .content(content)
                    .tag("태그" + random.nextInt(10) + ",태그" + random.nextInt(10))
                    .writer(writer)
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(365)))
                    .updatedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .likeCount(random.nextInt(100))
                    .viewCount(random.nextInt(1000))
                    .commentCount(random.nextInt(50))
                    .build();

            posts.add(post);

            if (i % BATCH_SIZE == 0) {
                saveBatch(posts);
                posts.clear();
                entityManager.clear();  // 메모리 관리
                log.info("   - {}개 처리 완료", i);
            }
        }

        if (!posts.isEmpty()) {
            saveBatch(posts);
        }

        log.info("✅ 게시글 생성 완료: {}개", count);
    }

    /**
     * 댓글 대량 생성
     */
    @Transactional
    public void generateComments(int count) {
        log.info("💬 댓글 {}개 생성 중...", count);

        List<Comment> comments = new ArrayList<>();

        Long maxUserId = entityManager
                .createQuery("SELECT MAX(u.id) FROM User u", Long.class)
                .getSingleResult();

        Long maxPostId = entityManager
                .createQuery("SELECT MAX(p.id) FROM Post p", Long.class)
                .getSingleResult();

        if (maxPostId == null || maxPostId == 0) {
            log.error("❌ 게시글 데이터가 없습니다. 먼저 게시글을 생성해주세요.");
            return;
        }

        for (int i = 1; i <= count; i++) {
            Long randomUserId = 1 + (long) (random.nextDouble() * maxUserId);
            Long randomPostId = 1 + (long) (random.nextDouble() * maxPostId);

            User writer = entityManager.getReference(User.class, randomUserId);
            Post post = entityManager.getReference(Post.class, randomPostId);

            String content = "테스트 댓글 내용입니다. 댓글 번호: " + i + ". " +
                    "이것은 성능 테스트를 위한 더미 댓글입니다. " +
                    "댓글 내용 ".repeat(10);

            Comment comment = Comment.builder()
                    .content(content)
                    .writer(writer)
                    .post(post)
                    .createdAt(LocalDateTime.now().minusDays(random.nextInt(180)))
                    .updatedAt(LocalDateTime.now().minusDays(random.nextInt(30)))
                    .likeCount(random.nextInt(20))
                    .build();

            comments.add(comment);

            if (i % BATCH_SIZE == 0) {
                saveBatch(comments);
                comments.clear();
                entityManager.clear();
                log.info("   - {}개 처리 완료", i);
            }
        }

        if (!comments.isEmpty()) {
            saveBatch(comments);
        }

        log.info("✅ 댓글 생성 완료: {}개", count);
    }

    /**
     * 수학 문제 풀이 기록 대량 생성
     */
    @Transactional
    public void generateMathAttempts(int count) {
        log.info("📊 수학 문제 풀이 기록 {}개 생성 중...", count);

        List<MathProblemAttempt> attempts = new ArrayList<>();

        Long maxStudentId = entityManager
                .createQuery("SELECT MAX(s.id) FROM Student s", Long.class)
                .getSingleResult();

        if (maxStudentId == null || maxStudentId == 0) {
            log.error("❌ 학생 데이터가 없습니다. 먼저 학생을 생성해주세요.");
            return;
        }

        MathProblemAttempt.AttemptType[] types = MathProblemAttempt.AttemptType.values();

        for (int i = 1; i <= count; i++) {
            Long randomStudentId = 1 + (long) (random.nextDouble() * maxStudentId);
            Long randomProblemId = 1 + (long) (random.nextDouble() * 100);  // 문제 1~100

            Student student = entityManager.getReference(Student.class, randomStudentId);
            MathProblem mathProblem = entityManager.getReference(MathProblem.class, randomProblemId);

            boolean isCorrect = random.nextDouble() > 0.3;  // 70% 정답률

            MathProblemAttempt attempt = MathProblemAttempt.builder()
                    .student(student)
                    .mathProblem(mathProblem)
                    .studentAnswer("답안_" + random.nextInt(100))
                    .isCorrect(isCorrect)
                    .timeSpent(30 + random.nextInt(600))  // 30~630초
                    .attemptsCount(1 + random.nextInt(3))
                    .type(types[random.nextInt(types.length)])
                    .feedback(isCorrect ? "정답입니다!" : "다시 한번 생각해보세요.")
                    .hintsUsed(random.nextInt(3))
                    .attemptedAt(LocalDateTime.now().minusDays(random.nextInt(180)))
                    .build();

            attempts.add(attempt);

            if (i % BATCH_SIZE == 0) {
                saveBatch(attempts);
                attempts.clear();
                entityManager.clear();
                log.info("   - {}개 처리 완료", i);
            }
        }

        if (!attempts.isEmpty()) {
            saveBatch(attempts);
        }

        log.info("✅ 수학 문제 풀이 기록 생성 완료: {}개", count);
    }

    /**
     * 배치 저장
     */
    private <T> void saveBatch(List<T> entities) {
        for (T entity : entities) {
            entityManager.persist(entity);
        }
        entityManager.flush();
    }

    /**
     * 생성된 데이터 통계 출력
     */
    @Transactional(readOnly = true)
    public void printDataStatistics() {
        log.info("========================================");
        log.info("📊 데이터 생성 통계");
        log.info("========================================");

        Long userCount = entityManager
                .createQuery("SELECT COUNT(u) FROM User u", Long.class)
                .getSingleResult();
        log.info("👥 Users: {}명", userCount);

        Long studentCount = entityManager
                .createQuery("SELECT COUNT(s) FROM Student s", Long.class)
                .getSingleResult();
        log.info("📚 Students: {}명", studentCount);

        Long postCount = entityManager
                .createQuery("SELECT COUNT(p) FROM Post p", Long.class)
                .getSingleResult();
        log.info("📝 Posts: {}개", postCount);

        Long commentCount = entityManager
                .createQuery("SELECT COUNT(c) FROM Comment c", Long.class)
                .getSingleResult();
        log.info("💬 Comments: {}개", commentCount);

        Long attemptCount = entityManager
                .createQuery("SELECT COUNT(a) FROM MathProblemAttempt a", Long.class)
                .getSingleResult();
        log.info("📊 Math Attempts: {}개", attemptCount);

        log.info("========================================");
    }
}
