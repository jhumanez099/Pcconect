// src/App.js
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CrearCliente from './Pages/Admin/CrearCliente.jsx';
import ConsultarCliente from './Pages/Admin/ConsultarCliente.jsx';
import CrearTipoUsuario from './Pages/Admin/CrearTipoUsuario.jsx';
import ConsultarTipoUsuario from './Pages/Admin/ConsultarTipoUsuario.jsx';
import CrearUsuario from './Pages/Admin/CrearUsuario.jsx';
import ConsultarUsuario from './Pages/Admin/ConsultarUsuario.jsx';
import CrearTipoEquipo from './Pages/Admin/CrearTipoEquipo.jsx';
import ConsultarTipoEquipo from './Pages/Admin/ConsultarTipoEquipo.jsx';
import CrearEquipo from './Pages/Admin/CrearEquipo.jsx';
import ConsultarEquipo from './Pages/Admin/ConsultarEquipo.jsx';
import MenuPrincipal from './Pages/Admin/MenuPrincipal.jsx';
import CrearTipoPedido from './Pages/Admin/CrearTipoPedido.jsx';
import ConsultarTipoPedido from './Pages/Admin/ConsultarTipoPedido.jsx';
import LoginRegister from './Pages/login/login.jsx';
import { AuthProvider } from './AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx'; // Vamos a crear esto

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginRegister />} />

          {/* Rutas protegidas */}
          <Route path='/CrearCliente' element={<PrivateRoute><CrearCliente /></PrivateRoute>} />
          <Route path='/ConsultarCliente' element={<PrivateRoute><ConsultarCliente /></PrivateRoute>} />
          <Route path='/CrearTipoUsuario' element={<PrivateRoute><CrearTipoUsuario /></PrivateRoute>} />
          <Route path='/ConsultarTipoUsuario' element={<PrivateRoute><ConsultarTipoUsuario /></PrivateRoute>} />
          <Route path='/CrearUsuario' element={<PrivateRoute><CrearUsuario /></PrivateRoute>} />
          <Route path='/ConsultarUsuario' element={<PrivateRoute><ConsultarUsuario /></PrivateRoute>} />
          <Route path='/CrearTipoEquipo' element={<PrivateRoute><CrearTipoEquipo /></PrivateRoute>} />
          <Route path='/ConsultarTipoEquipo' element={<PrivateRoute><ConsultarTipoEquipo /></PrivateRoute>} />
          <Route path='/CrearEquipo' element={<PrivateRoute><CrearEquipo /></PrivateRoute>} />
          <Route path='/ConsultarEquipo' element={<PrivateRoute><ConsultarEquipo /></PrivateRoute>} />
          <Route path='/CrearTipoPedido' element={<PrivateRoute><CrearTipoPedido /></PrivateRoute>} />
          <Route path='/ConsultarTipoPedido' element={<PrivateRoute><ConsultarTipoPedido /></PrivateRoute>} />
          <Route path='/MenuPrincipal' element={<PrivateRoute><MenuPrincipal /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
