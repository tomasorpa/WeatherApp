import React, { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Button } from "./ui/button";
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useWeatherApi } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-history";

export const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { search: locations, isLoading } = useWeatherApi(null, query);
  const navigate = useNavigate();
  const { addToHistory, clearHistory, history } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    addToHistory({
      query,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      country,
    });
    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      {/* Botón para abrir el dialog */}
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>

      {/* Dialog principal */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search city..." onValueChange={setQuery} />

        <CommandList>
          {/* --- Recent Searches --- */}
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex justify-between items-center px-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Recent Searches
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory()}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Clear
                  </Button>
                </div>

                {history.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* --- No results --- */}
          {query.length > 2 && !isLoading && locations.data?.length === 0 && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}

          {/* --- Suggestions --- */}
          {query.length >= 3 && (
            <CommandGroup heading="Suggestions">
              {/* Loader mientras llega la data */}
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Lista de resultados */}
              {locations.data?.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{location.name}</span>
                  {location.state && (
                    <span className="ml-1 text-sm text-muted-foreground">
                      , {location.state}
                    </span>
                  )}
                  <span className="ml-1 text-sm text-muted-foreground">
                    , {location.country}
                  </span>
                </CommandItem>
              ))}

              {/* Mensaje si no hay resultados */}
              {!isLoading && locations.data?.length === 0 && (
                <CommandEmpty>No cities found.</CommandEmpty>
              )}
            </CommandGroup>
          )}
          {/* --- Favorites (opcional) --- */}
          {/* {false && ( // Puedes activar esto si agregas favoritos
            <CommandGroup heading="Favorites">
              <CommandItem>
                <span>Toronto</span>
              </CommandItem>
            </CommandGroup>
          )} */}
        </CommandList>
      </CommandDialog>
    </>
  );
};
