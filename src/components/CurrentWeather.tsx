import type {
  CurrentWeatherResponse,
  GeocodingResponseArray,
  GeocodingResponse,
} from "@/api/types";
import { Card, CardContent } from "./ui/card";
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { formatTemp } from "@/helpers/formatTemp";

const WeatherLocation = ({ location }: { location?: GeocodingResponse }) => {
  console.warn({ location });
  if (!location) {
    return (
      <header className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">
          Unknown Location
        </h2>
      </header>
    );
  }

  return (
    <header className="space-y-2 w-full">
      <h2 className="text-2xl font-bold tracking-tight">
        {location.name}
        {location.state && (
          <span className="text-muted-foreground">, {location.state}</span>
        )}
      </h2>
      <p className="text-sm text-muted-foreground">{location.country}</p>
    </header>
  );
};

export const WeatherTemperature = ({
  temp,
  feelsLike,
  tempMin,
  tempMax,
}: {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
}) => {
  return (
    <section
      className="flex items-center justify-between "
      aria-label="Current temperature"
    >
      <p className="text-4xl sm:text-7xl font-bold tracking-tighter">
        {formatTemp(temp)}
      </p>

      <div className="space-y-1 ">
        <p className="text-sm font-medium text-muted-foreground">
          Feels like {formatTemp(feelsLike)}
        </p>

        <div className="flex gap-2 text-sm font-medium">
          <span className="flex items-center gap-1 text-blue-500">
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
            <span className="sr-only">Minimum: </span>
            {formatTemp(tempMin)}
          </span>

          <span className="flex items-center gap-1 text-red-500">
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
            <span className="sr-only">Maximum: </span>
            {formatTemp(tempMax)}
          </span>
        </div>
      </div>
    </section>
  );
};

const WeatherStat = ({
  icon: Icon,
  label,
  value,
  unit = "",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-blue-500" aria-hidden="true" />
      <div className="space-y-0.5">
        <dt className="text-[10px] sm:text-xs font-medium">{label}</dt>
        <dd className="text-[10px] sm:text-xs text-muted-foreground">
          {value}
          {unit}
        </dd>
      </div>
    </div>
  );
};

export const WeatherStats = ({
  humidity,
  windSpeed,
}: {
  humidity: number;
  windSpeed: number;
}) => {
  return (
    <dl className="flex-col lg:flex gap-6 space-y-2">
      <WeatherStat icon={Droplets} label="Humidity" value={humidity} unit="%" />
      <WeatherStat
        icon={Wind}
        label="Wind Speed"
        value={windSpeed}
        unit=" m/s"
      />
    </dl>
  );
};

const WeatherIcon = ({
  icon,
  description,
}: {
  icon: string;
  description: string;
}) => {
  return (
    <figure className="flex flex-col items-center justify-center">
      <div className="relative flex aspect-square w-full items-center justify-center">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt=""
          className="size-28 md:absolute md:block object-contain"
        />
      </div>
      <figcaption className="text-center">
        <p className="text-xs text-muted-foreground capitalize">
          {description}
        </p>
      </figcaption>
    </figure>
  );
};

interface Props {
  data: CurrentWeatherResponse;
  locationName?: GeocodingResponseArray | null;
}

export const CurrentWeather = ({ data, locationName }: Props) => {
  const { weather, main, wind, name, sys } = data;
  const location = { name, country: sys.country };
  const currentWeather = weather[0];
  console.log(locationName);
  return (
    <Card className="overflow-hidden bg-background/80 ">
      <CardContent className="p-6">
        <WeatherLocation location={location} />
        <div className="flex gap-6 flex-col justify-between">
          {/* Columna izquierda */}
          <div className="space-y-4 ">
            <WeatherTemperature
              temp={main.temp}
              feelsLike={main.feels_like}
              tempMin={main.temp_min}
              tempMax={main.temp_max}
            />
          </div>
          <div className="flex items-center justify-between">
            <WeatherStats humidity={main.humidity} windSpeed={wind.speed} />
            <WeatherIcon
              icon={currentWeather?.icon || "01d"}
              description={currentWeather?.description || "No data"}
            />
          </div>

          {/* Columna derecha */}
        </div>
      </CardContent>
    </Card>
  );
};
