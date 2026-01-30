import { Button } from "@/components/ui/button";
import { RefreshCcwDot } from "lucide-react";
import { CurrentWeather } from "./CurrentWeather";
import { HourlyTemperature } from "./HourlyTemperature";
import { WeatherDetails } from "./WeatherDetails";
import { WeatherForecast } from "./WeatherForecast";
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResponseArray,
} from "@/api/types";

interface WeatherDashboardProps {
  weather: CurrentWeatherResponse;
  forecast: ForecastResponse;
  location: GeocodingResponseArray | null | undefined;
  onRefresh: () => void;
  isRefreshing?: boolean;
  showLocationHeader?: boolean;
}

export const WeatherDashboard = ({
  weather,
  forecast,
  location,
  onRefresh,
  isRefreshing = false,
  showLocationHeader = true,
}: WeatherDashboardProps) => {

  return (
    <div className="space-y-6">
      {/* Header condicional (solo en HomePage) */}
      {showLocationHeader && (
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">My Location</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="transition-transform duration-500 hover:rotate-180"
          >
            <RefreshCcwDot
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </header>
      )}

      {/* Sección 1: Current Weather + Hourly Temperature */}
      <section className="grid gap-6 lg:grid-cols-2">
        <CurrentWeather data={weather} />
        <HourlyTemperature data={forecast} />
      </section>

      {/* Sección 2: Details + 5-Day Forecast */}
      <section className="grid gap-6 lg:grid-cols-2 items-start">
        <WeatherDetails data={weather} />
        <WeatherForecast data={forecast} />
      </section>
    </div>
  );
};
