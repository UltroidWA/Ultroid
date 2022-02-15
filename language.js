const Config = require('./config');
const fs = require('fs');
const chalk = require('chalk');
 
if (fs.existsSync('./language/' + Config.LANG + '.json')) {
    console.log(
        chalk.green.bold('Loading ' + Config.LANG + ' language...!')
    );

    var json = JSON.parse(fs.readFileSync('./language/' + Config.LANG + '.json'));
} else {
    console.log(
        chalk.red.bold('Loading SI Language...!')
    );

    var json = JSON.parse(fs.readFileSync('./language/SI.json'));
}

function getString(file) {
    return json['STRINGS'][file];
}

module.exports = {
    language: json,
    getString: getString
}
