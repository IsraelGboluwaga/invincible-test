const weatherApiBaseUrl = 'community-open-weather-map.p.rapidapi.com'

const endpoints = {
	apiHost: weatherApiBaseUrl,
	// zip code and postal code are practically the same
	getCityAndStateByZipCode: `${weatherApiBaseUrl}/zipinfo`,
	getWeatherByCityName: `${weatherApiBaseUrl}/weather`
}

module.exports = endpoints
