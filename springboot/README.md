# qianze 博客 — SpringBoot 后端 (MyBatis + MySQL)

基于 SpringBoot 3.3 + MyBatis 3.0 + MySQL 的 REST API 后端。

配套前端: `blog-react/` (React 18 + Vite + Tailwind CSS + Framer Motion + Recharts)

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | SpringBoot 3.3.2 |
| ORM | MyBatis 3.0.4 (注解 SQL) |
| 数据库 | MySQL 8.0 |
| 认证 | JWT (jjwt 0.12.6)，默认 1 小时过期 |
| Java | JDK 17 |

## 快速启动

```bash
# 1. 安装 MySQL 并建库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS blog DEFAULT CHARSET utf8mb4;"

# 2. 建表
mysql -u root -p blog < src/main/resources/migrate.sql

# 3. 修改 application.yml 中的数据库密码

# 4. 启动
./mvnw spring-boot:run
```

## 项目结构

```
src/main/java/com/qianze/
├── BlogApplication.java           # 启动入口
├── entity/        (7 个 POJO)
│   ├── Skill/Project/Post/Note/Friend/GuestbookEntry/VisitLog
├── mapper/        (7 个 MyBatis 注解接口)
├── service/       (7 个 Service)
├── controller/    (8 个 REST Controller)
│   ├── AuthController      POST /api/auth/login
│   ├── SkillController     GET/PUT /api/skills
│   ├── ProjectController   GET/PUT /api/projects
│   ├── PostController      GET/PUT /api/posts, GET /api/posts/{slug}
│   ├── NoteController      GET/PUT /api/notes
│   ├── FriendController    GET/PUT /api/friends
│   ├── GuestbookController GET/POST /api/guestbook
│   ├── StatsController     POST /api/stats
│   └── VisitController     POST /api/visit
└── config/
    ├── CorsConfig.java     # 跨域
    ├── JwtUtil.java        # JWT 工具
    ├── JwtFilter.java      # JWT 过滤器
    └── WebConfig.java      # 注册过滤器
```

## REST API

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | /api/auth/login | 密码 | 获取 JWT Token |
| GET | /api/skills | 否 | 技能列表 |
| PUT | /api/skills | JWT/密码 | 批量更新 |
| GET | /api/projects | 否 | 项目列表（含 url） |
| PUT | /api/projects | JWT/密码 | 批量更新 |
| GET | /api/posts | 否 | 文章列表（含 featured） |
| GET | /api/posts/{slug} | 否 | 文章详情 |
| PUT | /api/posts | JWT/密码 | 批量更新 |
| GET | /api/notes | 否 | 碎念列表 |
| PUT | /api/notes | JWT/密码 | 批量更新 |
| GET | /api/friends | 否 | 友链列表 |
| PUT | /api/friends | JWT/密码 | 批量更新 |
| GET | /api/guestbook | 否 | 留言列表 |
| POST | /api/guestbook | 否 | 新增留言 |
| POST | /api/stats | JWT/密码 | 访问统计 |
| POST | /api/visit | 否 | 页面访问信标 |

## JWT 认证

1. 前端发送 `POST /api/auth/login { "password": "..." }` 获取 Token
2. 后续管理请求携带 `Authorization: Bearer <token>` Header
3. JwtFilter 验证 Token，设置 `jwtValid` 属性
4. 控制器检查 JWT 或 body 中的密码，两者任一有效即通过
5. Token 默认 1 小时过期（`application.yml` → `jwt.expiration`）

## 访问统计

访问记录由前端 `useVisit` hook 触发（每次路由切换发送 `POST /api/visit`），后端写入 `visit_logs` 表。统计数据通过 `POST /api/stats` 获取，管理后台每 15 秒自动刷新。

## 数据库表

```
skills       (id, name, proficiency, desc_en, desc_zh)
projects     (id, num, title, tags, desc_en, desc_zh, url)
posts        (id, slug UNIQUE, title, title_zh, date, category, read_time, tags, summary, summary_zh, content_en LONGTEXT, content_zh LONGTEXT, featured BOOLEAN)
notes        (id, content, date, type)
friends      (id, name, desc, url)
guestbook    (id, author, message, mood, date)
visit_logs   (id, page, referrer, user_agent, language, screen, created_at)
```
