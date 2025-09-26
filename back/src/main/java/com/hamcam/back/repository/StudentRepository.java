package com.hamcam.back.repository;

import com.hamcam.back.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // 사용자명으로 학생 조회
    Optional<Student> findByUsernameAndIsActiveTrue(String username);

    // 이메일로 학생 조회
    Optional<Student> findByEmailAndIsActiveTrue(String email);

    // 학교별 학생 조회
    List<Student> findBySchoolAndIsActiveTrueOrderByGradeAscClassNumberAscStudentNumberAsc(String school);

    // 학년별 학생 조회
    List<Student> findByGradeAndIsActiveTrueOrderByNameAsc(Integer grade);

    // 수학 레벨별 학생 조회
    List<Student> findByCurrentMathLevelAndIsActiveTrueOrderByAverageAccuracyDesc(Student.MathLevel mathLevel);

    // 상위 성취도 학생들 조회
    @Query("SELECT s FROM Student s WHERE s.isActive = true ORDER BY s.averageAccuracy DESC, s.totalCorrectAnswers DESC")
    List<Student> findTopPerformingStudents();

    // 특정 정답률 이상 학생들 조회
    @Query("SELECT s FROM Student s WHERE s.averageAccuracy >= :accuracy AND s.isActive = true ORDER BY s.averageAccuracy DESC")
    List<Student> findStudentsWithAccuracyAbove(@Param("accuracy") Double accuracy);

    // 특정 연속 정답 횟수 이상 학생들 조회
    @Query("SELECT s FROM Student s WHERE s.streakCount >= :streakCount AND s.isActive = true ORDER BY s.streakCount DESC")
    List<Student> findStudentsWithStreakAbove(@Param("streakCount") Integer streakCount);

    // 레벨업 조건을 만족하는 학생들 조회
    @Query("SELECT s FROM Student s WHERE s.streakCount >= 10 AND s.averageAccuracy >= 80.0 AND s.isActive = true")
    List<Student> findStudentsEligibleForLevelUp();

    // 학급별 학생 조회
    @Query("SELECT s FROM Student s WHERE s.school = :school AND s.grade = :grade AND s.classNumber = :classNumber AND s.isActive = true ORDER BY s.studentNumber ASC")
    List<Student> findByClassroom(@Param("school") String school, @Param("grade") Integer grade, @Param("classNumber") Integer classNumber);

    // 수학 레벨별 통계
    @Query("SELECT s.currentMathLevel, COUNT(s) FROM Student s WHERE s.isActive = true GROUP BY s.currentMathLevel")
    List<Object[]> getStatsByMathLevel();

    // 평균 정답률 통계
    @Query("SELECT AVG(s.averageAccuracy) FROM Student s WHERE s.isActive = true")
    Double getAverageAccuracyOfAllStudents();

    // 총 문제 해결 수 통계
    @Query("SELECT SUM(s.totalSolvedProblems) FROM Student s WHERE s.isActive = true")
    Long getTotalSolvedProblemsOfAllStudents();
}