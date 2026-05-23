package com.qianze.controller;

import com.qianze.config.JwtUtil;
import com.qianze.entity.GuestbookEntry;
import com.qianze.service.GuestbookService;
import com.qianze.service.IpService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/guestbook")
public class GuestbookController {
    private final GuestbookService service;

    public GuestbookController(GuestbookService service) { this.service = service; }

    @GetMapping
    public java.util.List<GuestbookEntry> getAll() { return service.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String message = body.get("message");
        if (message == null || message.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "留言不能为空"));

        String ip = IpService.getClientIp(request);

        var entry = service.create(
            body.get("author"), message, body.get("mood"),
            ip, request.getHeader("User-Agent")
        );
        return ResponseEntity.ok(entry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        if (!JwtUtil.isAdmin(request))
            return ResponseEntity.status(403).body(Map.of("error", "无权限"));
        service.deleteById(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
