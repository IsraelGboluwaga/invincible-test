const chai = require('chai')
const expect = chai.expect

const { getWeatherAndTimeByLocationOrPostalCode } = require('../index')

describe('Get Weather Info And Current Time', () => {
	it('should return an error response if params are empty', () => {
		const response = getWeatherAndTimeByLocationOrPostalCode()
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an error if input param is not an array', () => {
		const response = getWeatherAndTimeByLocationOrPostalCode(123)
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an error if input param is an empty array', () => {
		const response = getWeatherAndTimeByLocationOrPostalCode([])
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an error if input array element is not a string', () => {
		const response = getWeatherAndTimeByLocationOrPostalCode(['london', 12, 'paris'])
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an array with key, current_time and weather_info properties as a data property of the return object', () => {
		// key is the search key- postal code or city name
		const keys = ['london', 'lagos', '200220', 'paris', '32009']
		const response = getWeatherAndTimeByLocationOrPostalCode(keys)
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response).to.have.property('data')
		expect(response.error).to.be.false
		expect(response.code).to.equal(200)
		expect(response.data).to.be.an('array')
		expect(response.data).to.have.lengthOf(keys.length)
	})
})