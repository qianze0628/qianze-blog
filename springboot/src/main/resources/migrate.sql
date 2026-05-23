-- ============================================
-- 警告：此文件会 DROP 所有表，数据全部丢失！
-- 仅在首次部署或需要清空数据时使用。
-- 日常更新请用 alter.sql
-- ============================================

DROP TABLE IF EXISTS visit_logs;
DROP TABLE IF EXISTS guestbook;
DROP TABLE IF EXISTS songs;
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
    ip VARCHAR(50),
    user_agent VARCHAR(500),
    browser VARCHAR(50),
    os VARCHAR(50),
    device VARCHAR(20),
    model VARCHAR(100),
    country VARCHAR(50),
    province VARCHAR(50),
    city VARCHAR(50),
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
    browser VARCHAR(50),
    os VARCHAR(50),
    device VARCHAR(20),
    model VARCHAR(100),
    country VARCHAR(50),
    province VARCHAR(50),
    city VARCHAR(50),
    isp VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    song_id BIGINT UNIQUE,
    title VARCHAR(200) NOT NULL,
    artist VARCHAR(100) DEFAULT '',
    album VARCHAR(200) DEFAULT '',
    url VARCHAR(1000) NOT NULL,
    play_url VARCHAR(1000),
    cover VARCHAR(1000),
    lyric_url LONGTEXT,
    duration INT DEFAULT 0,
    source_type VARCHAR(20) DEFAULT 'external',
    play_count INT DEFAULT 0,
    sort_order INT DEFAULT 0,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
