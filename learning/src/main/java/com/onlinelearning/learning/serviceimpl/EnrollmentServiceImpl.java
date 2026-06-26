package com.onlinelearning.learning.serviceimpl;
import com.onlinelearning.learning.dto.EnrollmentDTO;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.Enrollment;
import com.onlinelearning.learning.entity.User;
import com.onlinelearning.learning.repository.CourseRepository;
import com.onlinelearning.learning.repository.EnrollmentRepository;
import com.onlinelearning.learning.repository.UserRepository;
import com.onlinelearning.learning.service.EnrollmentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository,
                                 UserRepository userRepository,
                                 CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public EnrollmentDTO enrollStudent(Long userId, Long courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        enrollmentRepository.save(enrollment);
        return new EnrollmentDTO(enrollment.getId(), userId, courseId);
    }

    @Override
    public List<EnrollmentDTO> getEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId)
                .stream()
                .map(e -> new EnrollmentDTO(e.getId(),
                        e.getUser().getId(),
                        e.getCourse().getId()))
                .toList();
    }


    @Override
    @Transactional
    public void unenrollStudent(Long userId, Long courseId) {
        long deleted = enrollmentRepository.deleteByUserIdAndCourseId(userId, courseId);
        if (deleted == 0) {
            throw new RuntimeException("Enrollment not found");
        }
    }
}