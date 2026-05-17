package com.qianze.entity;

import java.time.LocalDate;

public class GuestbookEntry {
    private Long id;
    private String author;
    private String message;
    private String mood;
    private LocalDate date;

    public GuestbookEntry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
