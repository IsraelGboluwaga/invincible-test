const { getWeatherByZipCode } = require('../config/externalEndpoints')
const { getTimeZoneByCityName } = require('../handlers/cityHandler')
const get = require('../lib/getHttp')

const getTimeZoneFromCityName = (weatherInfo) => getTimeZoneByCityName(weatherInfo)

const getWeatherByZipCode_ = zip => get(getWeatherByZipCode + zip)
	.then(data => {
		if (data.status == 200) {
			return data.data
		}
		else {
			Promise.reject('Failed request response')
		}
	})
	.catch(e => e.response.data || e)

module.exports = {
	getWeatherByZipCode_,
	getTimeZoneFromCityName
};
