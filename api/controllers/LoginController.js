/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * `LoginController.index()`
     *   登录页面
     */
    login: function(req, res) {
        return res.view('login', { jsPath: 'login' });
    },
    loginPost: function(req, res) {
        SUser.find({ loginName: req.body.username, loginPwd: CryptoService.Md5(req.body.password) }).exec(function(err, user) {
            if (err) {
                LogsService.error(err);
                res.send(500, { error: "DB Error" });
            } else {
                if (user.length > 0) {
                    req.session.user = user[0];
                    SqlLogsService.WriteLogs(req, 0, 'Login');
                    res.myJsonReponse({ result: 1, message: null });
                } else {
                    res.myJsonReponse({ result: 0, message: null });
                }
                // if (user.state) {
                //     req.session.user = user;
                //     res.send(200);
                // } else {
                //     res.send(404);
                // }
            }
        });

    },
    /**
     * `LoginController.logout()`
     *   登出页面
     */
    logout: function(req, res) {
        req.session.user = null;
        SqlLogsService.WriteLogs(req, 0, 'Logout');
        res.redirect('/');
    }

};