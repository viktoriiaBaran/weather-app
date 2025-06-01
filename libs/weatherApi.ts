export const fetchWeatherByCity = async (city: string) => {
  const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
  );
  const data = await res.json();

  if (!res.ok) throw new Error('City not found');
  return data;
};
