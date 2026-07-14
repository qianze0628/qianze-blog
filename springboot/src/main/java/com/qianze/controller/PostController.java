package com.qianze.controller;

import com.qianze.config.JwtUtil;
import com.qianze.entity.Post;
import com.qianze.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService service;
    private final String password;
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

    public PostController(PostService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return service.findAll().stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId());
            m.put("slug", p.getSlug());
            m.put("title", p.getTitle());
            m.put("titleZh", p.getTitleZh());
            m.put("date", p.getDate() != null ? p.getDate().format(DT_FMT) : null);
            m.put("category", p.getCategory());
            m.put("readTime", p.getReadTime());
            m.put("tags", p.getTags());
            m.put("summary", p.getSummary());
            m.put("summaryZh", p.getSummaryZh());
            m.put("contentEn", p.getContentEn());
            m.put("contentZh", p.getContentZh());
            m.put("featured", p.getFeatured());
            m.put("cover", p.getCover());
            m.put("isDraft", p.getIsDraft());
            m.put("scheduledPublishAt", p.getScheduledPublishAt() != null ? p.getScheduledPublishAt().format(DT_FMT) : null);
            return m;
        }).toList();
    }

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
                p.setCover(str(m, "cover"));
                p.setIsDraft(m.get("isDraft") instanceof Boolean b ? b : false);
                p.setScheduledPublishAt(parseDateTime(str(m, "scheduledPublishAt")));
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

    private LocalDateTime parseDate(String d) {
        if (d == null || d.isBlank()) return LocalDateTime.now();
        try {
            // 尝试完整日期时间解析
            return LocalDateTime.parse(d, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e1) {
            try {
                // 兼容只有日期的格式 "2026-07-14"
                return LocalDate.parse(d, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay();
            } catch (DateTimeParseException e2) {
                return LocalDateTime.now();
            }
        }
    }

    private LocalDateTime parseDateTime(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDateTime.parse(s, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
