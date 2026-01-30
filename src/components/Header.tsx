import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./context/theme-provider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { CitySearch } from "./CitySearch";

export const Header = () => {
  const { theme, setTheme } = useTheme();

  const onToggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ✅ Removido container, agregado max-w-7xl para desktop */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src={theme === "dark" ? "/logo.png" : "/logo2.png"}
            alt="Klimate"
            className="h-8 md:h-10"
          />
        </Link>

        {/* Search + Theme Toggle */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* ✅ CitySearch con ancho limitado */}
          <div className="w-full max-w-xs md:max-w-md">
            <CitySearch />
          </div>

          {/* Theme Toggle */}
          <Button
            onClick={onToggleMode}
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-transform duration-500"
            style={{
              transform: theme === "dark" ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
