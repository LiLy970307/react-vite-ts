import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/views/Home";
import About from "@/views/About";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/About" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
