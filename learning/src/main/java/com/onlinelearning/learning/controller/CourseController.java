package com.onlinelearning.learning.controller;

import com.onlinelearning.learning.dto.CourseDto;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.service.courseService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final courseService service;

    public CourseController(courseService service) {
        this.service = service;
    }

    @GetMapping
    public Page<CourseDto> getCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(defaultValue = "rating") String sort
    ) {
        return service.getAllCourses(
                search, category, level, maxPrice,
                page, size, sort
        );
    }

    @PostMapping
    public CourseDto createCourse(@RequestBody Course course) {
        return service.createCourse(course);
    }

    @GetMapping("/{id}")
    public List<CourseDto> getById(@PathVariable Long id) {
        return service.getCourseById(id);
    }

    @PutMapping("/{id}")
    public CourseDto update(@PathVariable Long id,
                                  @RequestBody Course course) {
        return service.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteCourse(id);
    }


}