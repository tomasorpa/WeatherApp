import "./App.css";
import { Layout } from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/context/theme-provider";
import { WeatherDashboard } from "./components/WeatherDashboard";
import { CityPage } from "./pages/CityPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HomePage } from "./pages/HomePage";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: (5 * 60) ^ 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/city/:city" element={<CityPage />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
