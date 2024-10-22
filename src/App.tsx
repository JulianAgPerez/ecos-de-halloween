import { SpeedInsights } from "@vercel/speed-insights/react";
import AppRoutes from "./utils/AppRoutes";

export const url = import.meta.env.VITE_API_URL;

function App() {
  return (
    <>
      <SpeedInsights />
      <AppRoutes />
    </>
  );
}

export default App;
