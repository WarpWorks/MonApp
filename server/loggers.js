const path = require('path');
const winston = require('winston');

const config = require('./config');

winston.loggers.add('W2:content:entity:patch', {
    console: {
        level: 'info',
        colorize: true
    },
    file: {
        filename: path.join(config.folders.w2projects, 'logs', 'patch.log')
    }
});

module.exports = winston.loggers;
