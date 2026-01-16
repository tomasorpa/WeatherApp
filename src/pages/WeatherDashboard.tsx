import { Button } from "@/components/ui/button";
import { AlertCircleIcon, MapPin, RefreshCcwDot } from "lucide-react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import type { Coord } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "@/api/weather";

interface GeolocationState {
  coordinates: Coord | null;
  error: string | null;
  isLoading: boolean;
}

const WEATHER_KEYS = {
  weather: (coords: Coord) => ["weather", coords] as const,
  forecast: (coords: Coord) => ["forecast", coords] as const,
  location: (coords: Coord) => ["location", coords] as const,
} as const;

export const WeatherDashboard = () => {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getWeatherData = useQuery({
    queryKey: WEATHER_KEYS.weather(
      locationData.coordinates ?? { lat: 0, lon: 0 }
    ),
    queryFn: () =>
      locationData.coordinates
        ? weatherApi.getCurrentWeather(locationData.coordinates)
        : null,
    enabled: !!locationData.coordinates,
  });

  const getForecastData = useQuery({
    queryKey: WEATHER_KEYS.forecast(
      locationData.coordinates ?? { lat: 0, lon: 0 }
    ),
    queryFn: () =>
      locationData.coordinates
        ? weatherApi.getForecast(locationData.coordinates)
        : null,
    enabled: !!locationData.coordinates,
  });

  const getReverseGeocodings = useQuery({
    queryKey: WEATHER_KEYS.location(
      locationData.coordinates ?? { lat: 0, lon: 0 }
    ),
    queryFn: () =>
      locationData.coordinates
        ? weatherApi.reverseGeocode(locationData.coordinates)
        : null,
    enabled: !!locationData.coordinates,
  });

  const getLocation = () => {
    setLocationData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    if (!navigator.geolocation) {
      setLocationData((prev) => ({
        ...prev,
        isLoading: false,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }
        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleRefresh = () => {
    getLocation();
    // Opcional: refetch de las queries
    getWeatherData.refetch();
    getForecastData.refetch();
    getReverseGeocodings.refetch();
  };

  if (locationData.isLoading) {
    return <LoadingSkeleton />;
  }

  if (locationData.error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationData.error}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!locationData.coordinates) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // ✅ Return principal cuando todo está OK
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          className="transition-transform duration-500 hover:rotate-180"
        >
          <RefreshCcwDot className="h-4 w-4" />
        </Button>
      </div>

      {/* Aquí puedes agregar el contenido del weather */}
      {getWeatherData.data && (
        <div>
          {/* Renderiza tu componente de clima aquí */}
          <pre>{JSON.stringify(getWeatherData.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
