package com.qianze.service;

import com.qianze.entity.Project;
import com.qianze.mapper.ProjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {
    private final ProjectMapper mapper;
    public ProjectService(ProjectMapper mapper) { this.mapper = mapper; }

    public List<Project> findAll() { return mapper.findAll(); }

    @Transactional
    public void replaceAll(List<Project> projects) {
        mapper.deleteAll();
        projects.forEach(mapper::insert);
    }
}
