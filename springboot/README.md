# qianze 博客 — SpringBoot 后端 v3.0

SpringBoot 3.3 + MyBatis 3.0 + MySQL 8.0 的 REST API 后端。

配套前端：`react/`（React 18 + Vite + Tailwind CSS + Zustand + Framer Motion）

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | SpringBoot 3.3.2 |
| ORM | MyBatis 3.0.4（注解 SQL） |
| 数据库 | MySQL 8.0 |
| 认证 | JWT（jjwt 0.12.6） |
| IP 定位 | ip2region 2.7.0 |
| Java | JDK 17 |

---

## 快速启动

```bash
# 1. 建库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS blog DEFAULT CHARSET utf8mb4;"

# 2. 建表（首次）
mysql -u root -p blog < src/main/resources/migrate.sql

# 3. 增量迁移（已有数据时）
mysql -u root -p blog < src/main/resources/alter.sql

# 4. 启动
mvn spring-boot:run
```

---

## 项目结构

```
src/main/java/com/qianze/
├── BlogApplication.java           # 启动入口
├── config/
│   ├── CorsConfig.java            # CORS 跨域（/api/** /uploads/** /music/**）
│   ├── WebConfig.java             # JwtFilter 注册 + 静态资源映射
│   ├── JwtUtil.java               # JWT 签发/验证/角色提取
│   ├── JwtFilter.java             # JWT 请求过滤（设置 jwtValid + jwtRole）
│   └── UaParser.java              # User-Agent 解析（浏览器/OS/设备/型号）
├── entity/（9 个 POJO）
│   ├── Skill.java                 # 技能
│   ├── Project.java               # 项目
│   ├── Post.java                  # 文章
│   ├── Note.java                  # 碎念
│   ├── Friend.java                # 友链
│   ├── GuestbookEntry.java        # 留言（含 IP/UA/地理/设备）
│   ├── VisitLog.java              # 访问日志（含 IP/UA/地理/设备）
│   ├── Song.java                  # 歌曲（含 songId/playUrl/lyricUrl）
│   └── GuestMusicLog.java         # 访客点歌记录
├── mapper/（9 个 MyBatis 接口）
│   ├── SkillMapper.java           # 查询/批量替换
│   ├── ProjectMapper.java         # 查询/批量替换
│   ├── PostMapper.java            # 查询/按slug查/批量替换
│   ├── NoteMapper.java            # 查询/批量替换
│   ├── FriendMapper.java          # 查询/批量替换
│   ├── GuestbookMapper.java       # 查询/新增/删除
│   ├── VisitLogMapper.java        # 写入/统计查询
│   ├── SongMapper.java            # CRUD + 播放次数 + songId去重
│   └── GuestMusicLogMapper.java   # 写入/查询
├── service/（9 个 Service）
│   ├── SkillService.java          # 批量替换技能
│   ├── ProjectService.java        # 批量替换项目
│   ├── PostService.java           # 查询/批量替换文章
│   ├── NoteService.java           # 批量替换碎念
│   ├── FriendService.java         # 批量替换友链
│   ├── GuestbookService.java      # 留言创建（UA解析+IP定位）
│   ├── VisitService.java          # 访问记录（UA解析+IP定位）
│   ├── SongService.java           # 歌曲CRUD + songId去重
│   ├── IpService.java             # ip2region 地理定位 + 客户端IP提取
│   └── ImportService.java         # 音乐下载（mp3/封面→/music/）
└── controller/（11 个 Controller）
    ├── AuthController.java         # 登录/分享Token/查询角色
    ├── SkillController.java        # GET/PUT /api/skills
    ├── ProjectController.java      # GET/PUT /api/projects
    ├── PostController.java         # GET/PUT /api/posts
    ├── NoteController.java         # GET/PUT /api/notes
    ├── FriendController.java       # GET/PUT /api/friends
    ├── GuestbookController.java    # GET/POST/DELETE /api/guestbook
    ├── StatsController.java        # POST /api/stats
    ├── VisitController.java        # POST /api/visit
    ├── SongController.java         # 歌曲CRUD/搜索/导入/播放/访客追踪
    └── FileController.java         # 文件上传（图片/音频/封面/歌词）
```

---

## 核心特性

### JWT 双重认证
- 管理接口支持 JWT Header 或 body 密码，任一有效即可
- 角色：admin（完全权限）/ readonly（只读，分享用）
- Token 默认 1 小时过期（`jwt.expiration` 可配）

### IP 地理定位
- ip2region 2.7.0，精度到省/市/运营商
- 启动时加载 `ip2region.xdb`（~12MB），查询 0.1ms/次
- `IpService.getClientIp()` 从 X-Forwarded-For 提取真实 IP，跳过内网地址

### UA 解析
- `UaParser.java` 服务端 UA 解析：浏览器（微信/QQ/Chrome/Edge 等 15+）、OS（Win11/Android/iOS 等）、设备类型、手机型号
- 前端 `useVisit.js` 也用相同逻辑客户端解析

### 音乐导入系统
- 搜索：代理 xmsj.org，搜索网易云/QQ/酷狗/酷我/咪咕等 11 个平台（支持并行多平台）
- 导入：后端自动下载封面到 `/music/`，播放地址拼接 163 外链
- 去重：`song_id` UNIQUE，同歌曲不重复导入
- 失效检测：`GET /api/songs/check/{id}` 检测外链是否存活

### 文件管理
- `/uploads/` — 图片上传（博客文章 + 留言）
- `/music/`  — 音频/封面/歌词上传 + 下载
- 公开上传：`/api/upload/public`（无需认证，限图片 5MB）

---

## 环境变量

```yaml
server.port: 8080
spring.datasource.url: jdbc:mysql://localhost:3306/blog
spring.datasource.username: root
spring.datasource.password: ${DB_PASSWORD}
spring.servlet.multipart.max-file-size: 50MB
admin.password: ${ADMIN_PASSWORD}     # 逗号分隔多密码
jwt.secret: ${JWT_SECRET}             # 长随机字符串
jwt.expiration: 3600000               # 1 小时（毫秒）
```
