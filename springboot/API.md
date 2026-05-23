# API 接口文档 v3.0

基准 URL：`http://localhost:8080`（开发）/ 实际服务器地址
Content-Type：`application/json`
管理接口支持双重认证：JWT（`Authorization: Bearer <token>`）或密码（body 中 `password` 字段）

---

## 认证

### POST /api/auth/login
```json
{ "password": "qianze2026" }
```
`200 { "token": "eyJhbG..." }` | `401 { "error": "密码错误" }`

支持多密码（逗号分隔 `ADMIN_PASSWORD` 环境变量）。

### POST /api/auth/share
```json
{ "password": "qianze2026", "days": "7" }
```
生成只读分享 Token（1-30 天有效）。`200 { "token": "...", "days": 7, "role": "readonly" }`

### POST /api/auth/me
Header `Authorization: Bearer <token>`
`200 { "role": "admin"|"readonly" }` — 查询当前 JWT 角色

---

## 技能 /api/skills

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部技能 |
| PUT | JWT/密码 | `{ "password": "...", "data": [...] }` 批量替换 |

```json
{ "id": 1, "name": "AI Agent Dev", "proficiency": 92, "descEn": "...", "descZh": "..." }
```

---

## 项目 /api/projects

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部项目 |
| PUT | JWT/密码 | 批量替换 |

```json
{ "id": 1, "num": "/01", "title": "Project", "tags": "React,Java", "descEn": "...", "descZh": "...", "url": "https://..." }
```

---

## 文章 /api/posts

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部文章（按 date DESC） |
| GET /{slug} | — | 单篇文章详情 |
| PUT | JWT/密码 | 批量替换 |

```json
{
  "id": 1, "slug": "building-ai-agents", "title": "...", "titleZh": "...",
  "date": "2026-05-01", "category": "AI", "readTime": 8,
  "tags": "AI,LangChain", "summary": "...", "summaryZh": "...",
  "contentEn": "...", "contentZh": "...", "featured": true
}
```
- `contentEn/contentZh` 支持 `![描述](URL)` 插入图片
- `featured: true` 首页精选展示

---

## 碎念 /api/notes

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部碎念 |
| PUT | JWT/密码 | 批量替换 |

```json
{ "id": 1, "content": "...", "date": "2026-05-14", "type": "text" }
```
`type`：`text` | `code`

---

## 友链 /api/friends

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部友链 |
| PUT | JWT/密码 | 批量替换 |

```json
{ "id": 1, "name": "友人A", "desc": "全栈开发者", "url": "https://..." }
```

---

## 留言 /api/guestbook

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部留言（按 date DESC） |
| POST | — | 新增留言（公开） |
| DELETE /{id} | JWT | 删除留言 |

POST Body：
```json
{ "author": "访客名", "message": "留言内容（必填，支持 emoji + 图片）", "mood": "like" }
```

---

## 访问统计 POST /api/stats

```json
{ "password": "..." }
```
或 JWT Header。

```json
{
  "totalVisits": 1234, "uniqueVisitors": 567, "todayVisits": 89,
  "last7Days": [{"date":"2026-05-10","cnt":50}],
  "hourlyStats": [{"hour":10,"cnt":20}],
  "topPages": [{"page":"/","cnt":500}],
  "browserStats": [{"browser":"Chrome","cnt":200}],
  "osStats": [{"os":"Windows 10/11","cnt":300}],
  "deviceStats": [{"device":"桌面端","cnt":280}],
  "recent": [{"page":"/","ip":"1.2.3.4","country":"中国","province":"浙江","city":"杭州","isp":"电信","browser":"Chrome","os":"Windows 11","device":"桌面端","model":"","createdAt":"2026-05-16T12:00:00"}]
}
```

---

## 访问信标 POST /api/visit

