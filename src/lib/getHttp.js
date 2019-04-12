const unirest = require('unirest')

const getHttp = url => unirest.get(url)

module.exports = getHttp
