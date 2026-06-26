package com.onlinelearning.learning.serviceimpl;

import com.onlinelearning.learning.dto.CertificateDTO;
import com.onlinelearning.learning.entity.Certificate;
import com.onlinelearning.learning.entity.Course;
import com.onlinelearning.learning.entity.User;
import com.onlinelearning.learning.repository.CertificateRepository;
import com.onlinelearning.learning.repository.CourseRepository;
import com.onlinelearning.learning.repository.UserRepository;
import com.onlinelearning.learning.service.CertificateService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  UserRepository userRepository,
                                  CourseRepository courseRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public CertificateDTO generateCertificate(Long userId, Long courseId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Certificate certificate = new Certificate();
        certificate.setUser(user);
        certificate.setCourse(course);

        certificateRepository.save(certificate);

        return new CertificateDTO(certificate.getId(), userId, courseId);
    }

    @Override
    public List<CertificateDTO> getCertificatesByUser(Long userId) {
        return certificateRepository.findById(userId)
                .stream()
                .map(c -> new CertificateDTO(c.getId(),
                        c.getUser().getId(),
                        c.getCourse().getId()))
                .toList();
    }
}