/*******************************************
 * 日志记录服务
 */
var log4js = require('log4js');
log4js.configure({
    appenders: { mailsystem: { type: 'dateFile', filename: 'logs/mailsystem.log', pattern: 'yyyy-MM-dd-hh', compress: true } },
    categories: { default: { appenders: ['mailsystem'], level: 'trace' } }
});
module.exports = log4js.getLogger('mailsystem');