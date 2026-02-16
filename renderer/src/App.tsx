
import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/routes";
import { useLicenseStore } from "./features/auth/hooks/useLicenseStore";
import { useEffect } from "react";

function App() {
  const refresh = useLicenseStore((state) => state.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const AppRoutes = () => useRoutes(appRoutes)
  return (
    <AppRoutes />
  );
}

export default App;
