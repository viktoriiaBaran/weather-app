import { View, Text } from 'react-native';
import { WeatherData } from '../../store/types';

const WeatherDetails = ({ data }: { data: WeatherData }) => {
  const getWeatherDetails = (data: WeatherData) => [
    { icon: '💧', value: `${data.main.humidity}%`, label: 'Humidity' },
    { icon: '🌡️', value: `${data.main.pressure}`, label: 'hPa' },
    {
      icon: '💨',
      value: `${Math.round(data.wind.speed)} m/s`,
      label: 'Wind',
    },
    {
      icon: '👁️',
      value: `${(data.visibility / 1000).toFixed(1)} km`,
      label: 'Visibility',
    },
  ];

  return (
    <View
      style={{
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
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
        Detailed Information
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {getWeatherDetails(data).map(({ icon, value, label }) => (
          <View
            key={label}
            style={{
              width: '48%',
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              borderRadius: 16,
              padding: 20,
              marginBottom: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(102, 126, 234, 0.1)',
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>{icon}</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#1a1a1a',
                letterSpacing: -0.3,
              }}
            >
              {value}
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

export default WeatherDetails;
