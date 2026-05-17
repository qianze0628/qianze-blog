package com.qianze.entity;

import java.time.LocalDate;

public class Note {
    private Long id;
    private String content;
    private LocalDate date;
    private String type;

    public Note() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
