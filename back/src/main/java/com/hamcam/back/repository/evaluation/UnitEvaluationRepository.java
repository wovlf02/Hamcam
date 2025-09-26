package com.hamcam.back.repository.evaluation;

import com.hamcam.back.entity.evaluation.UnitEvaluation;
import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.study.team.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UnitEvaluationRepository extends JpaRepository<UnitEvaluation, Long> {

    /**
     * 특정 사용자의 완료된 평가 목록 조회 (최신순)
     */
    List<UnitEvaluation> findByUserAndIsCompletedTrueOrderByCompletedAtDesc(User user);

    /**
     * 특정 사용자와 단원의 가장 최근 평가 조회
     */
    Optional<UnitEvaluation> findTopByUserAndUnitOrderByCreatedAtDesc(User user, Unit unit);

    /**
     * 특정 사용자의 미완료 평가 조회
     */
    Optional<UnitEvaluation> findByUserAndIsCompletedFalse(User user);

    /**
     * 특정 기간 내 완료된 평가들
     */
    @Query("SELECT e FROM UnitEvaluation e WHERE e.user = :user AND e.isCompleted = true AND e.completedAt BETWEEN :startDate AND :endDate")
    List<UnitEvaluation> findCompletedEvaluationsBetween(@Param("user") User user, 
                                                        @Param("startDate") LocalDateTime startDate, 
                                                        @Param("endDate") LocalDateTime endDate);

    /**
     * 특정 단원의 평균 점수 조회
     */
    @Query("SELECT AVG(e.score) FROM UnitEvaluation e WHERE e.unit = :unit AND e.isCompleted = true")
    Double getAverageScoreByUnit(@Param("unit") Unit unit);

    /**
     * 사용자의 단원별 최고 점수 조회
     */
    @Query("SELECT MAX(e.score) FROM UnitEvaluation e WHERE e.user = :user AND e.unit = :unit AND e.isCompleted = true")
    Double getMaxScoreByUserAndUnit(@Param("user") User user, @Param("unit") Unit unit);
}