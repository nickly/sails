/**
 * ReportController
 *
 * @description :: Server-side logic for managing Reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var tag = "REPORT ANALYZED";
module.exports = {
    index: function(req, res) {
        MenuService.Menus(req.session.user.id).then(function(result) {
            return res.view('report', { menus: result, tag: tag });

        }).catch(function(err) {
            LogsService.error(err);
        });
    }
};