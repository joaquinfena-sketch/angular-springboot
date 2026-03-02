package com.joaquin.proyecto_backend.adapter.out.persistence;

import com.joaquin.proyecto_backend.application.port.out.ValidateCredentialsPort;
import org.springframework.stereotype.Component;

/**
 * Adaptador de salida: validación de credenciales en memoria.
 * Sustituir por BD/LDAP cuando se requiera.
 */
@Component
public class InMemoryCredentialsAdapter implements ValidateCredentialsPort {

    @Override
    public boolean validate(String username, String password) {
        return "j.fernandez".equals(username) && "1234".equals(password);
    }
}
