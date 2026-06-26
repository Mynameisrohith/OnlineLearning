package com.onlinelearning.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name="lecture")
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    public Lecture(Long id, String title, String videoUrl, Integer duration, Course course) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.duration = duration;
        this.course = course;
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

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    private String title;

    public Lecture() {

    }

    private String videoUrl;
    private Integer duration;

    @ManyToOne
    private Course course;
}