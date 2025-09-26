package com.hamcam.back.repository.evaluation;

import com.hamcam.back.entity.evaluation.StudentLevel;
import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.study.team.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentLevelRepository extends JpaRepository<StudentLevel, Long> {

    /**
     * 특정 사용자와 단원의 레벨 정보 조회
     */
    Optional<StudentLevel> findByUserAndUnit(User user, Unit unit);

    /**
     * 특정 사용자의 모든 단원 레벨 조회
     */
    List<StudentLevel> findByUserOrderByUpdatedAtDesc(User user);

    /**
     * 특정 사용자의 레벨별 단원 개수 조회
     */
    @Query("SELECT sl.currentLevel, COUNT(sl) FROM StudentLevel sl WHERE sl.user = :user GROUP BY sl.currentLevel")
    List<Object[]> countByUserAndLevel(@Param("user") User user);

    /**
     * 특정 사용자의 평균 레벨 조회
     */
    @Query("SELECT AVG(sl.currentLevel) FROM StudentLevel sl WHERE sl.user = :user")
    Double getAverageLevelByUser(@Param("user") User user);

    /**
     * 최근에 레벨업한 사용자들 조회 (상위 10명)
     */
    @Query("SELECT sl FROM StudentLevel sl WHERE sl.currentLevel > 1 ORDER BY sl.updatedAt DESC LIMIT 10")
    List<StudentLevel> findRecentLevelUps();
}