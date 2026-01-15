
/* =======================
   TIPOS BASE (REUTILIZABLES)
======================= */

export interface Coord {
  lat: number
  lon: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
  temp_kf?: number
}

export interface Wind {
  speed: number
  deg: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface Rain1h {
  "1h": number
}

export interface Rain3h {
  "3h": number
}

/* =======================
   CURRENT WEATHER RESPONSE
======================= */

export interface CurrentWeatherResponse {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  rain?: Rain1h
  clouds: Clouds
  dt: number
  sys: CurrentSys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface CurrentSys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}

/* =======================
   FORECAST (5 DAYS / 3H)
======================= */

export interface ForecastResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: City
}

export interface ForecastItem {
  dt: number
  main: Main
  weather: Weather[]
  clouds: Clouds
  wind: Wind
  visibility: number
  pop: number
  rain?: Rain3h
  sys: ForecastSys
  dt_txt: string
}

export interface ForecastSys {
  pod: "d" | "n"
}

export interface City {
  id: number
  name: string
  coord: Coord
  country: string
  population: number
  timezone: number
  sunrise: number
  sunset: number
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
