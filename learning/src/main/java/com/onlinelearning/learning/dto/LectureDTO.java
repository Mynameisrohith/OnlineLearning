package com.onlinelearning.learning.dto;

public class LectureDTO {

    private Long id;
    private String title;
    private String videoUrl;
    private Long courseId;

    public LectureDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LectureDTO(Long id, String title, String videoUrl, Long courseId) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.courseId = courseId;
    }

    // Getters & Setters
}