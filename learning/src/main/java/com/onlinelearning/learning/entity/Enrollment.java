package com.onlinelearning.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name="enrollment")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Enrollment(){

    }
    public Long getId() {
        return id;
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

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Enrollment(Long id, User user, Course course) {
        this.id = id;
        this.user = user;
        this.course = course;
    }

    @ManyToOne
    private User user;

    @ManyToOne
    private Course course;
}