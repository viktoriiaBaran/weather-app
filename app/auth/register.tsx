/* eslint-disable import/no-unresolved */
import { auth } from '@/libs/firebase';
import { Circle } from '@/modules/auth/components';
import TextInputItem from '@/modules/auth/components/TextInputItem/TextInputItem';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  Pressable,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Animations
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(50);
  const formAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 120 });

    setTimeout(() => {
      formAnim.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, 300);
  }, []);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      if (displayName.trim()) {
        await updateProfile(userCredential.user, {
          displayName: displayName.trim(),
        });
      }

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/weather') },
      ]);
    } catch (error: any) {
      console.error('Registration Error:', error);

      let errorMessage = 'Registration failed';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = 'Registration failed. Please try again';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressBack = () => {
    router.back();
  };

  const onPressLogin = () => {
    router.push('/auth/login');
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
    <View style={{ flex: 1, backgroundColor: '#764ba2' }}>
      {/* Gradient overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(118, 75, 162, 0.9)',
        }}
      />

      {/* Decorative elements */}
      <Circle
        style={{
          position: 'absolute',
          top: 80,
          right: -80,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
        }}
      />
      <Circle
        style={{
          position: 'absolute',
          bottom: 100,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
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
            paddingTop: 60,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[animatedContainerStyle, { width: '100%', maxWidth: 380 }]}
          >
            <Animated.View
              style={[
                animatedFormStyle,
                {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 24,
                  padding: 32,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 10 },
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
                  Register ✨
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#666',
                    textAlign: 'center',
                    letterSpacing: 0.2,
                  }}
                >
                  Create a new account
                </Text>
              </View>

              {/* Form */}
              <View style={{ marginBottom: 24 }}>
                <TextInputItem
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Name (optional)"
                  autoCapitalize="words"
                  autoComplete="name"
                />

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

                <TextInputItem
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  secureTextEntry
                  autoComplete="new-password"
                  autoCapitalize="none"
                />
              </View>

              {/* Password hint */}
              <View
                style={{
                  backgroundColor: '#F0F8FF',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 20,
                  borderLeftWidth: 4,
                  borderLeftColor: '#007AFF',
                }}
              >
                <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>
                  💡 Password must be at least 6 characters long
                </Text>
              </View>

              {/* Register button */}
              <View style={{ marginBottom: 16 }}>
                <Pressable
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 16,
                    alignItems: 'center',
                    backgroundColor: isLoading ? '#E0B3FF' : '#8A2BE2',
                    shadowColor: '#8A2BE2',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 6,
                    elevation: 4,
                  }}
                  onPress={handleRegister}
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
                      Register
                    </Text>
                  )}
                </Pressable>
              </View>

              {/* Additional actions */}
              <View style={{ alignItems: 'center', gap: 16 }}>
                <Pressable
                  style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                  onPress={onPressLogin}
                >
                  <Text
                    style={{
                      color: '#8A2BE2',
                      fontSize: 16,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Already have an account? Log in
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
                  style={{ paddingVertical: 12, paddingHorizontal: 16 }}
                  onPress={onPressBack}
                >
                  <Text
                    style={{
                      color: '#666',
                      fontSize: 15,
                      textAlign: 'center',
                    }}
                  >
                    Back
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
