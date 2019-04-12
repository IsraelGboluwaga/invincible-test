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
	respond(data, status)
}

module.exports.failure = (response, httpCode = 503) => {
	const data = response
	data.error = true
	respond(data, httpCode)
}
