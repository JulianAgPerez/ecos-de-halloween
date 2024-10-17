import Home from "./pages/Home";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <>
      <SpeedInsights />
      <Home />
    </>
  );
}

export default App;
