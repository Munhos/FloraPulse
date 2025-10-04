import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { routesService } from "./services/index";
import { estadosBR } from "./data/estados";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type FlowerData = { position: [number, number]; name: string };

export default function App() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("");
  const [data, setData] = useState<FlowerData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const estadosKeys = Object.keys(estadosBR);
        const getMethod =
          filtroSelecionado === "floresta"
            ? routesService.getFloresta
            : filtroSelecionado === "lavouras"
            ? routesService.getLavouras
            : filtroSelecionado === "floricultura"
            ? routesService.getFloricultura
            : routesService.getVegetacao;

        // Executa todas as chamadas em paralelo
        const results = await Promise.all(
          estadosKeys.map(async (estadoKey) => {
            const bbox = estadosBR[estadoKey as keyof typeof estadosBR];
            let response: any[] = [];
            try {
              response = await getMethod(
                bbox.lat_min.toString(),
                bbox.lat_max.toString(),
                bbox.lon_min.toString(),
                bbox.lon_max.toString(),
                100
              );
            } catch {
              return null;
            }

            // Conta ocorrências por espécie
            const contagem: Record<string, number> = {};
            for (const r of response) {
              if (r.species) contagem[r.species] = (contagem[r.species] || 0) + 1;
            }

            if (Object.keys(contagem).length === 0) return null;

            // Encontra espécie mais comum
            const especieMaisComum = Object.entries(contagem).sort(
              (a, b) => b[1] - a[1]
            )[0][0];

            // Encontra um ponto qualquer dessa espécie
            const ponto = response.find((r: any) => r.species === especieMaisComum);
            if (!ponto?.decimalLatitude || !ponto?.decimalLongitude) return null;

            return {
              position: [ponto.decimalLatitude, ponto.decimalLongitude] as [number, number],
              name: `${especieMaisComum} (${estadoKey})`,
            };
          })
        );

        // Atualiza apenas com dados válidos
        setData(results.filter((r): r is FlowerData => r !== null));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtroSelecionado]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "200px", margin: "10px" }}>
        <select
          className="form-select"
          value={filtroSelecionado}
          onChange={(e) => setFiltroSelecionado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="floresta">Floresta</option>
          <option value="lavouras">Lavouras</option>
          <option value="floricultura">Floricultura</option>
        </select>
      </div>

      <MapContainer
        center={[-14.235, -51.9253]} // Centro do Brasil
        zoom={4}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {data.map((d, i) => (
          <Marker key={i} position={d.position}>
            <Popup>
              <b>{d.name}</b>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "white",
            fontSize: "1.2rem",
          }}
        >
          <div
            className="spinner-border text-light"
            role="status"
            style={{ width: "4rem", height: "4rem" }}
          >
            <span className="visually-hidden">Carregando...</span>
          </div>
          <div style={{ marginTop: "15px" }}>Carregando dados de vegetação...</div>
        </div>
      )}
    </div>
  );
}
