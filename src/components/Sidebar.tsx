import React, { useState } from "react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(true); // controle do menu em mobile
  const menuItems = [
    { id: "mapa", label: "Mapa", icon: "bi-map" },
    { id: "alertas", label: "Alertas de Floração", icon: "bi-bell" },
    // { id: "alertasia", label: "Alertas IA", icon: "bi-robot" },
    { id: "estatisticas", label: "Estatísticas", icon: "bi-bar-chart-line" },
  ];

  return (
    <>
      {/* Botão hamburger para mobile */}
      <button
        className="btn btn-primary d-md-none position-fixed top-3 start-3 z-200"
        style={{ zIndex: 1050 }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className="bi bi-list"></i>
      </button>

      <aside
        className={`position-fixed top-0 start-0 vh-100 text-white d-flex flex-column shadow ${
          collapsed ? "translate-x--100" : ""
        }`}
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)",
          transition: "transform 0.3s ease",
          zIndex: 1040,
        }}
      >
        <div className="p-4 border-bottom border-secondary">
          <h4 className="fw-bold mb-0 text-center">🌿FloraMap</h4>
          <p className="text-center small text-secondary mb-0">Painel Ambiental</p>
        </div>

        <nav className="flex-grow-1 mt-3">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`nav-item d-flex align-items-center px-4 py-3 ${
                  currentPage === item.id ? "bg-primary bg-opacity-25" : ""
                }`}
                style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                onClick={() => {
                  onNavigate(item.id);
                  setCollapsed(true); // fecha menu no mobile ao clicar
                }}
              >
                <i className={`bi ${item.icon} me-3 fs-5`}></i>
                <span className="fw-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-top border-secondary p-3 small text-center text-secondary">
          v1.0.0 • Desenvolvido por <span className="text-light">ASIUS</span>
        </div>
      </aside>
    </>
  );
};
