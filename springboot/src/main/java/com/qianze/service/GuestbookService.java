package com.qianze.service;

import com.qianze.config.UaParser;
import com.qianze.entity.GuestbookEntry;
import com.qianze.mapper.GuestbookMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class GuestbookService {
    private final GuestbookMapper mapper;
    private final IpService ipService;
    public GuestbookService(GuestbookMapper mapper, IpService ipService) {
        this.mapper = mapper; this.ipService = ipService;
    }

    public List<GuestbookEntry> findAll() { return mapper.findAll(); }

    public GuestbookEntry create(String author, String message, String mood, String ip, String ua) {
        String[] loc = ipService.search(ip);
        Map<String, String> parsed = UaParser.parse(ua);

        GuestbookEntry entry = new GuestbookEntry();
        entry.setAuthor(author != null && !author.isBlank() ? author : "匿名");
        entry.setMessage(message);
        entry.setMood(mood != null ? mood : "like");
        entry.setIp(ip);
        entry.setUserAgent(ua);
        entry.setBrowser(parsed.getOrDefault("browser", ""));
        entry.setOs(parsed.getOrDefault("os", ""));
        entry.setDevice(parsed.getOrDefault("device", ""));
        entry.setModel(parsed.getOrDefault("model", ""));
        entry.setCountry(loc[0]);
        entry.setProvince(loc[1]);
        entry.setCity(loc[2]);
        entry.setDate(LocalDateTime.now());
        mapper.insert(entry);
        return entry;
    }

    public void deleteById(Long id) { mapper.deleteById(id); }
    public void deleteAll() { mapper.deleteAll(); }
}
