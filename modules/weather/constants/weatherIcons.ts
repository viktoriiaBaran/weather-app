import ClearLottie from '@/modules/weather/assets/lottie/clear.json';
import CloudsLottie from '@/modules/weather/assets/lottie/clouds.json';
import RainLottie from '@/modules/weather/assets/lottie/rain.json';
import DrizzleLottie from '@/modules/weather/assets/lottie/drizzle.json';
import ThunderstormLottie from '@/modules/weather/assets/lottie/thunderstorm.json';
import SnowLottie from '@/modules/weather/assets/lottie/snow.json';
import MistLottie from '@/modules/weather/assets/lottie/mist.json';
import SmokeLottie from '@/modules/weather/assets/lottie/smoke.json';
import HazeLottie from '@/modules/weather/assets/lottie/haze.json';
import FogLottie from '@/modules/weather/assets/lottie/fog.json';

const weatherData = {
  Clear: { icon: '☀️', animation: ClearLottie },
  Clouds: { icon: '☁️', animation: CloudsLottie },
  Rain: { icon: '🌧️', animation: RainLottie },
  Drizzle: { icon: '🌦️', animation: DrizzleLottie },
  Thunderstorm: { icon: '⛈️', animation: ThunderstormLottie },
  Snow: { icon: '❄️', animation: SnowLottie },
  Mist: { icon: '🌫️', animation: MistLottie },
  Smoke: { icon: '🌫️', animation: SmokeLottie },
  Haze: { icon: '🌫️', animation: HazeLottie },
  Dust: { icon: '🌫️', animation: FogLottie },
  Fog: { icon: '🌫️', animation: FogLottie },
  Sand: { icon: '🌫️', animation: FogLottie },
  Ash: { icon: '🌫️', animation: FogLottie },
  Squall: { icon: '💨', animation: RainLottie },
  Tornado: { icon: '🌪️', animation: ThunderstormLottie },
} as const;

type WeatherMain = keyof typeof weatherData;

export const getWeatherIcon = (weatherMain: string) => {
  return weatherData[weatherMain as WeatherMain]?.icon || '🌤️';
};

export const getWeatherAnimation = (weatherMain: string) => {
  return weatherData[weatherMain as WeatherMain]?.animation || ClearLottie;
};
