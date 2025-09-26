package com.hamcam.back.repository;

import com.hamcam.back.entity.MathProblemAttempt;
import com.hamcam.back.entity.Student;
import com.hamcam.back.entity.MathProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MathProblemAttemptRepository extends JpaRepository<MathProblemAttempt, Long> {

    // 학생별 시도 기록 조회
    List<MathProblemAttempt> findByStudentOrderByAttemptedAtDesc(Student student);

    // 학생별 특정 문제 시도 기록 조회
    List<MathProblemAttempt> findByStudentAndMathProblemOrderByAttemptedAtDesc(Student student, MathProblem mathProblem);

    // 학생의 최근 시도 기록 조회
    Optional<MathProblemAttempt> findTopByStudentAndMathProblemOrderByAttemptedAtDesc(Student student, MathProblem mathProblem);

    // 학생별 정답/오답 통계
    @Query("SELECT COUNT(a) FROM MathProblemAttempt a WHERE a.student = :student AND a.isCorrect = :isCorrect")
    Long countByStudentAndIsCorrect(@Param("student") Student student, @Param("isCorrect") Boolean isCorrect);

    // 학생별 전체 시도 수
    @Query("SELECT COUNT(a) FROM MathProblemAttempt a WHERE a.student = :student")
    Long countByStudent(@Param("student") Student student);

    // 학생별 난이도별 시도 통계
    @Query("SELECT COUNT(a) FROM MathProblemAttempt a WHERE a.student = :student AND a.mathProblem.difficultyGrade = :difficultyGrade")
    Long countByStudentAndDifficultyGrade(@Param("student") Student student, @Param("difficultyGrade") Integer difficultyGrade);

    // 학생별 과목별 시도 통계
    @Query("SELECT COUNT(a) FROM MathProblemAttempt a WHERE a.student = :student AND a.mathProblem.subject = :subject")
    Long countByStudentAndSubject(@Param("student") Student student, @Param("subject") String subject);

    // 학생의 평균 소요 시간
    @Query("SELECT AVG(a.timeSpent) FROM MathProblemAttempt a WHERE a.student = :student")
    Double getAverageTimeSpentByStudent(@Param("student") Student student);

    // 학생의 정답률
    @Query("SELECT CAST(COUNT(CASE WHEN a.isCorrect = true THEN 1 END) AS double) / COUNT(a) * 100 FROM MathProblemAttempt a WHERE a.student = :student")
    Double getAccuracyRateByStudent(@Param("student") Student student);

    // 특정 기간 내 시도 기록
    List<MathProblemAttempt> findByStudentAndAttemptedAtBetweenOrderByAttemptedAtDesc(
            Student student, LocalDateTime startDate, LocalDateTime endDate);

    // 학생별 시도 유형별 조회
    List<MathProblemAttempt> findByStudentAndTypeOrderByAttemptedAtDesc(Student student, MathProblemAttempt.AttemptType type);

    // 문제별 통계 - 정답률
    @Query("SELECT CAST(COUNT(CASE WHEN a.isCorrect = true THEN 1 END) AS double) / COUNT(a) * 100 FROM MathProblemAttempt a WHERE a.mathProblem = :mathProblem")
    Double getAccuracyRateByProblem(@Param("mathProblem") MathProblem mathProblem);

    // 문제별 평균 소요 시간
    @Query("SELECT AVG(a.timeSpent) FROM MathProblemAttempt a WHERE a.mathProblem = :mathProblem")
    Double getAverageTimeSpentByProblem(@Param("mathProblem") MathProblem mathProblem);

    // 학생의 최근 연속 정답/오답 상태 확인
    @Query("SELECT a FROM MathProblemAttempt a WHERE a.student = :student ORDER BY a.attemptedAt DESC")
    List<MathProblemAttempt> findRecentAttemptsByStudent(@Param("student") Student student);

    // 힌트 사용 통계
    @Query("SELECT AVG(a.hintsUsed) FROM MathProblemAttempt a WHERE a.student = :student AND a.hintsUsed > 0")
    Double getAverageHintsUsedByStudent(@Param("student") Student student);

    // 학생의 약점 분석용 틀린 문제들
    @Query("SELECT a FROM MathProblemAttempt a WHERE a.student = :student AND a.isCorrect = false ORDER BY a.attemptedAt DESC")
    List<MathProblemAttempt> findWrongAttemptsByStudent(@Param("student") Student student);

    // 학생별 과목별 정답률
    @Query("SELECT a.mathProblem.subject, CAST(COUNT(CASE WHEN a.isCorrect = true THEN 1 END) AS double) / COUNT(a) * 100 " +
           "FROM MathProblemAttempt a WHERE a.student = :student GROUP BY a.mathProblem.subject")
    List<Object[]> getAccuracyRateBySubjectForStudent(@Param("student") Student student);
    
    // ===========================================
    // 2025년 모의평가 관련 새로운 메서드들
    // ===========================================
    
    // 학생 ID로 최근 시도 기록 조회 (Limit 적용)
    @Query("SELECT a FROM MathProblemAttempt a WHERE a.student.id = :studentId ORDER BY a.attemptedAt DESC")
    List<MathProblemAttempt> findTopByStudentIdOrderByAttemptTimeDesc(@Param("studentId") Long studentId, int limit);
    
    // AI 피드백용: 학생별 최근 20개 시도 기록
    @Query("SELECT a FROM MathProblemAttempt a WHERE a.student.id = :studentId ORDER BY a.attemptedAt DESC")
    List<MathProblemAttempt> findTop20ByStudentIdOrderByAttemptedAtDesc(@Param("studentId") Long studentId);
}