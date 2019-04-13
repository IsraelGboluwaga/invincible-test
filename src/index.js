const dotenv = require('dotenv')
dotenv.config()

const { getFormattedTimeFromTimeZone } = require('./lib/utilityHelper')
const { success, failure, createReturnData } = require('./lib/responseManager')
const { getWeatherFromCityName, getTimeZoneByCityName } = require('./handlers/cityHandler')
const { _getWeatherByZipCode, _getTimeZoneByZipCode } = require('./handlers/zipHandler')

const outputData = []

const __getWeatherAndTimeByCity = async cityName => {
	let returnData, weatherInfo, currentTimeZone, currentTime, error = false, message = []

	try {
		weatherInfo = getWeatherFromCityName(cityName)
		currentTimeZone = getTimeZoneByCityName(cityName)
		currentTime = getFormattedTimeFromTimeZone(currentTimeZone)

		console.log('2', weatherInfo)
		if (weatherInfo && weatherInfo.cod != 200) {
			error = true
			message.push('Weather info could not be retrieved')
			message.push(weatherInfo.message)
		}
		const weatherData = weatherInfo.data ? weatherInfo.data : 'Weather info could not be retrieved'

		if (!weatherInfo || !currentTime) {
			error = true
			if (!weatherInfo || (weatherInfo && !weatherInfo.data)) message.push('Weather info could not be retrieved')
			if (!currentTime) message.push('Current time could not be retrieved')
		}

		returnData = createReturnData(cityName, weatherData, currentTime, error)
		outputData.push(returnData)
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

	while(outputData.length) {outputData.pop()}

	for await (let i of inputArray) {
		if (typeof i !== 'string') return failure({ message: `Input param ${i} is of an invalid type` }, 400)

		// If string => city name
		if (Number.isNaN(parseInt(i))) {
			__getWeatherAndTimeByCity(i.toLowerCase())
		}
		else {
			__getWeatherAndTimeByZip(i)
		}
	}

	return outputData
}

module.exports = {
	outputData,
	getWeatherAndTimeByLocationOrPostalCode
}
