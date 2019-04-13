const shell = require('shelljs');
const { getWeatherAndTimeByLocationOrPostalCode } = require('./index')

const main = () => {
	const standard_input = process.stdin
	standard_input.setEncoding('utf-8')

	console.log("Please input the city names and zip/postal codes e.g. Paris, Lisbon, 78009")

	standard_input.on('data', (data) => {

		if (data === 'exit\n') {
			// Program exit.
			console.log("Program stopped. Thanks for coming :-)")
			process.exit()
		} else if (data === 'clear\n') {
			shell.exec('clear')
		} else if (data === 'restart\n') {
			console.log('Restarting...')
			shell.exec('clear')
			main()
		} else {
			const cleanData = data.replace(/\n$/, '').replace(/[^a-zA-Z0-9,]/g, "").split(',')
			console.log('Loading... \n \n')
			console.log('Result:')
			const programExec = getWeatherAndTimeByLocationOrPostalCode(cleanData)
			console.log(programExec)
		}
	});
}

main()
