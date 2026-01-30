import { useEffect, useState } from "react";
import type { Coord } from "../api/types";
interface GeolocationState {
  coordinates: Coord | null;
  error: string | null;
  isLoading: boolean;
}
export const useGeolocation = () => {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
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
        timeout: 2000,
        maximumAge: 0,
      }
    );
  };
  useEffect(() => {
    getLocation();
  }, []);

  return { ...locationData, getLocation };
};
