package com.qianze.controller;

import com.qianze.entity.Skill;
import com.qianze.service.SkillService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {
    private final SkillService service;
    private final String password;

    public SkillController(SkillService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @GetMapping
    public List<Skill> getAll() { return service.findAll(); }

    @PutMapping
    public ResponseEntity<?> updateAll(@RequestBody Map<String, Object> body) {
        if (!password.equals(body.get("password")))
            return ResponseEntity.status(401).body(Map.of("error", "密码错误"));
        @SuppressWarnings("unchecked")
        var list = (List<Map<String, Object>>) body.get("data");
        var skills = list.stream().map(m -> {
            var s = new Skill();
            s.setName((String) m.get("name"));
            s.setProficiency((Integer) m.get("proficiency"));
            s.setDescEn((String) m.get("descEn"));
            s.setDescZh((String) m.get("descZh"));
            return s;
        }).toList();
        service.replaceAll(skills);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
