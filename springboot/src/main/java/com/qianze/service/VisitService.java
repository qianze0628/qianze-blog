package com.qianze.service;

import com.qianze.entity.VisitLog;
import com.qianze.mapper.VisitLogMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class VisitService {
    private final VisitLogMapper mapper;
    public VisitService(VisitLogMapper mapper) { this.mapper = mapper; }

    public void log(String page, String referrer, String ua, String lang, String screen) {
        VisitLog log = new VisitLog();
        log.setPage(page);
        log.setReferrer(referrer);
        log.setUserAgent(ua);
        log.setLanguage(lang);
        log.setScreen(screen);
        log.setCreatedAt(LocalDateTime.now());
        mapper.insert(log);
    }

    public Map<String, Object> stats() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("totalVisits", mapper.countAll());
        map.put("uniqueVisitors", mapper.countUniqueIp());
        map.put("todayVisits", mapper.countToday());
        map.put("last7Days", mapper.countByDay(7));
        map.put("topPages", mapper.topPages());
        map.put("hourlyStats", mapper.hourlyStats());
        map.put("recent", mapper.findRecent());
        return map;
    }
}
