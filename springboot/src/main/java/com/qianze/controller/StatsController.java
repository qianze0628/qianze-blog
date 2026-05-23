package com.qianze.controller;

import com.qianze.config.JwtUtil;
import com.qianze.service.VisitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
    private final VisitService service;
    private final String password;

    public StatsController(VisitService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @PostMapping
    public ResponseEntity<?> getStats(@RequestBody Map<String, String> body, HttpServletRequest request) {
        if (!isAuthed(request, body))
            return ResponseEntity.status(401).body(Map.of("error", "密码错误"));
        return ResponseEntity.ok(service.stats());
    }

    private boolean isAuthed(HttpServletRequest request, Map<String, String> body) {
        if (JwtUtil.isAuthed(request)) return true;
        return password.split(",")[0].trim().equals(body.get("password"));
    }
}
