import type { CurrentWeatherResponse } from "@/api/types";
import { format } from "date-fns";
import { Compass, Gauge, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface WeatherDetailsProps {
  data: CurrentWeatherResponse;
}
interface Details {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { sys, wind, main } = data;
  const getWindDirection = (degree: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index =
      Math.round(((degree %= 360) < 0 ? degree + 360 : degree) / 45) % 8;
    return directions[index];
  };
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), "h:mm a");
  };
  const details: Details[] = [
    {
      title: "Sunset",
      color: "text-blue-500",
      icon: Sunset,
      value: formatTime(sys.sunset),
    },
    {
      title: "Sunrise",
      color: "text-orange-500",
      icon: Sunrise,
      value: formatTime(sys.sunrise),
    },
    {
      title: "Wind Direction",
      color: "text-green-500",
      icon: Compass,
      value: `${wind.deg}° (${getWindDirection(wind.deg)}) `,
    },
    {
      title: "Pressure",
      color: "text-purple-500",
      icon: Gauge,
      value: `${main.pressure} hPa `,
    },
  ];
  return (
    <Card className="bg-background/80">
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {details.map((item) => {
          const Icon = item.icon;
          return (
            <div className="p-2 border rounded-lg flex gap-2  items-center">
              <Icon className={item.color} />
              <div className="">
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
