const moment = require('moment-timezone')

const getFormattedTimeFromTimeZone = timezone => timezone && typeof timezone === 'string'
	? moment().tz(timezone).format('MMMM Do YYYY, h:mm:ss a') : 'Timezone is required'

module.exports = { getFormattedTimeFromTimeZone }
