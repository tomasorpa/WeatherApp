import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWeatherApi } from "@/hooks/use-weather";
import { useFavorites } from "@/hooks/use-favorites";
import type { FavoriteCity } from "@/hooks/use-favorites";

/* ==========================================
   COMPONENTE: Tablet de Ciudad Favorita
========================================== */

interface FavoriteCityTabletProps {
  city: FavoriteCity;
  onRemove: (city: FavoriteCity) => void;
}

function FavoriteCityTablet({ city, onRemove }: FavoriteCityTabletProps) {
  const navigate = useNavigate();
  const coordinates = { lat: city.lat, lon: city.lon };

  // ✅ Hook corregido (sin segundo parámetro)
  const { weather } = useWeatherApi(coordinates);

  const handleClick = () => {
    navigate(`/city/${city.name}?lat=${city.lat}&lon=${city.lon}`);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(city);
    toast.error(`Removed ${city.name} from Favorites`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-background/80 p-4 pr-8 shadow-sm transition-all hover:shadow-md"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      {/* Botón de eliminar */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleRemove}
        aria-label={`Remove ${city.name} from favorites`}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* ✅ Estados de loading/error/success */}
      {weather.isLoading ? (
        <div className="flex h-12 w-full items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : weather.isError ? (
        <div className="flex h-12 w-full items-center justify-center">
          <p className="text-xs text-muted-foreground">Failed to load</p>
        </div>
      ) : weather.data ? (
        <>
          {/* Lado izquierdo: Icono + Nombre */}
          <div className="flex items-center gap-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.data.weather?.[0]?.icon}.png`}
              alt={weather.data.weather?.[0]?.description || "Weather icon"}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium">{city.name}</p>
              <p className="text-xs text-muted-foreground">
                {weather.data.sys.country}
              </p>
            </div>
          </div>

          {/* Lado derecho: Temperatura */}
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">
              {Math.round(weather.data.main.temp)}°
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.data.weather?.[0]?.description || "N/A"}
            </p>
          </div>
        </>
      ) : (
        <div className="flex h-12 w-full items-center justify-center">
          <p className="text-xs text-muted-foreground">No data</p>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   COMPONENTE PRINCIPAL: Lista de Favoritos
========================================== */

export function FavoriteCities() {
  const { favorites, toggleFavorite } = useFavorites();

  // ✅ Manejador de eliminación
  const handleRemoveFavorite = (city: FavoriteCity) => {
    toggleFavorite(city);
  };

  // ✅ Early return si no hay favoritos
  if (!favorites.length) {
    return null;
  }

  return (
    <div className="space-y-4 ">
      <h2 className="text-xl font-bold tracking-tight">Favorites</h2>

      <ScrollArea className="w-full pb-4">
        <div className="flex gap-4 ">
          {favorites.map((city) => (
            <FavoriteCityTablet
              key={city.id}
              city={city}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </div>
  );
}
