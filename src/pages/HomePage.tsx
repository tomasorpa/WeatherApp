import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { CustomAlert } from "@/components/CustomAlert";
import { FavoriteCities } from "@/components/FavoriteCities";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useWeatherApi } from "@/hooks/use-weather";

export const HomePage = () => {
  const { coordinates, error, getLocation, isLoading } = useGeolocation();
  const { weather, forecast, location, refetchAll } =
    useWeatherApi(coordinates);

  const handleRefresh = () => {
    getLocation();
    refetchAll();
  };

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Geolocation error
  if (error) {
    return (
      <CustomAlert
        title="Location Error"
        subtitle={error}
        getLocation={getLocation}
        btnText="Enable Location"
      />
    );
  }

  // No coordinates
  if (!coordinates) {
    return (
      <CustomAlert
        title="Location Required"
        subtitle="Please enable location access to see your local weather."
        getLocation={getLocation}
        btnText="Enable Location"
      />
    );
  }

  // API errors
  if (weather.isError || forecast.isError) {
    return (
      <CustomAlert
        title="Error"
        subtitle="Failed to fetch weather data. Please try again."
        getLocation={getLocation}
        btnText="Retry"
      />
    );
  }

  // Data loading
  if (!weather.data || !forecast.data) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <FavoriteCities />

      <WeatherDashboard
        weather={weather.data}
        forecast={forecast.data}
        location={location.data}
        onRefresh={handleRefresh}
        isRefreshing={weather.isFetching || forecast.isFetching}
        showLocationHeader
      />
    </div>
  );
};
