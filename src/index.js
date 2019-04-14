const dotenv = require('dotenv')
dotenv.config()

const { getFormattedTimeFromTimeZone } = require('./lib/utilityHelper')
const { success, failure, createReturnData } = require('./lib/responseManager')
const { getWeatherFromCityName, getTimeZoneByCityName } = require('./handlers/cityHandler')
const { _getWeatherByZipCode, _getTimeZoneByZipCode } = require('./handlers/zipHandler')

const outputData = []

// const handleApiResponse = (response) => {}

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
		})

	}
	catch (error) {
		return { error, message: 'An error occurred' }
	}
}

const __getWeatherAndTimeByZip = async zip => {
	let returnData, weatherData, currentTimeZone, currentTime, error = false, message = []

	try {
		currentTimeZone = await _getTimeZoneByZipCode(zip)
		currentTime = getFormattedTimeFromTimeZone(currentTimeZone)
		if (!currentTime) message.push('Current time could not be retrieved')

		return _getWeatherByZipCode(zip).then(weatherInfo => {
				if (weatherInfo && weatherInfo.cod != 200) {
					error = true
					message.push('Weather info could not be retrieved')
					message.push(weatherInfo.message)
					weatherData = 'Weather info service is temporarily unavailable'
					return createReturnData(zip, weatherInfo, currentTime, error, message)
				}
				else {
					weatherData = weatherInfo ? weatherInfo : 'Weather info could not be retrieved'

					if (!weatherInfo || !currentTime) {
						error = true
						if (!weatherInfo || (weatherInfo && !weatherInfo.data)) message.push('Weather info could not be retrieved')
						if (!currentTime) message.push('Current time could not be retrieved')
					}

					return createReturnData(zip, weatherInfo, currentTime, error)
				}
			}
		)

	}
	catch (err) {
		return { error, message: 'An error occurred' }
	}

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
				.then(data => console.log('data city', data) || outputData.push(data))
		}
		else {
			__getWeatherAndTimeByZip(i)
				.then(data => console.log('data zip', data) || outputData.push(data))
		}
	}

	return await outputData
}

const app = async (input) => {
	console.log('Response', await getWeatherAndTimeByLocationOrPostalCode(input))
}

module.exports = {
	outputData,
	app
}
