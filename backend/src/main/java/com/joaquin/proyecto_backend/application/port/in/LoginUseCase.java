package com.joaquin.proyecto_backend.application.port.in;

/**
 * Puerto de entrada (caso de uso): login con usuario y contraseña.
 * Devuelve el JWT si las credenciales son válidas.
 */
public interface LoginUseCase {

    /**
     * Autentica y devuelve el token JWT, o null si las credenciales son inválidas.
     */
    String login(String username, String password);
}
