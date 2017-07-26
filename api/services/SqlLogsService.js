/*******************************************
 * 数据库日志记录服务
 */
var moment = require('moment');
module.exports = {
    WriteLogs: function(req, category, action) {
        var ip = RequestService.getClientIp(req);
        var user = req.session.user;
        var appid = req.headers.appid;
        SLogs.create({ action: action, ip: ip, createTime: moment().format("YYYY-MM-DD HH:mm:ss"), category: category, userId: (user != null ? req.session.user.id : null), userName: (user != null ? req.session.user.loginName : ''), appid: appid }).then(function(result) {

        });
    }
};