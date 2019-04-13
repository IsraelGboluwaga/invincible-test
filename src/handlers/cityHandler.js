const tzCitySearch = require('city-timezones').lookupViaCity
const {getResponseBody} = require('../lib/responseManager')
const { getWeatherByCityName } = require('../config/externalEndpoints')
const get = require('../lib/getHttp')

const getWeatherFromCityName = cityName => get(getWeatherByCityName + cityName)
	.then(data => data)
	.catch(e => {data: e.message})

const getTimeZoneByCityName = cityName => tzCitySearch(cityName)[0].timezone

module.exports = {
	getWeatherFromCityName,
	getTimeZoneByCityName
}
