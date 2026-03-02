package com.joaquin.proyecto_backend.application.port.out;

import java.util.Optional;

/**
 * Puerto de salida: validar y extraer el subject (username) de un JWT.
 */
public interface ParseTokenPort {

    Optional<String> getSubjectFromToken(String token);
}
