package com.qianze.entity;

import java.time.LocalDateTime;

public class GuestbookEntry {
    private Long id;
    private String author;
    private String message;
    private String mood;
    private String ip;
    private String userAgent;
    private String browser;
    private String os;
    private String device;
    private String model;
    private String country;
    private String province;
    private String city;
    private LocalDateTime date;

    public GuestbookEntry() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getMood() { return mood; }
    public void setMood(String mood) { this.mood = mood; }
    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }
    public String getOs() { return os; }
    public void setOs(String os) { this.os = os; }
    public String getDevice() { return device; }
    public void setDevice(String device) { this.device = device; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
