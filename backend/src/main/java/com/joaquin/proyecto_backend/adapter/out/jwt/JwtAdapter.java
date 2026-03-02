package com.joaquin.proyecto_backend.adapter.out.jwt;

import com.joaquin.proyecto_backend.application.port.out.GenerateTokenPort;
import com.joaquin.proyecto_backend.application.port.out.ParseTokenPort;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtAdapter implements GenerateTokenPort, ParseTokenPort {

    private final SecretKey key;
    private final long expirationMs;

    public JwtAdapter(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("app.jwt.secret debe tener al menos 32 caracteres para HS256");
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    @Override
    public String generate(String username) {
        try {
            Date now = new Date();
            Date expiry = new Date(now.getTime() + expirationMs);
            return Jwts.builder()
                    .subject(username != null ? username : "")
                    .issuedAt(now)
                    .expiration(expiry)
                    .signWith(key)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Error generando JWT", e);
        }
    }

    @Override
    public Optional<String> getSubjectFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return Optional.ofNullable(claims.getSubject());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
