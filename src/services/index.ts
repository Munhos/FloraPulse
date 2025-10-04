import axios from "axios";

export const routesService = {
    getVegetacao: async (lat_min: string | number, lat_max: string | number, lon_min: string | number, lon_max: string | number, limit = 300) => {
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

    getFloresta: async (lat_min: string, lat_max: string, lon_min: string, lon_max: string, limit = 300) => {
        try {
            const response = await axios.get("https://api.gbif.org/v1/occurrence/search", {
                params: {
                    country: "BR",
                    kingdom: "Plantae",
                    hasCoordinate: "true",
                    habitat: 'forest',
                    decimalLatitude: `${lat_min},${lat_max}`,
                    decimalLongitude: `${lon_min},${lon_max}`,
                    limit: limit,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar dados de floresta:", error);
            return [];
        }
    },


    getLavouras: async (lat_min: string, lat_max: string, lon_min: string, lon_max: string, limit = 300) => {
        try {
            const response = await axios.get("https://api.gbif.org/v1/occurrence/search", {
                params: {
                    country: "BR",
                    kingdom: "Plantae",
                    hasCoordinate: "true",
                    familyKey: 3043,
                    decimalLatitude: `${lat_min},${lat_max}`,
                    decimalLongitude: `${lon_min},${lon_max}`,
                    limit: limit,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar dados de lavouras:", error);
            return [];
        }
    },

    getFloricultura: async (lat_min: string, lat_max: string, lon_min: string, lon_max: string, limit = 300) => {
        try {
            const response = await axios.get("https://api.gbif.org/v1/occurrence/search", {
                params: {
                    country: "BR",
                    kingdom: "Plantae",
                    hasCoordinate: "true",
                    familyKey: 7649,
                    decimalLatitude: `${lat_min},${lat_max}`,
                    decimalLongitude: `${lon_min},${lon_max}`,
                    limit: limit,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error("Erro ao buscar dados de floricultura:", error);
            return [];
        }
    },
};

