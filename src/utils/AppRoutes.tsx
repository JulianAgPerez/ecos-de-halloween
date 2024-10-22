import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import FileUpload from "../components/FileUpload";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
