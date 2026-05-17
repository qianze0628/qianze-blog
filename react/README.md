# qianze 博客 — React 前端 v2.0

React 18 + Vite + Tailwind CSS + Framer Motion + Recharts 前端项目。

对应后端: `blog-springboot/` (SpringBoot 3.3 + MyBatis + MySQL)

## 快速启动

```bash
npm install
npm run dev      # http://localhost:5173
# /api 请求通过 Vite proxy 转发到 localhost:8080
```

## 目录结构

```
src/
├── main.jsx                    # 入口（BrowserRouter + Providers）
├── App.jsx                     # 6 条路由 + useVisit 访问信标
├── index.css                   # Tailwind + 点阵背景 + 3D CSS
├── api/
│   └── index.js                # fetch 封装 + JWT Token 管理
├── hooks/
│   └── useVisit.js             # 访问信标（自动记录页面访问）
├── context/
│   ├── ThemeContext.jsx         # 亮暗切换
│   └── LanguageContext.jsx      # 中英切换（默认中文）
├── components/
│   ├── Header.jsx              # 导航栏（作品/文章/碎念/社区）
│   ├── Hero.jsx                # 3D Gaze + 大圆翻译反转
│   ├── FlipCard.jsx            # 通用 3D 翻转卡片
│   ├── Skills.jsx              # 技能卡片
│   ├── HomeBlog.jsx            # 首页精选文章
│   ├── Projects.jsx            # 项目卡片（含跳转链接）
│   └── Footer.jsx              # 联系信息 + 滚动渐入
└── views/
    ├── Home.jsx                # 首页（Hero+技能+精选文章+项目+Footer）
    ├── Blog.jsx                # 文章列表
    ├── BlogPost.jsx            # 文章详情页
    ├── Notes.jsx               # 碎念便当盒
    ├── Space.jsx               # 友链 + 留言板
    ├── Admin.jsx               # 管理后台（7 Tab + JWT 登录）
    └── Analytics.jsx           # 数据分析仪表盘（Recharts）
```

## 特效实现

| 特效 | 技术 |
|------|------|
| 3D Gaze 文字旋转 | Framer Motion useSpring |
| 大圆翻译反转 | 固定定位 + clip-path |
| 3D 翻转卡片 | CSS preserve-3d + rotateY |
| 滚动渐入动画 | whileInView + staggerChildren |
| 数据分析图表 | Recharts (AreaChart + BarChart) |
| 访问信标 | useVisit hook + POST /api/visit |
| JWT 认证 | localStorage Token + Authorization Header |
| 亮暗切换 | ThemeContext + html.dark class |
| 中英切换 | LanguageContext（默认中文） |
| 点阵网格背景 | radial-gradient |

## 页面路由

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | Home | 首页 |
| `/blog` | Blog | 文章列表 |
| `/blog/:slug` | BlogPost | 文章详情 |
| `/notes` | Notes | 碎念便当盒 |
| `/space` | Space | 友链 + 留言板 |
| `/admin` | Admin | 管理后台 |

## 管理后台功能

| Tab | 功能 |
|-----|------|
| 技能 | 名称、熟练度、描述 |
| 项目 | 编号、标题、标签、描述、链接 |
| 文章 | slug、标题、分类、标签、摘要、正文、精选标记 |
| 碎念 | 内容、日期、类型 |
| 友链 | 名称、描述、网址 |
| 留言 | 查看 / 删除 |
| 访问 | 总访问量、今日访问、独立访客、近7天趋势图、每小时流量图、热门页面、实时动态 |

## JWT 登录流程

1. 输入密码 → `POST /api/auth/login` → 获取 Token
2. Token 存 localStorage，后续请求自动携带 `Authorization: Bearer <token>`
3. Token 默认 1 小时过期，过期后需重新登录
4. 兼容模式：controller 同时支持 JWT 和 body 密码认证
