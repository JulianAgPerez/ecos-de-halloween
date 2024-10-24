import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { Story } from "../pages/Story";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";
import UploadForm from "../pages/UploadForm";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <SidebarMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<UploadForm />} />
        <Route path="/story/:id" element={<Story />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
