const shell = require('shelljs');
const { app } = require('./index')

const infoText = () => {
	console.log(`Kindly input the city names and zip/postal codes e.g. Paris, Lisbon, 78009
	
	- To restart, enter 'restart'
	- To clear the screen, enter 'clear'
	- To exit the program, enter 'exit'`)
}

const main = () => {
	const standard_input = process.stdin
	standard_input.setEncoding('utf-8')

	infoText()

	standard_input.on('data', (data) => {

		if (data === 'exit\n') {
			// Program exit.
			console.log("Program stopped. Thanks for coming :-)")
			process.exit()
		} else if (data === 'clear\n') {
			shell.exec('clear')
			infoText()
		} else if (data === 'restart\n') {
			console.log('Restarting...')
			shell.exec('clear')
			main()
		} else {
			const cleanData = data.replace(/\n$/, '').replace(/[^a-zA-Z0-9,^]/g, "").split(',')
			console.log('Loading... \n \n')
			console.log('Result:')
			app(cleanData)
		}
	});
}

main()
