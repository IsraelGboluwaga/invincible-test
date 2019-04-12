const moment = require('moment-timezone');
const getFormattedTimeFromTimeZone = timezone => moment().tz(timezone).format('MMMM Do YYYY, h:mm:ss a')

module.exports = { getFormattedTimeFromTimeZone }