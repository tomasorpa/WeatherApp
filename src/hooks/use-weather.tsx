import type {
  Coord,
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResponseArray,
} from "@/api/types";
import { weatherApi } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

const WEATHER_KEYS = {
  weather: (coords: Coord) => ["weather", coords] as const,
  forecast: (coords: Coord) => ["forecast", coords] as const,
  location: (coords: Coord) => ["location", coords] as const,
  search: (query: string) => ["location-search", query] as const,
};

export const useWeatherApi = (
  coordinates: Coord | null,
  query: string | null,
) => {
  const weather = useQuery<CurrentWeatherResponse>({
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherApi.getCurrentWeather(coordinates!),
    enabled: !!coordinates,
    staleTime: 5 * 60 * 1000,
  });

  const forecast = useQuery<ForecastResponse>({
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherApi.getForecast(coordinates!),
    enabled: !!coordinates,
    staleTime: 30 * 60 * 1000,
  });

  const location = useQuery<GeocodingResponseArray>({
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    queryFn: () => weatherApi.reverseGeocode(coordinates!),
    enabled: !!coordinates,
    staleTime: Infinity,
  });

  const search = useQuery<GeocodingResponseArray>({
    queryKey: query ? WEATHER_KEYS.search(query) : ["location-search", "idle"],
    queryFn: () => weatherApi.searchLocations(query!),
    enabled: !!query && query.length >= 3,
    staleTime: 10 * 60 * 1000,
  });

  return {
    weather,
    forecast,
    location,
    search,
    isLoading: weather.isLoading || forecast.isLoading || location.isLoading,
    isError: weather.isError || forecast.isError || location.isError,
    refetchAll: () => {
      weather.refetch();
      forecast.refetch();
      location.refetch();
    },
  };
};
