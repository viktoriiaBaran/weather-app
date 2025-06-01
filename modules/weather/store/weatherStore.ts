import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { WeatherData } from './types';

interface WeatherState {
  searchedCity: string;
  setSearchedCity: (city: string) => void;

  userWeatherData: WeatherData | null;
  setUserWeatherData: (data: WeatherData | null) => void;

  searchedWeatherData: WeatherData | null;
  setSearchedWeatherDataWeatherData: (data: WeatherData | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set) => ({
      searchedCity: '',
      setSearchedCity: (city) => set({ searchedCity: city }),

      userWeatherData: null,
      setUserWeatherData: (data) => set({ userWeatherData: data }),

      searchedWeatherData: null,
      setSearchedWeatherDataWeatherData: (data) =>
        set({ searchedWeatherData: data }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'weather-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
