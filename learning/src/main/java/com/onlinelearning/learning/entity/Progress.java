package com.onlinelearning.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "progress")
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    public Long getId() {
        return id;
    }

    public Progress(){

    }
    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lecture getLecture() {
        return lecture;
    }

    public void setLecture(Lecture lecture) {
        this.lecture = lecture;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Progress(Long id, User user, Lecture lecture, boolean completed) {
        this.id = id;
        this.user = user;
        this.lecture = lecture;
        this.completed = completed;
    }

    @ManyToOne
    private Lecture lecture;

    private boolean completed;
}