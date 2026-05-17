package com.qianze.service;

import com.qianze.entity.Note;
import com.qianze.mapper.NoteMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteService {
    private final NoteMapper mapper;
    public NoteService(NoteMapper mapper) { this.mapper = mapper; }

    public List<Note> findAll() { return mapper.findAll(); }

    @Transactional
    public void replaceAll(List<Note> notes) {
        mapper.deleteAll();
        notes.forEach(mapper::insert);
    }
}
