package com.qianze.controller;

import com.qianze.config.JwtUtil;
import com.qianze.entity.Note;
import com.qianze.service.NoteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService service;
    private final String password;

    public NoteController(NoteService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @GetMapping
    public List<Note> getAll() { return service.findAll(); }

    @PutMapping
    public ResponseEntity<?> updateAll(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!JwtUtil.checkWrite(request, (String) body.get("password"), password))
            return ResponseEntity.status(403).body(Map.of("error", "无权限"));
        @SuppressWarnings("unchecked")
        var list = (List<Map<String, Object>>) body.get("data");
        var notes = list.stream().map(m -> {
            var n = new Note();
            n.setContent((String) m.get("content"));
            n.setDate(m.get("date") != null ? LocalDate.parse((String) m.get("date")) : LocalDate.now());
            n.setType((String) m.get("type"));
            return n;
        }).toList();
        service.replaceAll(notes);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
