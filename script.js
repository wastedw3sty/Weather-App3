// Initialize the monday SDK
monday = window.mondaySdk();
monday.init();

document.getElementById('boards').addEventListener('change', function() {
    var selectedBoardId = this.value; // This will be '6388863171' or '6388863349' based on the user's selection
    updateWeatherDisplay(selectedBoardId);
});

function updateWeatherDisplay(boardId) {
    // Use the monday SDK to get items from the board
    monday.api(`query { items (ids: ${boardId}) { column_values { column { id title } id type value } } }`).then(res => {
        // Clear previous weather data
        document.getElementById('weather-display').innerHTML = '';
        // Process the response and update the display
        const locations = res.data.items.map(item => {
            // Assuming 'Location' is the title of the column that contains the location data
            const locationColumn = item.column_values.find(column => column.column.title === 'Location');
            return locationColumn.value;
        });

        // For each location, fetch the weather data and update the display
        locations.forEach(location => {
            fetchWeatherData(location, 'metric').then(weatherData => {
                var weatherElement = createWeatherElement(location, weatherData);
                document.getElementById('weather-display').appendChild(weatherElement);
            });
        });
    });
}

function fetchWeatherData(location, units) {
    // Replace 'your_weather_api_key' with your actual API key
    var weatherApiEndpoint = 'http://api.openweathermap.org/data/2.5/weather';
    var params = {
        q: location,
        appid: '356431785a03f84481f3f1c23f921c09',
        units: units
    };

    return fetch(weatherApiEndpoint + '?' + new URLSearchParams(params))
        .then(response => response.json())
        .then(data => {
            // Process the weather data
            return {
                temperature: data.main.temp,
                // Add other relevant data properties
            };
        });
}

function createWeatherElement(location, weatherData) {
    // Create HTML elements for the weather data
    var element = document.createElement('div');
    element.innerHTML = `<h3>${location}</h3><p>Temperature: ${weatherData.temperature}°${units === 'metric' ? 'C' : 'F'}</p>`;
    return element;
}

document.querySelectorAll('input[name="temp-units"]').forEach((elem) => {
    elem.addEventListener('change', function() {
        var selectedUnit = this.value; // Get the selected temperature unit
        // Call a function that updates the weather display with the new unit
        updateWeatherDisplayWithUnit(selectedUnit);
    });
});

function updateWeatherDisplayWithUnit(unit) {
    // Assuming you have a function to fetch weather data that accepts the unit as a parameter
    fetchWeatherData(unit).then(weatherData => {
        // Update the weather display with the new data
        document.getElementById('weather-display').textContent = 'Temperature: ' + weatherData.temperature + '°' + (unit === 'metric' ? 'C' : 'F');
    });
}
