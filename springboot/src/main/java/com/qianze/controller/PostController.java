package com.qianze.controller;

import com.qianze.config.JwtUtil;
import com.qianze.entity.Post;
import com.qianze.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService service;
    private final String password;

    public PostController(PostService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @GetMapping
    public List<Post> getAll() { return service.findAll(); }

    @GetMapping("/{slug}")
    public ResponseEntity<?> getBySlug(@PathVariable String slug) {
        Post post = service.findBySlug(slug);
        return post != null ? ResponseEntity.ok(post) : ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<?> updateAll(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (!JwtUtil.checkWrite(request, (String) body.get("password"), password))
            return ResponseEntity.status(403).body(Map.of("error", "无权限"));
        try {
            @SuppressWarnings("unchecked")
            var list = (List<Map<String, Object>>) body.get("data");
            var posts = list.stream().map(m -> {
                var p = new Post();
                p.setSlug(str(m, "slug"));
                p.setTitle(str(m, "title"));
                p.setTitleZh(str(m, "titleZh"));
                p.setDate(parseDate(str(m, "date")));
                p.setCategory(str(m, "category"));
                p.setReadTime(m.get("readTime") instanceof Number n ? n.intValue() : 5);
                Object tags = m.get("tags");
                p.setTags(tags instanceof List<?> l ? String.join(",", l.stream().map(Object::toString).toList()) : str(m, "tags"));
                p.setSummary(str(m, "summary"));
                p.setSummaryZh(str(m, "summaryZh"));
                p.setContentEn(str(m, "contentEn"));
                p.setContentZh(str(m, "contentZh"));
                p.setFeatured(m.get("featured") instanceof Boolean b ? b : false);
                return p;
            }).toList();
            service.replaceAll(posts);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    private String str(Map<String, Object> m, String key) {
        Object v = m.get(key);
        return v != null ? v.toString() : null;
    }

    private LocalDate parseDate(String d) {
        if (d == null || d.isBlank()) return LocalDate.now();
        try { return LocalDate.parse(d); } catch (Exception e) { return LocalDate.now(); }
    }
}
