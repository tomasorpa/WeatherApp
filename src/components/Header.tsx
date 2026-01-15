import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./context/theme-provider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const onToggleMode = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <header className="sticky top-0 z-50 bg-background/80 px-4 flex backdrop-blur-md border-b items-center justify-between">
      <div className="h-16 flex  items-center justify-between container ">
        
        <Link to="/">
          <img
            src={`${theme === "dark" ? "/logo.png" : "/logo2.png"}`}
            alt="Klimatis"
            className="h-10"
          />
        </Link>
      </div>
      <div>
        <Button
          onClick={onToggleMode}
          variant={"ghost"}
          className={`transition-transform duration-500 ${
            theme === "dark" ? "rotate-180" : "rotate-0"
          }`}
          size={"sm"}
        >
          {theme === "dark" ? (
            <Sun className="text-yellow-500" />
          ) : (
            <Moon className="text-blue-500" />
          )}
        </Button>
      </div>
    </header>
  );
};
