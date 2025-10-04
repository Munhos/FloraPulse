import React from "react";

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white p-4 shadow-lg fixed top-0 left-0 h-full z-50">
      <h1 className="text-xl font-bold mb-4">FloraPulse</h1>
      <div>
        <label className="block">Tipo de vegetação:</label>
        <select className="border p-1 w-full">
          <option value="">Todos</option>
          <option value="flor">Flores</option>
          <option value="floresta">Florestas</option>
        </select>
      </div>
    </div>
  );
};