前端自动调用，记录页面访问。
```json
{ "page": "/blog", "referrer": "", "userAgent": "...", "language": "zh-CN",
  "screen": "1920x1080", "browser": "Chrome", "os": "Windows 11", "device": "桌面端", "model": "" }
```

---

## 音乐 /api/songs

| 方法 | 认证 | 说明 |
|------|------|------|
| GET | — | 全部歌曲（公开） |
| GET /search?q=xxx&type=netease | — | 搜索音乐（代理 xmsj.org） |
| GET /{id} | — | 单曲详情 |
| POST | JWT | 新增歌曲 |
| PUT /{id} | JWT | 编辑歌曲 |
| DELETE /{id} | JWT | 删除歌曲 |
| POST /{id}/play | — | 播放次数 +1 |
| POST /import | JWT | 导入歌曲（搜索→下载→入库） |
| POST /import-batch | JWT | 批量导入 `{ "songs": [...] }` |
| GET /check/{id} | — | 检测音源是否存活 |
| GET /top-searched | — | TOP10 搜索排行 |
| GET /guest-logs | JWT | 访客点歌记录 |

搜索参数 `type`：`netease`（网易云）、`qq`（QQ）、`kugou`（酷狗）、`kuwo`（酷我）、`migu`（咪咕）等。逗号分隔并行搜索。

歌曲字段：
```json
{
  "id": 1, "songId": 30352891, "title": "牵丝戏", "artist": "银临",
  "album": "", "url": "https://music.163.com/song/media/outer/url?id=30352891.mp3",
  "playUrl": "https://music.163.com/song/media/outer/url?id=30352891.mp3",
  "cover": "/music/a1b2c3d4.jpg", "lyricUrl": "[00:12.00]嘲笑谁恃美扬威...",
  "duration": 0, "sourceType": "external", "playCount": 42,
  "sortOrder": 0, "createTime": "2026-05-19T20:00:00"
}
```

---

## 访客点歌追踪 POST /api/songs/track

```json
{ "title": "牵丝戏", "artist": "银临", "url": "https://...", "source": "search" }
```
记录访客搜索/添加歌曲的行为，保存 IP、地区、浏览器、OS、设备信息。

---

## 文件上传

| 方法 | 认证 | 说明 |
|------|------|------|
| POST /api/upload | JWT | 上传图片 → `/uploads/` |
| POST /api/upload/public | — | 公开上传（限图片/5MB） |
| POST /api/upload/music?type=audio | JWT | 上传音频 → `/music/` |
| POST /api/upload/music?type=cover | JWT | 上传封面 → `/music/` |
| POST /api/upload/music?type=lyric | JWT | 上传歌词 → `/music/` |

返回 `{ "url": "/uploads/xxx.jpg" }` 或 `{ "url": "/music/xxx.mp3" }`

---

## MySQL 表结构

```
skills          (id, name, proficiency, desc_en, desc_zh)
projects        (id, num, title, tags, desc_en, desc_zh, url)
posts           (id, slug UNIQUE, title, title_zh, date DATETIME, category,
                 read_time, tags, summary, summary_zh, content_en LONGTEXT,
                 content_zh LONGTEXT, featured BOOLEAN)
notes           (id, content, date DATETIME, type)
friends         (id, name, `desc`, url)
guestbook       (id, author, message TEXT, mood, ip, user_agent,
                 browser, os, device, model, country, province, city, date DATETIME)
visit_logs      (id, ip, page, user_agent, referrer, language, screen,
                 browser, os, device, model, country, province, city, isp, created_at)
songs           (id, song_id UNIQUE, title, artist, album, url, play_url,
                 cover, lyric_url LONGTEXT, duration, source_type, play_count,
                 sort_order, create_time)
guest_music_logs(id, ip, country, province, city, browser, os, device, model,
                 song_title, song_artist, song_url, source, created_at)
```

---

## 错误码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未认证 |
| 403 | 无权限（只读 Token 写操作） |
| 404 | 资源不存在 |
| 500 | 服务器错误 |
