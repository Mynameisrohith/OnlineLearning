package com.onlinelearning.learning.controller;

import com.onlinelearning.learning.dto.CertificateDTO;
import com.onlinelearning.learning.service.CertificateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    // Generate Certificate
    @PostMapping("/{userId}/{courseId}")
    public CertificateDTO generateCertificate(@PathVariable Long userId,
                                              @PathVariable Long courseId) {
        return certificateService.generateCertificate(userId, courseId);
    }

    // Get Certificates by User
    @GetMapping("/user/{userId}")
    public List<CertificateDTO> getCertificatesByUser(@PathVariable Long userId) {
        return certificateService.getCertificatesByUser(userId);
    }
}