import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Spinner, Table } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const simulatedAlerts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  tipo: ["Fenologia", "Clima", "Polinização"][i % 3],
  criticidade: ["Baixa", "Média", "Alta"][i % 3],
  regiao: ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"][i % 5],
  valor: Math.floor(Math.random() * 100),
  timestamp: new Date(Date.now() - i * 3600 * 1000).toLocaleString(),
  explicacao: [
    "NDVI baixo + alta precipitação → risco de frutificação reduzido",
    "Temperatura alta + umidade baixa → florescimento atrasado",
    "Polinização afetada por chuva intensa",
  ][i % 3],
  historico: Array.from({ length: 3 }, () => Math.floor(Math.random() * 100)),
}));

const IAPanel = () => {
  const [alerts, setAlerts] = useState(simulatedAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState(simulatedAlerts);
  const [loading, setLoading] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCriticidade, setFiltroCriticidade] = useState("");
  const [filtroRegiao, setFiltroRegiao] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const filtered = alerts.filter((a) => {
        if (filtroTipo && a.tipo !== filtroTipo) return false;
        if (filtroCriticidade && a.criticidade !== filtroCriticidade) return false;
        if (filtroRegiao && a.regiao !== filtroRegiao) return false;
        return true;
      });
      setFilteredAlerts(filtered);
      setLoading(false);
    }, 300);
  }, [filtroTipo, filtroCriticidade, filtroRegiao]);

  const statsByRegion = filteredAlerts.reduce((acc, a) => {
    if (!acc[a.regiao]) acc[a.regiao] = [];
    acc[a.regiao].push(a.valor);
    return acc;
  }, {} as Record<string, number[]>);

  const computeStats = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = (sum / values.length).toFixed(2);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const median =
      values.length % 2 === 0
        ? ((sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2).toFixed(2)
        : sorted[Math.floor(values.length / 2)].toFixed(2);
    return { avg, min, max, median };
  };

  const chartData = {
    labels: ["Baixa", "Média", "Alta"],
    datasets: [
      {
        label: "Número de Alertas",
        data: ["Baixa", "Média", "Alta"].map(
          (level) => filteredAlerts.filter((a) => a.criticidade === level).length
        ),
        backgroundColor: ["#4caf50", "#ffc107", "#f44336"],
      },
    ],
  };

  return (
    <div className="container-fluid p-3" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <h3>🤖 IA de Alertas Avançados</h3>
        <button className="btn btn-info" onClick={() => setShowModal(true)}>
          ℹ️ Sobre a IA
        </button>
      </div>

      {/* Filtros */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <label>Tipo de Alerta</label>
          <select
            className="form-select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Fenologia">Fenologia</option>
            <option value="Clima">Clima</option>
            <option value="Polinização">Polinização</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label>Criticidade</label>
          <select
            className="form-select"
            value={filtroCriticidade}
            onChange={(e) => setFiltroCriticidade(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label>Região</label>
          <select
            className="form-select"
            value={filtroRegiao}
            onChange={(e) => setFiltroRegiao(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Norte">Norte</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Sul">Sul</option>
          </select>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="fw-semibold">Distribuição de Alertas por Criticidade</h5>
        <Bar data={chartData} />
      </div>

      {/* Resumo estatístico */}
      <div className="card p-3 mb-4 shadow-sm overflow-auto">
        <h5 className="fw-semibold">📊 Resumo Estatístico por Região</h5>
        <Table size="sm" bordered hover responsive>
          <thead>
            <tr>
              <th>Região</th>
              <th>Média</th>
              <th>Mediana</th>
              <th>Mínimo</th>
              <th>Máximo</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(statsByRegion).map(([regiao, valores]) => {
              const stats = computeStats(valores);
              return (
                <tr key={regiao}>
                  <td>{regiao}</td>
                  <td>{stats.avg}</td>
                  <td>{stats.median}</td>
                  <td>{stats.min}</td>
                  <td>{stats.max}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Tabela de alertas */}
      <div className="card p-3 shadow-sm" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <h5 className="fw-semibold mb-3">Lista de Alertas Detalhada</h5>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table size="sm" hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Criticidade</th>
                <th>Região</th>
                <th>Valor</th>
                <th>Data/Hora</th>
                <th>Explicação</th>
                <th>Histórico (3 anos)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.tipo}</td>
                  <td>{a.criticidade}</td>
                  <td>{a.regiao}</td>
                  <td>{a.valor}</td>
                  <td>{a.timestamp}</td>
                  <td>{a.explicacao}</td>
                  <td>{a.historico.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        scrollable
      >
        <div className="p-4">
          <h5>🤖 Sobre a Inteligência Artificial</h5>
          <p>
            Este sistema utiliza modelos de IA para detectar padrões complexos em dados fenológicos e climáticos,
            gerando alertas avançados para cientistas. Ele fornece explicações sobre cada alerta e permite comparar
            a situação atual com anos anteriores, auxiliando em tomadas de decisão fundamentadas.
          </p>
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IAPanel;
