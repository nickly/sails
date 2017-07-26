/****************************
 * 权限认证服务
 */
var Promise = require('bluebird');
module.exports = {
    check: function(req, code) {
        var userId = req.session.user.id;
        var querySql = "select * from s_action where id in (select action_id from s_role_action where role_id in (select role_id from s_user_role where user_id=" + userId + ")) and isDelete=0 and code=?";
        var userQueryAsync = Promise.promisify(SAction.query);
        return userQueryAsync(querySql, [code]);
    }
};