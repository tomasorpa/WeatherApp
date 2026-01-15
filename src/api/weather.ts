import { API_CONFIG } from "./config";
import type {
  Coord,
  ForecastResponse,
  GeocodingResponse,
  CurrentWeatherResponse,
} from "./types";

type WeatherEndpoint = "weather" | "forecast" | "reverse";

class WeatherApi {
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }

  private async fetchData<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API Error: ${res.statusText}`);
    }
    return (await res.json()) as T;
  }

  async getData<T>(
    { lat, lon }: Coord,
    endpoint: WeatherEndpoint,
    extraParams?: Record<string, string | number>
  ): Promise<T> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/${endpoint}`, {
      lat:lat.toString(),
      lon:lon.toString(),
      unit: API_CONFIG.DEFAULT_PARAMS.units,
      ...extraParams,
    });
    return this.fetchData(url) as T;
  }

    
  async getCurrentWeather({ lat, lon, }: Coord): Promise<CurrentWeatherResponse> {
    return this.getData<CurrentWeatherResponse>({ lat, lon }, "weather");
  }

  async getForecast({ lat, lon }: Coord): Promise<ForecastResponse> {
    return this.getData<ForecastResponse>({ lat, lon }, "forecast");
  }

  async reverseGeocode({ lat, lon }: Coord) {
    return this.getData<GeocodingResponse>({ lat, lon }, "reverse", {
      limit: 1,
    });
  }
}

export const weatherApi = new WeatherApi();
