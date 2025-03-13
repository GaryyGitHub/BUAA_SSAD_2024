# 使用 Nginx 作为基础镜像
FROM nginx:alpine

# 复制构建后的文件到 Nginx 服务路径
COPY dist /usr/share/nginx/html

# 暴露 Nginx 默认的 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]