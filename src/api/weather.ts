import { API_CONFIG } from "./config";
import type {
  Coord,
  ForecastResponse,
  CurrentWeatherResponse,
  GeocodingResponseArray,
} from "./types";

type WeatherEndpoint = "weather" | "forecast";
type GeoEndpoint = "reverse" | "direct";

class WeatherApi {
  private createUrl(
    baseUrl: string,
    endpoint: string,
    params: Record<string, string | number>,
  ) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    });

    return `${baseUrl}/${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API Error: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  }

  private async getWeatherData<T>(
    endpoint: WeatherEndpoint,
    { lat, lon }: Coord,
    extraParams?: Record<string, string | number>,
  ): Promise<T> {
    const url = this.createUrl(API_CONFIG.BASE_URL, endpoint, {
      lat,
      lon,
      units: API_CONFIG.DEFAULT_PARAMS.units,
      ...extraParams,
    });

    return this.fetchData<T>(url);
  }

  private async getGeoData<T>(
    endpoint: GeoEndpoint,
    params: Record<string, string | number>,
  ): Promise<T> {
    const url = this.createUrl(API_CONFIG.GEO, endpoint, params);
    return this.fetchData<T>(url);
  }

  

  getCurrentWeather(coord: Coord) {
    return this.getWeatherData<CurrentWeatherResponse>("weather", coord);
  }

  getForecast(coord: Coord) {
    return this.getWeatherData<ForecastResponse>("forecast", coord);
  }

  reverseGeocode({ lat, lon }: Coord) {
    return this.getGeoData<GeocodingResponseArray>("reverse", {
      lat,
      lon,
      limit: 1,
    });
  }

  searchLocations(query: string) {
    return this.getGeoData<GeocodingResponseArray>("direct", {
      q: query,
      limit: 5,
    });
  }
}

export const weatherApi = new WeatherApi();
