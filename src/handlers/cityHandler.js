const tzCitySearch = require('city-timezones').lookupViaCity
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

const getTimeZoneByCityName = cityName => {
	const response = tzCitySearch(cityName)
	return response && Array.isArray(response) && response.length > 0 ? response[0].timezone : null
}

module.exports = {
	getWeatherFromCityName,
	getTimeZoneByCityName
}
