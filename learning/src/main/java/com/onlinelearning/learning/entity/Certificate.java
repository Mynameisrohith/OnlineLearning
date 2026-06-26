package com.onlinelearning.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name="certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String certificateCode;

    public Certificate(){

    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCertificateCode() {
        return certificateCode;
    }

    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
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

    public Certificate(Long id, String certificateCode, User user, Course course) {
        this.id = id;
        this.certificateCode = certificateCode;
        this.user = user;
        this.course = course;
    }

    @ManyToOne
    private User user;

    @ManyToOne
    private Course course;
}