import axios from "axios";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Converts a Brazilian address string into latitude/longitude coordinates
 * using the free Nominatim (OpenStreetMap) geocoding API.
 *
 * @param address Full address string (e.g. "Rua Augusta, 100, Consolacao, Sao Paulo, SP")
 * @returns `{ lat, lng }` or `null` if no match found
 */
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  const { data } = await axios.get<NominatimResult[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1,
        countrycodes: "br",
      },
      headers: {
        "User-Agent": "NaHoraApp/1.0",
      },
    },
  );

  if (!data || data.length === 0) return null;

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
