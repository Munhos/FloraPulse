// @ts-nocheck
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface LogEntry {
  timestamp: string;
  especie: string;
  pais: string;
  local: string;
  mensagem: string;
  nivel: string;
}

export const Alertas: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logData, setLogData] = useState<any>(null);

  // Carrega partes de mensagens do JSON
  useEffect(() => {
    fetch("/logs.json")
      .then((res) => res.json())
      .then(setLogData)
      .catch((err) => console.error("Erro ao carregar logs.json", err));
  }, []);

  // Gera novos logs automaticamente
  useEffect(() => {
    if (!logData) return;

    const gerarNovoLog = () => {
      const especie = logData.especies[Math.floor(Math.random() * logData.especies.length)];
      const pais = logData.paises[Math.floor(Math.random() * logData.paises.length)];
      const local = logData.locais[Math.floor(Math.random() * logData.locais.length)];
      const mensagem = logData.mensagens[Math.floor(Math.random() * logData.mensagens.length)];
      const nivel = logData.niveis[Math.floor(Math.random() * logData.niveis.length)];

      const novoLog: LogEntry = {
        timestamp: new Date().toLocaleString(),
        especie,
        pais,
        local,
        mensagem,
        nivel,
      };

      setLogs((prev) => [novoLog, ...prev]);
    };

    // Gera primeiro log imediatamente
    gerarNovoLog();

    const gerarProximo = () => {
      const intervalo = Math.random() * (60000 - 10000) + 10000; // entre 10 e 60 segundos
      setTimeout(() => {
        gerarNovoLog();
        gerarProximo();
      }, intervalo);
    };

    gerarProximo();
  }, [logData]);

  // Cor visual por nível de alerta
  const getNivelClass = (nivel: string) => {
    switch (nivel) {
      case "Baixo":
        return "text-success fw-bold";
      case "Moderado":
        return "text-warning fw-bold";
      case "Alto":
        return "text-danger fw-bold";
      case "Crítico":
        return "text-danger-emphasis bg-danger-subtle fw-bold";
      default:
        return "";
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh", background: "#f9fafb" }}>
      <h3 className="mb-4 fw-bold text-center">🌸 Alertas de Floração</h3>

      {/* Tabela para telas médias e grandes */}
      <div className="d-none d-md-block table-responsive shadow-lg bg-white rounded-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        <table className="table table-hover align-middle mb-0" style={{ minWidth: "800px" }}>
          <thead className="table-success text-center">
            <tr>
              <th>Data/Hora</th>
              <th>Espécie</th>
              <th>País</th>
              <th>Local</th>
              <th>Mensagem</th>
              <th>Nível</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {logs.map((log, i) => (
              <tr key={i}>
                <td>{log.timestamp}</td>
                <td className="fw-semibold">{log.especie}</td>
                <td>{log.pais}</td>
                <td>{log.local}</td>
                <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{log.mensagem}</td>
                <td className={getNivelClass(log.nivel)}>{log.nivel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards para telas pequenas */}
      <div className="d-block d-md-none">
        {logs.map((log, i) => (
          <div key={i} className="card mb-3 shadow-sm p-3">
            <p><strong>Data/Hora:</strong> {log.timestamp}</p>
            <p><strong>Espécie:</strong> {log.especie}</p>
            <p><strong>País:</strong> {log.pais}</p>
            <p><strong>Local:</strong> {log.local}</p>
            <p><strong>Mensagem:</strong> {log.mensagem}</p>
            <p><strong>Nível:</strong> <span className={getNivelClass(log.nivel)}>{log.nivel}</span></p>
          </div>
        ))}
      </div>

      {logs.length === 0 && (
        <div className="text-center mt-5 text-muted">Carregando alertas de floração...</div>
      )}
    </div>
  );
};
