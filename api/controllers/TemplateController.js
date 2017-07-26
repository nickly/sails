/**
 * TemplateController
 *
 * @description :: Server-side logic for managing Templates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var tag = "TEMPLATE";
module.exports = {
    /**********************
     * 模板主页
     */
    index: function(req, res) {
        // var searchKey = req.param('searchKey', "");
        // var categoryId = req.param('categoryId');
        // var status = req.param('status');
        // var orderBy = req.param('order');
        SqlLogsService.WriteLogs(req, 0, 'View Template');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var totalCount = ETemplate.count().then(function(count) {
                return count;
            });
            var temlateList = ETemplate.find({ sort: 'createTime desc' }).populate('categoryId').paginate({ page: 1, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            var categoryList = ETemplateCategory.find({ sort: 'id desc' }).populate('templates').then(function(result) {
                return result;
            });
            return Promise.all([menus, totalCount, temlateList, categoryList]);
        }).spread(function(menusResult, totalCountResult, temlateListResult, categoryListResult) {

            return res.view('template/list', { tag: tag, menus: menusResult, list: { pageInfo: PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize), template: temlateListResult }, categoryList: categoryListResult });
        }).catch(function(err) {

        });
    },
    /*************
     * 模板变量
     */
    variables: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'View Template Variables');
        ETemplateVariable.find({ sort: 'code desc' }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            } else {
                return res.myJsonReponse({ result: result, message: null });
            }
        });
    },
    /*******************
     * 模板查询方法
     */
    search: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'Search Template');
        var searchKey = req.param('searchKey', "");
        var categoryId = req.param('categoryId', -1);
        var status = req.param('status', -1);
        var orderBy = req.param('order', "desc");
        var page = req.param('page', 1);
        var condition = {};
        condition.or = [{ name: { 'like': '%' + searchKey + '%' } }, { subject: { 'like': '%' + searchKey + '%' } }];
        // condition.name = {
        //     'like': '%' + searchKey + '%'
        // };
        // condition.subject = {
        //     'like': '%' + searchKey + '%'
        // };
        if (categoryId > 0) {
            condition.categoryId = categoryId;
        }
        if (status > -1) {
            condition.status = status;
        }
        condition.sort = "createTime " + orderBy;
        ETemplate.count(condition).then(function(count) {
            var temlateList = ETemplate.find(condition).populate('categoryId').paginate({ page: page, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            return Promise.all([count, temlateList]);
        }).spread(function(totalCountResult, temlateListResult) {
            var result = {};
            result.pageInfo = PageService.PageData(page, totalCountResult, sails.config.PageInfo.PageSize);
            result.template = temlateListResult;
            return res.myJsonReponse({ result: result, message: null });
        }).catch(function(err) {
            return res.myJsonReponse({ result: 0, message: err });
        });
    },
    /****************
     * 更新状态
     */
    updateStatus: function(req, res) {
        var id = req.param('id');
        var status = req.param('status');
        SqlLogsService.WriteLogs(req, 0, 'Update Template Status,Id:' + id + ';status:' + status);
        ETemplate.update({ id: id }, { status: status }).exec(function(err, updated) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    },
    /****************
     * 删除
     */
    delete: function(req, res) {
        var id = req.param('id');
        SqlLogsService.WriteLogs(req, 0, 'Delete Template,Id:' + id);
        ETemplate.destroy({ id: id }).exec(function(err) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    },
    edit: function(req, res) {
        var templateId = req.param('id');
        SqlLogsService.WriteLogs(req, 0, 'Edit Template,Id:' + templateId);
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var template = ETemplate.find({ id: templateId }).populate('categoryId').then(function(result) {
                return result;
            });
            var categoryList = ETemplateCategory.find({ sort: 'id desc' }).then(function(result) {
                return result;
            });
            return Promise.all([menus, template, categoryList]);
        }).spread(function(menusResult, templateResult, categoryResult) {

            return res.view('template/edit', { tag: tag, menus: menusResult, template: templateResult[0], categoryList: categoryResult });
        }).catch(function(err) {

        });
    },
    new: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'View Add Template');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var categoryList = ETemplateCategory.find({ sort: 'id desc' }).then(function(result) {
                return result;
            });
            return Promise.all([menus, categoryList]);
        }).spread(function(menusResult, categoryListResult) {

            return res.view('template/new', { tag: tag, menus: menusResult, categoryList: categoryListResult });
        }).catch(function(err) {

        });
    },
    /**********************
     * 新增模板提交
     */
    addPost: function(req, res) {
        var id = req.param('id');
        var enabled = req.param('enabled', 1);
        var categoryId = req.param('categoryId');
        var name = req.param('name');
        var contentType = req.param('contentType', 0);
        var subject = req.param('subject');
        var content = req.param('content');
        if (id == "") {
            ETemplate.create({ status: enabled, categoryId: categoryId, contentType: contentType, name: name, subject: subject, content: content }).exec(function(err, result) {
                SqlLogsService.WriteLogs(req, 0, 'Save Template,Id:' + result.id);
                if (err) {
                    return res.myJsonReponse({ result: 0, message: err });
                }
                return res.myJsonReponse({ result: 1, message: null });
            });
        } else {
            ETemplate.update({ id: id }, { status: enabled, categoryId: categoryId, contentType: contentType, name: name, subject: subject, content: content }).exec(function(err, result) {
                SqlLogsService.WriteLogs(req, 0, 'Update Template,Id:' + id);
                if (err) {
                    return res.myJsonReponse({ result: 0, message: err });
                }
                return res.myJsonReponse({ result: 1, message: null });
            });
        }
    },
    /**********************
     * 获取模板信息
     */
    templateInfo: function(req, res) {
        var id = req.param("id");
        SqlLogsService.WriteLogs(req, 0, 'View TemplateInfo,Id:' + id);
        ETemplate.findOne({ id: id }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: result, message: null });
        });
    },
    /**********************
     * 模板分类
     */
    category: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'View Template Category');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var categoryList = ETemplateCategory.find({ sort: 'id desc' }).then(function(result) {
                return result;
            });
            return Promise.all([menus, categoryList]);
        }).spread(function(menusResult, categoryListResult) {

            return res.view('template/category', { tag: tag, menus: menusResult, list: categoryListResult });
        }).catch(function(err) {

        });
    },
    categorySearch: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'Search Template Category');
        ETemplateCategory.find({ sort: 'id desc' }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: result, message: null });
        });
    },
    /****************
     * 更新模板分类
     */
    categoryUpdate: function(req, res) {
        var id = req.param("id");
        var categoryName = req.param("categoryName");
        var description = req.param("description", "");
        SqlLogsService.WriteLogs(req, 0, 'Update Template Category,Id:' + id);
        ETemplateCategory.update({ id: id }, { categoryName: categoryName, description: description }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    },
    /*******************
     * 添加模板分类
     */
    categoryNew: function(req, res) {
        var categoryName = req.param("categoryName");
        var description = req.param("description", "");
        SqlLogsService.WriteLogs(req, 0, 'Add Template Category');
        ETemplateCategory.create({ categoryName: categoryName, description: description }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    },
    /********************
     * 删除模板分类
     */
    categoryDelete: function(req, res) {
        var id = req.param("id");
        SqlLogsService.WriteLogs(req, 0, 'Delete Template Category');
        ETemplateCategory.destroy({ id: id }).exec(function(err) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    }

};