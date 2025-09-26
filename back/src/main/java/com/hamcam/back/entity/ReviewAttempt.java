package com.hamcam.back.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wrong_answer_id", nullable = false)
    private StudentWrongAnswer wrongAnswer;

    @Column(nullable = false)
    private String reviewAnswer; // 복습시 제출한 답안

    @Column(nullable = false)
    private Boolean isCorrect; // 복습 정답 여부

    @Column(nullable = false)
    private Integer timeSpent; // 복습 소요 시간 (초)

    @Column(length = 1000)
    private String notes; // 복습 노트

    @CreationTimestamp
    private LocalDateTime reviewedAt;

    // 비즈니스 메서드
    public boolean isImproved() {
        return isCorrect;
    }

    public String getPerformanceLevel() {
        if (isCorrect) {
            if (timeSpent <= 60) return "우수";
            else if (timeSpent <= 120) return "양호";
            else return "보통";
        }
        return "미흡";
    }
}