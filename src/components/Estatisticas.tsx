import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { routesService } from "../services";

// Cores fixas para o gráfico
const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1", "#ff9da7"];

interface PlantItem {
  id: number;
  especie: string;
  familia: string;
  genero: string;
  pais: string;
  local: string;
  data: string;
  lat: number;
  lon: number;
  habitat: string;
  imagem?: string;
  fonte?: string;
}

export const Estatisticas: React.FC = () => {
  const [data, setData] = useState<PlantItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await routesService.getFlores({ limit: 300 });
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-secondary" style={{ height: "80vh" }}>
        Carregando estatísticas...
      </div>
    );
  }

  // --- Estatísticas base ---
  const total = data.length;
  const paises = new Set(data.map((d) => d.pais)).size;
  const familias = new Set(data.map((d) => d.familia)).size;
  const generos = new Set(data.map((d) => d.genero)).size;

  // --- Gráfico de países ---
  const paisCount = Object.entries(
    data.reduce((acc, curr) => {
      acc[curr.pais] = (acc[curr.pais] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([pais, count]) => ({ pais, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // --- Gráfico de famílias ---
  const familiaCount = Object.entries(
    data.reduce((acc, curr) => {
      acc[curr.familia] = (acc[curr.familia] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([familia, count]) => ({ familia, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // --- Gráfico de gêneros ---
  const generoCount = Object.entries(
    data.reduce((acc, curr) => {
      acc[curr.genero] = (acc[curr.genero] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([genero, count]) => ({ genero, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // --- Linha do tempo ---
  const dataPorMes = Object.entries(
    data.reduce((acc, curr) => {
      const mes = curr.data?.substring(0, 7) || "Desconhecido";
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([mes, count]) => ({ mes, count }))
    .sort((a, b) => a.mes.localeCompare(b.mes));

  return (
    <div className="container-fluid">
      <h4 className="fw-semibold mb-4 text-secondary">📈 Estatísticas de Floração</h4>

      {/* Cards resumo */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Total de Registros</h6>
            <h3 className="fw-bold text-primary">{total}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Países</h6>
            <h3 className="fw-bold text-success">{paises}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Famílias</h6>
            <h3 className="fw-bold text-warning">{familias}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3">
            <h6 className="text-muted">Gêneros</h6>
            <h3 className="fw-bold text-danger">{generos}</h3>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-semibold mb-3 text-secondary">🌍 Registros por País</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paisCount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pais" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4e79a7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-semibold mb-3 text-secondary">🌿 Famílias mais comuns</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={familiaCount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="familia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#59a14f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-semibold mb-3 text-secondary">🧬 Gêneros mais comuns</h6>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={generoCount}
                  dataKey="count"
                  nameKey="genero"
                  outerRadius={100}
                  label
                >
                  {generoCount.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card p-3 shadow-sm border-0">
            <h6 className="fw-semibold mb-3 text-secondary">📅 Registros ao longo do tempo</h6>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dataPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#f28e2b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
