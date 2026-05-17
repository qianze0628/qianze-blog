package com.qianze.entity;

import java.time.LocalDateTime;

public class VisitLog {
    private Long id;
    private String ip;
    private String page;
    private String userAgent;
    private String referrer;
    private String language;
    private String screen;
    private LocalDateTime createdAt;

    public VisitLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getScreen() { return screen; }
    public void setScreen(String screen) { this.screen = screen; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
