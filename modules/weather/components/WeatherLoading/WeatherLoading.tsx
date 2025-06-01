import { View, Text, StatusBar, ActivityIndicator } from 'react-native';

const WeatherLoading = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#667eea',
    }}
  >
    <StatusBar barStyle="light-content" backgroundColor="#667eea" />

    {/* Gradient overlay */}
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

    <View
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      <ActivityIndicator
        size="large"
        color="#667eea"
        style={{ marginBottom: 16 }}
      />
      <Text
        style={{
          fontSize: 18,
          color: '#1a1a1a',
          fontWeight: '600',
          letterSpacing: 0.2,
        }}
      >
        Loading weather...
      </Text>
    </View>
  </View>
);

export default WeatherLoading;
