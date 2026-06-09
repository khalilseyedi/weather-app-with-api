const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('.temperature');
const feelsLike = document.querySelector('.feelsLike');
const weatherStatus = document.querySelector('#weatherStatus');
const humidity = document.querySelector('#humidity');
const windSpeed = document.querySelector('#windSpeed');
const input = document.querySelector('#input');
const form = document.querySelector('#form');
const weatherIcon = document.querySelector('#weatherIcon');
const loading = document.querySelector('.loading');
const errorMessage = document.querySelector('.error-message');
const weatherCard = document.querySelector('#weather-card');

// submit form
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valueInput = input.value;
    if (valueInput === '') return;
    loading.style.display = 'block';
    fetchWeatherFromApi(valueInput);
    fetchDaysFromApi(valueInput);
    input.value = '';

});
// fetch display current weather
async function fetchWeatherFromApi(city) {
const apiUrl = `https://api.weatherapi.com/v1/current.json?key=35e2ae66779741ab90294736260306&q=${city}`
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        if (data.error){
            errorMessage.textContent = 'شهر مورد نظر یافت نشد';
            errorMessage.style.transform = 'translateY(0)';
        }else {
            const condition = data.current.condition.text.toLowerCase();
            if (condition === 'sunny' || condition === 'clear'){
                weatherCard.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('./images/sunny.png')";
            }else if (condition === 'cloudy' || condition === 'partly cloudy' || condition === 'overcast'){
                weatherCard.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('./images/cloudy.png')";
            }else if (condition.includes('rain')){
                weatherCard.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('./images/rainy.png')";
            }else if (condition.includes('snow')) {
                weatherCard.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('./images/snowy.png')";
            }
            cityName.textContent = data.location.name;
            weatherIcon.src = data.current.condition.icon;
            temperature.textContent = `${Math.round(data.current.temp_c)} °C`;
            feelsLike.textContent = `${Math.round(data.current.feelslike_c)} °C`;
            weatherStatus.textContent = data.current.condition.text;
            humidity.textContent = `${data.current.humidity}%`;
            windSpeed.textContent = `${Math.round(data.current.wind_kph)} km/h`;
            loading.style.display = 'none';
            errorMessage.style.transform = 'translateY(-140px)';
        }
    }catch (error) {
        loading.style.display = 'none';
        errorMessage.textContent = 'دریافت اطلاعات با خطا مواجه شد';
        errorMessage.style.transform = 'translateY(-10px)';

        setTimeout(()=> {
            errorMessage.style.transform = 'translateY(-140px)';
        },3000)
    }
}
fetchWeatherFromApi('Tehran');

// fetch 3-days
async function fetchDaysFromApi(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=35e2ae66779741ab90294736260306&q=${city}&days=3`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const forecastDays = data.forecast.forecastday;
        const containerForecastDays = document.querySelector('.container-forecastDays');
        containerForecastDays.innerHTML = '';
        forecastDays.forEach(forecastDay => {
            //create element
           const cardDiv = document.createElement('div');
           const daySpan = document.createElement('span');
           const statusSpan = document.createElement('span');
           const img = document.createElement('img');
           const groupDivDegree = document.createElement('div');
           const maxDegreeSpan = document.createElement('span');
           const minDegreeSpan = document.createElement('span');
            // add class
           cardDiv.classList.add('degree-avg');
           daySpan.classList.add('day');
           statusSpan.classList.add('status');
           groupDivDegree.classList.add('group-degree');
           maxDegreeSpan.classList.add('max-degree');
           minDegreeSpan.classList.add('min-degree');
            // set days
           const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
           const date = new Date(forecastDay.date)
           const dayIndex = date.getDay();

           daySpan.textContent = days[dayIndex];
           img.src = `http:${forecastDay.day.condition.icon}`;
           maxDegreeSpan.textContent = `${Math.round(forecastDay.day.maxtemp_c)}°`;
           minDegreeSpan.textContent = `${Math.round(forecastDay.day.mintemp_c)}°`;
            // append child
            containerForecastDays.appendChild(cardDiv)
            cardDiv.appendChild(daySpan)
            cardDiv.appendChild(statusSpan)
            statusSpan.appendChild(img)
            cardDiv.appendChild(groupDivDegree)
            groupDivDegree.appendChild(maxDegreeSpan)
            groupDivDegree.appendChild(minDegreeSpan)
        })
    }catch (error) {
        loading.style.display = 'none';
        errorMessage.textContent = 'دریافت اطلاعات با خطا مواجه شد';
        errorMessage.style.transform = 'translateY(-10px)';

        setTimeout(()=> {
            errorMessage.style.transform = 'translateY(-140px)';
        },3000)
    }
}
fetchDaysFromApi('Tehran');
