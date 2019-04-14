const chai = require('chai')
const expect = chai.expect

const { getWeatherAndTimeByLocationOrPostalCode } = require('../index')

describe('Get Weather Info And Current Time', () => {
	it('should return an error response if params are empty', async () => {
		const response = await getWeatherAndTimeByLocationOrPostalCode()
		expect(response).to.exist
		expect(response).to.be.an('object')
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an error if input param is not an array', async () => {
		const response = await getWeatherAndTimeByLocationOrPostalCode(123)
		expect(response).to.exist
		expect(response).to.be.an('object')
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an error if input param is an empty array', async () => {
		const response = await getWeatherAndTimeByLocationOrPostalCode([])
		expect(response).to.exist
		expect(response).to.be.an('object')
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an error if input array element is not a string', async () => {
		const response = await getWeatherAndTimeByLocationOrPostalCode(['london', 12, 'paris'])
		expect(response).to.exist
		expect(response).to.be.an('object')
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response.error).to.be.true
		expect(response.code).to.equal(400)
	})

	it('should return an array as a data property of the return object', async () => {
		// key is the search key- postal code or city name
		const keys = ['london', 'lagos', '200220', 'paris', '32009']
		const response = await getWeatherAndTimeByLocationOrPostalCode(keys)
		expect(response).to.exist
		expect(response).to.be.an('object')
		expect(response).to.have.property('error')
		expect(response).to.have.property('code')
		expect(response).to.have.property('data')
		expect(response.error).to.be.false
		expect(response.code).to.equal(200)
		expect(response.data).to.be.an('array')
		expect(response.data).to.have.lengthOf(keys.length)
	})

	it ('object in data array of response should contain key, weather_info, current_time, error and message', async () => {
		const keys = ['london', 'lagos', '200220', 'paris', '32009']
		const response = await getWeatherAndTimeByLocationOrPostalCode(keys)
		expect(response).to.exist
		expect(response).to.be.an('object')
		expect(response).to.have.property('data')
		expect(response.data).to.be.an('array')
		expect(response.data[0]).to.be.an('object')
		expect(response.data[0]).to.have.property('key')
		expect(response.data[0]).to.have.property('weather_info')
		expect(response.data[0]).to.have.property('current_time')
		expect(response.data[0]).to.have.property('error')
		expect(response.data[0]).to.have.property('message')
	})
})
