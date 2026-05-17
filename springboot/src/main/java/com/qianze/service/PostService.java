package com.qianze.service;

import com.qianze.entity.Post;
import com.qianze.mapper.PostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PostService {
    private final PostMapper mapper;
    public PostService(PostMapper mapper) { this.mapper = mapper; }

    public List<Post> findAll() { return mapper.findAll(); }

    public Post findBySlug(String slug) { return mapper.findBySlug(slug).orElse(null); }

    @Transactional
    public void replaceAll(List<Post> posts) {
        mapper.deleteAll();
        posts.forEach(mapper::insert);
    }
}
