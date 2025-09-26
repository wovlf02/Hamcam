package com.hamcam.back.repository.study;

import com.hamcam.back.entity.study.team.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    
    /**
     * 과목별 단원 목록 조회
     */
    List<Unit> findBySubject(String subject);

    /**
     * 과목과 단원명으로 단원 조회
     */
    Optional<Unit> findBySubjectAndUnit(String subject, String unit);

    /**
     * 카테고리별 단원 목록 조회
     */
    List<Unit> findByCategory(String category);
}