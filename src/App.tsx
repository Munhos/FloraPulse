import React, { useState } from "react";
import { MapView } from "./components/MapView";
import { Sidebar } from "./components/Sidebar";
import "bootstrap-icons/font/bootstrap-icons.css";


function App() {
  const [currentPage, setCurrentPage] = useState("mapa");

  const renderContent = () => {
    switch (currentPage) {
      case "mapa":
        return <MapView />;
      case "alertas":
        return "<Alertas />";
      case "estatisticas":
        return "<Estatisticas />";
      default:
        return <MapView />;
    }
  };

  return (
    <div className="relative">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="ml-64 p-4">{renderContent()}</div>
    </div>
  );
}

export default App;
