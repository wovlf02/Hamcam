package com.hamcam.back.repository;

import com.hamcam.back.entity.StudentWrongAnswer;
import com.hamcam.back.entity.Student;
import com.hamcam.back.entity.MathProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentWrongAnswerRepository extends JpaRepository<StudentWrongAnswer, Long> {

    // 학생별 오답 목록 조회
    List<StudentWrongAnswer> findByStudentAndIsResolvedFalseOrderByWrongCountDescCreatedAtDesc(Student student);

    // 학생별 모든 오답 목록 조회 (해결된 것 포함)
    List<StudentWrongAnswer> findByStudentOrderByCreatedAtDesc(Student student);

    // 학생의 특정 문제 오답 기록 조회
    Optional<StudentWrongAnswer> findByStudentAndMathProblem(Student student, MathProblem mathProblem);

    // 복습이 필요한 오답들 (틀린 횟수 2회 이상, 미해결)
    @Query("SELECT w FROM StudentWrongAnswer w WHERE w.student = :student AND w.wrongCount >= 2 AND w.isResolved = false ORDER BY w.wrongCount DESC")
    List<StudentWrongAnswer> findNeedsReviewByStudent(@Param("student") Student student);

    // 학생별 과목별 오답 통계
    @Query("SELECT w.mathProblem.subject, COUNT(w) FROM StudentWrongAnswer w WHERE w.student = :student AND w.isResolved = false GROUP BY w.mathProblem.subject ORDER BY COUNT(w) DESC")
    List<Object[]> getWrongAnswerStatsBySubject(@Param("student") Student student);

    // 학생별 난이도별 오답 통계
    @Query("SELECT w.mathProblem.difficultyGrade, COUNT(w) FROM StudentWrongAnswer w WHERE w.student = :student AND w.isResolved = false GROUP BY w.mathProblem.difficultyGrade")
    List<Object[]> getWrongAnswerStatsByDifficultyGrade(@Param("student") Student student);

    // 가장 많이 틀린 문제들 (전체 학생 기준)
    @Query("SELECT w.mathProblem, COUNT(w) as wrongCount FROM StudentWrongAnswer w WHERE w.isResolved = false GROUP BY w.mathProblem ORDER BY wrongCount DESC")
    List<Object[]> getMostWrongProblems();

        // 학생의 약한 과목 조회 (오답 빈도 높은 순)
    @Query("SELECT w.mathProblem.subject FROM StudentWrongAnswer w WHERE w.student = :student AND w.isResolved = false GROUP BY w.mathProblem.subject ORDER BY COUNT(w) DESC, SUM(w.wrongCount) DESC")
    List<String> getWeakSubjectsByStudent(@Param("student") Student student);

    // 학생의 약점 과목 세부 분석
    @Query("SELECT w.mathProblem.subjectDetail FROM StudentWrongAnswer w WHERE w.student = :student AND w.isResolved = false GROUP BY w.mathProblem.subjectDetail ORDER BY COUNT(w) DESC, SUM(w.wrongCount) DESC")
    List<String> getWeakChaptersByStudent(@Param("student") Student student);

    // 특정 과목의 미해결 오답 개수
    @Query("SELECT COUNT(w) FROM StudentWrongAnswer w WHERE w.student = :student AND w.mathProblem.subject = :subject AND w.isResolved = false")
    Long countUnresolvedByStudentAndSubject(@Param("student") Student student, @Param("subject") String subject);

    // 학생의 전체 미해결 오답 개수
    Long countByStudentAndIsResolvedFalse(Student student);

    // 학생의 해결된 오답 개수
    Long countByStudentAndIsResolvedTrue(Student student);

    // 최근 해결된 오답들
    @Query("SELECT w FROM StudentWrongAnswer w WHERE w.student = :student AND w.isResolved = true ORDER BY w.resolvedAt DESC")
    List<StudentWrongAnswer> findRecentlyResolvedByStudent(@Param("student") Student student);

    // 오랜 기간 미해결된 오답들 (우선순위 높음)
    @Query("SELECT w FROM StudentWrongAnswer w WHERE w.student = :student AND w.isResolved = false AND w.wrongCount >= 3 ORDER BY w.createdAt ASC")
    List<StudentWrongAnswer> findLongUnresolvedByStudent(@Param("student") Student student);

    // 특정 과목의 오답들
    @Query("SELECT w FROM StudentWrongAnswer w WHERE w.student = :student AND w.mathProblem.subject = :subject AND w.isResolved = false")
    List<StudentWrongAnswer> findByStudentAndSubject(@Param("student") Student student, @Param("subject") String subject);
    
    // ===========================================
    // 2025년 모의평가 관련 새로운 메서드들
    // ===========================================
    
    // 학생 ID로 오답 목록 조회
    List<StudentWrongAnswer> findByStudentId(Long studentId);
    
    // 학생과 문제로 오답 존재 여부 확인
    boolean existsByStudentAndMathProblem(Student student, MathProblem mathProblem);
    
    // AI 피드백용: 학생별 최근 20개 오답 기록
    @Query("SELECT w FROM StudentWrongAnswer w WHERE w.student.id = :studentId ORDER BY w.createdAt DESC")
    List<StudentWrongAnswer> findTop20ByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);
}