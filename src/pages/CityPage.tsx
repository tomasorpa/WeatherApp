import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWeatherApi } from "@/hooks/use-weather";
import { useFavorites } from "@/hooks/use-favorites";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { AlertCircle } from "lucide-react";

export const CityPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse coordinates
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  // Validate coordinates
  if (!lat || !lon || lat === 0 || lon === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Invalid Location</AlertTitle>
        <AlertDescription>Please provide valid coordinates.</AlertDescription>
      </Alert>
    );
  }

  const coordinates = { lat, lon };
  const { weather, forecast, location, refetchAll } =
    useWeatherApi(coordinates);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Loading state
  if (weather.isLoading || forecast.isLoading) {
    return <LoadingSkeleton />;
  }

  // Error state
  if (weather.isError || forecast.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Data validation
  if (!weather.data || !forecast.data) {
    return <LoadingSkeleton />;
  }

  // City object for favorites
  const city = {
    id: `${lat}-${lon}`,
    name: weather.data.name,
    lat,
    lon,
    country: weather.data.sys.country,
    addedAt: Date.now(),
  };

  const isCityFavorite = isFavorite(city.lat, city.lon);

  const handleToggleFavorite = () => {
    toggleFavorite(city);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    refetchAll();
  };

  return (
    <div className="space-y-6">
      {/* Header con botones de navegación */}
      <header className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleFavorite}
          className="transition-colors"
        >
          <Star
            className={`h-4 w-4 ${
              isCityFavorite
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        </Button>
      </header>

      {/* Dashboard */}
      <WeatherDashboard
        weather={weather.data}
        forecast={forecast.data}
        location={location.data}
        onRefresh={handleRefresh}
        isRefreshing={weather.isFetching || forecast.isFetching}
        showLocationHeader={false}
      />
    </div>
  );
};
