import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { Home, StoreLayout } from "./pages/HomePage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import PedidosPage from "./pages/PedidosPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import CategoryProductsPage from "./pages/CategoryProductsPage.tsx";
import { AdminLayout } from "./pages/Admin/AdminPage.tsx";
import ProtectedRoute, { AdminRoute } from "@/ProtectedRoute.tsx";
import { useAuthStore } from "./store/auth.ts";

//ABMS
import ABMCategorias from "./pages/Admin/Categorias/ABMCategorias.tsx";
import ABMProductos from "./pages/Admin/Productos/ABMProductos.tsx";
import ABMUsuarios from "./pages/Admin/Usuarios/ABMUsuarios.tsx";
import ABMPedidos from "./pages/Admin/Ordenes/ABMPedidos.tsx";
import ABMSucursalesStock from "./pages/Admin/SucursalesStock/ABMSucursalesStock.tsx";
//APP
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
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/pedidos" element={<PedidosPage />} />
              <Route path="/productos_cat" element={<CategoryProductsPage />} />
            </Route>
          </Route>
          <Route element={<AdminRoute rol={rol} />}>
            <Route element={<AdminLayout />}>
              {/* <Route path="/admin" element={<AdminPage />} /> */}
              <Route path="/admin/productos" element={<ABMProductos />} />
              <Route path="/admin/usuarios" element={<ABMUsuarios />} />
              <Route path="/admin/categorias" element={<ABMCategorias />} />
              <Route path="/admin/pedidos" element={<ABMPedidos />} />
              <Route path="/admin/stocks" element={<ABMSucursalesStock />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
