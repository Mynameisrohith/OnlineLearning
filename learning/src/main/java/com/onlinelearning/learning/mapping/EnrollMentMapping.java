package com.onlinelearning.learning.mapping;

import com.onlinelearning.learning.dto.EnrollmentDTO;
import com.onlinelearning.learning.entity.Enrollment;
import com.onlinelearning.learning.entity.User;
import com.onlinelearning.learning.entity.Course;

public class EnrollMentMapping {

    public static EnrollmentDTO mapToDto(Enrollment enrollment) {
        return new EnrollmentDTO(
                enrollment.getId(),
                enrollment.getUser().getId(),
                enrollment.getCourse().getId()
        );
    }

    public static Enrollment mapToEntity(User user, Course course) {
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        return enrollment;
    }
}