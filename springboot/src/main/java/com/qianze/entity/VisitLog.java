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
    private String browser;
    private String os;
    private String device;
    private String model;
    private String country;
    private String province;
    private String city;
    private String isp;
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
    public String getIsp() { return isp; }
    public void setIsp(String isp) { this.isp = isp; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
