import { BrowserRouter, Routes, Route } from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {DashboardPage} from "./pages/DashboardPage";
import ProtectedRoute from "@/ProtectedRoute.tsx";
import { useAuthStore } from "./store/auth.ts";


const App = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute isAllowed={isAuth} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;