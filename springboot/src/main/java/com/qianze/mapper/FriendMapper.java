package com.qianze.mapper;

import com.qianze.entity.Friend;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FriendMapper {
    @Select("SELECT id, name, `desc`, url FROM friends")
    List<Friend> findAll();

    @Insert("INSERT INTO friends (name, `desc`, url) VALUES (#{name}, #{desc}, #{url})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insert(Friend friend);

    @Update("UPDATE friends SET name=#{name}, `desc`=#{desc}, url=#{url} WHERE id=#{id}")
    void update(Friend friend);

    @Delete("DELETE FROM friends WHERE id=#{id}")
    void deleteById(Long id);

    @Delete("DELETE FROM friends")
    void deleteAll();
}
