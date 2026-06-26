package com.onlinelearning.learning.repository;

import com.onlinelearning.learning.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);

    long deleteByUserIdAndCourseId(Long userId, Long courseId);

    List<Enrollment> findAllByUserIdAndCourseId(Long userId, Long courseId);
}