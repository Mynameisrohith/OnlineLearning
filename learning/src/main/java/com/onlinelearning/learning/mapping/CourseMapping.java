package com.onlinelearning.learning.mapping;
import com.onlinelearning.learning.dto.CourseDto;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.User;

public class CourseMapping {

    // ENTITY → DTO
    public static CourseDto mapToDto(Course course) {
        return new CourseDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getPrice(),
                course.getOldPrice(),
                course.getRating(),
                course.getReviews(),
                course.getCategory(),
                course.getLevel(),
                course.getImage()
        );
    }

    // DTO → ENTITY
    public static Course mapToEntity(CourseDto dto, User instructor) {
        return new Course(
                dto.getId(),
                dto.getTitle(),
                dto.getDescription(),
                dto.getPrice(),
                dto.getOldPrice(),
                dto.getRating(),
                dto.getReviews(),
                dto.getCategory(),
                dto.getLevel(),
                dto.getImage(),
                instructor   // must pass instructor
        );
    }
}