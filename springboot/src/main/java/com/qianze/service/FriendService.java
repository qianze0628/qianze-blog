package com.qianze.service;

import com.qianze.entity.Friend;
import com.qianze.mapper.FriendMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FriendService {
    private final FriendMapper mapper;
    public FriendService(FriendMapper mapper) { this.mapper = mapper; }

    public List<Friend> findAll() { return mapper.findAll(); }

    @Transactional
    public void replaceAll(List<Friend> friends) {
        mapper.deleteAll();
        friends.forEach(mapper::insert);
    }
}
