import { FC, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import SidebarMenu, { APP_CONTENT_ID } from "../components/SidebarMenu";
import Footer from "../components/Footer";
import PersistentLayout from "../components/PersistentLayout";
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
      {/* Región que el menú marca inert mientras el drawer está abierto. */}
      <div id={APP_CONTENT_ID}>
        <Suspense fallback={<GhostLoader />}>
          <Routes>
            <Route path="/" element={<PersistentLayout />}>
              <Route index element={<Home />} />
              {/* Pública a propósito: se puede enviar un cuento sin registro. */}
              <Route path="/upload-story" element={<UploadForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/story/:id" element={<Story />} />
              <Route path="/classic/:slug" element={<ClassicStory />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
};

export default AppRoutes;
