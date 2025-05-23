// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Bootstrap JS para funcionalidad (opcional)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// ✅ Bootstrap Icons (ahora correctamente instalado)
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
