import type { ForecastResponse } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { formatTemp } from "@/helpers/formatTemp";

interface Props {
  data: ForecastResponse;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export const WeatherForecast = ({ data }: Props) => {
  const dailyForecasts = data.list.reduce(
    (acc, forecast) => {
      const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = {
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          weather: forecast.weather[0],
          date: forecast.dt,
        };
      } else {
        acc[date].temp_min = Math.min(
          acc[date].temp_min,
          forecast.main.temp_min,
        );
        acc[date].temp_max = Math.max(
          acc[date].temp_max,
          forecast.main.temp_max,
        );
      }
      return acc;
    },
    {} as Record<string, DailyForecast>,
  );

  const nextFiveDays = Object.values(dailyForecasts).slice(1, 6);

  return (
    <Card className="overflow-hidden bg-background/80">
      <CardHeader>
        <CardTitle className="text-xl">5-Day Forecast</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 p-4 md:p-6">
        {nextFiveDays.map((day) => (
          <div
            key={day.date}
            className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50 md:gap-4 md:p-4"
          >
            {/* Fecha + Icono */}
            <div className="flex min-w-[140px] items-center gap-3 md:min-w-[160px]">
              <img
                src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                alt={day.weather.description}
                className="h-10 w-10 md:h-12 md:w-12"
              />
              <div>
                <p className="text-sm font-semibold md:text-base">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-xs capitalize text-muted-foreground">
                  {day.weather.description}
                </p>
              </div>
            </div>

            {/* Temperaturas */}
            <div className="flex flex-col-reverse sm:flex-row flex-1 items-center justify-center gap-4">
              <div className="flex items-center gap-1 text-blue-500">
                <ArrowDown className="h-3 w-3" aria-hidden="true" />
                <span className="text-sm font-medium md:text-base">
                  {formatTemp(day.temp_min)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <ArrowUp className="h-3 w-3" aria-hidden="true" />
                <span className="text-sm font-medium md:text-base">
                  {formatTemp(day.temp_max)}
                </span>
              </div>
            </div>

            {/* Stats (Humedad y Viento) */}
            <div className="hidden items-center gap-4 md:flex">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Wind className="h-4 w-4 text-blue-500" />
                <span className="text-sm">{day.wind.toFixed(1)} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
