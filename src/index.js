const dotenv = require('dotenv')
dotenv.config()

const { getFormattedTimeFromTimeZone } = require('./lib/utilityHelper')
const { success, failure, createReturnData } = require('./lib/responseManager')
const { getWeatherFromCityName, getTimeZoneByCityName } = require('./handlers/cityHandler')
const { getWeatherByZipCode_, getTimeZoneFromCityName } = require('./handlers/zipHandler')

const outputData = []

// const handleApiResponse = (response) => {}

const __getWeatherAndTimeByCity = async cityName => {
	let weatherData, currentTimeZone, currentTime, error = false, message = []

	try {
		currentTimeZone = getTimeZoneByCityName(cityName)
		if (!currentTimeZone) {
			return createReturnData(cityName, 'Weather info could not be retrieved', 'Time info could not be retrieved', true, 'Invalid city name')
		}
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
		return createReturnData(cityName, 'Error fetching weather info', 'Error fetching time info', true, [error])
	}
}

const __getWeatherAndTimeByZip = zip => {
	let weatherData, currentTimeZone, currentTime, error = false, message = []

	try {

		return getWeatherByZipCode_(zip).then(async weatherInfo => {
				if (!weatherInfo) {
					error = true
					message.push('Weather info could not be retrieved')
					message.push(weatherInfo.message)
					weatherData = 'Weather info service is temporarily unavailable'

					return createReturnData(zip, weatherData, currentTime, error, message)
				}
				else {
					if (weatherInfo.cod && weatherInfo.cod != 200) {
						if (weatherInfo && weatherInfo.cod == 404) {
							message.push('Invalid zip/postal code')
							message.push(weatherInfo.message)
							weatherData = 'Weather info could not be retrieved'
						} else {
							error = true
							message.push('Weather info could not be retrieved')
							message.push(weatherInfo.message)
							weatherData = 'Weather info service is temporarily unavailable'
						}
						currentTimeZone = null
					}
					else {
						weatherData = weatherInfo ? weatherInfo : 'Weather info could not be retrieved'
						message.push('successful')
						currentTimeZone = getTimeZoneFromCityName(weatherData.name)
					}

					if (!currentTimeZone) {
						return createReturnData(zip, weatherData, 'Time info could not be retrieved', true, 'Invalid city name')
					}
					currentTime = getFormattedTimeFromTimeZone(currentTimeZone)
					if (!currentTime) message.push('Current time could not be retrieved')

					return createReturnData(zip, weatherData, currentTime, error, message)
				}
			}
		)

	}
	catch (err) {
		return createReturnData(zip, 'Error fetching weather info', 'Error fetching time info', true, [err])
	}

}

const getWeatherAndTimeByLocationOrPostalCode = async (inputArray) => {
	if (!inputArray) return failure({ message: 'Input params can not be empty' }, 400)
	if (!Array.isArray(inputArray)) return failure({ message: 'Input param has to be an array of strings' }, 400)
	if (inputArray && inputArray.length < 1) return failure({ message: 'Input array cannot be empty' }, 400)

	while (outputData.length) {
		outputData.pop()
	}

	let dataByCity, dataByZip
	for (let i of inputArray) {
		if (typeof i !== 'string') return failure({ message: `Input param ${i} is of an invalid type` }, 400)

		// If string => city name
		if (Number.isNaN(parseInt(i))) {
			dataByCity = await __getWeatherAndTimeByCity(i.toLowerCase())
			outputData.push(dataByCity)
		}
		else {
			dataByZip = await __getWeatherAndTimeByZip(i)
			outputData.push(dataByZip)
		}
	}

	return outputData
}

const app = async (input) => {
	console.log('Response', await getWeatherAndTimeByLocationOrPostalCode(input))
}

module.exports = {
	getWeatherAndTimeByLocationOrPostalCode,
	app
}
