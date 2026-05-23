# 部署指南 — SpringBoot + React v2.0

## 前提

- 服务器安装 JDK 17、MySQL 8.0、Nginx、Node.js 20
- 项目源码在本地

---

## 1. 服务器安装 MySQL

```bash
apt-get install -y mysql-server
mysql_secure_installation

mysql -u root -p <<SQL
CREATE DATABASE blog DEFAULT CHARSET utf8mb4;
CREATE USER IF NOT EXISTS 'blog'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON blog.* TO 'blog'@'localhost';
FLUSH PRIVILEGES;
SQL
```

---

## 2. 建表

```bash
scp src/main/resources/migrate.sql root@服务器:/tmp/
ssh root@服务器 "mysql -u blog -p blog < /tmp/migrate.sql"
```

> `migrate.sql` 会先 DROP 再 CREATE 所有表（数据会丢失）。生产环境首次部署后不要重复执行，改用 `alter.sql` 增量迁移。

---

## 3. 后端部署

```bash
# 本地打包
cd blog-springboot
mvn clean package -DskipTests
# 生成 target/blog-api.jar

# 上传
scp target/blog-api.jar root@服务器:/app/
scp src/main/resources/ip2region.xdb root@服务器:/app/

# 服务器：创建目录
ssh root@服务器
mkdir -p /app/uploads /app/music

# 服务器：创建 application.yml（含真实密码，不会提交到 Git）
cat > /app/application.yml << 'EOF'
server:
  port: 8080
  forward-headers-strategy: framework
spring:
  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
  datasource:
    url: jdbc:mysql://localhost:3306/blog?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai&createDatabaseIfNotExist=true
    username: root
    password: 你的MySQL密码
admin:
  password: 你的管理密码
jwt:
  secret: 生成一个长随机字符串
EOF

# 创建 systemd 服务
cat > /etc/systemd/system/blog-api.service << 'EOF'
[Unit]
Description=Blog API
After=network.target mysql.service
[Service]
User=root
WorkingDirectory=/app
ExecStart=/usr/bin/java -jar /app/blog-api-2.0.0.jar --spring.config.location=/app/application.yml
Restart=always
[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable blog-api
systemctl start blog-api
# 验证: curl http://localhost:8080/api/skills
```

---

## 4. 前端部署

```bash
# 本地构建
cd blog-react
npm install && npm run build

# 上传
scp -r dist/* root@服务器:/var/www/blog/

# 服务器：Nginx 配置
cat > /etc/nginx/sites-available/blog << 'NGINX'
server {
    listen 80;
    server_name 你的域名或IP;

    client_max_body_size 50M;

    root /var/www/blog;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /uploads/ {
        proxy_pass http://localhost:8080/uploads/;
        proxy_set_header Host $host;
    }

    location /music/ {
        proxy_pass http://localhost:8080/music/;
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 5. SSL 证书

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d 你的域名
certbot renew --dry-run
```

---

## 6. 数据库增量迁移

```bash
scp src/main/resources/alter.sql root@服务器:/tmp/
ssh root@服务器 "mysql -u root -p blog < /tmp/alter.sql"
```

> `alter.sql` 中的 `DROP TABLE IF EXISTS songs` 会清空音乐列表。

---

## 7. 更新部署

```bash
# 后端更新
cd blog-springboot && mvn clean package -DskipTests
scp target/blog-api.jar root@服务器:/app/
ssh root@服务器 "systemctl restart blog-api"

# 前端更新
cd blog-react && npm run build
scp -r dist/* root@服务器:/var/www/blog/
```

---

## 8. 数据流

```
浏览器 → Nginx (80)
    ├── /               → /var/www/blog/index.html (React SPA)
    ├── /uploads/*      → proxy_pass → localhost:8080 (SpringBoot 静态文件)
    ├── /music/*        → proxy_pass → localhost:8080 (SpringBoot 静态文件)
    ├── /api/*          → proxy_pass → localhost:8080 (SpringBoot)
    │                         ├── JwtFilter (认证)
    │                         ├── MyBatis Mapper
    │                         └── MySQL (blog 库)
    └── /api/visit      → 前端 useVisit hook 自动发送
                              └── INSERT visit_logs
```
