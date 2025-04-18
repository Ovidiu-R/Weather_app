function main() {
    const location = document.getElementById('location');
    const submit = document.getElementById('submit');
    const date = document.getElementById('date');
    submit.addEventListener('click', async () => {
        const weatherData = await queryWeatherAPI(location.value, date.value);
        const processedData = processWeatherData(weatherData);
        // queryGiphyAPI(processedData.description);
        displayWeatherReport(processedData);
    });
}

async function queryWeatherAPI(location, date) {
    try {
        const apiKey = '';
        const response = await fetch (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}?key=${apiKey}&unitGroup=metric`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log ('Error fetching data:', error);
    }
}

function processWeatherData(data) {
    if (!data || !data.days || data.days.length === 0) {
        return undefined;
    } else {
        let description = '';
        if (data.days[0].description == '') {
            description = data.days[0].conditions;
        } else {
            description = data.days[0].description;
        }
        let temperature = data.days[0].temp;
        let humidity = data.days[0].humidity;
        let wind = data.days[0].windspeed;
        let precipitation = data.days[0].precipprob;
        let uvIndex = data.days[0].uvindex;
        let icon = data.days[0].icon;
        let feelslike = data.days[0].feelslike;
        return {description, temperature, humidity, wind, precipitation, uvIndex, icon, feelslike};
    }
}

function displayWeatherReport(processedData) {
    const outputs = document.getElementById('outputs');
    outputs.classList.remove('hidden'); // Make the outputs div visible
    outputs.innerHTML = ''; // Clear previous content

    if (processedData == undefined) {
        const invalidLocation = document.createElement('p');
        invalidLocation.textContent = 'Please enter a valid location';
        outputs.appendChild(invalidLocation);
    } else {
        // Create main-info container
        const mainInfoDiv = document.createElement('div');
        mainInfoDiv.id = 'main-info';

        // Create weather-icon container
        const weatherIconDiv = document.createElement('div');
        weatherIconDiv.id = 'weather-icon';
        const weatherIconImg = document.createElement('img');
        weatherIconImg.id = 'icon';
        weatherIconImg.src = `media/icons/${processedData.icon}.svg`;
        weatherIconImg.alt = processedData.description;
        weatherIconDiv.appendChild(weatherIconImg);

        // Create temps-condition container
        const tempsConditionDiv = document.createElement('div');
        tempsConditionDiv.id = 'temps-condition';

        // Create temperature element
        const temperatureDiv = document.createElement('div');
        temperatureDiv.id = 'temperature';
        temperatureDiv.innerHTML = `<span id="temp-value" class="temp-value">${processedData.temperature}</span><span class="temp-unit">°C</span>`;

        // Create real-feel element
        const realFeelDiv = document.createElement('div');
        realFeelDiv.id = 'real-feel';
        realFeelDiv.innerHTML = `RealFeel<sup>®</sup> ${processedData.feelslike}°`;

        // Create condition element
        const conditionDiv = document.createElement('div');
        conditionDiv.id = 'condition';
        conditionDiv.textContent = processedData.description;

        // Append temperature, real-feel, and condition to temps-condition
        tempsConditionDiv.appendChild(temperatureDiv);
        tempsConditionDiv.appendChild(realFeelDiv);
        tempsConditionDiv.appendChild(conditionDiv);

        // Append weather-icon and temps-condition to main-info
        mainInfoDiv.appendChild(weatherIconDiv);
        mainInfoDiv.appendChild(tempsConditionDiv);

        // Create details container
        const detailsDiv = document.createElement('div');
        detailsDiv.id = 'details';

        // Create detail items
        const details = [
            { id: 'windspeed', label: 'Wind', value: `${processedData.wind} km/h` },
            { id: 'humidity', label: 'Humidity', value: `${processedData.humidity}%` },
            { id: 'precipitation', label: 'Precipitation', value: `${processedData.precipitation}%` },
            { id: 'uvindex', label: 'UV Index', value: processedData.uvIndex },
        ];

        details.forEach(detail => {
            const detailItemDiv = document.createElement('div');
            detailItemDiv.className = 'detail-item';

            const detailLabelSpan = document.createElement('span');
            detailLabelSpan.className = 'detail-label';
            detailLabelSpan.textContent = detail.label;

            const detailValueSpan = document.createElement('span');
            detailValueSpan.id = detail.id;
            detailValueSpan.className = 'detail-value';
            detailValueSpan.textContent = detail.value;

            detailItemDiv.appendChild(detailLabelSpan);
            detailItemDiv.appendChild(detailValueSpan);
            detailsDiv.appendChild(detailItemDiv);
        });

        // Append main-info and details to outputs
        outputs.appendChild(mainInfoDiv);
        outputs.appendChild(detailsDiv);
    }
}

// async function queryGiphyAPI(weatherType) {
//     try {
//         const apiKey = '';
//         const query = weatherType;
//         const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=1&offset=0&rating=g&lang=en`;
//         const response = await fetch (url);
//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.log ('Error fetching data:', error);
//     }
// } 

document.addEventListener('DOMContentLoaded', () => {
    main();
});