const log4js = require('log4js');

module.exports = log4js.configure({
    appenders: {
        console : {type: "console"},
        loggerFileWarn : {type: "file", filename: "loggerInfo/warn.log"},
        loggerFileError : {type: "file", filename: "loggerInfo/error.log"},
    },
    categories: {
        default: {appenders : ["console"], level: "info"},
        fileWarn: {appenders : ["loggerFileWarn"], level: "warn"},
        fileError: {appenders : ["loggerFileError"], level: "error"},
        
    }
})

const logger = log4js.getLogger();
