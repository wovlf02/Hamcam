package com.hamcam.back.repository.study;

import com.hamcam.back.entity.study.team.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ✅ 문제 조건 기반 조회용 리포지토리
 */
@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findBySubjectAndUnit_UnitAndCorrectRateBetween(String subject, String unitName, double min, double max);

    /**
     * 특정 과목과 단원의 모든 문제 조회
     */
    List<Problem> findBySubjectAndUnit(String subject, com.hamcam.back.entity.study.team.Unit unit);

    /**
     * 과목별 문제 조회
     */
    List<Problem> findBySubject(String subject);

    /**
     * 단원별 문제 조회
     */
    List<Problem> findByUnit(com.hamcam.back.entity.study.team.Unit unit);
}
