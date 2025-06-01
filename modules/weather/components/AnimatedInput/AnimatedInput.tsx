/* eslint-disable react-hooks/exhaustive-deps */
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Pressable, TextInput } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import { useWeatherStore } from '../../store/weatherStore';
import { fetchWeatherByCity } from '@/libs/weatherApi';

const DEBOUNCED_DELAY = 1000;

const AnimatedInput = ({ searchActive }: { searchActive: boolean }) => {
  const [query, setQuery] = useState('');
  const { setSearchedCity, setSearchedWeatherDataWeatherData, setIsLoading } =
    useWeatherStore();

  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const width = useSharedValue(0);

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value * 73}%`,
      opacity: width.value,
    };
  });

  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        if (searchQuery.trim().length >= 2) {
          setIsLoading(true);
          setSearchedCity(searchQuery.trim());

          try {
            const weatherData = await fetchWeatherByCity(searchQuery.trim());
            setSearchedWeatherDataWeatherData(weatherData);
          } catch (error) {
            console.error('Error fetching search weather data:', error);
            setSearchedWeatherDataWeatherData(null);
          } finally {
            setIsLoading(false);
          }
        } else {
          setSearchedCity('');
          setSearchedWeatherDataWeatherData(null);
        }
      }, DEBOUNCED_DELAY);
    },
    [setSearchedCity, setSearchedWeatherDataWeatherData, setIsLoading],
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const clearSearch = () => {
    setQuery('');
    setSearchedCity('');
    setSearchedWeatherDataWeatherData(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  useEffect(() => {
    if (searchActive) {
      width.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      width.value = withTiming(0, {
        duration: 250,
        easing: Easing.in(Easing.ease),
      });
      clearSearch();
    }
  }, [searchActive, width]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          height: 44,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 20,
          paddingHorizontal: 10,
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        },
        animatedInputStyle,
      ]}
    >
      <TextInput
        ref={inputRef}
        value={query}
        onChangeText={handleQueryChange}
        placeholder="Search city..."
        placeholderTextColor="#ccc"
        style={{
          flex: 1,
          color: 'white',
        }}
      />
      {!!query && (
        <Pressable onPress={clearSearch}>
          <AntDesign name="close" size={20} color="#fff" />
        </Pressable>
      )}
    </Animated.View>
  );
};

export default AnimatedInput;
