package com.hamcam.back.service.dashboard;

import com.hamcam.back.dto.dashboard.exam.request.ExamScheduleRequest;
import com.hamcam.back.dto.dashboard.exam.response.ExamScheduleResponse;
import com.hamcam.back.dto.dashboard.exam.response.DDayInfoResponse;
import com.hamcam.back.entity.auth.User;
import com.hamcam.back.entity.dashboard.ExamSchedule;
import com.hamcam.back.repository.auth.UserRepository;
import com.hamcam.back.repository.dashboard.ExamScheduleRepository;
import com.hamcam.back.service.auth.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExamScheduleService {
    private final ExamScheduleRepository examScheduleRepository;
    private final UserRepository userRepository;
    private final SessionService sessionService;

    @Transactional(readOnly = true)
    public List<ExamScheduleResponse> getAllExamSchedules(HttpServletRequest request) {
        User user = sessionService.getCurrentUser(request);
        List<ExamSchedule> schedules = examScheduleRepository.findAllByUserOrderByExamDateAsc(user);
        
        List<ExamScheduleResponse> responses = new ArrayList<>();
        for (ExamSchedule schedule : schedules) {
            long dDay = ChronoUnit.DAYS.between(LocalDate.now(), schedule.getExamDate());
            ExamScheduleResponse response = new ExamScheduleResponse();
            response.setId(schedule.getId());
            response.setTitle(schedule.getTitle());
            response.setExamDate(schedule.getExamDate());
            response.setExam_date(schedule.getExamDate().toString());
            response.setDDay(dDay);
            responses.add(response);
        }
        return responses;
    }

    @Transactional
    public void createExamSchedule(ExamScheduleRequest request, HttpServletRequest httpRequest) {
        User user = sessionService.getCurrentUser(httpRequest);
        ExamSchedule schedule = new ExamSchedule();
        schedule.setUser(user);
        schedule.setTitle(request.getTitle());
        schedule.setExamDate(request.getExamDate());
        examScheduleRepository.save(schedule);
    }

    public DDayInfoResponse getNearestExamSchedule(HttpServletRequest httpRequest) {
        User user = sessionService.getCurrentUser(httpRequest);
        LocalDate now = LocalDate.now();
        Optional<ExamSchedule> nearestExam = examScheduleRepository.findByUserId(user.getId())
                .stream()
                .filter(exam -> !exam.getExamDate().isBefore(now))
                .min((a, b) -> a.getExamDate().compareTo(b.getExamDate()));

        if (nearestExam.isEmpty()) {
            return DDayInfoResponse.builder()
                    .title("다가오는 시험이 없습니다")
                    .dDay(0L)
                    .build();
        }

        long dDay = ChronoUnit.DAYS.between(now, nearestExam.get().getExamDate());
        return DDayInfoResponse.builder()
                .title(nearestExam.get().getTitle())
                .dDay(Long.valueOf(dDay))
                .build();
    }
} 