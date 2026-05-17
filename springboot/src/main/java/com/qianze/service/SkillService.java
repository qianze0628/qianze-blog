package com.qianze.service;

import com.qianze.entity.Skill;
import com.qianze.mapper.SkillMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {
    private final SkillMapper mapper;
    public SkillService(SkillMapper mapper) { this.mapper = mapper; }

    public List<Skill> findAll() { return mapper.findAll(); }

    @Transactional
    public void replaceAll(List<Skill> skills) {
        mapper.deleteAll();
        skills.forEach(mapper::insert);
    }
}
