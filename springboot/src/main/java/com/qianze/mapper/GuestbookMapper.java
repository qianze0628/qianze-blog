package com.qianze.mapper;

import com.qianze.entity.GuestbookEntry;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GuestbookMapper {
    @Select("SELECT id, author, message, mood, ip, user_agent, browser, os, device, model, country, province, city, date FROM guestbook ORDER BY date DESC")
    @Results({ @Result(property = "userAgent", column = "user_agent") })
    List<GuestbookEntry> findAll();

    @Insert("INSERT INTO guestbook (author, message, mood, ip, user_agent, browser, os, device, model, country, province, city, date) " +
            "VALUES (#{author}, #{message}, #{mood}, #{ip}, #{userAgent}, #{browser}, #{os}, #{device}, #{model}, #{country}, #{province}, #{city}, #{date})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(GuestbookEntry entry);

    @Delete("DELETE FROM guestbook WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM guestbook")
    void deleteAll();
}
