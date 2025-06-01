import { View } from 'react-native';

type CircleProps = {
  style?: object;
};
const Circle = ({ style }: CircleProps) => {
  return <View style={style} />;
};

export default Circle;
