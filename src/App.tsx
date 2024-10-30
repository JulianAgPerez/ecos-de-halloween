import { SpeedInsights } from "@vercel/speed-insights/react";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <SpeedInsights />
      <AppRoutes />
    </>
  );
}

export default App;
