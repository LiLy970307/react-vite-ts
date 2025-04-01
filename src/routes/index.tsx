import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/views/Home";
import About from "@/views/About";
import Drag from "@/views/Drag";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/About" element={<About />} />
      <Route path="/" element={<Drag />} />
    </Routes>
  );
};

export default AppRoutes;
