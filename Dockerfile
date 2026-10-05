# ---- 构建阶段 ----
FROM node:22-alpine AS builder

WORKDIR /app

# 先复制依赖定义以利用缓存
COPY package*.json ./
RUN npm install

# 复制源码并执行打包
COPY . .
RUN npm run build

# ---- 运行阶段 (轻量 Nginx) ----
FROM nginx:alpine

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制生成的静态 HTML 文件
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
