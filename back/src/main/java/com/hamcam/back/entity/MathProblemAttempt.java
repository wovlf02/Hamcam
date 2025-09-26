package com.hamcam.back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "math_problem_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MathProblemAttempt {

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
    private String studentAnswer; // 학생이 제출한 답안

    @Column(nullable = false)
    private Boolean isCorrect; // 정답 여부

    @Column(nullable = false)
    private Integer timeSpent; // 소요 시간 (초)

    @Column(nullable = false)
    private Integer attemptsCount; // 시도 횟수

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptType type; // 시도 유형

    @Column(length = 1000)
    private String feedback; // AI 피드백

    @Column
    private Integer hintsUsed; // 사용한 힌트 수

    @CreationTimestamp
    private LocalDateTime attemptedAt;

    public enum AttemptType {
        PRACTICE("연습"),
        EVALUATION("평가"),
        REVIEW("복습");

        private final String description;

        AttemptType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 비즈니스 메서드
    public double getAccuracyRate() {
        return isCorrect ? 100.0 : 0.0;
    }

    public String getEfficiencyLevel() {
        Integer timeLimit = mathProblem.getTimeLimit();
        if (timeLimit == null) return "보통";
        
        double ratio = (double) timeSpent / timeLimit;
        if (ratio <= 0.5) return "매우빠름";
        else if (ratio <= 0.7) return "빠름";
        else if (ratio <= 1.0) return "보통";
        else return "느림";
    }
}