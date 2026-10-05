#!/bin/bash
# Debian 服务器一键初始化脚本（以 root 或 sudo 运行）
set -e

echo "=== 1. 安装 Nginx ==="
apt update
apt install -y nginx curl

echo "=== 2. 创建博客目录 ==="
mkdir -p /var/www/myblog
chown -R www-data:www-data /var/www/myblog
chmod -R 755 /var/www/myblog

echo "=== 3. 写入 Nginx 配置 ==="
cat > /etc/nginx/sites-available/myblog << 'EOF'
server {
    listen 80;
    server_name _; # 若已绑定域名，请将 _ 替换为你的域名，如 blog.example.com

    root /var/www/myblog;
    index index.html;

    # 启用 Gzip 深度压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        image/svg+xml;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # 静态资源强缓存
    location ~* ^/_astro/.*\.(js|css|webp|png|jpg|jpeg|gif|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    error_page 404 /404.html;
}
EOF

# 启用站点并测试
ln -sf /etc/nginx/sites-available/myblog /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "=== Nginx 配置完成！现在可以接收本地构建推送了 ==="
