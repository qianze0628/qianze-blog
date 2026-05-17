package com.qianze.mapper;

import com.qianze.entity.Project;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProjectMapper {
    @Select("SELECT id, num, title, tags, desc_en, desc_zh, url FROM projects")
    @Results({
        @Result(property = "descEn", column = "desc_en"),
        @Result(property = "descZh", column = "desc_zh")
    })
    List<Project> findAll();

    @Insert("INSERT INTO projects (num, title, tags, desc_en, desc_zh, url) VALUES (#{num}, #{title}, #{tags}, #{descEn}, #{descZh}, #{url})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Project project);

    @Update("UPDATE projects SET num=#{num}, title=#{title}, tags=#{tags}, desc_en=#{descEn}, desc_zh=#{descZh}, url=#{url} WHERE id=#{id}")
    void update(Project project);

    @Delete("DELETE FROM projects WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM projects")
    void deleteAll();
}
