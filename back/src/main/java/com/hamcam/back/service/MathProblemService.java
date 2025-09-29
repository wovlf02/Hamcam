package com.hamcam.back.service;

import com.hamcam.back.entity.MathProblem;
import com.hamcam.back.repository.MathProblemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MathProblemService {

    private final MathProblemRepository mathProblemRepository;

    /**
     * 모든 활성화된 문제 조회
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getAllActiveProblems() {
        return mathProblemRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    /**
     * ID로 문제 조회
     */
    @Transactional(readOnly = true)
    public Optional<MathProblem> getProblemById(Long id) {
        return mathProblemRepository.findById(id);
    }

    /**
     * 과목별 문제 조회
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getProblemsBySubject(String subject) {
        return mathProblemRepository.findBySubject(subject);
    }

    /**
     * 난이도별 문제 조회
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getProblemsByDifficultyGrade(Integer difficultyGrade) {
        return mathProblemRepository.findByDifficultyGrade(difficultyGrade);
    }

    /**
     * 시험 년월별 문제 조회
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getProblemsByExamMonthYear(String examMonthYear) {
        return mathProblemRepository.findByExamMonthYear(examMonthYear);
    }

    /**
     * 랜덤 문제 조회 (난이도별)
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getRandomProblemsByDifficultyGrade(Integer difficultyGrade, int count) {
        return mathProblemRepository.findRandomProblemsByDifficultyGrade(difficultyGrade, count);
    }

    /**
     * 문제 저장
     */
    public MathProblem saveProblem(MathProblem problem) {
        return mathProblemRepository.save(problem);
    }

    /**
     * 문제 삭제 (소프트 삭제)
     */
    public void deleteProblem(Long id) {
        Optional<MathProblem> problem = mathProblemRepository.findById(id);
        if (problem.isPresent()) {
            MathProblem mathProblem = problem.get();
            mathProblem.setIsActive(false);
            mathProblemRepository.save(mathProblem);
        }
    }

    /**
     * 과목 목록 조회
     */
    @Transactional(readOnly = true)
    public List<String> getAllSubjects() {
        return mathProblemRepository.findDistinctSubjects();
    }

    /**
     * 상세 분야 목록 조회
     */
    @Transactional(readOnly = true)
    public List<String> getAllSubjectDetails() {
        return mathProblemRepository.findDistinctSubjectDetails();
    }

    /**
     * 학년별 난이도 맞춤 문제 조회
     * 1학년 (저학년) → 어려운 문제 (난이도 1-2)
     * 5학년 (고학년) → 쉬운 문제 (난이도 4-5)
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getProblemsByStudentGrade(Integer studentGrade, int count) {
        log.info("학년별 문제 조회 요청 - 학년: {}, 문제 수: {}", studentGrade, count);
        
        int minDifficulty, maxDifficulty;
        
        // 학년에 따른 난이도 범위 설정
        switch (studentGrade) {
            case 1:
                // 1학년: 가장 어려운 문제 (난이도 1)
                minDifficulty = 1;
                maxDifficulty = 1;
                break;
            case 2:
                // 2학년: 어려운 문제 (난이도 1-2)
                minDifficulty = 1;
                maxDifficulty = 2;
                break;
            case 3:
                // 3학년: 중간 난이도 (난이도 2-3)
                minDifficulty = 2;
                maxDifficulty = 3;
                break;
            case 4:
                // 4학년: 쉬운 문제 (난이도 3-4)
                minDifficulty = 3;
                maxDifficulty = 4;
                break;
            case 5:
            default:
                // 5학년 이상: 가장 쉬운 문제 (난이도 4-5)
                minDifficulty = 4;
                maxDifficulty = 5;
                break;
        }
        
        log.info("학년 {}에 대해 난이도 범위 {}-{} 설정", studentGrade, minDifficulty, maxDifficulty);
        return mathProblemRepository.findRandomProblemsByDifficultyRange(minDifficulty, maxDifficulty, count);
    }

    /**
     * 학년별 전체 활성화된 문제 조회 (난이도 필터링)
     */
    @Transactional(readOnly = true)
    public List<MathProblem> getAllProblemsByStudentGrade(Integer studentGrade) {
        log.info("학년별 전체 문제 조회 요청 - 학년: {}", studentGrade);
        
        List<Integer> targetDifficulties;
        
        // 학년에 따른 난이도 리스트 설정
        switch (studentGrade) {
            case 1:
                targetDifficulties = List.of(1);
                break;
            case 2:
                targetDifficulties = List.of(1, 2);
                break;
            case 3:
                targetDifficulties = List.of(2, 3);
                break;
            case 4:
                targetDifficulties = List.of(3, 4);
                break;
            case 5:
            default:
                targetDifficulties = List.of(4, 5);
                break;
        }
        
        log.info("학년 {}에 대해 난이도 {} 필터링", studentGrade, targetDifficulties);
        return mathProblemRepository.findByDifficultyGradeIn(targetDifficulties);
    }
}