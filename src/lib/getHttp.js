const axios = require('axios')

const getHttp = url => axios.get(url)

module.exports = getHttp
