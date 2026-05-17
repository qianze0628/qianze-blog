CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    proficiency INT DEFAULT 50,
    desc_en TEXT,
    desc_zh TEXT
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    num VARCHAR(10),
    title VARCHAR(200) NOT NULL,
    tags VARCHAR(500),
    desc_en TEXT,
    desc_zh TEXT,
    url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE,
    title VARCHAR(300) NOT NULL,
    title_zh VARCHAR(300),
    date DATE,
    category VARCHAR(50),
    read_time INT DEFAULT 5,
    tags VARCHAR(500),
    summary TEXT,
    summary_zh TEXT,
    content_en LONGTEXT,
    content_zh LONGTEXT
);

CREATE TABLE IF NOT EXISTS notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    date DATE,
    type VARCHAR(20) DEFAULT 'text'
);

CREATE TABLE IF NOT EXISTS friends (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    `desc` VARCHAR(500),
    url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS guestbook (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author VARCHAR(100) DEFAULT '匿名',
    message TEXT NOT NULL,
    mood VARCHAR(20) DEFAULT 'like',
    date DATE
);

CREATE TABLE IF NOT EXISTS visit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(50),
    page VARCHAR(200),
    user_agent VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
