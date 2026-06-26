package com.onlinelearning.learning.service;

import com.onlinelearning.learning.dto.CourseDto;
import com.onlinelearning.learning.entity.Course;
import org.springframework.data.domain.Page;

import java.util.List;

public interface courseService {

    CourseDto createCourse(Course course);

    List<CourseDto> getCourseById(Long id);

    Page<CourseDto> getAllCourses(
            String search,
            String category,
            String level,
            Double maxPrice,
            int page,
            int size,
            String sort
    );

    CourseDto updateCourse(Long id, Course course);

    void deleteCourse(Long id);
}