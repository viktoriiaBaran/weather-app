import { WeatherData } from '../../store/types';

type WeatherCity = {
  name: string;
  data: WeatherData | null;
  isHome?: boolean;
  isLoading?: boolean;
};

type CachedWeatherData = {
  data: WeatherData;
  timestamp: number;
  cityName: string;
};

type StoredCityInfo = {
  name: string;
  isHome: boolean;
  addedAt: number;
};
export type { WeatherCity, CachedWeatherData, StoredCityInfo };
