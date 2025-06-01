import { ErrorBoundary } from '@/components';
import { auth } from '@/libs/firebase';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { getLocation } from '@/utils/location';
import { Slot, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function RootLayout() {
  const { user, setUser, isLoading, setLoading, setUserCity } = useAuthStore();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);

      if (!state.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
        );
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          emailVerified: firebaseUser.emailVerified,
        };

        setUser(user);

        try {
          const userCity = await getLocation();
          setUserCity(userCity as string);
        } catch (error) {
          console.error('Failed to get location:', error);
          setUserCity('Kyiv');
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setUserCity]);

  useEffect(() => {
    if (!isMounted || isLoading || !isConnected) {
      return;
    }

    const navigationTimeout = setTimeout(() => {
      try {
        if (user) {
          router.replace('/weather');
        } else {
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setTimeout(() => {
          try {
            if (user) {
              router.replace('/weather');
            } else {
              router.replace('/auth');
            }
          } catch (retryError) {
            console.error('Retry navigation failed:', retryError);
          }
        }, 500);
      }
    }, 100);

    return () => clearTimeout(navigationTimeout);
  }, [isMounted, user, isLoading, isConnected, router]);

  if (!isMounted || !isConnected || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#667eea',
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
          }}
        >
          {!isConnected ? 'No Internet Connection' : 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Slot />
    </ErrorBoundary>
  );
}
