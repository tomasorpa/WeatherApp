import { toast } from "sonner";
import { useLocalStorage } from "./use-local-storage";
import { data } from "react-router-dom";

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

const STORAGE_KEY = "favorite-cities";

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    STORAGE_KEY,
    [],
  );

  const toggleFavorite = (city: Omit<FavoriteCity, "id" | "addedAt">) => {
    const id = `${city.lat}-${city.lon}`;
    const exists = favorites.some((fav) => fav.id === id);

    if (exists) {
        setFavorites(favorites.filter((fav) => fav.id !== id));
        toast.error(`${city.name} Has Been Removed From Favorites`)
    } else {
        const newFavorite: FavoriteCity = {
            ...city,
            id,
            addedAt: Date.now(),
        };
        setFavorites([newFavorite, ...favorites]);
        toast.success(`${city.name} Has Been added To Favorites`)
    }
  };

  const isFavorite = (lat: number, lon: number) =>
    favorites.some((fav) => fav.id === `${lat}-${lon}`);

  return { favorites, toggleFavorite, isFavorite };
};
