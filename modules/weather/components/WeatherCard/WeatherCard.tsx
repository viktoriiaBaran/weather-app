import { View, Text } from 'react-native';
import { getWeatherAnimation } from '@/modules/weather/constants/weatherIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import { WeatherData } from '../../store/types';

type WeatherCardProps = {
  data: WeatherData;
  isHome?: boolean;
};

const WeatherCard = ({ data, isHome }: WeatherCardProps) => {
  return (
    <View
      style={{
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 32,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        {isHome && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginBottom: 8,
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <FontAwesome name="location-arrow" size={16} color="#667eea" />
            <Text
              style={{
                fontSize: 14,
                color: '#667eea',
                fontWeight: '600',
                letterSpacing: 0.2,
              }}
            >
              Home
            </Text>
          </View>
        )}

        <Text
          style={{
            fontSize: 32,
            fontWeight: '800',
            color: '#1a1a1a',
            marginBottom: 4,
            letterSpacing: -0.5,
          }}
        >
          {data.name}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: '#666',
            fontWeight: '500',
            letterSpacing: 0.2,
          }}
        >
          {data.sys.country}
        </Text>
      </View>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <LottieView
          autoPlay
          style={{
            width: 120,
            height: 120,
          }}
          source={getWeatherAnimation(data.weather[0].main)}
        />

        <Text
          style={{
            fontSize: 72,
            fontWeight: '200',
            color: '#1a1a1a',
            marginBottom: 8,
            letterSpacing: -2,
          }}
        >
          {Math.round(data.main.temp)}°
        </Text>

        <Text
          style={{
            fontSize: 20,
            color: '#333',
            fontWeight: '600',
            textTransform: 'capitalize',
            letterSpacing: 0.3,
          }}
        >
          {data.weather[0].description}
        </Text>
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: 'rgba(102, 126, 234, 0.05)',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#666',
            fontWeight: '500',
            letterSpacing: 0.2,
          }}
        >
          Feels like {Math.round(data.main.feels_like)}°C
        </Text>
      </View>
    </View>
  );
};

export default WeatherCard;
