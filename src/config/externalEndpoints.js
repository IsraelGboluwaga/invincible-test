const { OPENWEATHER_API_KEY } = require('./config')

const weatherApiBaseUrl = `http://api.openweathermap.org/data/2.5/weather/APPID=${OPENWEATHER_API_KEY}&`

const endpoints = {
	getWeatherByZipCode: `${weatherApiBaseUrl}zip=`,
	getWeatherByCityName: `${weatherApiBaseUrl}q=`,
}

module.exports = endpoints
