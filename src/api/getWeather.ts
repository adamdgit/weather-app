import axios from "axios"

export type currentWeatherParams = {
  temperature: number, 
  time: number,
  windspeed: number,
  winddirection: number,
  weathercode: number 
}

export type hourlyWeatherParams = {
  temperature_2m: number[],
  apparent_temperature: number[],
  precipitation: number[],
  relativehumidity_2m: number[],
  time: string[],
  weathercode: number[]
}

export type dailyWeatherParams = {
  temperature_2m_max: number[],
  temperature_2m_min: number[],
  apparent_temperature_max: number[],
  apparent_temperature_min: number[],
  precipitation_sum: number[],
  time: string[],
  weathercode: number[]
}

export function getWeather(lat:number, lon:number, timezone:string) {

  return axios.get('https://api.open-meteo.com/v1/forecast?&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode&daily=weathercode,apparent_temperature_max,apparent_temperature_min,temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true', {
    params: {
      latitude: lat,
      longitude: lon,
      timezone,
    }
  }).then(({data}) => {
    return {
      current: parseCurrentWeather(data),
      daily: parseDailyWeather(data),
      hourly: parseHourlyWeather(data), 
    }
  })
}

function parseCurrentWeather({ current_weather, daily } : 
  { current_weather:currentWeatherParams, daily:dailyWeatherParams }) {

  const { 
    temperature: currentTemp, 
    windspeed: windSpeed,
    weathercode: weatherCode 
  } = current_weather
  const { 
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLIke: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precipitation: Math.round(precip * 100) / 100,
    weatherCode: Math.round(weatherCode)
  }
}

function parseDailyWeather({ daily } : { daily:dailyWeatherParams }) {
  return daily.time.map((time, index) => (
    {
      timestamp: time,
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index])
    }
  ))
} 

function parseHourlyWeather({ hourly, current_weather } : 
  { hourly: hourlyWeatherParams, current_weather:currentWeatherParams }) {
  return hourly.time.map((time, index) => (
    {
      timestamp: time,
      iconCode: hourly.weathercode[index],
      precipitation: hourly.precipitation[index],
      humidity: hourly. relativehumidity_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      temp: hourly.temperature_2m[index]
    }
  )).filter(({ timestamp }) => {
    // returns current days hourly weather updates
    const date = new Date(current_weather.time).getDay()
    const date2 = new Date(timestamp).getDay()
    if (date2 === date) return timestamp
  })
}