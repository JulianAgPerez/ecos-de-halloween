import { FC, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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

const ScrollToTop: FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

const AppRoutes: FC = () => {
  return (
    <Router>
      <ScrollToTop />
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
