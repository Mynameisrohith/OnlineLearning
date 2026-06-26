package com.onlinelearning.learning.serviceimpl;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.Lecture;
import com.onlinelearning.learning.repository.CourseRepository;
import com.onlinelearning.learning.repository.LectureRepository;
import com.onlinelearning.learning.service.LectureService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectureServiceImpl implements LectureService {

    private final LectureRepository lectureRepository;
    private final CourseRepository courseRepository;

    public LectureServiceImpl(LectureRepository lectureRepository,
                              CourseRepository courseRepository) {
        this.lectureRepository = lectureRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public Lecture createLecture(Lecture lecture) {

        Course course = courseRepository.findById(lecture.getId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lecture lectures = new Lecture();
        lectures.setTitle(lecture.getTitle());
        lectures.setVideoUrl(lecture.getVideoUrl());
        lectures.setCourse(course);

        lectureRepository.save(lectures);

        return lectures;
    }


    public List<Lecture> getLecturesByCourse(Long courseId) {
        return lectureRepository.findByCourseId(courseId)
                .stream()
                .map(l -> new Lecture(l.getId(), l.getTitle(),
                        l.getVideoUrl(), l.getDuration(),l.getCourse()))
                .toList();
    }

    @Override
    public void deleteLecture(Long id) {
        lectureRepository.deleteById(id);
    }
}