import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // 替换为你的 Nest 服务的实际地址
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export const fetchData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("There was an error!", error);
    throw error;
  }
};

export default api;
