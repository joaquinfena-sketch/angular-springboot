package com.joaquin.proyecto_backend.application.port.out;

/**
 * Puerto de salida: validación de credenciales (usuario/contraseña).
 * Implementado por adaptador (en memoria, BD, LDAP, etc.).
 */
public interface ValidateCredentialsPort {

    boolean validate(String username, String password);
}
