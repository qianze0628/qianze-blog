package com.qianze.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey key;
    private final long expiration;

    public JwtUtil(@Value("${jwt.secret:qianze-blog-secret-key-2026-very-long-string!!}") String secret,
                   @Value("${jwt.expiration:3600000}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public String generateToken() {
        return generateToken(expiration, "admin");
    }

    public String generateToken(long durationMs, String role) {
        return Jwts.builder()
                .subject("admin")
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + durationMs))
                .signWith(key)
                .compact();
    }

    public boolean validate(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getRole(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /** Check if the current request comes from an admin JWT token */
    public static boolean isAdmin(HttpServletRequest request) {
        return "admin".equals(request.getAttribute("jwtRole"));
    }

    /** Check if the current request has a valid JWT (any role) */
    public static boolean isAuthed(HttpServletRequest request) {
        return Boolean.TRUE.equals(request.getAttribute("jwtValid"));
    }

    /** Admin JWT OR body password → allow write. Returns false if only readonly JWT. */
    public static boolean checkWrite(HttpServletRequest request, String bodyPassword, String configuredPassword) {
        if (isAdmin(request)) return true;
        if (bodyPassword == null) return false;
        for (String pw : configuredPassword.split(",")) {
            if (pw.trim().equals(bodyPassword)) return true;
        }
        return false;
    }
}
