const dotenv = require('dotenv')
dotenv.config()

const { getFormattedTimeFromTimeZone } = require('./lib/utilityHelper')
const { success, failure, createReturnData } = require('./lib/responseManager')
const { getWeatherFromCityName, getTimeZoneByCityName } = require('./handlers/cityHandler')
const { _getWeatherByZipCode, _getTimeZoneByZipCode } = require('./handlers/zipHandler')

const outputData = []

const __getWeatherAndTimeByCity = async cityName => {
	let weatherData, currentTimeZone, currentTime, error = false, message = []

	try {
		currentTimeZone = getTimeZoneByCityName(cityName)
		currentTime = getFormattedTimeFromTimeZone(currentTimeZone)

		return getWeatherFromCityName(cityName).then(weatherInfo => {
			if (weatherInfo && weatherInfo.cod != 200) {
				error = true
				message.push('Weather info could not be retrieved')
				message.push(weatherInfo.message)
				weatherData = 'Weather info service is temporarily unavailable'
			}
			else {
				weatherData = weatherInfo ? weatherInfo : 'Weather info could not be retrieved'

				if (!weatherInfo || !currentTime) {
					error = true
					if (!weatherInfo || (weatherInfo && !weatherInfo.data)) message.push('Weather info could not be retrieved')
					if (!currentTime) message.push('Current time could not be retrieved')
				}
			}

			return createReturnData(cityName, weatherData, currentTime, error, message)
		}).catch(err => console.log(err, 'err'))

	}
	catch (error) {
		return { error, message: 'An error occurred' }
	}
}

const __getWeatherAndTimeByZip = async zip => {
	let returnData, weatherInfo, currentTimeZone, currentTime, error = false, message = []

	weatherInfo = await _getWeatherByZipCode(zip)
	currentTimeZone = await _getTimeZoneByZipCode(zip)
	currentTime = getFormattedTimeFromTimeZone(currentTimeZone)
	if (!weatherInfo || !currentTime) {
		error = true
		if (!weatherInfo) message.push('Weather info could not be retrieved')
		if (!currentTime) message.push('Current time could not be retrieved')
		returnData = createReturnData(zip, weatherInfo, currentTime, error, message)
		return outputData.push(success({ data: returnData, message }))
	}

	returnData = createReturnData(zip, weatherInfo, currentTime, error)
	return outputData.push(success({ data: returnData, message: 'successful' }))
}

const getWeatherAndTimeByLocationOrPostalCode = async (inputArray) => {
	if (!inputArray) return failure({ message: 'Input params can not be empty' }, 400)
	if (!Array.isArray(inputArray)) return failure({ message: 'Input param has to be an array of strings' }, 400)
	if (inputArray && inputArray.length < 1) return failure({ message: 'Input array cannot be empty' }, 400)

	while (outputData.length) {
		outputData.pop()
	}

	for await (let i of inputArray) {
		if (typeof i !== 'string') return failure({ message: `Input param ${i} is of an invalid type` }, 400)

		// If string => city name
		if (Number.isNaN(parseInt(i))) {
			__getWeatherAndTimeByCity(i.toLowerCase())
				.then(data => console.log('data last', data) || outputData.push(data))
		}
		else {
			__getWeatherAndTimeByZip(i)
				.then(data => outputData.push(data))
		}
	}

	return outputData //Find a way to delay this to bring real data
}

const app = async (input) => {
	console.log('Response', await getWeatherAndTimeByLocationOrPostalCode(input))
}

module.exports = {
	outputData,
	app
}
