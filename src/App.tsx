import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { Home, StoreLayout } from "./pages/HomePage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { ProductsPage } from "./pages/ProductsPage.tsx";
import { AdminPage, AdminLayout } from "./pages/Admin/AdminPage.tsx";
import { AdminCategoriesPage } from "./pages/Admin/Categorias/AdmCategoriasPage.tsx";
import { AdminProductsPage } from "./pages/Admin/Productos/AdmProductsPage.tsx";
import { AdminOrdersPage } from "./pages/Admin/Ordenes/AdmOrdenesPage.tsx";
import { AdminUsersPage } from "./pages/Admin/Usuarios/AdmUsersPage.tsx";
import ProtectedRoute, { AdminRoute } from "@/ProtectedRoute.tsx";
import { useAuthStore } from "./store/auth.ts";

const App = () => {
  const isAuth = useAuthStore((state) => state.isAuth);
  const rol = useAuthStore((state) => state.profile.rol);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route element={<ProtectedRoute isAllowed={isAuth} />}>
            <Route element={<StoreLayout />}>
              <Route path="/inicio" element={<Home />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/productos" element={<ProductsPage />} />
            </Route>
          </Route>
          <Route element={<AdminRoute rol={rol} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/productos" element={<AdminProductsPage />} />
              <Route path="/admin/pedidos" element={<AdminOrdersPage />} />
              <Route path="/admin/usuarios" element={<AdminUsersPage />} />
              <Route
                path="/admin/categorias"
                element={<AdminCategoriesPage />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
