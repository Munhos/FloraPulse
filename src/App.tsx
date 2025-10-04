import React, { useState, useEffect } from "react";
import { MapView } from "./components/MapView";
import { Alertas } from "./components/Alertas";
import { Estatisticas } from "./components/Estatisticas";
import IAPanel from "./components/IAPanel";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal, Tab, Nav, ProgressBar } from "react-bootstrap";

// Sidebar responsivo
interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    { id: "mapa", label: "Mapa", icon: "bi-map" },
    { id: "alertas", label: "Alertas de Floração", icon: "bi-bell" },
    // { id: "alertasia", label: "Alertas IA", icon: "bi-robot" },
    { id: "estatisticas", label: "Estatísticas", icon: "bi-bar-chart-line" },
  ];

  // Atualiza collapsed se a tela for grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setCollapsed(false);
      else setCollapsed(true);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Botão hamburger mobile */}
      <button
        className="btn btn-primary d-md-none position-fixed top-3 start-3"
        style={{ zIndex: 1050 }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className="bi bi-list"></i>
      </button>

      <aside
        className={`position-fixed top-0 start-0 vh-100 d-flex flex-column text-white shadow ${
          collapsed ? "translate-x--100" : ""
        }`}
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)",
          transition: "transform 0.3s ease",
          zIndex: 1040,
        }}
      >
        <div className="p-4 border-bottom border-secondary text-center">
          <h4 className="fw-bold mb-0">🌿FloraMap</h4>
          <p className="small text-secondary mb-0">Painel Ambiental</p>
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
                  if (window.innerWidth < 768) setCollapsed(true);
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

      {/* CSS global para transição */}
      <style>{`.translate-x--100 { transform: translateX(-100%); }`}</style>
    </>
  );
};

// InfoModal educativo
const InfoModal = ({ show, onHide }: { show: boolean; onHide: () => void }) => (
  <Modal show={show} onHide={onHide} centered size="lg" animation={true}>
    <Modal.Header closeButton>
      <Modal.Title>ℹ️ Painel Educativo</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Tab.Container defaultActiveKey="ndvi">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="ndvi">NDVI</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="fenologia">Fenologia</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="floracao">Floração</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="clima">Clima</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="ndvi">
            <p>🌿 <strong>O que é NDVI:</strong> Índice de Vegetação por Diferença Normalizada. Mede a saúde das plantas através da refletância das folhas.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="fenologia">
            <p>🍃 <strong>O que é Fenologia:</strong> Estudo dos eventos cíclicos das plantas, como florescimento e frutificação.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="floracao">
            <p>🌸 <strong>Importância da Floração:</strong> Crucial para polinização, agricultura e equilíbrio climático.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="clima">
            <p>☀️ <strong>Dados Climáticos:</strong> Entender temperatura, chuva e vento ajuda a prever picos de florescimento.</p>
            <ProgressBar now={70} label="Temperatura" className="mb-2" />
            <ProgressBar now={60} label="Umidade" className="mb-2" />
            <ProgressBar now={20} label="Precipitação" />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Modal.Body>
    <Modal.Footer>
      <button className="btn btn-primary" onClick={onHide}>Fechar</button>
    </Modal.Footer>
  </Modal>
);

const App = () => {
  const [currentPage, setCurrentPage] = useState("mapa");
  const [showClimate, setShowClimate] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const renderContent = () => {
    switch (currentPage) {
      case "mapa": return <MapView />;
      case "alertas": return <Alertas />;
      case "alertasia": return <IAPanel />;
      case "estatisticas": return <Estatisticas />;
      default: return <MapView />;
    }
  };

  return (
    <div className="d-flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: window.innerWidth >= 768 ? "260px" : "0px",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
          position: "relative",
          transition: "margin-left 0.3s ease"
        }}
      >
        {/* Topbar */}
        <header
          className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm bg-white"
          style={{ position: "sticky", top: 0, zIndex: 100 }}
        >
          <h5 className="m-0 fw-semibold text-dark">
            {currentPage === "mapa" ? "🌍 Mapa de Vegetação" :
             currentPage === "alertas" ? "🔔 Alertas de Floração" :
             "📈 Estatísticas"}
          </h5>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-search fs-5 text-secondary" style={{ cursor: "pointer" }}></i>
            <i className="bi bi-bell fs-5 text-secondary" style={{ cursor: "pointer" }}></i>
            <i
              className="bi bi-info-circle fs-5 text-info"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => setShowInfo(true)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            ></i>
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px", fontWeight: 600, cursor: "pointer" }}
            >J</div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="p-4 flex-grow-1">{renderContent()}</main>

        {/* Botão flutuante nuvem */}
        <button
          onClick={() => setShowClimate(true)}
          aria-label="Abrir estatísticas climáticas"
          className="shadow-lg bg-white position-fixed"
          style={{
            bottom: "25px",
            right: "25px",
            zIndex: 10000,
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 6px 18px rgba(20,20,30,0.12)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <i className="bi bi-cloud-sun-fill fs-5 text-primary"></i>
        </button>

        {/* Modal mini estatísticas climáticas */}
        <Modal show={showClimate} onHide={() => setShowClimate(false)} centered size="sm" animation={true}>
          <div className="p-3 text-center">
            <h6 className="fw-semibold mb-3">🌤️ Estatísticas Climáticas</h6>
            <div className="text-start small">
              <p className="mb-1"><strong>Temperatura Média:</strong> 26°C</p>
              <ProgressBar now={65} label="26°C" className="mb-2" />
              <p className="mb-1"><strong>Umidade:</strong> 68%</p>
              <ProgressBar now={68} label="68%" className="mb-2" />
              <p className="mb-1"><strong>Precipitação:</strong> 12 mm</p>
              <ProgressBar now={12} label="12 mm" className="mb-2" />
              <p className="mb-1"><strong>Velocidade do Vento:</strong> 8 km/h</p>
              <ProgressBar now={30} label="8 km/h" />
            </div>
            <button className="btn btn-sm btn-primary mt-3" onClick={() => setShowClimate(false)}>Fechar</button>
          </div>
        </Modal>

        {/* InfoModal */}
        <InfoModal show={showInfo} onHide={() => setShowInfo(false)} />
      </div>
    </div>
  );
};

export default App;
