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

> `migrate.sql` 会先 DROP 再 CREATE 所有表（数据会丢失）。生产环境首次部署后不要重复执行，改用 `ALTER TABLE` 增量迁移。

---

## 3. 后端部署

```bash
# 本地打包
cd blog-springboot
./mvnw clean package -DskipTests
# 生成 target/blog-api-2.0.0.jar

# 上传
scp target/blog-api-2.0.0.jar root@服务器:/app/

# 服务器：创建 application.yml（含真实密码，不会提交到 Git）
ssh root@服务器
cat > /app/application.yml << 'EOF'
server:
  port: 8080
spring:
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
cat > /etc/nginx/sites-available/blog << 'EOF'
server {
    listen 80;
    server_name 你的域名或IP;

    root /var/www/blog;
    index index.html;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理到 SpringBoot
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 5. SSL 证书

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d 你的域名
certbot renew --dry-run  # 测试自动续期
```

---

## 6. 更新部署

```bash
# 后端更新
cd blog-springboot && ./mvnw clean package -DskipTests
scp target/blog-api-2.0.0.jar root@服务器:/app/
ssh root@服务器 "systemctl restart blog-api"

# 前端更新
cd blog-react && npm run build
scp -r dist/* root@服务器:/var/www/blog/
```

---

## 7. 数据流

```
浏览器 → Nginx (80)
    ├── /               → /var/www/blog/index.html (React SPA)
    ├── /api/*          → proxy_pass → localhost:8080 (SpringBoot)
    │                         ├── JwtFilter (认证)
    │                         ├── MyBatis Mapper
    │                         └── MySQL (blog 库)
    └── /api/visit      → 前端 useVisit hook 自动发送
                              └── INSERT visit_logs
```

## 8. JWT 配置

`application.yml`:
```yaml
jwt:
  secret: your-256-bit-secret-key-here-make-it-long
  expiration: 3600000  # 1 小时（毫秒）
```
