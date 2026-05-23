# qianze 博客 — React 前端 v3.0

React 18 + Vite 5 + TailwindCSS 3 + Zustand + Framer Motion + Recharts

对应后端：`springboot/`（SpringBoot 3.3 + MyBatis + MySQL）

---

## 快速启动

```bash
npm install
npm run dev      # http://localhost:5173
# /api /uploads /music 通过 Vite proxy 转发到 localhost:8080
```

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + Vite 5 |
| 样式 | TailwindCSS 3 + 毛玻璃（backdrop-blur） |
| 动画 | Framer Motion |
| 状态管理 | Zustand（播放器全局状态） |
| 图表 | Recharts（访问分析仪表盘） |
| 路由 | React Router 6 |
| HTTP | fetch（api/index.js 封装） |
| 持久化 | localStorage（Token + 播放器状态 + 搜索历史） |

---

## 目录结构

```
src/
├── main.jsx                       # 入口（BrowserRouter + ThemeProvider + LanguageProvider）
├── App.jsx                        # 路由表 + useVisit 全局信标 + MusicPlayer 全局播放器
├── index.css                      # Tailwind + 点阵背景 + 3D CSS
│
├── api/
│   └── index.js                   # fetch 封装 + JWT Token 管理 + 全部 API 函数
│
├── stores/
│   └── playerStore.js             # Zustand 全局播放器状态（歌曲/音量/模式/进度/历史/收藏）
│
├── utils/
│   └── mediaUrl.js                # URL 工具（getMediaUrl / normalizeUploadUrl / isExternal）
│
├── hooks/
│   └── useVisit.js                # 访问信标 hook（UA 解析 + 自动上报）
│
├── context/
│   ├── ThemeContext.jsx            # 亮暗主题切换
│   └── LanguageContext.jsx         # 中/英语言切换（默认中文）
│
├── components/（12 个）
│   ├── Header.jsx                 # 顶部导航栏（桌面+移动汉堡菜单）
│   ├── Hero.jsx                   # 首页 3D Gaze 交互 + 大圆翻译反转
│   ├── FlipCard.jsx               # 通用 3D 翻转卡片（CSS preserve-3d + rotateY）
│   ├── Skills.jsx                 # 技能卡片（进度条 + 滚动渐入）
│   ├── HomeBlog.jsx               # 首页精选文章
│   ├── Projects.jsx               # 项目卡片（含跳转链接）
│   ├── Footer.jsx                 # 页脚（联系信息）
│   ├── MusicPlayer.jsx            # 全局音乐播放器（Music Hub 居中面板）
│   ├── EmojiPicker.jsx            # 留言表情选择器（预设 50 + 自定义）
│   └── SearchModal.jsx            # 音乐搜索弹窗（xmsj.org 网易云搜索）
│
└── views/（7 个页面）
    ├── Home.jsx                   # 首页（Hero + 技能 + 精选文章 + 项目 + Footer）
    ├── Blog.jsx                   # 文章列表（滚动渐入动画）
    ├── BlogPost.jsx               # 文章详情（Markdown 图片渲染 + 中英双语）
    ├── Notes.jsx                  # 碎念便当盒（文字/代码）
    ├── Space.jsx                  # 友链翻卡 + 留言板（emoji + 图片）+ 播放排行
    ├── Admin.jsx                  # 管理后台（10 Tab + JWT 登录 + 权限管理）
    └── Analytics.jsx              # 访问数据仪表盘（Recharts 图表）
```

---

## 页面路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/blog` | Blog | 文章列表 |
| `/blog/:slug` | BlogPost | 文章详情 |
| `/notes` | Notes | 碎念 |
| `/space` | Space | 友链 + 留言板 + 播放排行 |
| `/admin` | Admin | 管理后台 |

---

## 管理后台选项卡

| Tab | 功能 |
|-----|------|
| 技能 | 名称 / 熟练度 / 中英描述（翻译按钮） |
| 项目 | 编号 / 标题 / 标签 / 中英描述 / 链接（翻译按钮） |
| 文章 | slug / 日期 / 分类 / 标签 / 中英标题摘要正文 / 精选标记 / 图片上传预览（翻译按钮） |
| 碎念 | 内容 / 日期 / 类型 |
| 友链 | 名称 / 描述 / 网址 |
| 留言 | 查看（emoji+图片渲染）/ 删除确认 |
| 音乐 | 搜索导入（多平台并行）+ 歌曲编辑 + 本地上传 |
| 点歌 | 播放次数排行 / 热门搜索 / 点歌记录（IP+地区+设备） |
| 访问 | KPI 卡片 / 趋势图 / 流量图 / 热门页面 / 实时动态 |

---

## 音乐播放器特性

### Music Hub 居中面板
- 右下角悬浮 FAB → 点击展开全屏毛玻璃面板
- **左侧**：封面旋转 + 频谱动画 + 歌曲信息 + 沉浸歌词
- **右侧**：三 Tab（歌单 / 搜索 / 临时歌单）
- **底部**：进度条拖拽 + 播放控制 + 音量 + 播放模式

### 全局状态（Zustand）
- 页面切换不断歌
- localStorage 持久化：当前歌曲/进度/音量/模式/歌单/历史
- 键盘快捷键：Space 暂停、Ctrl+←→ 切歌、Ctrl+↑↓ 音量、Ctrl+M 静音

### 音乐来源
- 作者歌单：数据库永久存储，后台管理
- 游客临时歌单：localStorage，刷新不丢失
- 搜索：xmsj.org → 网易云/QQ/酷狗/酷我/咪咕 等多平台

### 歌词
- LRC 格式解析
- 当前行大字高亮暖橙色，非当前行半透明小字
- 自动居中滚动

---

## 特效实现

| 特效 | 技术 |
|------|------|
| 3D Gaze 文字旋转 | Framer Motion useSpring |
| 大圆翻译反转 | 固定定位 + clip-path |
| 3D 翻卡 | CSS preserve-3d + rotateY |
| 滚动渐入 | whileInView + staggerChildren |
| 封面旋转 | Framer Motion rotate: 360 + infinite |
| 频谱动画 | Canvas 随机游走柱状图 |
| 毛玻璃 | backdrop-blur-xl + 半透明背景 |
| 呼吸光 | Framer Motion opacity 循环 |
| 数据分析 | Recharts（AreaChart + BarChart） |
| 点阵背景 | radial-gradient |

---

## JWT 认证流程

1. 输入密码 → `POST /api/auth/login` → 获取 admin Token
2. Token 存 localStorage，后续请求自动带 `Authorization: Bearer <token>`
3. 分享链接：生成只读 Token（1-30 天有效），打开自动登录
4. 只读模式：隐藏保存/删除按钮，后端返回 403
5. 退出登录：清除 Token 回到登录页
