import { useRouter } from 'expo-router';
import { Text, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { AnimatedButton, Circle } from '@/modules/auth/components';

export default function AuthIndexScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressLogin = () => {
    router.push('/auth/login');
  };

  const onPressRegister = () => {
    router.push('/auth/register');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#667eea',
      }}
    >
      {/* Gradient overlay effect */}
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

      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Decorative circles */}
        <Circle
          style={{
            position: 'absolute',
            top: 100,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Circle
          style={{
            position: 'absolute',
            bottom: 200,
            left: -80,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          }}
        />

        {/* Main content */}
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 24,
            padding: 32,
            width: '100%',
            maxWidth: 340,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontWeight: '800',
              color: '#1a1a1a',
              marginBottom: 8,
              textAlign: 'center',
              letterSpacing: -0.5,
            }}
          >
            Greeting! 👋
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: '#666',
              textAlign: 'center',
              marginBottom: 40,
              lineHeight: 24,
              letterSpacing: 0.2,
            }}
          >
            Log in to your account or create a new one to access all features of
            our app.
          </Text>

          <View style={{ width: '100%' }}>
            <AnimatedButton
              onPress={onPressLogin}
              title="Log In"
              variant="primary"
            />

            <AnimatedButton
              onPress={onPressRegister}
              title="Sign Up"
              variant="secondary"
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
