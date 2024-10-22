import { SpeedInsights } from "@vercel/speed-insights/react";
import AppRoutes from "./utils/AppRoutes";

function App() {
  return (
    <>
      <SpeedInsights />
      <AppRoutes />
    </>
  );
}

export default App;
