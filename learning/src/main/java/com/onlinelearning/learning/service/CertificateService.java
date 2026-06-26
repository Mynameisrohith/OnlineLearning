package com.onlinelearning.learning.service;

import com.onlinelearning.learning.dto.CertificateDTO;

import java.util.List;

public interface CertificateService {

    CertificateDTO generateCertificate(Long userId, Long courseId);

    List<CertificateDTO> getCertificatesByUser(Long userId);
}