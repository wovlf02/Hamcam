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
@Table(name = "math_problems")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MathProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String examMonthYear; // 시험 년월 (예: 2025_06, 2025_09)

    @Column(nullable = false)
    private Integer problemNumber; // 문제 번호 (1-30)

    @Column(nullable = false)
    private String subject; // 과목 (공통, 미적분, 확률과통계, 기하)

    @Column(nullable = false, length = 2000)
    private String subjectDetail; // 상세 분야 (예: 지수법칙을 이용한 계산)

    @Column(nullable = false)
    private Integer difficultyGrade; // 난이도 등급 (1:최고난도 ~ 5:가장쉬움)

    @Column(nullable = false)
    private String answer; // 정답

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProblemType type; // 문제 유형 (객관식, 단답형)

    @Column
    private String imagePath; // 문제 이미지 경로

    @Column(length = 1000)
    private String explanation; // 해설

    @Column(length = 500)
    private String hint; // 힌트

    @Builder.Default
    @Column(nullable = false)
    private Integer timeLimit = 300; // 제한시간 (초) - 기본 5분

    @Builder.Default
    @Column(nullable = false)
    private Integer points = 2; // 배점 - 기본 2점

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true; // 활성화 여부

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 연관관계
    @OneToMany(mappedBy = "mathProblem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MathProblemAttempt> attempts;

    @OneToMany(mappedBy = "mathProblem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<StudentWrongAnswer> wrongAnswers;

    public enum ProblemType {
        MULTIPLE_CHOICE("객관식"),
        SHORT_ANSWER("단답형");

        private final String description;

        ProblemType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 비즈니스 메서드
    public boolean isCorrect(String studentAnswer) {
        if (studentAnswer == null || answer == null) {
            return false;
        }
        
        // 정답과 학생 답안 비교 (공백 제거 후)
        return studentAnswer.trim().equalsIgnoreCase(answer.trim());
    }

    public String getTypeKorean() {
        return type.getDescription();
    }
    
    public String getDifficultyDescription() {
        switch (difficultyGrade) {
            case 1: return "최고난도";
            case 2: return "어려움";
            case 3: return "보통";
            case 4: return "쉬움";
            case 5: return "매우쉬움";
            default: return "보통";
        }
    }
    
    public String getSubjectKorean() {
        switch (subject) {
            case "공통": return "수학 I, II";
            case "미적분": return "미적분";
            case "확률과통계": return "확률과 통계";
            case "기하": return "기하";
            default: return subject;
        }
    }
    
    // 이미지 경로 생성 메서드
    public String generateImagePath() {
        if (imagePath != null && !imagePath.isEmpty()) {
            return imagePath;
        }
        
        String folderType = (problemNumber <= 22) ? "객관식" : "단답형";
        
        if ("공통".equals(subject)) {
            return String.format("/math_image/%s/%s_수학_%d번_%s.png", 
                    folderType, examMonthYear, problemNumber, subject);
        } else {
            return String.format("/math_image/%s/%s_수학_%d번_%s.png", 
                    folderType, examMonthYear, problemNumber, subject);
        }
    }
}