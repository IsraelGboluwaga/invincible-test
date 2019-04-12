const tzCitySearch = require('city-timezones').lookupViaCity
const dotenv = require('dotenv')
dotenv.config()

const { getWeatherByZipCode, getWeatherByCityName } = require('./config/externalEndpoints')
const get = require('./lib/getHttp')

const outputData = []

const getResponseBody = response => response.body
// const _getWeatherByCityName = cityName => () => get(getWeatherByCityName + cityName).end(getResponseBody)

const _getWeatherByCityName = cityName => get(getWeatherByCityName + cityName)
	.end(getResponseBody)

const _getWeatherByZipCode = zip => get(getWeatherByZipCode + zip)
	.end(getResponseBody)

const _getTimeZoneByCityName = cityName => tzCitySearch(cityName)[0]

const _getTimeZoneByZipCode = zip => {
	let city
	for (let i of outputData) {
		city = i.key === zip ? i.weather_info.name : null
	}

	city = city ? city : _getWeatherByZipCode(zip).name
	const cityTimezone = city ? _getTimeZoneByCityName(city) : 'No timezone was found for this city'

	return cityTimezone
}

const getWeatherAndTimeByLocationOrPostalCode = (inputArray) => {
}

module.exports = {
	getWeatherAndTimeByLocationOrPostalCode
}
