package com.onlinelearning.learning.controller;

import com.onlinelearning.learning.entity.Lecture;
import com.onlinelearning.learning.service.LectureService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lectures")
@CrossOrigin
public class LectureController {

    private final LectureService lectureService;

    public LectureController(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    // Create Lecture
    @PostMapping
    public Lecture createLecture(@RequestBody Lecture lecture) {
        return lectureService.createLecture(lecture);
    }

    // Get Lectures by Course
    @GetMapping("/course/{courseId}")
    public List<Lecture> getLecturesByCourse(@PathVariable Long courseId) {
        return lectureService.getLecturesByCourse(courseId);
    }

    // Delete Lecture
    @DeleteMapping("/{id}")
    public String deleteLecture(@PathVariable Long id) {
        lectureService.deleteLecture(id);
        return "Lecture deleted successfully";
    }
}