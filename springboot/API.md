# SpringBoot + MyBatis API 文档 v2.0

- 基准 URL: `http://localhost:8080`（开发）/ 实际服务器地址
- Content-Type: `application/json`
- 管理接口支持双重认证：JWT（`Authorization: Bearer <token>`）或密码（body 中 `password` 字段）

---

## 认证 POST /api/auth/login

```json
{ "password": "qianze2026" }
```
`200 { "token": "eyJhbG..." }` | `401 { "error": "密码错误" }`

Token 默认有效期 1 小时，配置项 `jwt.expiration`（毫秒）。

---

## 技能 /api/skills

### GET
```json
[{ "id": 1, "name": "AI Agent Dev", "proficiency": 92, "descEn": "...", "descZh": "..." }]
```

### PUT (认证)
```json
{ "password": "qianze2026", "data": [...] }
```
或 Header `Authorization: Bearer <token>` + body `{ "data": [...] }`

---

## 项目 /api/projects

### GET
```json
[{ "id": 1, "num": "/01", "title": "...", "tags": "LangChain,Python", "descEn": "...", "descZh": "...", "url": "https://..." }]
```
`url` 字段可选，设置后首页卡片背面显示「访问站点 →」按钮。

### PUT (认证)
格式同技能。

---

## 文章 /api/posts

### GET
```json
[{
  "id": 1, "slug": "building-ai-agents", "title": "...", "titleZh": "...",
  "date": "2026-05-01", "category": "AI", "readTime": 8, "tags": "AI,LangChain",
  "summary": "...", "summaryZh": "...", "contentEn": "...", "contentZh": "...",
  "featured": true
}]
```
按 `date DESC` 排序。`featured: true` 的文章优先在首页「精选文章」展示。

### GET /api/posts/{slug}
返回单篇文章详情（含正文 `contentEn`/`contentZh`）。`404` 不存在。

### PUT (认证)
格式同上。`date` 为 `yyyy-MM-dd`，`tags` 支持数组或逗号分隔字符串。

---

## 碎念 /api/notes

### GET
```json
[{ "id": 1, "content": "...", "date": "2026-05-14", "type": "text" }]
```
`type`: `text` | `code`

### PUT (认证)
格式同上。

---

## 友链 /api/friends

### GET
```json
[{ "id": 1, "name": "友人 A", "desc": "全栈开发者", "url": "https://..." }]
```

### PUT (认证)
格式同上。

---

## 留言 /api/guestbook

### GET 同上

### POST (公开)
```json
{ "author": "访客名", "message": "留言内容（必填）", "mood": "like" }
```
`200` 返回新建条目 | `400 { "error": "留言不能为空" }`

---

## 访问统计 POST /api/stats

```json
{ "password": "qianze2026" }
```
或 JWT Header。

```json
{
  "totalVisits": 1234, "uniqueVisitors": 567,
  "todayVisits": 89, "last7Days": [{"date":"2026-05-10","cnt":50}],
  "hourlyStats": [{"hour":10,"cnt":20}],
  "topPages": [{"page":"/","cnt":500}],
  "recent": [{"page":"/","userAgent":"...","createdAt":"2026-05-16T12:00:00"}]
}
```

---

## 访问信标 POST /api/visit

前端自动调用，记录页面访问。

```json
{ "page": "/blog", "referrer": "", "userAgent": "...", "language": "zh-CN", "screen": "1920x1080" }
```
`200`（无返回值）

---

## 错误码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未认证（密码错误/Token 过期） |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 数据库表

```
skills       (id, name, proficiency, desc_en, desc_zh)
projects     (id, num, title, tags, desc_en, desc_zh, url)
posts        (id, slug UNIQUE, title, title_zh, date, category, read_time, tags, summary, summary_zh, content_en, content_zh, featured)
notes        (id, content, date, type)
friends      (id, name, desc, url)
guestbook    (id, author, message, mood, date)
visit_logs   (id, page, referrer, user_agent, language, screen, created_at)
```
