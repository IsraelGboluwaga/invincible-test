const respond = (data, httpCode) => {
	return {
		error: data.error,
		code: httpCode,
		data: data.data,
		message: data.message,
	}
}

module.exports.success = (response, status = 200) => {
	const data = response
	data.error = false
	return respond(data, status)
}

module.exports.failure = (response, httpCode = 503) => {
	const data = response
	data.error = true
	return respond(data, httpCode)
}


module.exports.createReturnData = (key, weather_info, current_time, error=false, message=['successful']) => {
	return {key, weather_info, current_time, error, message}
}
