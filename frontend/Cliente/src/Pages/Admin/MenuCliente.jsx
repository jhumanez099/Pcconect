import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../../components/Navbar";

export default function MenuCliente() {
  const navigate = useNavigate();

  const opciones = useMemo(
    () => [
      {
        nombre: "Crear",
        ruta: "/CrearCliente",
        icon: "bi-person-plus",
        desc: "Registra un nuevo cliente con su información de contacto y datos fiscales.",
      },
      {
        nombre: "Consultar",
        ruta: "/ConsultarCliente",
        icon: "bi-search",
        desc: "Busca, visualiza y gestiona clientes existentes en el sistema.",
      },
    ],
    []
  );

  const handleOpen = (ruta) => navigate(ruta);
  const handleKey = (e, ruta) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(ruta);
    }
  };

  return (
    <>
      {/* CSS incrustado */}
      <style>{`
        .liftable {
          transition: transform .15s ease, box-shadow .15s ease;
        }
        .liftable:hover,
        .liftable:focus {
          transform: translateY(-2px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.08);
          outline: none;
        }
      `}</style>

      <div className="min-vh-100 d-flex flex-column bg-light">
        <NavBar />

        <main className="container flex-grow-1 py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/MenuPrincipal">Menú principal</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Cliente
              </li>
            </ol>
          </nav>

          {/* Encabezado */}
          <header className="mb-4">
            <h1 className="h3 mb-1">Menú Cliente</h1>
            <p className="text-body-secondary mb-0">
              Elige una acción para comenzar.
            </p>
          </header>

          {/* Opciones */}
          <section className="row row-cols-1 row-cols-md-2 g-3">
            {opciones.map((op) => (
              <div className="col" key={op.nombre}>
                <div
                  className="card h-100 shadow-sm border-0 liftable"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpen(op.ruta)}
                  onKeyDown={(e) => handleKey(e, op.ruta)}
                  aria-label={`${op.nombre} cliente`}
                >
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <span
                        className="d-inline-flex align-items-center justify-content-center rounded-3 border bg-white"
                        style={{ width: 48, height: 48 }}
                        aria-hidden="true"
                      >
                        <i className={`bi ${op.icon} fs-4`} />
                      </span>
                      <h2 className="h5 mb-0">{op.nombre}</h2>
                    </div>

                    <p className="text-body-secondary mb-4">{op.desc}</p>

                    <div className="mt-auto d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
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
              </div>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
