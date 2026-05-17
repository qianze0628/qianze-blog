package com.qianze.controller;

import com.qianze.config.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final String password;
    private final JwtUtil jwt;

    public AuthController(@Value("${admin.password}") String password, JwtUtil jwt) {
        this.password = password; this.jwt = jwt;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        if (!password.equals(body.get("password")))
            return ResponseEntity.status(401).body(Map.of("error", "密码错误"));
        return ResponseEntity.ok(Map.of("token", jwt.generateToken()));
    }
}
