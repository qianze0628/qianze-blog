package com.qianze.controller;

import com.qianze.service.IpService;
import com.qianze.service.VisitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/visit")
public class VisitController {
    private final VisitService service;

    public VisitController(VisitService service) { this.service = service; }

    @PostMapping
    public void log(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String ip = IpService.getClientIp(request);

        service.log(
            ip,
            body.getOrDefault("page", "/"),
            body.getOrDefault("referrer", ""),
            body.getOrDefault("userAgent", ""),
            body.getOrDefault("language", ""),
            body.getOrDefault("screen", ""),
            body.getOrDefault("browser", ""),
            body.getOrDefault("os", ""),
            body.getOrDefault("device", ""),
            body.getOrDefault("model", "")
        );
    }
}
