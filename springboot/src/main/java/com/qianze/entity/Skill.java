package com.qianze.entity;

public class Skill {
    private Long id;
    private String name;
    private Integer proficiency;
    private String descEn;
    private String descZh;

    public Skill() {}
    public Skill(String name, Integer proficiency, String descEn, String descZh) {
        this.name = name; this.proficiency = proficiency; this.descEn = descEn; this.descZh = descZh;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getProficiency() { return proficiency; }
    public void setProficiency(Integer proficiency) { this.proficiency = proficiency; }
    public String getDescEn() { return descEn; }
    public void setDescEn(String descEn) { this.descEn = descEn; }
    public String getDescZh() { return descZh; }
    public void setDescZh(String descZh) { this.descZh = descZh; }
}
