import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import CrearCliente from './Pages/Admin/CrearCliente.jsx'
import ConsultarCliente from './Pages/Admin/ConsultarCliente.jsx'
import CrearTipoUsuario from './Pages/Admin/CrearTipoUsuario.jsx'



export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/CrearCliente' element={<CrearCliente />} />
        <Route path='/ConsultarCliente' element={<ConsultarCliente />} />
        <Route path='/CrearTipoUsuario' element={<CrearTipoUsuario />} />
      </Routes>
    </BrowserRouter>
  )
}
