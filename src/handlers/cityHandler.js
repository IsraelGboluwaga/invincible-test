const tzCitySearch = require('city-timezones').lookupViaCity
const { getResponseBody } = require('../lib/responseManager')
const { getWeatherByCityName } = require('../config/externalEndpoints')
const get = require('../lib/getHttp')

const getWeatherFromCityName = cityName => get(getWeatherByCityName + cityName)
	.then(data => {
		if (data.status == 200) {
			return data.data
		}
		else {
			Promise.reject('Failed request response')
		}
	})
	.catch(e => e)

const getTimeZoneByCityName = cityName => tzCitySearch(cityName)[0].timezone

module.exports = {
	getWeatherFromCityName,
	getTimeZoneByCityName
}
