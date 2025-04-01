import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const About: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

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
