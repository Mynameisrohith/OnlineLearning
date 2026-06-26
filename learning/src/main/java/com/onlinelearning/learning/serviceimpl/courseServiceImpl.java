package com.onlinelearning.learning.serviceimpl;
import com.onlinelearning.learning.dto.CourseDto;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.mapping.CourseMapping;
import com.onlinelearning.learning.repository.CourseRepository;
import com.onlinelearning.learning.service.courseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;


import jakarta.persistence.criteria.Predicate;

import org.springframework.stereotype.Service;


import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class courseServiceImpl implements courseService {

    @Autowired
    CourseRepository repository;
    public CourseDto createCourse(Course course) {

        repository.save(course);
        CourseDto dto=CourseMapping.mapToDto(course);
        return dto;
    }

    @Override
    public List<CourseDto> getCourseById(Long id) {

        return repository.findById(id).stream().map(course -> CourseMapping.mapToDto(course)).collect(Collectors.toList());

    }

    public Page<CourseDto> getAllCourses(
            String search,
            String category,
            String level,
            Double maxPrice,
            int page,
            int size,
            String sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());

        Specification<Course> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null)
                predicates.add(cb.like(cb.lower(root.get("title")),
                        "%" + search.toLowerCase() + "%"));

            if (category != null)
                predicates.add(cb.equal(root.get("category"), category));

            if (level != null)
                predicates.add(cb.equal(root.get("level"), level));

            if (maxPrice != null)
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return repository.findAll(spec, pageable)
                .map(course -> CourseMapping.mapToDto(course));
    }



    public CourseDto updateCourse(Long id, Course course) {
        Optional<Course> existingcourse= repository.findById(id);
        Course courses=existingcourse.orElseThrow(()->new RuntimeException("course with id "+id+"not found"));
        courses.setTitle(course.getTitle());
        courses.setDescription(course.getDescription());
        courses.setInstructor(course.getInstructor());
        courses.setPrice(course.getPrice());
        courses.setCategory(course.getCategory());
        courses.setImage(course.getImage());
        courses.setRating(course.getRating());
        courses.setReviews(course.getReviews());
        courses.setOldPrice(course.getOldPrice());
        courses.setLevel(course.getLevel());
        Course updatecourse=repository.save(courses);
        return CourseMapping.mapToDto(updatecourse);



    }


    public void deleteCourse(Long id) {

        repository.deleteById(id);

    }
}
