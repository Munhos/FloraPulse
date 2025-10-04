import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type FlowerData = { position: [number, number]; name: string };
const data: FlowerData[] = [
  { position: [-25, -51], name: "Flor A" },
  { position: [-26, -52], name: "Flor B" },
  { position: [-24, -50], name: "Flor C" },
];

export default function App() {

  const [filtroSeleionado, setFiltroSeleionado] = React.useState("");

  const getDataByFilter = (param: string) => {

  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <select name="" id="" onChange={(e) => setFiltroSeleionado(e.target.value)}>
          <option value="floresta">Floresta</option>
          <option value="lavouras">Lavouras</option>
          <option value="floricultura">Floricultura</option>
        </select>
      </div>
      <MapContainer
        center={[-25, -51]}
        zoom={5}
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
    </div>

  );
}
