import React from "react";
import { MapView } from "./components/MapView";
import { Sidebar } from "./components/Sidebar";

function App() {
  return (
    <div className="relative">
      <Sidebar />
      <div className="ml-64">
        <MapView />
      </div>
    </div>
  );
}

export default App;
