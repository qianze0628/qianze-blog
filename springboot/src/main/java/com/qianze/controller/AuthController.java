package com.qianze.controller;

import com.qianze.config.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
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

    private boolean checkPassword(String input) {
        if (input == null) return false;
        for (String pw : password.split(",")) {
            if (pw.trim().equals(input)) return true;
        }
        return false;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        if (!checkPassword(body.get("password")))
            return ResponseEntity.status(401).body(Map.of("error", "密码错误"));
        return ResponseEntity.ok(Map.of("token", jwt.generateToken()));
    }

    @PostMapping("/share")
    public ResponseEntity<?> share(@RequestBody Map<String, String> body, HttpServletRequest request) {
        if (!JwtUtil.checkWrite(request, body.get("password"), password))
            return ResponseEntity.status(403).body(Map.of("error", "无权限"));
        int days = Math.min(Math.max(Integer.parseInt(body.getOrDefault("days", "7")), 1), 30);
        String token = jwt.generateToken(days * 86400000L, "readonly");
        return ResponseEntity.ok(Map.of("token", token, "days", days, "role", "readonly"));
    }

    @PostMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        if (!JwtUtil.isAuthed(request))
            return ResponseEntity.status(401).body(Map.of("error", "未登录"));
        String role = (String) request.getAttribute("jwtRole");
        return ResponseEntity.ok(Map.of("role", role != null ? role : "admin"));
    }
}
