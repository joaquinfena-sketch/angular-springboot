package com.joaquin.proyecto_backend.repo;

import com.joaquin.proyecto_backend.domain.Accident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccidentRepository extends JpaRepository<Accident, Long> {
    List<Accident> findByProvinceIn(List<String> provinces);
}
