/*********************菜单显示服务*********************/
var crypto = require('crypto');
var Promise = require('bluebird');
module.exports = {
    Menus: function(uid, callBack) {
        var userQueryAsync = Promise.promisify(SMenu.query);
        var query = "SELECT m.* FROM s_menu as m inner join s_role_menu as sr on m.id=sr.menu_id inner join s_role as r on sr.role_id=r.id inner join s_user_role as su on r.id=su.role_id where su.user_id=? order by m.sort asc";
        return userQueryAsync(query, [uid]);
        //SMenu.query(query, [uid], callBack);
    }
};