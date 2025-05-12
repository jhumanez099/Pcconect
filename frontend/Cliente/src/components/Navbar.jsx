

export default function NavBar() {
  return (
    <nav className = "navbar navbar-expand-lg navbar-light bg-light w-100" >
      <div className="container">
        <a className="navbar-brand" href="#">PCCONECT</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="/MenuClientes">Clientes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/MenuUsuarios">Usuarios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/MenuPedidos">Pedidos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/MenuEquipos">Equipos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Soporte">Soporte</a>
            </li>
          </ul>
        </div>
      </div>
  </nav >
  )
}

