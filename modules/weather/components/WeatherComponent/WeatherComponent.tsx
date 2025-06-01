import { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  Text,
  Dimensions,
  FlatList,
  ViewToken,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/modules/auth/store/authStore';
import {
  WeatherCard,
  WeatherDetails,
  WeatherHeader,
  WeatherLoading,
  WeatherSunInfo,
} from '..';
import { useWeatherStore } from '../../store/weatherStore';
import Entypo from '@expo/vector-icons/Entypo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAuth, signOut } from 'firebase/auth';
import { WeatherData } from '../../store/types';
import { StoredCityInfo, WeatherCity } from './types';
import { CITIES_STORAGE_KEY, MAX_CITIES } from '../../constants';
import {
  cacheWeatherData,
  clearWeatherCache,
  getWeatherData,
  loadCitiesFromStorage,
  loadWeatherForCities,
  saveCitiesToStorage,
  updateCitiesList,
} from '../../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Weather = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { setUserWeatherData, searchedWeatherData, searchedCity } =
    useWeatherStore();

  const backgroundColor = '#667eea';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [weatherCities, setWeatherCities] = useState<WeatherCity[]>([]);
  const flatListRef = useRef<FlatList<WeatherCity>>(null);

  useEffect(() => {
    const initializeWeather = async () => {
      const homeCityName = user?.userCity || 'Home';

      let savedCities = await loadCitiesFromStorage();

      const hasHomeCity = savedCities.some((city) => city.isHome);

      if (!hasHomeCity || savedCities.length === 0) {
        savedCities = await updateCitiesList(homeCityName, true);
      } else {
        const currentHomeCity = savedCities.find((city) => city.isHome);
        if (currentHomeCity && currentHomeCity.name !== homeCityName) {
          const nonHomeCities = savedCities.filter((city) => !city.isHome);
          const updatedCities: StoredCityInfo[] = [
            { name: homeCityName, isHome: true, addedAt: Date.now() },
            ...nonHomeCities,
          ].slice(0, MAX_CITIES);

          await saveCitiesToStorage(updatedCities);
          savedCities = updatedCities;
        }
      }

      await loadWeatherForCities(
        savedCities,
        setWeatherCities,
        setUserWeatherData,
      );
    };

    initializeWeather();
  }, [user?.userCity]);

  useEffect(() => {
    const handleSearchedCity = async () => {
      if (!searchedCity) return;

      const updatedCities = await updateCitiesList(searchedCity, false);

      const weatherCitiesWithLoading: WeatherCity[] = updatedCities.map(
        (city, index) => {
          const existingCity = weatherCities.find(
            (c) => c.name.toLowerCase() === city.name.toLowerCase(),
          );

          return {
            name: city.name,
            data: index === 1 ? null : existingCity?.data || null,
            isHome: city.isHome,
            isLoading: index === 1,
          };
        },
      );

      setWeatherCities(weatherCitiesWithLoading);
      setCurrentIndex(1);

      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 1, animated: true });
      }, 100);

      try {
        let weatherData: WeatherData | null;

        if (
          searchedWeatherData &&
          searchedWeatherData.name.toLowerCase() === searchedCity.toLowerCase()
        ) {
          weatherData = searchedWeatherData;
          await cacheWeatherData(searchedCity, searchedWeatherData);
        } else {
          weatherData = await getWeatherData(searchedCity);
        }

        setWeatherCities((prev) =>
          prev.map((city, index) =>
            index === 1
              ? { ...city, data: weatherData, isLoading: false }
              : city,
          ),
        );
      } catch (error) {
        console.error('Error loading searched city weather:', error);

        setWeatherCities((prev) =>
          prev.map((city, index) =>
            index === 1 ? { ...city, data: null, isLoading: false } : city,
          ),
        );
      }
    };

    handleSearchedCity();
  }, [searchedCity, searchedWeatherData]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index;
        if (index !== null) {
          setCurrentIndex(index);
        }
      }
    },
  ).current;

  const onPressLogOut = async () => {
    await AsyncStorage.removeItem(CITIES_STORAGE_KEY);
    await clearWeatherCache();
    signOut(getAuth());
    setWeatherCities([]);
    setUserWeatherData(null);
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderWeatherPage = ({
    item,
  }: {
    item: WeatherCity;
    index: number;
  }) => {
    if (item.isLoading) {
      return (
        <View style={{ width: SCREEN_WIDTH }}>
          <WeatherLoading />
        </View>
      );
    }

    if (!item.data) {
      return (
        <View style={{ width: SCREEN_WIDTH, paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: 24,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: '#1a1a1a',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
                letterSpacing: 0.2,
              }}
            >
              Could not load weather data for {item.name}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <ScrollView
        style={{ width: SCREEN_WIDTH }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View style={{ paddingHorizontal: 0 }}>
          <WeatherCard data={item.data} isHome={item.isHome} />
          <WeatherDetails data={item.data} />
          <WeatherSunInfo data={item.data} />
        </View>
      </ScrollView>
    );
  };

  if (weatherCities.length === 0) {
    return <WeatherLoading />;
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(102, 126, 234, 0.9)',
        }}
      />

      <WeatherHeader />

      {/* Indicators */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          gap: 8,
        }}
      >
        {weatherCities.map((_, index) => (
          <View
            key={index}
            style={{
              width: currentIndex === index ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                currentIndex === index
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={weatherCities}
        renderItem={renderWeatherPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      <View
        style={{
          position: 'absolute',
          bottom: bottomInset,
          right: 20,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={onPressLogOut}
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.7,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Entypo name="log-out" size={24} color="#E14040" />
        </Pressable>
      </View>
    </View>
  );
};

export default Weather;
