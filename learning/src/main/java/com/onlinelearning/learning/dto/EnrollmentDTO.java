package com.onlinelearning.learning.dto;

public class EnrollmentDTO {

    private Long id;
    private Long userId;
    private Long courseId;

    public EnrollmentDTO() {}

    public EnrollmentDTO(Long id, Long userId, Long courseId) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}