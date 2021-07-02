function formatDate(date, timezone) {
  let localOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
  let targetOffsetInMs = timezone * 1000;
  let targetTimestamp = date.getTime() + localOffsetInMs + targetOffsetInMs;
  let localDate = new Date(targetTimestamp);

  let hours = localDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = localDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = localDate.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day}, ${hours}:${minutes}`;
}

function displayWeatherCondition(response) {
  let cityElement = document.querySelector("#city");
  let tempElement = document.querySelector("#temperature");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  cityElement.innerHTML = response.data.name;
  tempElement.innerHTML = Math.round(response.data.main.temp);
  descriptionElement.innerHTML = response.data.weather[0].main;
  lowElement.innerHTML = Math.round(response.data.main.temp_min);
  highElement.innerHTML = Math.round(response.data.main.temp_max);
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  dateElement.innerHTML = formatDate(new Date(), response.data.timezone);
  iconElement.setAttribute("alt", response.data.weather[0].main);
  iconElement.setAttribute(
    "src",
    `src/img/${response.data.weather[0].icon}.png`
  );
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  let tempMax = document.querySelector("#temp-max");
  let tempMin = document.querySelector("#temp-min");

  console.log(response.data.city.timezone);

  for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    tempMax = forecast.main.temp_max;
    tempMin = forecast.main.temp_min;

    forecastElement.innerHTML += ` <div class="col">
      <h3>
       <div class="hourly-forecast">
       ${formatHours(forecast.dt * 1000)}
       </div>
       </h3>
      <div class="forecast-icons">
      <img 
      src= "src/img/${forecast.weather[0].icon}.png" />
       </div>
      <div class="highs-lows">
     <strong> <span id="temp-max">${Math.round(tempMax)}</span>°
     </strong> 
     <span id="temp-min">${Math.round(tempMin)}</span>°
     </div>
      </div>`;
  }
}

function search(city) {
  let apiKey = "51464853d37e6a5193246383448ff81f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#search-form");
  search(cityInputElement.value);
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(celsiusTemperature);

  let forecastMax = document.querySelectorAll("#temp-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;

    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });
  let forecastMin = document.querySelectorAll("#temp-min");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });
  celsiusLink.removeEventListener("click", showCelsiusTemperature);
  fahrenheitLink.addEventListener("click", showFahrenheitTemperature);
}

function showFahrenheitTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemperature);

  let forecastMax = document.querySelectorAll("#temp-max");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll("#temp-min");

  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });
  celsiusLink.addEventListener("click", showCelsiusTemperature);
  fahrenheitLink.removeEventListener("click", showFahrenheitTemperature);
}

let form = document.querySelector(".search-form");
form.addEventListener("submit", handleSubmit);

let celsiusTemperature = null;

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

search("Philadelphia");
