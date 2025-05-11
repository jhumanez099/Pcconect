

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
              <a className="nav-link" href="/menuClientes">Clientes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/menuUsuarios">Usuarios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/menuPedidos">Pedidos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/menuEquipos">Equipos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/soporte">Soporte</a>
            </li>
          </ul>
        </div>
      </div>
  </nav >
  )
}

