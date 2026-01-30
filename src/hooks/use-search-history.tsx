import { useLocalStorage } from "./use-local-storage";
interface SearchHistoryItem {
  id: string;
  query: string;
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
  searchedAt: number;
}
export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<SearchHistoryItem[]>(
    "search-history-cities",
    [],
  );

  const addToHistory = (
    search: Omit<SearchHistoryItem, "id" | "searchedAt">,
  ) => {
    //crea histoItem
    const newItem: SearchHistoryItem = {
      ...search,
      id: `${search.lat}-${search.lon}-${Date.now()}`,
      searchedAt: Date.now(),
    };

    //quita a los previos iguales
    const filteredItems = history.filter(
      (item) => item.lat !== newItem.lat && item.lon !== newItem.lon,
    );

    setHistory([newItem, ...filteredItems].slice(0, 10)); //que pasa si no uso el spread operator??
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
}
