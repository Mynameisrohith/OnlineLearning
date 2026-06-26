package com.onlinelearning.learning.service;

import com.onlinelearning.learning.entity.Lecture;

import java.util.List;

public interface LectureService {

    Lecture createLecture(Lecture lecture);

    List<Lecture> getLecturesByCourse(Long courseId);

    void deleteLecture(Long id);
}