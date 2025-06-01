import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedInput from '../AnimatedInput/AnimatedInput';

const WeatherHeader = () => {
  const { top: topInset } = useSafeAreaInsets();
  const [searchActive, setSearchActive] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: topInset + 10,
        paddingHorizontal: 20,
        paddingBottom: searchActive ? 28 : 20,
        justifyContent: 'space-between',
      }}
    >
      <AnimatedInput searchActive={searchActive} />
      {searchActive ? (
        <Pressable
          onPress={() => setSearchActive(false)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              letterSpacing: 0.3,
            }}
          >
            Cancel
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => setSearchActive(true)}
          style={{
            padding: 14,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <AntDesign name="search1" size={24} color="white" />
        </Pressable>
      )}
    </View>
  );
};

export default WeatherHeader;
