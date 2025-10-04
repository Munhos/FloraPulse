// services/routesService.ts

export const routesService = {
  /**
   * Busca plantas a partir de um arquivo JSON local
   */
  getFlores: async (options?: { limit?: number }) => {
    try {
      const { limit } = options || {};

      // Busca o JSON no diretório public
      const res = await fetch("/plantas-brasil.json");
      if (!res.ok) throw new Error("Erro ao carregar o arquivo JSON");

      const data = await res.json();

      // Limita o número de registros se for passado
      const results = limit ? data.slice(0, limit) : data;

      return results;
    } catch (err) {
      console.error("Erro ao buscar flores no JSON local:", err);
      return [];
    }
  },
};
