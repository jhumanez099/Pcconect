
export default function Grid_Producto({ List, handleDelete, handleEdit }) {
  return (
    <div className="container mt-5">
      <div
        className="scrollable-table"
        style={{ maxHeight: "18rem", overflowY: "auto" }}
      >
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Valor actual</th>
              <th>Caracteristicas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {List
              ? List.map((productos) => (
                <tr key={productos.id_programa}>
                  <td>{productos.id_producto}</td>
                  <td>{productos.nombre_producto}</td>
                  <td>{productos.valor_actual}</td>
                  <td>{productos.caracteristicas_producto}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm mr-2"
                      onClick={() => handleDelete(productos.id_producto)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(productos)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
