package com.hamcam.back.entity.evaluation;

import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.study.team.Unit;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 단원평가 시험 기본 정보 엔티티
 */
@Entity
@Table(name = "unit_evaluation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 응시자
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 단원 정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    /**
     * 시험 시작 시간
     */
    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    /**
     * 시험 종료 시간
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    /**
     * 전체 문제 수
     */
    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    /**
     * 맞힌 문제 수
     */
    @Column(name = "correct_answers")
    private Integer correctAnswers;

    /**
     * 점수 (백분율)
     */
    @Column(name = "score")
    private Double score;

    /**
     * 쉬운 문제 정답 수
     */
    @Builder.Default
    @Column(name = "easy_correct", nullable = false, columnDefinition = "int default 0")
    private Integer easyCorrect = 0;

    /**
     * 중간 문제 정답 수
     */
    @Builder.Default
    @Column(name = "medium_correct", nullable = false, columnDefinition = "int default 0")
    private Integer mediumCorrect = 0;

    /**
     * 어려운 문제 정답 수
     */
    @Builder.Default
    @Column(name = "hard_correct", nullable = false, columnDefinition = "int default 0")
    private Integer hardCorrect = 0;

    /**
     * 시험 완료 여부
     */
    @Builder.Default
    @Column(name = "is_completed", nullable = false, columnDefinition = "boolean default false")
    private Boolean isCompleted = false;

    /**
     * 생성일시
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        }
    }

    /**
     * 시험 완료 처리
     */
    public void complete() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
        calculateScore();
    }

    /**
     * 점수 계산
     */
    private void calculateScore() {
        if (this.totalQuestions != null && this.totalQuestions > 0) {
            this.score = (double) this.correctAnswers / this.totalQuestions * 100;
        }
    }

    /**
     * 어려운 문제 모든 정답 여부 확인
     */
    public boolean isAllHardCorrect() {
        return this.hardCorrect != null && this.hardCorrect == 3; // 어려운 문제 3개 모두 정답
    }
}