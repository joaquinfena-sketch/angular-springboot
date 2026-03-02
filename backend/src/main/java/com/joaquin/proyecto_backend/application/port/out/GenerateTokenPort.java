package com.joaquin.proyecto_backend.application.port.out;

/**
 * Puerto de salida: generación de token JWT para un usuario autenticado.
 */
public interface GenerateTokenPort {

    String generate(String username);
}
