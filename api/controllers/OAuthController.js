/**
 * OAuthController
 *
 * @description :: Server-side logic for managing Oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var Util = require('../../assets/js/extensions/Util');
require('../../assets/js/extensions/String');
var tag = "OAUTH";
module.exports = {
    index: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'View OAuth');
        MenuService.Menus(req.session.user.id).then(function(menus) {

            var totalCount = EOAuth.count().then(function(count) {
                return count;
            });
            var oauthList = EOAuth.find({ sort: 'createTime desc' }).paginate({ page: 1, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            return Promise.all([menus, totalCount, oauthList]);
        }).spread(function(menusResult, totalCountResult, oauthListResult) {

            return res.view('oauth/list', { Util: Util, tag: tag, menus: menusResult, list: { pageInfo: PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize), oauth: oauthListResult } });
        }).catch(function(err) {

        });
    },
    search: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'Search OAuth');
        var searchKey = req.param('searchKey', "");
        var status = req.param('status', -1);
        var orderBy = req.param('order', "desc");
        var page = req.param('page', 1);
        var condition = {};
        condition.or = [{
            appId: { contains: searchKey }
        }];
        if (status > -1) {
            condition.status = status;
        }
        condition.sort = "createTime " + orderBy;
        EOAuth.count(condition).then(function(count) {
            var oauthList = EOAuth.find(condition).paginate({ page: page, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            return Promise.all([count, oauthList]);
        }).spread(function(totalCountResult, oauthListResult) {
            var result = {};
            result.pageInfo = PageService.PageData(page, totalCountResult, sails.config.PageInfo.PageSize);
            result.oauth = oauthListResult;
            return res.myJsonReponse({ result: result, message: null });
        }).catch(function(err) {
            return res.myJsonReponse({ result: 0, message: err });
        });
    },
    new: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'New OAuth');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            return res.view('oauth/new', { tag: tag, menus: menus, APPID: "S" + Util.createGuid(), APPSECRET: Util.createGuid() });
        }).catch(function(err) {});
    },
    save: function(req, res) {

        var id = req.param('id', "");
        var enabled = req.param('enabled');
        var domain = req.param('domain');
        var ip = req.param('ip');
        var appid = req.param('appid');
        var appsecret = req.param('appsecret');
        var name = req.param('name');
        if (id == "") {
            EOAuth.create({
                name: name,
                domain: domain,
                ip: ip,
                appId: appid,
                appSecret: appsecret,
                status: enabled
            }).exec(function(err, result) {
                if (err) {
                    return res.myJsonReponse({ result: 0, message: err });
                } else {
                    SqlLogsService.WriteLogs(req, 0, 'Save OAuth,ID:' + result.id);
                    return res.myJsonReponse({ result: 1, message: null });
                }
            });
        } else {
            EOAuth.update({ id: id }, {
                domain: domain,
                ip: ip,
                appId: appid,
                appSecret: appsecret,
                status: enabled
            }).exec(function(err, result) {
                SqlLogsService.WriteLogs(req, 0, 'Update OAuth,ID:' + result.id);
                if (err) {
                    return res.myJsonReponse({ result: 0, message: err });
                } else {
                    return res.myJsonReponse({ result: 1, message: null });
                }
            });
        }
    },
    updateStatus: function(req, res) {

        var id = req.param('id');
        var status = req.param('status');
        SqlLogsService.WriteLogs(req, 0, 'Update OAuth Status,ID:' + id + ';Status:' + status);
        EOAuth.update({ id: id }, { status: status }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            } else {
                return res.myJsonReponse({ result: 1, message: null });
            }
        });
    },
    delete: function(req, res) {
        var id = req.param('id');
        SqlLogsService.WriteLogs(req, 0, 'Delete OAuth,ID:' + id);
        EOAuth.destroy({ id: id }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            } else {
                return res.myJsonReponse({ result: 1, message: null });
            }
        });
    },
    edit: function(req, res) {
        var id = req.param('id');
        SqlLogsService.WriteLogs(req, 0, 'Edit OAuth,ID:' + id);
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var oauth = EOAuth.findOne({ id: id }).then(function(result) {
                return result;
            });
            return Promise.all([menus, oauth]);
        }).spread(function(menusResult, oauthResult) {

            return res.view('oauth/edit', { tag: tag, menus: menusResult, oauth: oauthResult });
        }).catch(function(err) {

        });
    }
};