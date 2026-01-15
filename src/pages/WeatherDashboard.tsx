import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { AlertCircleIcon, MapPin, RefreshCcwDot } from "lucide-react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const WeatherDashboard = () => {
  const { coordinates, error, getLocation, isLoading } = useGeolocation();

  console.log(coordinates);
  const handleRefresh = () => {
    getLocation();
  };
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>please Enable Location Access To See Your Local Weather.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className=" h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className=" h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold ">My Location</h1>
        <Button variant={"outline"} size={"icon"} onClick={handleRefresh}>
          <RefreshCcwDot className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
