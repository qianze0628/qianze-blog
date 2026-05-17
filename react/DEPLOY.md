# qianze 博客 — 部署指南

## 架构总览

```
浏览器
  │
  ├── 方案 A：Next.js（全栈，一个服务）
  │     blog/  →  npm run build  →  npm start
  │     端口 3000，前后端一体
  │
  └── 方案 B：React + SpringBoot（前后端分离，两个服务）
        blog-react/      →  npm run build  →  nginx 静态服务 (端口 5173/80)
        blog-springboot/ →  mvn package     →  java -jar (端口 8080)
```

---

## 方案 A：Next.js 部署

### Vercel 部署（推荐，免费）

```bash
cd blog
git add . && git commit -m "deploy"
git push origin main

# 打开 vercel.com → Import Project → 选择仓库 → Deploy
# Vercel 自动检测 Next.js，无需任何配置
```

### 自建服务器（Ubuntu 22.04）

```bash
# 1. SSH 登录
ssh root@your-server-ip

# 2. 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 3. 克隆代码
git clone https://github.com/qianze-ui/your-repo.git
cd your-repo/blog

# 4. 构建并启动
npm install
npm run build
npm install -g pm2
pm2 start npm --name "blog" -- start
pm2 save && pm2 startup

# 5. Nginx 反向代理
apt-get install -y nginx
cat > /etc/nginx/sites-available/blog << 'EOF'
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 6. SSL（Let's Encrypt 免费证书）
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 方案 B：React + SpringBoot 部署

### SpringBoot 后端部署

```bash
# 1. 本地打包
cd blog-springboot
./mvnw clean package -DskipTests
# 生成 target/blog-api-1.0.0.jar

# 2. 上传到服务器
scp target/blog-api-1.0.0.jar root@your-server-ip:/app/

# 3. 服务器启动
ssh root@your-server-ip
cd /app

# 开发环境（H2 数据库）
java -jar blog-api-1.0.0.jar

# 生产环境（PostgreSQL）
cat > application-prod.yml << 'EOF'
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/blog
    driver-class-name: org.postgresql.Driver
    username: postgres
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
EOF
java -jar blog-api-1.0.0.jar --spring.profiles.active=prod

# 4. PM2 进程守护（需要先安装 PM2）
# 或者使用 systemd
cat > /etc/systemd/system/blog-api.service << 'EOF'
[Unit]
Description=Blog API
After=network.target
[Service]
User=root
ExecStart=/usr/bin/java -jar /app/blog-api-1.0.0.jar
Restart=always
[Install]
WantedBy=multi-user.target
EOF
systemctl enable blog-api && systemctl start blog-api
```

### React 前端部署

```bash
# 1. 本地构建
cd blog-react
npm install
npm run build
# 生成 dist/ 目录

# 2. 上传到服务器
scp -r dist/* root@your-server-ip:/var/www/blog/

# 3. Nginx 配置
cat > /etc/nginx/sites-available/blog << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/blog;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理到 SpringBoot
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 4. SSL
certbot --nginx -d your-domain.com
```

---

## 数据库切换（SpringBoot）

### 开发：H2（默认，无需安装）

`application.yml` 默认使用 H2 文件数据库，自动建表，自动种子数据。

访问 `http://localhost:8080/h2-console` 查看数据库。

### 生产：PostgreSQL

```bash
# 安装 PostgreSQL
apt-get install -y postgresql

# 创建数据库
sudo -u postgres psql -c "CREATE DATABASE blog;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"

# 修改 application-prod.yml 中的数据库连接
# 启动时指定 prod profile
java -jar blog-api-1.0.0.jar --spring.profiles.active=prod
```

---

## Next.js 数据管理

Next.js 版本无需额外后端，所有数据存储在 `src/data/*.json`。

管理后台：`/admin`，密码 `qianze2026`。

**如果想用 SpringBoot 作为 Next.js 的后端**：

修改 `src/app/api/*/route.ts` 中的实现，改为 fetch SpringBoot API 即可。

---

## 常用命令

```bash
# Next.js
cd blog
npm run dev      # 开发模式
npm run build    # 构建
npm start        # 生产启动

# SpringBoot
cd blog-springboot
./mvnw spring-boot:run              # 开发模式
./mvnw clean package -DskipTests    # 打包
java -jar target/blog-api-1.0.0.jar # 运行

# React
cd blog-react
npm install      # 安装依赖
npm run dev      # 开发模式（端口 5173）
npm run build    # 构建到 dist/
npm run preview  # 预览构建结果

# 服务器
pm2 list                    # 查看进程
pm2 logs blog               # 查看日志
pm2 restart blog            # 重启
systemctl status blog-api   # SpringBoot 状态
nginx -t                    # 检查 Nginx 配置
certbot renew               # 续期 SSL 证书
```
