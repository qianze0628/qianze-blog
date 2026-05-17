package com.qianze.entity;

import java.time.LocalDate;

public class Post {
    private Long id;
    private String slug;
    private String title;
    private String titleZh;
    private LocalDate date;
    private String category;
    private Integer readTime;
    private String tags;
    private String summary;
    private String summaryZh;
    private String contentEn;
    private String contentZh;
    private Boolean featured;

    public Post() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTitleZh() { return titleZh; }
    public void setTitleZh(String titleZh) { this.titleZh = titleZh; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Integer getReadTime() { return readTime; }
    public void setReadTime(Integer readTime) { this.readTime = readTime; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getSummaryZh() { return summaryZh; }
    public void setSummaryZh(String summaryZh) { this.summaryZh = summaryZh; }
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    public String getContentZh() { return contentZh; }
    public void setContentZh(String contentZh) { this.contentZh = contentZh; }
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
}
