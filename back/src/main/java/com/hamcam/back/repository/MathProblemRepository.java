package com.hamcam.back.repository;

import com.hamcam.back.entity.MathProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MathProblemRepository extends JpaRepository<MathProblem, Long> {

    // 활성화된 문제들 조회
    List<MathProblem> findByIsActiveTrueOrderByCreatedAtDesc();

    // 과목별 문제 조회 (활성화된 것만)
    List<MathProblem> findBySubjectOrderByDifficultyGradeAsc(String subject);

    // 난이도별 문제 조회 (difficultyGrade 사용)
    List<MathProblem> findByDifficultyGradeOrderByCreatedAtDesc(Integer difficultyGrade);

    // 과목 + 난이도별 문제 조회 (difficultyGrade 사용)
    List<MathProblem> findBySubjectAndDifficultyGradeOrderByCreatedAtDesc(String subject, Integer difficultyGrade);

    // 과목별 문제 조회
    List<MathProblem> findBySubjectAndIsActiveTrueOrderByDifficultyGradeAsc(String subject);

    // 랜덤 문제 조회 (난이도 등급별) - difficultyGrade 필드 사용
    @Query(value = "SELECT * FROM math_problems WHERE difficulty_grade = :difficultyGrade ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<MathProblem> findRandomProblemsByDifficultyString(@Param("difficultyGrade") Integer difficultyGrade, @Param("limit") int limit);
    
    // 랜덤 문제 조회 (난이도 등급별)
    @Query(value = "SELECT * FROM math_problems WHERE difficulty_grade = :difficultyGrade ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<MathProblem> findRandomProblemsByDifficultyGrade(@Param("difficultyGrade") Integer difficultyGrade, @Param("limit") int limit);

    // 특정 과목의 랜덤 문제 조회
    @Query(value = "SELECT * FROM math_problems WHERE subject = :subject ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<MathProblem> findRandomProblemsBySubject(@Param("subject") String subject, @Param("limit") int limit);

    // 난이도별 문제 개수 조회 (difficultyGrade 사용)
    @Query("SELECT COUNT(p) FROM MathProblem p WHERE p.difficultyGrade = :difficultyGrade")
    Long countByDifficultyGradeAndIsActiveTrue(@Param("difficultyGrade") Integer difficultyGrade);

    // 과목별 문제 개수 조회
    @Query("SELECT COUNT(p) FROM MathProblem p WHERE p.subject = :subject")
    Long countBySubjectAndIsActiveTrue(@Param("subject") String subject);

    // 모든 과목 목록 조회
    @Query("SELECT DISTINCT p.subject FROM MathProblem p ORDER BY p.subject")
    List<String> findDistinctSubjects();

    // 모든 상세 분야 목록 조회
    @Query("SELECT DISTINCT p.subjectDetail FROM MathProblem p ORDER BY p.subjectDetail")
    List<String> findDistinctSubjectDetails();

    // ===========================================
    // 2025년 모의평가 관련 새로운 메서드들
    // ===========================================
    
    // 과목별 문제 조회
    List<MathProblem> findBySubject(String subject);
    
    // 시험 년월별 문제 조회
    List<MathProblem> findByExamMonthYear(String examMonthYear);
    
    // 난이도 등급별 문제 조회 (1-5등급)
    List<MathProblem> findByDifficultyGrade(int difficultyGrade);
    
    // 시험과 과목으로 문제 조회
    List<MathProblem> findByExamMonthYearAndSubject(String examMonthYear, String subject);
    
    // 시험과 문제번호로 특정 문제 조회
    Optional<MathProblem> findByExamMonthYearAndProblemNumber(String examMonthYear, int problemNumber);
    
    // 난이도 등급 범위 내 랜덤 문제 조회
    @Query(value = "SELECT * FROM math_problems WHERE difficulty_grade BETWEEN :minGrade AND :maxGrade ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<MathProblem> findRandomProblemsByDifficultyRange(@Param("minGrade") int minGrade, @Param("maxGrade") int maxGrade, @Param("limit") int limit);
    
    // 특정 난이도 등급의 랜덤 문제 조회 (오버로드)
    @Query(value = "SELECT * FROM math_problems WHERE difficulty_grade = :grade ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<MathProblem> findRandomProblemsByDifficultyGrade(@Param("grade") int grade, @Param("limit") int limit);
    
    // 학생의 정답률 조회
    @Query(value = "SELECT (COUNT(CASE WHEN mpa.is_correct = true THEN 1 END) * 100.0 / COUNT(*)) AS accuracy_rate " +
           "FROM math_problem_attempts mpa WHERE mpa.student_id = :studentId", nativeQuery = true)
    Double getAccuracyRateByStudent(@Param("studentId") Long studentId);
    
    // 학생의 과목별 정답률 조회
    @Query(value = "SELECT mp.subject, (COUNT(CASE WHEN mpa.is_correct = true THEN 1 END) * 100.0 / COUNT(*)) AS accuracy_rate " +
           "FROM math_problem_attempts mpa " +
           "JOIN math_problems mp ON mpa.math_problem_id = mp.id " +
           "WHERE mpa.student_id = :studentId " +
           "GROUP BY mp.subject", nativeQuery = true)
    List<Object[]> getAccuracyRateBySubject(@Param("studentId") Long studentId);
    
    // 학생의 약한 단원 조회 (정답률 낮은 순)
    @Query(value = "SELECT mp.subject_detail, (COUNT(CASE WHEN mpa.is_correct = true THEN 1 END) * 100.0 / COUNT(*)) AS accuracy_rate " +
           "FROM math_problem_attempts mpa " +
           "JOIN math_problems mp ON mpa.math_problem_id = mp.id " +
           "WHERE mpa.student_id = :studentId " +
           "GROUP BY mp.subject_detail " +
           "HAVING COUNT(*) >= 3 " +
           "ORDER BY accuracy_rate ASC " +
           "LIMIT 5", nativeQuery = true)
    List<String> getWeakUnitsByStudent(@Param("studentId") Long studentId);
    
    // 통계 관련 추가 메서드들
    @Query("SELECT p FROM MathProblem p WHERE p.difficultyGrade IN :difficulties ORDER BY RAND()")
    List<MathProblem> findByDifficultyGradeIn(@Param("difficulties") List<Integer> difficulties);
    
    @Query("SELECT COUNT(p) FROM MathProblem p WHERE p.difficultyGrade = :difficultyGrade")
    Long countByDifficultyGrade(@Param("difficultyGrade") Integer difficultyGrade);
    
    @Query("SELECT COUNT(p) FROM MathProblem p WHERE p.subject = :subject")
    Long countBySubject(@Param("subject") String subject);
    
    @Query("SELECT COUNT(p) FROM MathProblem p WHERE p.subjectDetail = :subjectDetail")
    Long countBySubjectDetail(@Param("subjectDetail") String subjectDetail);
    
    // 서비스에서 사용하는 추가 메서드들 (중복 제거)
    @Query(value = "SELECT * FROM math_problems WHERE difficulty_grade = :grade ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<MathProblem> findRandomProblemsByDifficultyGradeNew(@Param("grade") int grade, @Param("limit") int limit);
}