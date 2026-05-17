package com.qianze.mapper;

import com.qianze.entity.Note;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoteMapper {
    @Select("SELECT id, content, date, type FROM notes ORDER BY date DESC")
    List<Note> findAll();

    @Insert("INSERT INTO notes (content, date, type) VALUES (#{content}, #{date}, #{type})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Note note);

    @Update("UPDATE notes SET content=#{content}, date=#{date}, type=#{type} WHERE id=#{id}")
    void update(Note note);

    @Delete("DELETE FROM notes WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM notes")
    void deleteAll();
}
