package com.onlinelearning.learning.mapping;

import com.onlinelearning.learning.dto.LectureDTO;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.Lecture;

public class LectureMapping {

    public static LectureDTO mapToDto(Lecture lecture) {
        return new LectureDTO(
                lecture.getId(),
                lecture.getTitle(),
                lecture.getVideoUrl(),
                lecture.getCourse().getId()
        );
    }

    public static Lecture mapToEntity(LectureDTO dto, Course course) {
        Lecture lecture = new Lecture();
        lecture.setId(dto.getId());
        lecture.setTitle(dto.getTitle());
        lecture.setVideoUrl(dto.getVideoUrl());
        lecture.setCourse(course);
        return lecture;
    }
}