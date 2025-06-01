import { View, Text } from 'react-native';
import { formatTime } from '@/modules/weather/utils/formatTime';
import { WeatherData } from '../../store/types';

const WeatherSunInfo = ({ data }: { data: WeatherData }) => {
  const getWeatherDetails = (data: WeatherData) => [
    { icon: '🌅', time: formatTime(data.sys.sunrise), label: 'Sunrise' },
    { icon: '🌇', time: formatTime(data.sys.sunset), label: 'Sunset' },
  ];

  return (
    <View
      style={{
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: '800',
          color: '#1a1a1a',
          marginBottom: 20,
          textAlign: 'center',
          letterSpacing: -0.5,
        }}
      >
        Sun
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {getWeatherDetails(data).map(({ icon, time, label }) => (
          <View
            key={label}
            style={{
              alignItems: 'center',
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              paddingVertical: 20,
              paddingHorizontal: 24,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(102, 126, 234, 0.1)',
              minWidth: 120,
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 8 }}>{icon}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#1a1a1a',
                letterSpacing: -0.3,
              }}
            >
              {time}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#666',
                fontWeight: '500',
                letterSpacing: 0.2,
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeatherSunInfo;
