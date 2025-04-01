import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// 定义响应数据的通用结构
interface ApiResponse<T = any> {
  code: number;       // 状态码
  data: T;            // 响应数据
  message: string;    // 提示信息
}

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 默认的基础路径
  baseURL: 'http://localhost:3000', // 默认的基础路径
  timeout: 1000 * 600, // 请求超时时间（毫秒）
});

// 请求拦截器
request.interceptors.request.use(
  (config: any) => {
    // 可以在这里添加请求头，例如 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: any) => {
    // @ts-ignore
    const { code, message } = response.data;
    // 根据返回的状态码处理逻辑
    // if (code !== 200) {
    //   // 可以使用全局消息提示框，比如 Element Plus 的 `ElMessage`
    //   console.error(`Error: ${message}`);
    //   return Promise.reject(new Error(message));
    // }
    return response.data; // 返回数据
  },
  (error) => {
    // 响应错误处理
    console.error(`Network Error: ${error.message}`);
    return Promise.reject(error);
  }
);

export default request;
