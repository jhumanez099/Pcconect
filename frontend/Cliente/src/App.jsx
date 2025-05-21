// src/App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CrearCliente from './Pages/Admin/CrearCliente';
import ConsultarCliente from './Pages/Admin/ConsultarCliente';
import CrearTipoUsuario from './Pages/Admin/CrearTipoUsuario';
import ConsultarTipoUsuario from './Pages/Admin/ConsultarTipoUsuario';
import CrearUsuario from './Pages/Admin/CrearUsuario';
import ConsultarUsuario from './Pages/Admin/ConsultarUsuario';
import CrearTipoEquipo from './Pages/Admin/CrearTipoEquipo';
import ConsultarTipoEquipo from './Pages/Admin/ConsultarTipoEquipo';
import CrearEquipo from './Pages/Admin/CrearEquipo';
import ConsultarEquipo from './Pages/Admin/ConsultarEquipo';
import MenuPrincipal from './Pages/Admin/MenuPrincipal';
import CrearTipoPedido from './Pages/Admin/CrearTipoPedido';
import ConsultarTipoPedido from './Pages/Admin/ConsultarTipoPedido';
import Login from './Pages/login/login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Logout from './components/Logout';
import CrearPedido from './Pages/Admin/CrearPedido';
import ConsultarPedido from './Pages/Admin/ConsultarPedido';
import MenuCliente from './Pages/Admin/MenuCliente';
import MenuUsuario from './Pages/Admin/MenuUsuario';
import MenuEquipo from './Pages/Admin/MenuEquipo';
import MenuPedido from './Pages/Admin/MenuPedido';
import MenuTipoUsuario from './Pages/Admin/MenuTipoUsuario';
import MenuTipoEquipo from './Pages/Admin/MenuTipoEquipo';
import MenuTipoPedido from './Pages/Admin/MenuTipoPedido';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Ruta Pública: Login */}
          <Route path="/" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* ✅ Rutas Protegidas */}
          <Route path="/MenuPrincipal" element={<ProtectedRoute><MenuPrincipal /></ProtectedRoute>} />
          <Route path="/MenuCliente" element={<ProtectedRoute><MenuCliente /></ProtectedRoute>} />
          <Route path="/MenuUsuario" element={<ProtectedRoute><MenuUsuario /></ProtectedRoute>} />
          <Route path="/MenuEquipo" element={<ProtectedRoute><MenuEquipo /></ProtectedRoute>} />
          <Route path="/MenuPedido" element={<ProtectedRoute><MenuPedido /></ProtectedRoute>} />
          <Route path="/MenuTipoUsuario" element={<ProtectedRoute><MenuTipoUsuario /></ProtectedRoute>} />
          <Route path="/MenuTipoEquipo" element={<ProtectedRoute><MenuTipoEquipo /></ProtectedRoute>} />
          <Route path="/MenuTipoPedido" element={<ProtectedRoute><MenuTipoPedido /></ProtectedRoute>} />
          <Route path="/CrearCliente" element={<ProtectedRoute><CrearCliente /></ProtectedRoute>} />
          <Route path="/ConsultarCliente" element={<ProtectedRoute><ConsultarCliente /></ProtectedRoute>} />
          <Route path="/CrearTipoUsuario" element={<ProtectedRoute><CrearTipoUsuario /></ProtectedRoute>} />
          <Route path="/ConsultarTipoUsuario" element={<ProtectedRoute><ConsultarTipoUsuario /></ProtectedRoute>} />
          <Route path="/CrearUsuario" element={<ProtectedRoute><CrearUsuario /></ProtectedRoute>} />
          <Route path="/ConsultarUsuario" element={<ProtectedRoute><ConsultarUsuario /></ProtectedRoute>} />
          <Route path="/CrearTipoEquipo" element={<ProtectedRoute><CrearTipoEquipo /></ProtectedRoute>} />
          <Route path="/ConsultarTipoEquipo" element={<ProtectedRoute><ConsultarTipoEquipo /></ProtectedRoute>} />
          <Route path="/CrearEquipo" element={<ProtectedRoute><CrearEquipo /></ProtectedRoute>} />
          <Route path="/ConsultarEquipo" element={<ProtectedRoute><ConsultarEquipo /></ProtectedRoute>} />
          <Route path="/CrearTipoPedido" element={<ProtectedRoute><CrearTipoPedido /></ProtectedRoute>} />
          <Route path="/ConsultarTipoPedido" element={<ProtectedRoute><ConsultarTipoPedido /></ProtectedRoute>} />
          <Route path="/CrearPedido" element={<ProtectedRoute><CrearPedido /></ProtectedRoute>} />
          <Route path="/ConsultarPedido" element={<ProtectedRoute><ConsultarPedido /></ProtectedRoute>} />

          {/* ✅ Ruta por defecto para redirigir al login si no está autenticado */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
