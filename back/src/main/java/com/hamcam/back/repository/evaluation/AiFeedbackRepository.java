package com.hamcam.back.repository.evaluation;

import com.hamcam.back.entity.evaluation.AiFeedback;
import com.hamcam.back.entity.evaluation.UnitEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AiFeedbackRepository extends JpaRepository<AiFeedback, Long> {

    /**
     * 특정 평가의 AI 피드백 조회
     */
    Optional<AiFeedback> findByEvaluation(UnitEvaluation evaluation);

    /**
     * 특정 평가 ID로 AI 피드백 조회
     */
    Optional<AiFeedback> findByEvaluationId(Long evaluationId);
}