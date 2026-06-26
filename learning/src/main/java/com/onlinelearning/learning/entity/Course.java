package com.onlinelearning.learning.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(Double oldPrice) {
        this.oldPrice = oldPrice;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Long getReviews() {
        return reviews;
    }

    public void setReviews(Long reviews) {
        this.reviews = reviews;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public User getInstructor() {
        return instructor;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    private String title;

    @Column(length = 2000)
    private String description;

    private Double price;
    private Double oldPrice;
    private Double rating;
    private Long reviews;

    private String category;
    private String level;
    private String image;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private User instructor;

    // ✅ Required by JPA
    public Course() {}

    public Course(Long id, String title, String description,
                  Double price, Double oldPrice,
                  Double rating, Long reviews,
                  String category, String level,
                  String image, User instructor) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.oldPrice = oldPrice;
        this.rating = rating;
        this.reviews = reviews;
        this.category = category;
        this.level = level;
        this.image = image;
        this.instructor = instructor;
    }

    // getters and setters
}