package com.qianze.service;

import com.qianze.entity.GuestbookEntry;
import com.qianze.mapper.GuestbookMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GuestbookService {
    private final GuestbookMapper mapper;
    public GuestbookService(GuestbookMapper mapper) { this.mapper = mapper; }

    public List<GuestbookEntry> findAll() { return mapper.findAll(); }

    public GuestbookEntry create(String author, String message, String mood) {
        GuestbookEntry entry = new GuestbookEntry();
        entry.setAuthor(author != null && !author.isBlank() ? author : "匿名");
        entry.setMessage(message);
        entry.setMood(mood != null ? mood : "like");
        entry.setDate(LocalDate.now());
        mapper.insert(entry);
        return entry;
    }

    public void deleteAll() { mapper.deleteAll(); }
}
