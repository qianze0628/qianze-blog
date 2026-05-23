package com.qianze.mapper;

import com.qianze.entity.VisitLog;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface VisitLogMapper {
    @Insert("INSERT INTO visit_logs (ip, page, referrer, user_agent, language, screen, browser, os, device, model, country, province, city, isp, created_at) " +
            "VALUES (#{ip}, #{page}, #{referrer}, #{userAgent}, #{language}, #{screen}, #{browser}, #{os}, #{device}, #{model}, #{country}, #{province}, #{city}, #{isp}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(VisitLog log);

    @Select("SELECT COUNT(*) FROM visit_logs")
    long countAll();

    @Select("SELECT COUNT(DISTINCT ip) FROM visit_logs WHERE ip IS NOT NULL AND ip != ''")
    long countUniqueIp();

    @Select("SELECT COUNT(*) FROM visit_logs WHERE DATE(created_at) = CURDATE()")
    long countToday();

    @Select("SELECT DATE(created_at) as date, COUNT(*) as cnt FROM visit_logs " +
            "WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date")
    List<Map<String, Object>> countByDay(int days);

    @Select("SELECT HOUR(created_at) as hour, COUNT(*) as cnt FROM visit_logs " +
            "WHERE DATE(created_at) = CURDATE() GROUP BY HOUR(created_at) ORDER BY hour")
    List<Map<String, Object>> hourlyStats();

    @Select("SELECT page, COUNT(*) as cnt FROM visit_logs GROUP BY page ORDER BY cnt DESC LIMIT 10")
    List<Map<String, Object>> topPages();

    @Select("SELECT browser, COUNT(*) as cnt FROM visit_logs WHERE browser IS NOT NULL AND browser != '未知' GROUP BY browser ORDER BY cnt DESC")
    List<Map<String, Object>> browserStats();

    @Select("SELECT os, COUNT(*) as cnt FROM visit_logs WHERE os IS NOT NULL AND os != '未知' GROUP BY os ORDER BY cnt DESC")
    List<Map<String, Object>> osStats();

    @Select("SELECT device, COUNT(*) as cnt FROM visit_logs WHERE device IS NOT NULL AND device != '未知' GROUP BY device ORDER BY cnt DESC")
    List<Map<String, Object>> deviceStats();

    @Select("SELECT * FROM visit_logs ORDER BY created_at DESC LIMIT 50")
    @Results({
        @Result(property = "userAgent", column = "user_agent"),
        @Result(property = "createdAt", column = "created_at")
    })
    List<VisitLog> findRecent();
}
