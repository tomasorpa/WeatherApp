import type { ForecastResponse } from "@/api/types";
import React from "react";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { CardContent } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
interface Props {
  data: ForecastResponse | null | undefined;
}
export const HourlyTemperature = ({ data }: Props) => {
  const chartData = data?.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"), //hour, AM or PM
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));
  return (
    <Card className="flex-1 bg-background/80 ">
      <CardHeader>
        <CardTitle></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 ">
                        <div>
                          <div>
                            <p>
                              Temperature:{" "}
                              <span className="font-bold">
                                {payload[0].value}°
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Feels Like:{" "}
                              <span className="font-bold">
                                {payload[1].value}°
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type={"monotone"}
                dataKey={"temp"}
                stroke="#2563eb"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type={"monotone"}
                dataKey={"feels_like"}
                stroke="#64748b"
                dot={false}
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
