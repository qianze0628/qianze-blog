package com.qianze.controller;

import com.qianze.config.JwtUtil;
import com.qianze.entity.Project;
import com.qianze.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService service;
    private final String password;

    public ProjectController(ProjectService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @GetMapping
    public List<Project> getAll() { return service.findAll(); }

    @PutMapping
    public ResponseEntity<?> updateAll(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!JwtUtil.checkWrite(request, (String) body.get("password"), password))
            return ResponseEntity.status(403).body(Map.of("error", "无权限"));
        @SuppressWarnings("unchecked")
        var list = (List<Map<String, Object>>) body.get("data");
        var projects = list.stream().map(m -> {
            var p = new Project();
            p.setNum((String) m.get("num"));
            p.setTitle((String) m.get("title"));
            Object tags = m.get("tags");
            p.setTags(tags instanceof List ? String.join(",", (List<String>) tags) : (String) tags);
            p.setDescEn((String) m.get("descEn"));
            p.setDescZh((String) m.get("descZh"));
            p.setUrl((String) m.get("url"));
            return p;
        }).toList();
        service.replaceAll(projects);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
