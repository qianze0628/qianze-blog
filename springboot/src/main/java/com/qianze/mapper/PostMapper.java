package com.qianze.mapper;

import com.qianze.entity.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PostMapper {
    @Select("SELECT * FROM posts ORDER BY date DESC")
    
    List<Post> findAll();

    @Select("SELECT * FROM posts WHERE slug = #{slug}")
    
    Optional<Post> findBySlug(String slug);

    @Insert("INSERT INTO posts (slug, title, title_zh, date, category, read_time, tags, summary, summary_zh, content_en, content_zh, featured, cover, is_draft, scheduled_publish_at) " +
            "VALUES (#{slug}, #{title}, #{titleZh}, #{date}, #{category}, #{readTime}, #{tags}, #{summary}, #{summaryZh}, #{contentEn}, #{contentZh}, #{featured}, #{cover}, #{isDraft}, #{scheduledPublishAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Post post);

    @Update("UPDATE posts SET slug=#{slug}, title=#{title}, title_zh=#{titleZh}, date=#{date}, category=#{category}, " +
            "read_time=#{readTime}, tags=#{tags}, summary=#{summary}, summary_zh=#{summaryZh}, content_en=#{contentEn}, content_zh=#{contentZh}, featured=#{featured}, " +
            "cover=#{cover}, is_draft=#{isDraft}, scheduled_publish_at=#{scheduledPublishAt} WHERE id=#{id}")
    void update(Post post);

    @Delete("DELETE FROM posts WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM posts")
    void deleteAll();
}

