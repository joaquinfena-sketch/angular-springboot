package com.joaquin.proyecto_backend.application.service;

import com.joaquin.proyecto_backend.application.port.in.LoginUseCase;
import com.joaquin.proyecto_backend.application.port.out.GenerateTokenPort;
import com.joaquin.proyecto_backend.application.port.out.ValidateCredentialsPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoginService implements LoginUseCase {

    private static final Logger log = LoggerFactory.getLogger(LoginService.class);

    private final ValidateCredentialsPort validateCredentialsPort;
    private final GenerateTokenPort generateTokenPort;

    public LoginService(ValidateCredentialsPort validateCredentialsPort, GenerateTokenPort generateTokenPort) {
        this.validateCredentialsPort = validateCredentialsPort;
        this.generateTokenPort = generateTokenPort;
    }

    @Override
    public String login(String username, String password) {
        try {
            if (!validateCredentialsPort.validate(username, password)) {
                return null;
            }
            return generateTokenPort.generate(username);
        } catch (Exception e) {
            log.error("Error generando token para usuario {}", username, e);
            return null;
        }
    }
}
