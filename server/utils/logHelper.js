const log4js = require('log4js');
const path = require('path')
log4js.configure({
    appenders: [
        {
            "type": "dateFile",
            "filename": "./logs/log_http",
            "maxLogSize": 204800,
            "pattern": '-yyyy-MM-dd.log',
            "alwaysIncludePattern": true,
            "backups": 10,
            "category": "http"
        },
        {
            "type": "dateFile",
            "filename": "./logs/log_error",
            "maxLogSize": 204800,
            "pattern": '-yyyy-MM-dd.log',
            "alwaysIncludePattern": true,
            "backups": 10,
            "category": "error"
        },
    ],
    "replaceConsole": false,
    "levels": {
        "http": "ALL",  //等级可以设置ALL,AUTO,INFO,WARN,ERROR
        "error": "ALL"
    }
});
var HTTP_logger = log4js.getLogger('http');
var ERROR_logger = log4js.getLogger('error')
module.exports = {
    log4js,
    HTTP_logger,
    ERROR_logger
}