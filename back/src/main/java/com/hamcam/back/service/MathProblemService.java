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
}