package com.hamcam.back.controller.evaluation;

import com.hamcam.back.dto.evaluation.request.StartEvaluationRequest;
import com.hamcam.back.dto.evaluation.request.SubmitAnswersRequest;
import com.hamcam.back.dto.evaluation.response.EvaluationProblemsResponse;
import com.hamcam.back.dto.evaluation.response.EvaluationResultResponse;
import com.hamcam.back.service.evaluation.UnitEvaluationService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 단원평가 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/evaluation")
@RequiredArgsConstructor
public class UnitEvaluationController {

    private final UnitEvaluationService unitEvaluationService;

    /**
     * 단원평가 시작
     */
    @PostMapping("/start")
    public ResponseEntity<EvaluationProblemsResponse> startEvaluation(
            @RequestBody StartEvaluationRequest request,
            HttpSession session) {
        
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            log.info("단원평가 시작 - 사용자: {}, 단원: {}", userId, request.getUnitName());
            
            EvaluationProblemsResponse response = unitEvaluationService.startEvaluation(userId, request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("단원평가 시작 실패", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 답안 제출 및 평가 완료
     */
    @PostMapping("/submit")
    public ResponseEntity<EvaluationResultResponse> submitAnswers(
            @RequestBody SubmitAnswersRequest request,
            HttpSession session) {
        
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            log.info("답안 제출 - 사용자: {}, 평가: {}", userId, request.getEvaluationId());
            
            EvaluationResultResponse response = unitEvaluationService.submitAnswers(userId, request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("답안 제출 실패", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 평가 결과 조회
     */
    @GetMapping("/result/{evaluationId}")
    public ResponseEntity<EvaluationResultResponse> getEvaluationResult(
            @PathVariable Long evaluationId,
            HttpSession session) {
        
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            // TODO: 평가 결과 조회 서비스 메서드 구현
            log.info("평가 결과 조회 - 사용자: {}, 평가: {}", userId, evaluationId);
            
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            log.error("평가 결과 조회 실패", e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 사용자의 평가 히스토리 조회
     */
    @GetMapping("/history")
    public ResponseEntity<?> getEvaluationHistory(HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(401).build();
            }

            // TODO: 평가 히스토리 조회 서비스 메서드 구현
            log.info("평가 히스토리 조회 - 사용자: {}", userId);
            
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            log.error("평가 히스토리 조회 실패", e);
            return ResponseEntity.status(500).build();
        }
    }
}