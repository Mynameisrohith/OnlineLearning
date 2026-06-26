package com.onlinelearning.learning.service;

import com.onlinelearning.learning.dto.EnrollmentDTO;

import java.util.List;

public interface EnrollmentService {

    EnrollmentDTO enrollStudent(Long userId, Long courseId);

    List<EnrollmentDTO> getEnrollmentsByUser(Long userId);
    void unenrollStudent(Long userId, Long courseId);
}