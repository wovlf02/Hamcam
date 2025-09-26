package com.hamcam.back.repository.evaluation;

import com.hamcam.back.entity.evaluation.EvaluationAnswer;
import com.hamcam.back.entity.evaluation.UnitEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationAnswerRepository extends JpaRepository<EvaluationAnswer, Long> {

    /**
     * 특정 평가의 모든 답안 조회
     */
    List<EvaluationAnswer> findByEvaluationOrderByAnsweredAt(UnitEvaluation evaluation);

    /**
     * 특정 평가의 틀린 답안들만 조회
     */
    List<EvaluationAnswer> findByEvaluationAndIsCorrectFalse(UnitEvaluation evaluation);

    /**
     * 특정 평가의 난이도별 정답 개수
     */
    @Query("SELECT COUNT(ea) FROM EvaluationAnswer ea WHERE ea.evaluation = :evaluation AND ea.difficulty = :difficulty AND ea.isCorrect = true")
    Long countCorrectByEvaluationAndDifficulty(@Param("evaluation") UnitEvaluation evaluation, @Param("difficulty") String difficulty);

    /**
     * 특정 평가의 난이도별 전체 문제 개수
     */
    @Query("SELECT COUNT(ea) FROM EvaluationAnswer ea WHERE ea.evaluation = :evaluation AND ea.difficulty = :difficulty")
    Long countByEvaluationAndDifficulty(@Param("evaluation") UnitEvaluation evaluation, @Param("difficulty") String difficulty);
}