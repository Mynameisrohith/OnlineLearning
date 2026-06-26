package com.onlinelearning.learning.repository;

import com.onlinelearning.learning.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    List<Lecture> findByCourseId(Long courseId);
}
