/****************************
 * 操作权限判断
 */
module.exports = function(req, res, next) {
    //sails.log.level(req);
    // User is allowed, proceed to the next policy, 
    // or if this is the last policy, the controller
    if (req.options.code) {
        return next();
    }
    PolicyService.check(req).then(function(list) {
        if (list.length > 0) {
            var filterArr = list.filter(function(item) {
                return item.code == req.options.code;
            });
            if (filterArr.length > 0) {
                next();
            } else {
                return res.send(403, { error: "Don't have permission" });
            }
        } else {
            return res.send(403, { error: "Don't have any permissions" });
        }
    }).catch(function(err) {
        return res.send(403, { error: "Don't have any permissions" });
    });
    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    //return res.forbidden('You are not permitted to perform this action.');
};