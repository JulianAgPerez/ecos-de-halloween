import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { Story } from "../pages/Story";
import ClassicStory from "../pages/ClassicStory";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UploadForm from "../pages/UploadForm";
import NotFound from "../pages/NotFound";
import PersistentLayout from "../components/PersistentLayaout";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <SidebarMenu />
      <Routes>
        <Route path="/" element={<PersistentLayout />}>
          <Route index element={<Home />} />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <UploadForm />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/story/:id" element={<Story />} />
          <Route path="/classic/:slug" element={<ClassicStory />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
