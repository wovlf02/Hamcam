package com.hamcam.back.controller;

import com.hamcam.back.entity.MathProblem;
import com.hamcam.back.service.MathProblemService;
import com.hamcam.back.service.MathEvaluationService;
import com.hamcam.back.service.MathStatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/math")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MathProblemController {

    private final MathProblemService mathProblemService;
    private final MathEvaluationService mathEvaluationService;
    private final MathStatisticsService mathStatisticsService;

    /**
     * 모든 활성화된 문제 조회
     */
    @GetMapping("/problems")
    public ResponseEntity<List<MathProblem>> getAllProblems() {
        try {
            List<MathProblem> problems = mathProblemService.getAllActiveProblems();
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            log.error("문제 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * ID로 문제 조회
     */
    @GetMapping("/problems/{id}")
    public ResponseEntity<MathProblem> getProblemById(@PathVariable Long id) {
        try {
            Optional<MathProblem> problem = mathProblemService.getProblemById(id);
            return problem.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            log.error("문제 조회 실패: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 과목별 문제 조회
     */
    @GetMapping("/problems/subject/{subject}")
    public ResponseEntity<List<MathProblem>> getProblemsBySubject(@PathVariable String subject) {
        try {
            List<MathProblem> problems = mathProblemService.getProblemsBySubject(subject);
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            log.error("과목별 문제 조회 실패: {}", subject, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 난이도별 문제 조회
     */
    @GetMapping("/problems/difficulty/{grade}")
    public ResponseEntity<List<MathProblem>> getProblemsByDifficulty(@PathVariable Integer grade) {
        try {
            List<MathProblem> problems = mathProblemService.getProblemsByDifficultyGrade(grade);
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            log.error("난이도별 문제 조회 실패: {}", grade, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 시험별 문제 조회
     */
    @GetMapping("/problems/exam/{examMonthYear}")
    public ResponseEntity<List<MathProblem>> getProblemsByExam(@PathVariable String examMonthYear) {
        try {
            List<MathProblem> problems = mathProblemService.getProblemsByExamMonthYear(examMonthYear);
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            log.error("시험별 문제 조회 실패: {}", examMonthYear, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 평가용 문제 세트 생성
     */
    @GetMapping("/evaluation/generate")
    public ResponseEntity<List<MathProblem>> generateEvaluationSet(
            @RequestParam(defaultValue = "공통") String subject,
            @RequestParam(defaultValue = "10") int count) {
        try {
            List<MathProblem> problems = mathEvaluationService.generateEvaluationProblemSet(subject, count);
            return ResponseEntity.ok(problems);
        } catch (Exception e) {
            log.error("평가 문제 세트 생성 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 전체 문제 통계 조회
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getProblemStatistics() {
        try {
            Map<String, Object> stats = mathStatisticsService.getProblemStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("문제 통계 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 과목 목록 조회
     */
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getAllSubjects() {
        try {
            List<String> subjects = mathProblemService.getAllSubjects();
            return ResponseEntity.ok(subjects);
        } catch (Exception e) {
            log.error("과목 목록 조회 실패", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}