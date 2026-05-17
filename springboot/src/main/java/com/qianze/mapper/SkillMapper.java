package com.qianze.mapper;

import com.qianze.entity.Skill;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SkillMapper {
    @Select("SELECT id, name, proficiency, desc_en, desc_zh FROM skills")
    @Results({
        @Result(property = "descEn", column = "desc_en"),
        @Result(property = "descZh", column = "desc_zh")
    })
    List<Skill> findAll();

    @Insert("INSERT INTO skills (name, proficiency, desc_en, desc_zh) VALUES (#{name}, #{proficiency}, #{descEn}, #{descZh})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Skill skill);

    @Update("UPDATE skills SET name=#{name}, proficiency=#{proficiency}, desc_en=#{descEn}, desc_zh=#{descZh} WHERE id=#{id}")
    void update(Skill skill);

    @Delete("DELETE FROM skills WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM skills")
    void deleteAll();
}
