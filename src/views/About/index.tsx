import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchData } from "@/api";

const About: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData('/another-endpoint') // 替换为你的实际接口路径
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>ℹ️ 关于我们</h1>
      <Button onClick={() => navigate("/")}>返回首页</Button>
      <div>
        <h2>接口数据:</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default About;
