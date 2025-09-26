package com.hamcam.back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "student_wrong_answers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentWrongAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "math_problem_id", nullable = false)
    private MathProblem mathProblem;

    @Column(nullable = false)
    private String wrongAnswer; // 틀린 답안

    @Column(nullable = false)
    private Integer wrongCount; // 틀린 횟수

    @Column(length = 1000)
    private String weaknessAnalysis; // 약점 분석

    @Column(length = 2000)
    private String studyRecommendation; // 학습 권장사항

    @Builder.Default
    @Column(nullable = false)
    private Boolean isResolved = false; // 해결 여부 (나중에 맞췄는지)

    @Column
    private LocalDateTime resolvedAt; // 해결 시점

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 연관관계
    @OneToMany(mappedBy = "wrongAnswer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ReviewAttempt> reviewAttempts;

    // 비즈니스 메서드
    public void resolve() {
        this.isResolved = true;
        this.resolvedAt = LocalDateTime.now();
    }

    public void increaseWrongCount() {
        this.wrongCount++;
    }

    public String getDifficultyLevel() {
        if (wrongCount >= 3) return "매우약함";
        else if (wrongCount >= 2) return "약함";
        else return "보통";
    }

    public boolean needsReview() {
        return !isResolved && wrongCount >= 2;
    }
}