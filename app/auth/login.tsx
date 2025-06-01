/* eslint-disable import/no-unresolved */
import { auth } from '@/libs/firebase';
import { saveSecureToken } from '@/libs/secureStorage';
import { Circle } from '@/modules/auth/components';
import TextInputItem from '@/modules/auth/components/TextInputItem/TextInputItem';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  Pressable,
  View,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const formAnim = useSharedValue(0);

  useEffect(() => {
    // Sequential entry animations
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 120 });

    setTimeout(() => {
      formAnim.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, 300);
  }, []);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Oops', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const token = await userCredential.user.getIdToken();
      await saveSecureToken(token);
    } catch (error: any) {
      console.error('Login Error:', error);

      let errorMessage = 'Login error';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        default:
          errorMessage = 'Login error. Please try again';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressBack = () => {
    router.back();
  };

  const onPressRegister = () => {
    router.push('/auth/register');
  };

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }],
    };
  });

  const animatedFormStyle = useAnimatedStyle(() => {
    const scale = interpolate(formAnim.value, [0, 1], [0.9, 1]);
    const opacity = interpolate(formAnim.value, [0, 1], [0, 1]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#667eea' }}>
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
      {/* Decorative elements */}
      <Circle
        style={{
          position: 'absolute',
          top: -50,
          right: -100,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      <Circle
        style={{
          position: 'absolute',
          bottom: -80,
          left: -60,
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[animatedContainerStyle, { width: '100%', maxWidth: 380 }]}
          >
            {/* Main container */}
            <Animated.View
              style={[
                animatedFormStyle,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 24,
                  padding: 32,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 20,
                  elevation: 10,
                },
              ]}
            >
              {/* Title */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <Text
                  style={{
                    fontSize: 32,
                    fontWeight: '800',
                    color: '#1a1a1a',
                    marginBottom: 8,
                    letterSpacing: -0.5,
                  }}
                >
                  Login 🔑
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#666',
                    textAlign: 'center',
                    letterSpacing: 0.2,
                  }}
                >
                  Sign in to your account
                </Text>
              </View>

              {/* Form */}
              <View style={{ marginBottom: 24 }}>
                <TextInputItem
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <TextInputItem
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  autoComplete="new-password"
                  autoCapitalize="none"
                />
              </View>

              {/* Login button */}
              <View style={{ marginBottom: 16 }}>
                <Pressable
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 16,
                    alignItems: 'center',
                    backgroundColor: isLoading ? '#CCE7FF' : '#007AFF',
                    shadowColor: '#007AFF',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  onPress={handleEmailLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 18,
                        fontWeight: '700',
                        letterSpacing: 0.5,
                      }}
                    >
                      Log In
                    </Text>
                  )}
                </Pressable>
              </View>

              {/* Extra actions */}
              <View style={{ alignItems: 'center', gap: 16 }}>
                <Pressable
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}
                  onPress={onPressRegister}
                >
                  <Text
                    style={{
                      color: '#007AFF',
                      fontSize: 16,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Don’t have an account? Register
                  </Text>
                </Pressable>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E5E5E5',
                    marginVertical: 8,
                  }}
                />

                <Pressable
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}
                  onPress={onPressBack}
                >
                  <Text
                    style={{
                      color: '#999',
                      fontSize: 16,
                      fontWeight: '500',
                    }}
                  >
                    ← Back
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
