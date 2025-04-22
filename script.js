function main() {
    const location = document.getElementById('location');
    const submit = document.getElementById('submit');
    const date = document.getElementById('date');
    const unitToggle = document.getElementById('unit-toggle');

    let currentUnit = 'metric';

    unitToggle.addEventListener('change', async (event) => {
        if (event.target.name === 'unit') {
            currentUnit = event.target.value; // Update the current unit
            const weatherData = await queryWeatherAPI(location.value, date.value, currentUnit);
            const processedData = processWeatherData(weatherData);
            displayWeatherReport(processedData);
        }
    });
    submit.addEventListener('click', async () => {
        const weatherData = await queryWeatherAPI(location.value, date.value, currentUnit);
        const processedData = processWeatherData(weatherData);
        displayWeatherReport(processedData);
    });
}

async function queryWeatherAPI(location, date, unitGroup = 'metric') {
    try {
        const apiKey = 'DN98JBDTZQV72SU3DULMAZF3R';
        const unitParam = unitGroup === 'metric' ? '&unitGroup=metric' : '';
        const response = await fetch (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}?key=${apiKey}${unitParam}`);
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

    // Clear only the dynamically generated content
    const existingContent = document.querySelectorAll('#outputs > :not(#unit-toggle)');
    existingContent.forEach(element => element.remove());

    if (processedData == undefined) {
        const invalidLocation = document.createElement('p');
        invalidLocation.textContent = 'Please enter a valid location';
        outputs.appendChild(invalidLocation);
    } else {
        //Determine current unit (Celsius or Fahrenheit)
        const currentUnit = document.querySelector('input[name="unit"]:checked').value;
        const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
        const windUnit = currentUnit === 'metric' ? 'km/h' : 'mph';

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
        temperatureDiv.innerHTML = `<span id="temp-value" class="temp-value">${processedData.temperature}</span><span class="temp-unit">${unitSymbol}</span>`;

        // Create real-feel element
        const realFeelDiv = document.createElement('div');
        realFeelDiv.id = 'real-feel';
        realFeelDiv.innerHTML = `RealFeel<sup>®</sup> ${processedData.feelslike}${unitSymbol}`;

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
            { id: 'windspeed', label: 'Wind', value: `${processedData.wind} ${windUnit}` },
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


document.addEventListener('DOMContentLoaded', () => {
    // Ensure the Celsius radio button is checked by default
    const celsiusRadio = document.querySelector('input[name="unit"][value="metric"]');
    celsiusRadio.checked = true;

    main();
});