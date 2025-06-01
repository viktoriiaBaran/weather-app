import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CACHE_EXPIRY_TIME,
  CITIES_STORAGE_KEY,
  MAX_CITIES,
  WEATHER_CACHE_KEY,
} from '../constants';
import { WeatherData } from '../store/types';
import {
  CachedWeatherData,
  StoredCityInfo,
  WeatherCity,
} from '../components/WeatherComponent/types';
import { fetchWeatherByCity } from '@/libs/weatherApi';

export const getCachedWeather = async (
  cityName: string,
): Promise<WeatherData | null> => {
  try {
    const cacheKey = `${WEATHER_CACHE_KEY}_${cityName.toLowerCase()}`;
    const cachedDataStr = await AsyncStorage.getItem(cacheKey);

    if (!cachedDataStr) return null;

    const cachedData: CachedWeatherData = JSON.parse(cachedDataStr);
    const now = Date.now();

    if (now - cachedData.timestamp > CACHE_EXPIRY_TIME) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return cachedData.data;
  } catch (error) {
    console.error('Error getting cached weather:', error);
    return null;
  }
};

export const cacheWeatherData = async (cityName: string, data: WeatherData) => {
  try {
    const cacheKey = `${WEATHER_CACHE_KEY}_${cityName.toLowerCase()}`;
    const cachedData: CachedWeatherData = {
      data,
      timestamp: Date.now(),
      cityName,
    };

    await AsyncStorage.setItem(cacheKey, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error caching weather data:', error);
  }
};

export const getWeatherData = async (
  cityName: string,
): Promise<WeatherData | null> => {
  try {
    const cachedData = await getCachedWeather(cityName);
    if (cachedData) {
      return cachedData;
    }

    const freshData = await fetchWeatherByCity(cityName);
    await cacheWeatherData(cityName, freshData);
    return freshData;
  } catch (error) {
    console.error(`Failed to get weather data for ${cityName}:`, error);
    return null;
  }
};

export const saveCitiesToStorage = async (cities: StoredCityInfo[]) => {
  try {
    await AsyncStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(cities));
  } catch (error) {
    console.error('Error saving cities to storage:', error);
  }
};

export const loadCitiesFromStorage = async (): Promise<StoredCityInfo[]> => {
  try {
    const citiesStr = await AsyncStorage.getItem(CITIES_STORAGE_KEY);
    if (!citiesStr) return [];

    const cities: StoredCityInfo[] = JSON.parse(citiesStr);
    return cities.filter((city) => city.name && city.name.trim() !== '');
  } catch (error) {
    console.error('Error loading cities from storage:', error);
    return [];
  }
};

export const updateCitiesList = async (
  newCityName: string,
  isHome: boolean = false,
) => {
  const existingCities = await loadCitiesFromStorage();

  const filteredCities = existingCities.filter(
    (city) => city.name.toLowerCase() !== newCityName.toLowerCase(),
  );

  const newCity: StoredCityInfo = {
    name: newCityName,
    isHome,
    addedAt: Date.now(),
  };

  let updatedCities: StoredCityInfo[];

  if (isHome) {
    const nonHomeCities = filteredCities.filter((city) => !city.isHome);
    updatedCities = [newCity, ...nonHomeCities].slice(0, MAX_CITIES);
  } else {
    const homeCity = filteredCities.find((city) => city.isHome);
    const nonHomeCities = filteredCities.filter((city) => !city.isHome);

    if (homeCity) {
      updatedCities = [homeCity, newCity, ...nonHomeCities].slice(
        0,
        MAX_CITIES,
      );
    } else {
      updatedCities = [newCity, ...nonHomeCities].slice(0, MAX_CITIES);
    }
  }

  await saveCitiesToStorage(updatedCities);
  return updatedCities;
};

export const loadWeatherForCities = async (
  cities: StoredCityInfo[],
  setWeatherCities: (weatherCities: WeatherCity[]) => void,
  setUserWeatherData: (data: WeatherData | null) => void,
) => {
  const weatherCitiesWithLoading: WeatherCity[] = cities.map((city) => ({
    name: city.name,
    data: null,
    isHome: city.isHome,
    isLoading: true,
  }));

  setWeatherCities(weatherCitiesWithLoading);

  const weatherPromises = cities.map(async (city, index) => {
    try {
      const weatherData = await getWeatherData(city.name);

      if (city.isHome && weatherData) {
        setUserWeatherData(weatherData);
      }

      return {
        name: city.name,
        data: weatherData,
        isHome: city.isHome,
        isLoading: false,
      };
    } catch (error) {
      console.error(`Failed to load weather for ${city.name}:`, error);
      return {
        name: city.name,
        data: null,
        isHome: city.isHome,
        isLoading: false,
      };
    }
  });

  const weatherResults = await Promise.all(weatherPromises);
  setWeatherCities(weatherResults);
};

export const clearWeatherCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const weatherCacheKeys = keys.filter((key) =>
      key.startsWith(WEATHER_CACHE_KEY),
    );
    await AsyncStorage.multiRemove(weatherCacheKeys);
  } catch (error) {
    console.error('Error clearing weather cache:', error);
  }
};
