package com.qianze.entity;

public class Project {
    private Long id;
    private String num;
    private String title;
    private String tags;
    private String descEn;
    private String descZh;
    private String url;

    public Project() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNum() { return num; }
    public void setNum(String num) { this.num = num; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getDescEn() { return descEn; }
    public void setDescEn(String descEn) { this.descEn = descEn; }
    public String getDescZh() { return descZh; }
    public void setDescZh(String descZh) { this.descZh = descZh; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
