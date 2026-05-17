package com.qianze.mapper;

import com.qianze.entity.VisitLog;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface VisitLogMapper {
    @Insert("INSERT INTO visit_logs (page, referrer, user_agent, language, screen, created_at) " +
            "VALUES (#{page}, #{referrer}, #{userAgent}, #{language}, #{screen}, #{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(VisitLog log);

    @Select("SELECT COUNT(*) FROM visit_logs")
    long countAll();

    @Select("SELECT COUNT(DISTINCT ip) FROM visit_logs")
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

    @Select("SELECT * FROM visit_logs ORDER BY created_at DESC LIMIT 50")
    @Results({
        @Result(property = "userAgent", column = "user_agent"),
        @Result(property = "createdAt", column = "created_at")
    })
    List<VisitLog> findRecent();
}
