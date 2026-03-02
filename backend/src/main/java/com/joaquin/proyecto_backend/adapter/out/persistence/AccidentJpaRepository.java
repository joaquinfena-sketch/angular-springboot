package com.joaquin.proyecto_backend.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repositorio JPA (adaptador de persistencia).
 * Opcional según perfil (p. ej. excluido en postgres).
 */
public interface AccidentJpaRepository extends JpaRepository<AccidentEntity, Long> {

    List<AccidentEntity> findByProvinceIn(List<String> provinces);
}
