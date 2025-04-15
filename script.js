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
        return {description, temperature};
    }
}

function displayWeatherReport(processedData) {
    const outputs = document.getElementById('outputs');
    outputs.innerHTML = '';
    if (processedData == undefined) {
        const invalidLocation = document.createElement('p');
        invalidLocation.textContent = 'Please enter a valid location';
        outputs.append(invalidLocation);
    } else {
        const temp = document.createElement('p');
        temp.textContent = processedData.temperature;
        const description = document.createElement('p');
        description.textContent = processedData.description;
        outputs.append(temp, description);
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

main();