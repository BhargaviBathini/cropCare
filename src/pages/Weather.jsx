import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Weather = () => {
  const { t, i18n } = useTranslation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState("Hyderabad"); // Default location
  const [translatedCity, setTranslatedCity] = useState("Hyderabad");

  const API_KEY = "40d5b83687e0e04ee5755b93d6157883"; // Replace with your OpenWeather API key

  useEffect(() => {
    fetchWeather(location);
  }, []);

  // Fetch Current Weather
  const fetchWeather = async (city) => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod === 200) {
        setWeatherData(weatherData);
        fetchForecast(city); // Fetch 7-day forecast
        setTranslatedCity(t(`cities.${city}`, city)); // Translate City Name
      } else {
        setWeatherData(null);
        setForecastData([]);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData(null);
      setForecastData([]);
    }
  };

  // Fetch 7-day Forecast
  const fetchForecast = async (city) => {
    try {
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();

      if (forecastData.cod === "200") {
        const dailyData = processForecastData(forecastData.list);
        setForecastData(dailyData);
      } else {
        setForecastData([]);
      }
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecastData([]);
    }
  };

  // Process Forecast Data (Converting 3-hour intervals into daily averages)
  const processForecastData = (data) => {
    const dailyTemps = {};
    
    data.forEach((entry) => {
      const date = new Date(entry.dt * 1000).toLocaleDateString(i18n.language);
      if (!dailyTemps[date]) {
        dailyTemps[date] = {
          tempSum: 0,
          count: 0,
          icon: entry.weather[0].icon,
          description: t(`weather.${entry.weather[0].description}`, entry.weather[0].description),
        };
      }
      dailyTemps[date].tempSum += entry.main.temp;
      dailyTemps[date].count += 1;
    });

    return Object.keys(dailyTemps).slice(0, 7).map((date) => ({
      date,
      temp: (dailyTemps[date].tempSum / dailyTemps[date].count).toFixed(1),
      icon: dailyTemps[date].icon,
      description: dailyTemps[date].description,
    }));
  };

  return (
    <Container className="mt-5 text-center">
      <h2>{t("weather.title")}</h2>
      <p>{t("weather.subtitle")}</p>

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder={t("weather.placeholder")}
        className="form-control w-50 mx-auto"
      />
      <Button variant="primary" className="mt-2" onClick={() => fetchWeather(location)}>
        {t("weather.getWeather")}
      </Button>

      {weatherData ? (
        <>
          {/* Real-Time Weather */}
          <Card className="mt-3 p-3">
            <h4>
              {translatedCity}, {weatherData.sys.country}
            </h4>
            <h5>{t(`weather.${weatherData.weather[0].description}`, weatherData.weather[0].description)}</h5>
            <h3>{weatherData.main.temp}°C</h3>
            <p>{t("weather.humidity")}: {weatherData.main.humidity}%</p>
            <p>{t("weather.windSpeed")}: {weatherData.wind.speed} m/s</p>
          </Card>

          {/* 7-Day Forecast */}
          <h3 className="mt-4">{t("weather.forecastTitle")}</h3>
          <Row>
            {forecastData.map((day, index) => (
              <Col key={index} md={3} className="mb-3">
                <Card className="p-3 text-center">
                  <Card.Title>{day.date}</Card.Title>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.icon}.png`}
                    alt={day.description}
                    width="50"
                  />
                  <Card.Text>
                    🌡️ {day.temp}°C <br />
                    🌧️ {day.description} <br />
                  </Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <p className="mt-3 text-danger">{t("weather.noData")}</p>
      )}
    </Container>
  );
};

export default Weather;
