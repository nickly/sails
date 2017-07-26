/**
 * SettingController
 *
 * @description :: Server-side logic for managing Settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var tag = "SETTING";
module.exports = {
    index: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'View Setting');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var setting = SSetting.find().then(function(list) {
                return list;
            });
            return Promise.all([menus, setting]);
        }).spread(function(menusResult, settingResult) {

            return res.view('setting', { tag: tag, menus: menusResult, setting: settingResult[0] });
        }).catch(function(err) {

        });
    },
    save: function(req, res) {
        var old = req.param('old');
        var newPwd = req.param('new');
        SqlLogsService.WriteLogs(req, 0, 'Edit password');
        if (CryptoService.Md5(old) == req.session.user.loginPwd) {
            SUser.update({ id: req.session.user.id }, { loginPwd: CryptoService.Md5(newPwd) }).exec(function(err, result) {
                if (err) {
                    return res.myJsonReponse({ result: 0, message: err });
                }
                req.session.user = null;
                return res.myJsonReponse({ result: 1, message: null });
            });
        } else {
            return res.myJsonReponse({ result: 0, message: 'Old Password not match' });
        }
    }
};