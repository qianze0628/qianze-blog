package com.qianze.service;

import com.qianze.entity.VisitLog;
import com.qianze.mapper.VisitLogMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class VisitService {
    private final VisitLogMapper mapper;
    private final IpService ipService;
    public VisitService(VisitLogMapper mapper, IpService ipService) {
        this.mapper = mapper; this.ipService = ipService;
    }

    public void log(String ip, String page, String referrer, String ua, String lang,
                    String screen, String browser, String os, String device, String model) {
        String[] loc = ipService.search(ip);
        VisitLog log = new VisitLog();
        log.setIp(ip);
        log.setPage(page);
        log.setReferrer(referrer);
        log.setUserAgent(ua);
        log.setLanguage(lang);
        log.setScreen(screen);
        log.setBrowser(browser);
        log.setOs(os);
        log.setDevice(device);
        log.setModel(model);
        log.setCountry(loc[0]);
        log.setProvince(loc[1]);
        log.setCity(loc[2]);
        log.setIsp(loc[3]);
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
        map.put("browserStats", mapper.browserStats());
        map.put("osStats", mapper.osStats());
        map.put("deviceStats", mapper.deviceStats());
        map.put("recent", mapper.findRecent());
        return map;
    }
}
