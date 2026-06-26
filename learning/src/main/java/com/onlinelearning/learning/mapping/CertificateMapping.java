package com.onlinelearning.learning.mapping;
import com.onlinelearning.learning.dto.CertificateDTO;
import com.onlinelearning.learning.entity.Certificate;
import com.onlinelearning.learning.entity.User;
import com.onlinelearning.learning.entity.Course;

public class CertificateMapping {

    public static CertificateDTO mapToDto(Certificate certificate) {
        return new CertificateDTO(
                certificate.getId(),
                certificate.getUser().getId(),
                certificate.getCourse().getId()
        );
    }

    public static Certificate mapToEntity(User user, Course course) {
        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setCourse(course);
        return certificate;
    }
}