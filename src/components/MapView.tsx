// @ts-nocheck
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { routesService } from "../services";

// Fix ícone do Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface PlantItem {
  id: string | number;
  especie: string;
  familia: string;
  genero: string;
  pais: string;
  local: string;
  data: string;
  lat: number;
  lon: number;
  habitat: string;
  imagem?: string | null;
}

export const MapView: React.FC = () => {
  const [data, setData] = useState<PlantItem[]>([]);
  const [filteredData, setFilteredData] = useState<PlantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [filtroFamilia, setFiltroFamilia] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroPais, setFiltroPais] = useState("");

  // Opções de filtro
  const [familias, setFamilias] = useState<string[]>([]);
  const [generos, setGeneros] = useState<string[]>([]);
  const [paises, setPaises] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await routesService.getFlores({ limit: 200 });

      const registrosValidos = result.filter(
        (r) => typeof r.lat === "number" && typeof r.lon === "number"
      );

      setData(registrosValidos);

      setFamilias(Array.from(new Set(registrosValidos.map((r) => r.familia))).sort());
      setGeneros(Array.from(new Set(registrosValidos.map((r) => r.genero))).sort());
      setPaises(Array.from(new Set(registrosValidos.map((r) => r.pais))).sort());

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const anyFilterSelected = filtroFamilia || filtroGenero || filtroPais;
    if (!anyFilterSelected) {
      setFilteredData([]);
      return;
    }

    const filtrado = data.filter((item) => {
      if (filtroFamilia && item.familia !== filtroFamilia) return false;
      if (filtroGenero && item.genero !== filtroGenero) return false;
      if (filtroPais && item.pais !== filtroPais) return false;
      return true;
    });
    setFilteredData(filtrado);
  }, [filtroFamilia, filtroGenero, filtroPais, data]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          fontSize: "1.5rem",
          backgroundColor: "#00000088",
          color: "white",
        }}
      >
        Carregando flores do Brasil...
      </div>
    );

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* Botão para abrir filtros */}
      <button
        className="btn btn-primary position-absolute"
        style={{ top: "10px", right: "10px", zIndex: 1001 }}
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Fechar Filtros" : "Abrir Filtros"}
      </button>

      {/* Painel lateral de filtros */}
      {showFilters && (
        <div
          className="card p-3 shadow"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "300px",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <h5>Filtros</h5>

          <div className="mb-3">
            <label className="form-label">Família</label>
            <select
              className="form-select"
              value={filtroFamilia}
              onChange={(e) => setFiltroFamilia(e.target.value)}
            >
              <option value="">Todas</option>
              {familias.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Gênero</label>
            <select
              className="form-select"
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
            >
              <option value="">Todos</option>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Localidade</label>
            <select
              className="form-select"
              value={filtroPais}
              onChange={(e) => setFiltroPais(e.target.value)}
            >
              <option value="">Todas</option>
              {paises.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <p>Total registros filtrados: {filteredData.length}</p>
        </div>
      )}

      {/* Mapa */}
      <MapContainer zoomControl={false} center={[-10, -55]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {filteredData.map((item) => (
          <Marker key={item.id} position={[item.lat, item.lon]}>
            <Popup>
              <h6 className="fw-bold">{item.especie}</h6>
              <p>
                <strong>Família:</strong> {item.familia} <br />
                <strong>Gênero:</strong> {item.genero} <br />
                <strong>Local:</strong> {item.local}
              </p>
              <p>
                <strong>Habitat:</strong> {item.habitat}
              </p>
              <p>
                <strong>Data:</strong> {item.data}
              </p>
              {item.imagem && (
                <img src={item.imagem} alt={item.especie} style={{ width: "150px", marginTop: "5px" }} />
              )}
            </Popup>
          </Marker>
        ))}

        {filteredData.map((item) => (
          <Circle
            key={`circle-${item.id}`}
            center={[item.lat, item.lon]}
            radius={50000}
            pathOptions={{ color: "green", fillOpacity: 0.3 }}
          />
        ))}
      </MapContainer>
    </div>
  );
};
