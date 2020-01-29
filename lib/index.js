const readline = require('readline');
const chalk = require('chalk');
const processLine = require('./processLine');

const DEBUG = false;

const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

//reading a file line-by-line and printing its content to the console
let lineNumber = 0;
readInterface.on('line', function(line) {
    let result = line;
    if (lineNumber > 0) { 
        result = processLine(line);
	}
	
	if (DEBUG) {
        console.log(chalk.white(line));
        console.log(chalk.green(result));
    } else {
        console.log(result);
	}
	
	lineNumber++;
});