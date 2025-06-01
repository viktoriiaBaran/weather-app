import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const getLocation = async (): Promise<string | undefined> => {
  try {
    const { status: currentStatus } =
      await Location.getForegroundPermissionsAsync();

    if (currentStatus === 'granted') {
      return await fetchUserCity();
    }

    const userAllowed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Access to Location',
        'This app needs access to your location to provide weather updates for your city.',
        [
          { text: 'No', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Yes', onPress: () => resolve(true) },
        ],
        { cancelable: false },
      );
    });

    if (!userAllowed) throw new Error('User denied location permission');

    const { status: newStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (newStatus !== 'granted') throw new Error('Permission denied');

    return await fetchUserCity();
  } catch (err) {
    console.warn('Location error:', err);
    return undefined;
  }
};

const fetchUserCity = async (): Promise<string> => {
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const places = await Location.reverseGeocodeAsync({ latitude, longitude });
  const place = places?.[0];

  if (!place) throw new Error('City not found');

  return place.city || place.region || 'Unknown City';
};
