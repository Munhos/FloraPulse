import axios from "axios";

export const routesService = {
  getVegetacao: async (lat_min:string, lat_max:string, lon_min:string, lon_max:string, limit = 300) => {
    try {
      const response = await axios.get("https://api.gbif.org/v1/occurrence/search", {
        params: {
          country: "BR",
          kingdom: "Plantae", 
          hasCoordinate: "true",
          decimalLatitude: `${lat_min},${lat_max}`,
          decimalLongitude: `${lon_min},${lon_max}`,
          limit: limit,
        },
      });

      return response.data.results; 
    } catch (error) {
      console.error("Erro ao buscar dados de vegetação:", error);
      return [];
    }
  },
};
