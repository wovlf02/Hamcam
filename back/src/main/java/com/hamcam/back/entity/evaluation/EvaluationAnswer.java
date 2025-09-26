package com.hamcam.back.entity.evaluation;

import com.hamcam.back.entity.study.team.Problem;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 단원평가 개별 문제 답안 엔티티
 */
@Entity
@Table(name = "evaluation_answer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 소속 단원평가
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false)
    private UnitEvaluation evaluation;

    /**
     * 문제 정보
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    /**
     * 학생이 제출한 답안
     */
    @Column(name = "user_answer", length = 500)
    private String userAnswer;

    /**
     * 정답 여부
     */
    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    /**
     * 문제 난이도 (easy, medium, hard)
     */
    @Column(name = "difficulty", nullable = false, length = 20)
    private String difficulty;

    /**
     * 답안 제출 시간
     */
    @Column(name = "answered_at", nullable = false)
    private LocalDateTime answeredAt;

    @PrePersist
    protected void onCreate() {
        if (this.answeredAt == null) {
            this.answeredAt = LocalDateTime.now();
        }
    }

    /**
     * 정답 확인 및 설정
     */
    public void checkAnswer() {
        if (this.problem != null && this.userAnswer != null) {
            String correctAnswer = this.problem.getAnswer().trim();
            String userAnswerTrimmed = this.userAnswer.trim();
            this.isCorrect = correctAnswer.equalsIgnoreCase(userAnswerTrimmed);
        }
    }
}