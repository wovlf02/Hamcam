package com.hamcam.back.entity.study.team;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "problem")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "problem_id")
    private Long problemId;

    @Column(nullable = false, length = 50)
    private String subject;

    /**
     * 문제 제목
     */
    @Column(name = "title", length = 200)
    private String title;

    /**
     * 문제 내용
     */
    @Lob
    @Column(name = "content")
    private String content;

    /**
     * 선택지 (JSON 형태 또는 구분자로 저장)
     */
    @Column(name = "choices", length = 1000)
    private String choices;

    @Column(name = "correct_rate")
    private Double correctRate;

    @Column(length = 200)
    private String source;

    @Column(nullable = false, length = 20)
    private String answer;

    @Column(name = "image_path", length = 500)
    private String imagePath;

    @Lob
    private String explanation;

    /**
     * ✅ 국어 지문 외래키 (nullable)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passage_id", nullable = true)
    private Passage passage;

    /**
     * ✅ 단원 외래키 (unit_id)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    /**
     * 선택지를 배열로 반환
     */
    public String[] getChoicesArray() {
        if (choices == null || choices.isEmpty()) {
            return new String[0];
        }
        return choices.split("\\|"); // "|" 구분자 사용
    }

    /**
     * 선택지 배열을 문자열로 설정
     */
    public void setChoicesArray(String[] choicesArray) {
        if (choicesArray == null || choicesArray.length == 0) {
            this.choices = null;
        } else {
            this.choices = String.join("|", choicesArray);
        }
    }
}
