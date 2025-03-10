import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/api";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ userName: "111", email: "222" });

  useEffect(() => {
    fetchData("/users/createUser") // 替换为你的实际接口路径
      .then((data: any) => {
        setData(data);
      })
      .catch((error: string) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🏠 首页</h1>
      <Button type="primary" onClick={() => navigate("/about")}>
        跳转到关于页
      </Button>
      <div>
        <h2>接口数据:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Home;
