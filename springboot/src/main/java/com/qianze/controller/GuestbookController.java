package com.qianze.controller;

import com.qianze.entity.GuestbookEntry;
import com.qianze.service.GuestbookService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guestbook")
public class GuestbookController {
    private final GuestbookService service;

    public GuestbookController(GuestbookService service) { this.service = service; }

    @GetMapping
    public List<GuestbookEntry> getAll() { return service.findAll(); }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> body) {
        String message = body.get("message");
        if (message == null || message.isBlank())
            return ResponseEntity.badRequest().body(Map.of("error", "留言不能为空"));
        var entry = service.create(body.get("author"), message, body.get("mood"));
        return ResponseEntity.ok(entry);
    }
}
