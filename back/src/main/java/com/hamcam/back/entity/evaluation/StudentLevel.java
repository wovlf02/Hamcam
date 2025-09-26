package com.hamcam.back.entity.evaluation;

import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.study.team.Unit;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 학생의 단원별 학습 레벨 관리 엔티티
 */
@Entity
@Table(name = "student_level", 
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "unit_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 학생
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * 단원
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    /**
     * 현재 레벨 (1: 초급, 2: 중급, 3: 고급)
     */
    @Builder.Default
    @Column(name = "current_level", nullable = false)
    private Integer currentLevel = 1;

    /**
     * 어려운 문제 연속 정답 횟수
     */
    @Builder.Default
    @Column(name = "hard_streak", nullable = false)
    private Integer hardStreak = 0;

    /**
     * 총 시도 횟수
     */
    @Builder.Default
    @Column(name = "total_attempts", nullable = false)
    private Integer totalAttempts = 0;

    /**
     * 총 정답 횟수
     */
    @Builder.Default
    @Column(name = "total_correct", nullable = false)
    private Integer totalCorrect = 0;

    /**
     * 평균 점수
     */
    @Column(name = "average_score")
    private Double averageScore;

    /**
     * 마지막 업데이트 시간
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 생성일시
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 어려운 문제 정답 처리
     */
    public void addHardCorrect() {
        this.hardStreak++;
        if (this.hardStreak >= 3 && this.currentLevel < 3) {
            this.currentLevel++;
            this.hardStreak = 0; // 레벨업 후 스트릭 초기화
        }
    }

    /**
     * 어려운 문제 오답 처리
     */
    public void resetHardStreak() {
        this.hardStreak = 0;
    }

    /**
     * 평가 결과 반영
     */
    public void updateWithEvaluation(UnitEvaluation evaluation) {
        this.totalAttempts++;
        this.totalCorrect += evaluation.getCorrectAnswers();
        
        // 평균 점수 계산
        this.averageScore = (double) this.totalCorrect / (this.totalAttempts * evaluation.getTotalQuestions()) * 100;
        
        // 어려운 문제 전부 맞춘 경우 레벨업 체크
        if (evaluation.getHardCorrect() == 3) {
            addHardCorrect();
        } else if (evaluation.getHardCorrect() < 3) {
            resetHardStreak();
        }
    }

    /**
     * 레벨 문자열 반환
     */
    public String getLevelString() {
        switch (this.currentLevel) {
            case 1: return "초급";
            case 2: return "중급";
            case 3: return "고급";
            default: return "초급";
        }
    }
}