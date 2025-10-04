import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface SidebarProps {
    currentPage?: string;
    onNavigate?: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage = "mapa", onNavigate }) => {
    const menuItems = [
        { label: "Mapa", key: "mapa", icon: "bi-geo-alt" },
        { label: "Alertas de Floração", key: "alertas", icon: "bi-bell" },
        { label: "Estatísticas", key: "estatisticas", icon: "bi-bar-chart" },
    ];

    return (
        <div
            className="d-flex flex-column vh-100 bg-light shadow"
            style={{ width: "250px", position: "fixed", zIndex: 1000 }}
        >
            <div className="text-center py-4 border-bottom">
                <h4>🌿 FloraApp</h4>
            </div>
            <ul className="nav flex-column mt-3">
                {menuItems.map((item) => (
                    <li className="nav-item" key={item.key}>
                        <button
                            className={`nav-link btn w-100 text-start d-flex align-items-center ${currentPage === item.key ? "active bg-primary text-white" : "text-dark"
                                }`}
                            onClick={() => onNavigate && onNavigate(item.key)}
                            style={{ border: "none" }}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
