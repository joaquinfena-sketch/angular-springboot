package com.joaquin.proyecto_backend.adapter.in.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.joaquin.proyecto_backend.adapter.in.web.dto.LoginRequestDto;
import com.joaquin.proyecto_backend.adapter.in.web.dto.LoginResponseDto;
import com.joaquin.proyecto_backend.application.port.in.LoginUseCase;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://joaquinfena-sketch.github.io"})
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final LoginUseCase loginUseCase;

    public AuthController(LoginUseCase loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        if (request == null || request.username() == null || request.username().isBlank() ||
                request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String token = loginUseCase.login(request.username().trim(), request.password());
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok(new LoginResponseDto(token));
        } catch (Exception e) {
            log.error("Error en login para usuario {}", request.username(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
