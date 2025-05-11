import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CrearCliente from './Pages/Admin/CrearCliente.jsx'
import ConsultarCliente from './Pages/Admin/ConsultarCliente.jsx'
import CrearTipoUsuario from './Pages/Admin/CrearTipoUsuario.jsx'
import ConsultarTipoUsuario from './Pages/Admin/ConsultarTipoUsuario.jsx'
import CrearUsuario from './Pages/Admin/CrearUsuario.jsx'
import ConsultarUsuario from './Pages/Admin/ConsultarUsuario.jsx'



export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/CrearCliente' element={<CrearCliente />} />
        <Route path='/ConsultarCliente' element={<ConsultarCliente />} />
        <Route path='/CrearTipoUsuario' element={<CrearTipoUsuario />} />
        <Route path='/ConsultarTipoUsuario' element={<ConsultarTipoUsuario />} />
        <Route path='/CrearUsuario' element={<CrearUsuario />} />
        <Route path='/ConsultarUsuario' element={<ConsultarUsuario />} />
      </Routes>
    </BrowserRouter>
  )
}
