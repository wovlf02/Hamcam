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
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username; // 학생 아이디

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String name; // 실명

    @Column
    private String school; // 학교명

    @Column
    private Integer grade; // 학년

    @Column
    private Integer classNumber; // 반

    @Column
    private Integer studentNumber; // 번호

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private MathLevel currentMathLevel = MathLevel.BEGINNER; // 현재 수학 레벨

    @Builder.Default
    @Column
    private Integer totalSolvedProblems = 0; // 총 해결한 문제 수

    @Builder.Default
    @Column
    private Integer totalCorrectAnswers = 0; // 총 정답 수

    @Builder.Default
    @Column
    private Double averageAccuracy = 0.0; // 평균 정답률

    @Builder.Default
    @Column
    private Integer streakCount = 0; // 연속 정답 횟수

    @Builder.Default
    @Column
    private Integer maxStreakCount = 0; // 최대 연속 정답 횟수

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true; // 활성화 여부

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 연관관계
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MathProblemAttempt> attempts;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentWrongAnswer> wrongAnswers;

    public enum MathLevel {
        BEGINNER("초급", 1),
        ELEMENTARY("초등", 2),
        MIDDLE("중등", 3),
        HIGH("고등", 4),
        ADVANCED("고급", 5);

        private final String description;
        private final Integer level;

        MathLevel(String description, Integer level) {
            this.description = description;
            this.level = level;
        }

        public String getDescription() {
            return description;
        }

        public Integer getLevel() {
            return level;
        }
    }

    // 비즈니스 메서드
    public void updateStatistics(boolean isCorrect) {
        this.totalSolvedProblems++;
        
        if (isCorrect) {
            this.totalCorrectAnswers++;
            this.streakCount++;
            if (this.streakCount > this.maxStreakCount) {
                this.maxStreakCount = this.streakCount;
            }
        } else {
            this.streakCount = 0;
        }
        
        this.averageAccuracy = (double) this.totalCorrectAnswers / this.totalSolvedProblems * 100;
    }

    public void levelUp() {
        MathLevel[] levels = MathLevel.values();
        for (int i = 0; i < levels.length - 1; i++) {
            if (levels[i] == this.currentMathLevel) {
                this.currentMathLevel = levels[i + 1];
                break;
            }
        }
    }

    public boolean canLevelUp() {
        // 연속 정답 10개 이상이고 정답률 80% 이상일 때 레벨업
        return this.streakCount >= 10 && this.averageAccuracy >= 80.0;
    }

    public String getProgressStatus() {
        if (averageAccuracy >= 90) return "우수";
        else if (averageAccuracy >= 80) return "양호";
        else if (averageAccuracy >= 70) return "보통";
        else if (averageAccuracy >= 60) return "미흡";
        else return "부족";
    }
}