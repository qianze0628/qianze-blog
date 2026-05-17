package com.qianze.controller;

import com.qianze.entity.Friend;
import com.qianze.service.FriendService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
    private final FriendService service;
    private final String password;

    public FriendController(FriendService service, @Value("${admin.password}") String password) {
        this.service = service; this.password = password;
    }

    @GetMapping
    public List<Friend> getAll() { return service.findAll(); }

    @PutMapping
    public ResponseEntity<?> updateAll(@RequestBody Map<String, Object> body) {
        if (!password.equals(body.get("password")))
            return ResponseEntity.status(401).body(Map.of("error", "密码错误"));
        @SuppressWarnings("unchecked")
        var list = (List<Map<String, Object>>) body.get("data");
        var friends = list.stream().map(m -> {
            var f = new Friend();
            f.setName((String) m.get("name"));
            f.setDesc((String) m.get("desc"));
            f.setUrl((String) m.get("url"));
            return f;
        }).toList();
        service.replaceAll(friends);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
