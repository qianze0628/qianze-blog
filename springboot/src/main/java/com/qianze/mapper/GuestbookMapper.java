package com.qianze.mapper;

import com.qianze.entity.GuestbookEntry;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GuestbookMapper {
    @Select("SELECT id, author, message, mood, date FROM guestbook ORDER BY date DESC")
    List<GuestbookEntry> findAll();

    @Insert("INSERT INTO guestbook (author, message, mood, date) VALUES (#{author}, #{message}, #{mood}, #{date})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(GuestbookEntry entry);

    @Delete("DELETE FROM guestbook WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM guestbook")
    void deleteAll();
}
