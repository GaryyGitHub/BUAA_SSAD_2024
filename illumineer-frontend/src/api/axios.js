import axios from 'axios';

// 根据环境变量设置基础 URL 和端口
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:9090' // 本地开发环境
    : 'http://115.120.239.233/:9090',  // 生产环境
  timeout: 300000, // 请求超时时间
});

// 你可以在这里添加请求拦截器、响应拦截器等
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，比如添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么
    return response;
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error);
  }
);

export default api;
