import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  interpolate,
} from 'react-native-reanimated';

type AnimatedButtonProps = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
};

const AnimatedButton = ({
  onPress,
  title,
  variant = 'primary',
}: AnimatedButtonProps) => {
  const pressed = useSharedValue(0);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    pressed.value = withSpring(1, { damping: 15, stiffness: 300 });
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, { damping: 15, stiffness: 300 });
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const isPrimary = variant === 'primary';

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      marginBottom: 16,
    };
  });

  const animatedButtonStyle = useAnimatedStyle(() => {
    const backgroundColor = isPrimary
      ? interpolateColor(pressed.value, [0, 1], ['#007AFF', '#0056CC'])
      : interpolateColor(pressed.value, [0, 1], ['white', '#F0F8FF']);

    const borderColor = interpolateColor(
      pressed.value,
      [0, 1],
      ['#007AFF', '#0056CC'],
    );

    const shadowOpacity = interpolate(pressed.value, [0, 1], [0.25, 0.15]);
    const shadowRadius = interpolate(pressed.value, [0, 1], [6, 3]);
    const elevation = interpolate(pressed.value, [0, 1], [4, 2]);

    return {
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 16,
      alignItems: 'center',
      backgroundColor,
      borderWidth: isPrimary ? 0 : 2,
      borderColor,
      shadowColor: '#007AFF',
      shadowOffset: {
        width: 0,
        height: interpolate(pressed.value, [0, 1], [4, 2]),
      },
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const textColor = isPrimary
      ? 'white'
      : interpolateColor(pressed.value, [0, 1], ['#007AFF', '#0056CC']);

    return {
      color: textColor,
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
    };
  });

  return (
    <Animated.View style={animatedContainerStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={animatedButtonStyle}>
          <Animated.Text style={animatedTextStyle}>{title}</Animated.Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedButton;
