-- 对新数据库：直接建表
-- 对已有数据库：先执行 DROP TABLE IF EXISTS，再重新建表

DROP TABLE IF EXISTS visit_logs;
DROP TABLE IF EXISTS guestbook;
DROP TABLE IF EXISTS friends;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS skills;

CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    proficiency INT DEFAULT 50,
    desc_en TEXT,
    desc_zh TEXT
);

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    num VARCHAR(10),
    title VARCHAR(200) NOT NULL,
    tags VARCHAR(500),
    desc_en TEXT,
    desc_zh TEXT,
    url VARCHAR(500)
);

CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE,
    title VARCHAR(300) NOT NULL,
    title_zh VARCHAR(300),
    date DATETIME,
    category VARCHAR(50),
    read_time INT DEFAULT 5,
    tags VARCHAR(500),
    summary TEXT,
    summary_zh TEXT,
    content_en LONGTEXT,
    content_zh LONGTEXT,
    featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    date DATETIME,
    type VARCHAR(20) DEFAULT 'text'
);

CREATE TABLE friends (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    `desc` VARCHAR(500),
    url VARCHAR(500)
);

CREATE TABLE guestbook (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(100) DEFAULT '匿名',
    message TEXT NOT NULL,
    mood VARCHAR(20) DEFAULT 'like',
    date DATETIME
);

CREATE TABLE visit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(50),
    page VARCHAR(200),
    user_agent VARCHAR(500),
    referrer VARCHAR(500),
    language VARCHAR(20),
    screen VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
