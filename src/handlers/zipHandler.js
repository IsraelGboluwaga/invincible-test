const {getResponseBody} = require('../lib/responseManager')
const { getWeatherByZipCode } = require('../config/externalEndpoints')
const {getWeatherFromCityName} = require('../handlers/cityHandler')
const {outputData} = require('../index');
const get = require('../lib/getHttp')



const _getTimeZoneByZipCode = zip => {
	let city
	if (outputData && outputData.length > 0) {
		for (let i of outputData) {
			city = i.key === zip ? i.weather_info.name : null
		}
	}

	try {
		if (!city) {
			const weatherInfo = _getWeatherByZipCode(zip)
			city = weatherInfo && weatherInfo.name ? weatherInfo.name : 'No weather info was found'
		}
		const cityTimeZone = city ? getWeatherFromCityName(city) : 'No timezone was found for this city'

		return cityTimeZone
	}
	catch (err) {
		console.log('Error =>', err)
	}
}

const _getWeatherByZipCode = zip => get(getWeatherByZipCode + zip)
	.then(getResponseBody)

module.exports = {
	_getTimeZoneByZipCode,
	_getWeatherByZipCode
};
