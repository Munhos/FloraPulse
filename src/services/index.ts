// services/routesService.ts
import axios from "axios";

export const routesService = {
  /**
   * Busca plantas (flores) usando GBIF
   */
  getFlores: async (options?: { limit?: number }) => {
    try {
      const { limit = 200 } = options || {};

      const res = await axios.get("https://api.gbif.org/v1/occurrence/search", {
        params: {
          kingdom: "Plantae",
          country: "BR",
          hasCoordinate: true,
          mediaType: "StillImage",
          limit,
        },
      });

      const results = res.data.results || [];

      const formatted = results.map((r: any) => ({
        id: r.key,
        especie: r.scientificName || "Desconhecida",
        familia: r.family || "Não especificada",
        genero: r.genus || "",
        pais: r.country || "Brasil",
        local: r.locality || r.municipality || "Local não informado",
        data: r.eventDate || "",
        lat: r.decimalLatitude,
        lon: r.decimalLongitude,
        habitat: r.habitat || "Não informado",
        imagem: r.media?.[0]?.identifier || null,
        fonte: "GBIF",
      }));

      return formatted;
    } catch (err) {
      console.error("Erro ao buscar flores no GBIF:", err);
      return [];
    }
  },
};
