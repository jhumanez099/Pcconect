import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import NavBar from "../../components/Navbar";

export default function MenuPrincipal() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  // Opciones con icono de Bootstrap Icons

  const opciones = useMemo(
    () => [
      { nombre: "Clientes", ruta: "/MenuCliente", icon: "bi-people" },

      {
        nombre: "Tipos de Usuarios",
        ruta: "/MenuTipoUsuario",
        icon: "bi-person-gear",
      },

      { nombre: "Usuarios", ruta: "/MenuUsuario", icon: "bi-person-circle" },

      { nombre: "Tipos de Equipos", ruta: "/MenuTipoEquipo", icon: "bi-gear" },

      { nombre: "Equipos", ruta: "/MenuEquipo", icon: "bi-wrench" },

      {
        nombre: "Tipos de Pedido",
        ruta: "/MenuTipoPedido",
        icon: "bi-clipboard-check",
      },

      { nombre: "Pedidos", ruta: "/MenuPedido", icon: "bi-bag-check" },
    ],

    []
  );

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return opciones;

    return opciones.filter((o) => o.nombre.toLowerCase().includes(q));
  }, [opciones, query]);

  const handleOpen = (ruta) => navigate(ruta);

  const handleKey = (e, ruta) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      navigate(ruta);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <NavBar />

      <main className="container flex-grow-1 py-4">
        <div className="d-flex flex-column flex-sm-row align-items-sm-end justify-content-between gap-3 mb-3">
          <div>
            <h1 className="h3 mb-1">Menú Principal</h1>
            <small className="text-body-secondary">
              Elige un módulo para continuar.
            </small>
          </div>

          <div className="w-100" style={{ maxWidth: 380 }}>
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search" aria-hidden="true"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Buscar (ej. Usuarios)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Buscar opción"
              />

              {query && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuery("")}
                  title="Limpiar búsqueda"
                >
                  <i className="bi bi-x-lg" aria-hidden="true"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
          {filtradas.map((op) => (
            <div className="col" key={op.nombre}>
              <div
                className="card h-100 shadow-sm border-0"
                role="button"
                tabIndex={0}
                onClick={() => handleOpen(op.ruta)}
                onKeyDown={(e) => handleKey(e, op.ruta)}
              >
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="d-inline-flex align-items-center justify-content-center rounded-3 border bg-white"
                      style={{ width: 44, height: 44 }}
                      aria-hidden="true"
                    >
                      <i className={`bi ${op.icon} fs-5`} />
                    </span>
                    <div>
                      <h2 className="h6 mb-1">{op.nombre}</h2>
                      <small className="text-body-secondary">
                        Ir a {op.nombre}
                      </small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleOpen(op.ruta);
                    }}
                  >
                    Abrir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtradas.length === 0 && (
          <p className="text-center text-body-secondary mt-4">
            No hay resultados para “{query}”.
          </p>
        )}
      </main>
    </div>
  );
}
