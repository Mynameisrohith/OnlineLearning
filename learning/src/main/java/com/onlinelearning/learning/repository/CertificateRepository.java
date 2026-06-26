package com.onlinelearning.learning.repository;

import com.onlinelearning.learning.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Certificate findByCertificateCode(String code);
}
