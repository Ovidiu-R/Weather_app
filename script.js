

function main() {
    const city = document.getElementById('city');
    const submit = document.getElementById('submit');
    const date = document.getElementById('date');
    
    submit.addEventListener('click', queryWeatherAPI(city.value, date.value));
}

async function queryWeatherAPI(city, date) {
    try {
        const response = await fetch ('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]/[date1]/[date2]?key=YOUR_API_KEY');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log ('Error fetching data:', error);
    }
}

function processWeatherData(data) {

}

async function queryGiphyAPI(weatherType) {
    try {
        const apiKey = '';
        const query = weatherType;
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=5&offset=0&rating=g&lang=en`;
        const response = await fetch (url);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log ('Error fetching data:', error);
    }
} 