import { FC, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";
import PersistentLayout from "../components/PersistentLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import GhostLoader from "../components/GhostLoader";

const Home = lazy(() => import("../pages/Home"));
const Story = lazy(() => import("../pages/Story"));
const ClassicStory = lazy(() => import("../pages/ClassicStory"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const UploadForm = lazy(() => import("../pages/UploadForm"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes: FC = () => {
  return (
    <Router>
      <SidebarMenu />
      <Suspense fallback={<GhostLoader />}>
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
      </Suspense>
      <Footer />
    </Router>
  );
};

export default AppRoutes;
