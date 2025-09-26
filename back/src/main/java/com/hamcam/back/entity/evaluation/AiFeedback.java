package com.hamcam.back.entity.evaluation;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * AI 피드백 저장 엔티티
 */
@Entity
@Table(name = "ai_feedback")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 소속 단원평가
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private UnitEvaluation evaluation;

    /**
     * 전체 분석 내용
     */
    @Lob
    @Column(name = "overall_analysis", nullable = false)
    private String overallAnalysis;

    /**
     * 부족한 개념들
     */
    @Lob
    @Column(name = "weak_concepts")
    private String weakConcepts;

    /**
     * 학습 권장사항
     */
    @Lob
    @Column(name = "study_recommendations")
    private String studyRecommendations;

    /**
     * 향후 학습 계획
     */
    @Lob
    @Column(name = "future_plan")
    private String futurePlan;

    /**
     * 예상 학습 시간 (분)
     */
    @Column(name = "estimated_study_time")
    private Integer estimatedStudyTime;

    /**
     * 추천 문제 유형
     */
    @Column(name = "recommended_problem_types", length = 500)
    private String recommendedProblemTypes;

    /**
     * 피드백 생성 시간
     */
    @Column(name = "generated_at", nullable = false, updatable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
    }
}