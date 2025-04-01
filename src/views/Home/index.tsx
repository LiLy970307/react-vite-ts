import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../api/index";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ username: "111", email: "223332",password:'123456' });

  useEffect(() => {
    addUser(data).then((res: any) => {

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
