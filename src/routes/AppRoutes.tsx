import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { Story } from "../pages/Story";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UploadForm from "../pages/UploadForm";
import VolumeButton from "../components/VolumeButton";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <SidebarMenu />
      <VolumeButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<UploadForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/story/:id" element={<Story />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
