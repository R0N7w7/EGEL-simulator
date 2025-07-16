
import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/routes";

function App() {
  const AppRoutes = () => useRoutes(appRoutes)
  return (
    <AppRoutes />
  );
}

export default App;
