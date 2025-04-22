import React, { useState } from "react";
import "./Tracker.css";
import TextField from "@mui/material/TextField";
import Button from "../Button/Button";
import Cal from "../Calendar";
import { useEffect } from "react";
import { Dayjs } from "dayjs";
import { fetchData } from "../../server/api";
import emojisList from "../../server/emojis";
import { DayMood } from "../../class/DayMood";
import { fetchWeather } from "../../server/api";
import { set } from "date-fns";

const Tracker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState();
  const [cityInput, setCityInput] = useState(""); // input box text
  const [city, setCity] = useState(""); // city to fetch data for
  const [isLightMode, setIsLightMode] = useState(false);

  const [highlightedDays, setHighlightedDays] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  const textRef = React.createRef();

  useEffect(() => {
    const day = findSelectedDay(selectedDate);
    textRef.current.value = day ? day.reason : "No reason";
  }, [textRef]);

  useEffect(() => {
    const getWeather = async () => {
      if (!city) return;
      try {
        const weather = await fetchWeather(city);
        setWeatherData(weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null); // optional: clear data on error
      }
    };
    getWeather();
  }, [city]);

  const fetchAllDays = async () => {
    try {
      const result = await fetchData("days/all");

      const dates = result.map((day) => {
        // console.log({day});
        const findEmoji = emojis.find((emoji) => emoji.id === day.emojiId);
        const mood = findEmoji ? findEmoji.emoji : "😐";
        return new DayMood(day.date[2], mood, day.reason);
      });

      setHighlightedDays(dates);
    } catch (error) {
      console.log("Failed to fetch data from API");
    }
  };

  useEffect(() => {
    fetchAllDays();
  }, []);

  console.log(highlightedDays);
  const handleDateSelected = (date) => {
    setSelectedDate(date);
  };

  const findSelectedDay = (selectedDate) => {
    let result = null;
    if (selectedDate) {
      result = highlightedDays.find(
        (item) => item.day === parseInt(selectedDate.toISOString().slice(8, 10))
      );
    }
    return result ? result : { mood: "__", reason: null };
  };

  const handleSelectMood = (emoji) => {
    if (selectedDate) {
      // Add the selected date to the list of highlighted days
      if (
        !highlightedDays.find(
          (item) =>
            item.day === parseInt(selectedDate.toISOString().slice(8, 10))
        )
      ) {
        setHighlightedDays((prevDays) => [
          ...prevDays,
          new DayMood(
            parseInt(selectedDate.toISOString().slice(8, 10)),
            emoji,
            textRef.current.value
          ),
        ]);
      } else {
        // Update the mood of the selected date
        const updatedHighlightedDays = highlightedDays.map((item) => {
          if (item.day === parseInt(selectedDate.toISOString().slice(8, 10))) {
            item.mood = emoji;
          }
          return item;
        });
        setHighlightedDays(updatedHighlightedDays);
      }
    }
  };

  return (
    <div className={isLightMode ? "Tracker light-mode" : "Tracker dark-mode"}>
    <>
      <div className="WeatherHeader">
        <TextField
          label="Enter City"
          variant="outlined"
          size="small"
          sx={{backgroundColor: "white", borderRadius: "15px"}}
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <button onClick={() => setCity(cityInput)} className="Weatherbtn">
          Get
        </button>
        <button
          className="theme-toggle-btn"
          onClick={() => setIsLightMode((prev) => !prev)}
        >
          {isLightMode ? "🌙 Dark Mode" : "🌞 Light Mode"}
        </button>
      </div>
      {weatherData && (
        <div className="WeatherInfo">
          <h4>Weather in {weatherData.name}</h4>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
          <p>{weatherData.weather[0].description}</p>
          <p>{Math.round(weatherData.main.temp)}°C</p>
        </div>
      )}

      <section id="TrackerContainer">
        <div className="MoodContainer">
          <div className="CalendarContainer">
            <Cal
              onDateSelected={handleDateSelected}
              daysToHighlight={highlightedDays}
            />
          </div>
          <div className="MoodSelector">
            <div className="title">Mood Selector</div>
            <div className="SelectedData">
              <TextField
                label="Selected Date"
                value={
                  selectedDate ? selectedDate.toISOString().substr(0, 10) : ""
                }
                disabled
              />
              <div className="MoodInSelectedDate">
                {selectedDate ? findSelectedDay(selectedDate).mood : "😊"}
              </div>
            </div>
            <div className="ButtonList">
              <Button
                text="😊"
                onSelectText={handleSelectMood.bind(null, "😊")}
              />{" "}
              <Button
                text="😴"
                onSelectText={handleSelectMood.bind(null, "😴")}
              />{" "}
              <Button
                text="☹️"
                onSelectText={handleSelectMood.bind(null, "☹️")}
              />{" "}
              <Button
                text="😁"
                onSelectText={handleSelectMood.bind(null, "😁")}
              />
              <Button
                text="😡"
                onSelectText={handleSelectMood.bind(null, "😡")}
              />
            </div>
            <TextField
              label="Reason"
              multiline
              rows={3}
              className="ReasonTextField"
              inputRef={textRef}
              InputLabelProps={{
                shrink: true, // Keep the label up when text is present
              }}
            />
          </div>
        </div>
      </section>
    </>
    </div>
  );
};

export default Tracker;
