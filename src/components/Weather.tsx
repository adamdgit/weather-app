import { useEffect, useState } from "react"
import { getWeather } from "../api/getWeather"

type currentWeatherParams = {
  currentTemp: number,
  highTemp:number,
  lowTemp: number,
  highFeelsLike: number,
  lowFeelsLIke: number,
  windSpeed: number,
  precipitation: number,
  weatherCode: number
}

interface dailyWeatherParams {
  timestamp: string,
  iconCode: number,
  maxTemp: number
}

interface hourlyWeatherParams {
  timestamp: string,
  iconCode: number,
  precipitation: number,
  humidity: number,
  feelsLike: number,
  temp: number
}

export default function Weather() {

  const [currentWeather, setCurrentWeather] = useState<currentWeatherParams | undefined>(undefined)
  const [dailyWeather, setDailyWeather] = useState<dailyWeatherParams[] | undefined>(undefined)
  const [hourlyWeather, setHourlyWeather] = useState<hourlyWeatherParams[] | undefined>(undefined)

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(position, positionError)

    function position({ coords }) {
      console.log(coords)
      // get weather on mount
      getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone)
      .then(data => {
        setCurrentWeather(data.current)
        setDailyWeather(data.daily)
        setHourlyWeather(data.hourly)
        console.log(data)
      })
    }

    function positionError() {
      alert("Error getting location.")
    }

  },[])

  // returns associated svg from a given code
  function getWeatherCodeIcon(code:number | undefined) {

    if (code === undefined) return
    const weatherOptions = {
      clear: [0],
      cloudSunny: [1,2],
      cloudy: [3],
      fog: [45,48],
      snowy: [71,73,75,77,85,86],
      lightRain: [51,53,55,56,57,61,66,80],
      heavyRain: [63,65,67,81,82],
      lightning: [95,96,99]
    }

    if (weatherOptions.clear.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 512 512"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM352 256c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128z"/></svg>
    }
    if (weatherOptions.cloudy.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 640 512"><path d="M0 336c0 79.5 64.5 144 144 144H512c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"/></svg>
    }
    if (weatherOptions.cloudSunny.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 640 512"><path d="M122.4 1.2C127.6-.9 133.4-.2 137.9 3l70.3 50.3L278.5 3c4.5-3.2 10.3-3.9 15.4-1.8s8.8 6.7 9.7 12.2l14.1 85.3L403 112.8c5.4 .9 10.1 4.6 12.2 9.7s1.4 10.9-1.8 15.4l-38.8 54.3c-2.2-.1-4.3-.2-6.5-.2c-23.2 0-45 6.2-63.8 17c.1-12.5-2.2-25.3-7.3-37.6c-20.3-49-76.4-72.2-125.4-52s-72.2 76.4-52 125.4c18.3 44.3 66 67.5 111.1 56.6c-36.3 18.2-62.8 53.3-69.1 94.9l-23.6 16.9c-4.5 3.2-10.3 3.9-15.4 1.8s-8.8-6.7-9.7-12.2L98.7 317.7 13.4 303.6c-5.5-.9-10.1-4.6-12.2-9.7S-.2 282.9 3 278.5l50.3-70.3L3 137.9c-3.2-4.5-3.9-10.3-1.8-15.4s6.7-8.8 12.2-9.7L98.7 98.7l14.1-85.3c.9-5.5 4.6-10.1 9.7-12.2zM149 232.7c-13.5-32.7 2-70.1 34.6-83.6s70.1 2 83.6 34.6s-2 70.1-34.6 83.6s-70.1-2-83.6-34.6zM639.9 431.9c0 44.2-35.8 80-80 80H288c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"/></svg>
    }
    if (weatherOptions.fog.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 640 512"><path d="M32 144c0 79.5 64.5 144 144 144H299.3c22.6 19.9 52.2 32 84.7 32s62.1-12.1 84.7-32H496c61.9 0 112-50.1 112-112s-50.1-112-112-112c-10.7 0-21 1.5-30.8 4.3C443.8 27.7 401.1 0 352 0c-32.6 0-62.4 12.2-85.1 32.3C242.1 12.1 210.5 0 176 0C96.5 0 32 64.5 32 144zM616 368H280c-13.3 0-24 10.7-24 24s10.7 24 24 24H616c13.3 0 24-10.7 24-24s-10.7-24-24-24zm-64 96H440c-13.3 0-24 10.7-24 24s10.7 24 24 24H552c13.3 0 24-10.7 24-24s-10.7-24-24-24zm-192 0H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24zM224 392c0-13.3-10.7-24-24-24H96c-13.3 0-24 10.7-24 24s10.7 24 24 24H200c13.3 0 24-10.7 24-24z"/></svg>
    }
    if (weatherOptions.snowy.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 448 512"><path d="M224 0c17.7 0 32 14.3 32 32V62.1l15-15c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-49 49v70.3l61.4-35.8 17.7-66.1c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4l-5.2 19.3 23.6-13.8c15.3-8.9 34.9-3.7 43.8 11.5s3.7 34.9-11.5 43.8l-25.3 14.8 21.7 5.8c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-67.7-18.1L287.5 256l60.9 35.5 67.7-18.1c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4l-21.7 5.8 25.3 14.8c15.3 8.9 20.4 28.5 11.5 43.8s-28.5 20.4-43.8 11.5l-23.6-13.8 5.2 19.3c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-17.7-66.1L256 311.7v70.3l49 49c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V449.9l-15 15c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l49-49V311.7l-61.4 35.8-17.7 66.1c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4l5.2-19.3L48.1 395.6c-15.3 8.9-34.9 3.7-43.8-11.5s-3.7-34.9 11.5-43.8l25.3-14.8-21.7-5.8c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l67.7 18.1L160.5 256 99.6 220.5 31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4l21.7-5.8L15.9 171.6C.6 162.7-4.5 143.1 4.4 127.9s28.5-20.4 43.8-11.5l23.6 13.8-5.2-19.3c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l17.7 66.1L192 200.3V129.9L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l15 15V32c0-17.7 14.3-32 32-32z"/></svg>
    }
    if (weatherOptions.lightRain.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 512 512"><path d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H96zm-6.8 52c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L89.2 372zm160 0c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3L249.2 372zm124.9 64.6L409.2 372c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3v3c0 26.5-21.5 48-48 48s-48-21.5-48-48v-3c0-8.5 2.1-16.9 6.2-24.3z"/></svg>
    }
    if (weatherOptions.heavyRain.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 576 512"><path d="M128 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C96.7 126.1 96 119.1 96 112C96 50.1 146.1 0 208 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96H128zm-14.5 33.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm120 0c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6zm244.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6s17.8 19.3 12.6 31.5zM345.5 353.9c12.2 5.2 17.8 19.3 12.6 31.5l-48 112c-5.2 12.2-19.3 17.8-31.5 12.6s-17.8-19.3-12.6-31.5l48-112c5.2-12.2 19.3-17.8 31.5-12.6z"/></svg>
    }
    if (weatherOptions.lightning.includes(code)) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="currentcolor" viewBox="0 0 512 512"><path d="M0 224c0 53 43 96 96 96h47.2L290 202.5c17.6-14.1 42.6-14 60.2 .2s22.8 38.6 12.8 58.8L333.7 320H352h64c53 0 96-43 96-96s-43-96-96-96c-.5 0-1.1 0-1.6 0c1.1-5.2 1.6-10.5 1.6-16c0-44.2-35.8-80-80-80c-24.3 0-46.1 10.9-60.8 28C256.5 24.3 219.1 0 176 0C114.1 0 64 50.1 64 112c0 7.1 .7 14.1 1.9 20.8C27.6 145.4 0 181.5 0 224zm330.1 3.6c-5.8-4.7-14.2-4.7-20.1-.1l-160 128c-5.3 4.2-7.4 11.4-5.1 17.8s8.3 10.7 15.1 10.7h70.1L177.7 488.8c-3.4 6.7-1.6 14.9 4.3 19.6s14.2 4.7 20.1 .1l160-128c5.3-4.2 7.4-11.4 5.1-17.8s-8.3-10.7-15.1-10.7H281.9l52.4-104.8c3.4-6.7 1.6-14.9-4.2-19.6z"/></svg>
    }

  }

  return (
    <>
      <header>
        <div className="weather-today">
          <h2>Today</h2>
          {getWeatherCodeIcon(currentWeather?.weatherCode)}
          <span className="current-temp">{currentWeather?.currentTemp} &deg;</span>
        </div>
        <div className="weather-today-info">
          <div><span className="info">High: </span>{currentWeather?.highTemp} &deg;</div>
          <div><span className="info">Low: </span>{currentWeather?.lowTemp} &deg;</div>
          <div><span className="info">Feels like high: </span>{currentWeather?.highFeelsLike} &deg;</div>
          <div><span className="info">Feels like Low: </span>{currentWeather?.lowFeelsLIke} &deg;</div>
          <div><span className="info">Wind: </span>{currentWeather?.windSpeed} Km/h</div>
          <div><span className="info">Precipitation: </span>{currentWeather?.precipitation} mm</div>
        </div>
      </header>

      <main>
        <span className="weekly-heading">Weekly forecast</span>
        <section className="weekly-info">
        {
          dailyWeather?.map(day => {
            return <div key={day.timestamp} className="daily-info">
              <span>{new Date(day.timestamp).toLocaleString("en-AU", { weekday: 'long' })}</span>
              {getWeatherCodeIcon(day.iconCode)}
              <span>Max: {day.maxTemp} &deg;</span>
            </div>
          })
        }
        </section>
        <span className="weekly-heading">Hourly forecast</span>
        <section className="hourly-info">
        {
          hourlyWeather?.map(hour => {
            return <div className="hour-wrap">
              <span className="info">{new Date(hour.timestamp).toLocaleTimeString("en-AU", { hour: '2-digit', minute: '2-digit' })}</span>
              <div><span className="info"></span>{hour?.temp} &deg;</div>
              {getWeatherCodeIcon(hour.iconCode)}
              <div><span className="info">Humidity: </span>{hour?.humidity} &deg;</div>
            </div>
          })
        }
        </section>
      </main>
    </>
  )
}