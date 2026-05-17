package com.qianze.mapper;

import com.qianze.entity.Post;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PostMapper {
    @Select("SELECT * FROM posts ORDER BY date DESC")
    @Results({
        @Result(property = "titleZh", column = "title_zh"),
        @Result(property = "readTime", column = "read_time"),
        @Result(property = "summaryZh", column = "summary_zh"),
        @Result(property = "contentEn", column = "content_en"),
        @Result(property = "contentZh", column = "content_zh")
    })
    List<Post> findAll();

    @Select("SELECT * FROM posts WHERE slug = #{slug}")
    @Results({
        @Result(property = "titleZh", column = "title_zh"),
        @Result(property = "readTime", column = "read_time"),
        @Result(property = "summaryZh", column = "summary_zh"),
        @Result(property = "contentEn", column = "content_en"),
        @Result(property = "contentZh", column = "content_zh")
    })
    Optional<Post> findBySlug(String slug);

    @Insert("INSERT INTO posts (slug, title, title_zh, date, category, read_time, tags, summary, summary_zh, content_en, content_zh, featured) " +
            "VALUES (#{slug}, #{title}, #{titleZh}, #{date}, #{category}, #{readTime}, #{tags}, #{summary}, #{summaryZh}, #{contentEn}, #{contentZh}, #{featured})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Post post);

    @Update("UPDATE posts SET slug=#{slug}, title=#{title}, title_zh=#{titleZh}, date=#{date}, category=#{category}, " +
            "read_time=#{readTime}, tags=#{tags}, summary=#{summary}, summary_zh=#{summaryZh}, content_en=#{contentEn}, content_zh=#{contentZh}, featured=#{featured} WHERE id=#{id}")
    void update(Post post);

    @Delete("DELETE FROM posts WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM posts")
    void deleteAll();
}
