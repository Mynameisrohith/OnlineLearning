package com.onlinelearning.learning.controller;

import com.onlinelearning.learning.dto.EnrollmentDTO;
import com.onlinelearning.learning.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // Enroll Student
    @PostMapping("/{userId}/{courseId}")
    public EnrollmentDTO enrollStudent(@PathVariable Long userId,
                                       @PathVariable Long courseId) {
        return enrollmentService.enrollStudent(userId, courseId);
    }

    // Get Enrollments By User
    @GetMapping("/user/{userId}")
    public List<EnrollmentDTO> getEnrollmentsByUser(@PathVariable Long userId) {
        return enrollmentService.getEnrollmentsByUser(userId);
    }
    @DeleteMapping("/{userId}/{courseId}")
    public ResponseEntity<Void> unenrollStudent(@PathVariable Long userId, @PathVariable Long courseId) {
        enrollmentService.unenrollStudent(userId, courseId);
        return ResponseEntity.noContent().build();
    }
}