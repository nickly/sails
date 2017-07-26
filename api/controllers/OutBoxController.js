/**
 * OutBoxController
 *
 * @description :: Server-side logic for managing Outboxes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var moment = require('moment');
var tag = "OUTBOX";
module.exports = {
    index: function(req, res) {
        // var searchKey = req.param('searchKey', "");
        // var categoryId = req.param('categoryId');
        // var status = req.param('status');
        // var orderBy = req.param('order');
        SqlLogsService.WriteLogs(req, 0, 'View Outbox');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var totalCount = EOutbox.count().then(function(count) {
                return count;
            });
            var outboxList = EOutbox.find({ sort: 'createTime desc' }).populate('categoryId').paginate({ page: 1, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            var categoryList = ETemplateCategory.find({ sort: 'id desc' }).populate('outboxs').then(function(result) {
                return result;
            });
            return Promise.all([menus, totalCount, outboxList, categoryList]);
        }).spread(function(menusResult, totalCountResult, outboxListResult, categoryListResult) {

            return res.view('outbox/list', { tag: tag, menus: menusResult, moment: moment, list: { pageInfo: PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize), outboxList: outboxListResult }, categoryList: categoryListResult });
        }).catch(function(err) {

        });
    },
    compose: function(req, res) {
        // var searchKey = req.param('searchKey', "");
        // var categoryId = req.param('categoryId');
        // var status = req.param('status');
        // var orderBy = req.param('order');
        SqlLogsService.WriteLogs(req, 0, 'Compose Outbox');
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var categoryList = ETemplateCategory.find({ sort: 'id desc' }).populate('templates').then(function(result) {
                return result;
            });
            return Promise.all([menus, categoryList]);
        }).spread(function(menusResult, categoryListResult) {

            return res.view('outbox/compose', { tag: tag, menus: menusResult, categoryList: categoryListResult });
        }).catch(function(err) {

        });
    },
    /*******************
     * 收件箱查询方法
     */
    search: function(req, res) {
        SqlLogsService.WriteLogs(req, 0, 'Search Outbox');
        var searchKey = req.param('searchKey', "");
        var categoryId = req.param('categoryId', -1);
        var status = req.param('status', -3);
        var orderBy = req.param('order', "desc");
        var page = req.param('page', 1);
        var condition = {};
        condition.or = [{
            fromEmail: { 'like': '%' + searchKey + '%' }
        }, {
            fromName: { 'like': '%' + searchKey + '%' }
        }, {
            recipient: { 'like': '%' + searchKey + '%' }
        }, {
            subject: { 'like': '%' + searchKey + '%' }
        }];
        if (categoryId > 0) {
            condition.categoryId = categoryId;
        }
        if (status > -3) {
            condition.status = status;
        }
        condition.sort = "createTime " + orderBy;
        EOutbox.count(condition).then(function(count) {
            var outboxList = EOutbox.find(condition).populate('categoryId').paginate({ page: page, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            return Promise.all([count, outboxList]);
        }).spread(function(totalCountResult, outboxListResult) {
            var result = {};
            result.pageInfo = PageService.PageData(page, totalCountResult, sails.config.PageInfo.PageSize);
            result.outboxList = outboxListResult;
            return res.myJsonReponse({ result: result, message: null });
        }).catch(function(err) {
            return res.myJsonReponse({ result: 0, message: err });
        });
    },
    /**************
     * 移动分类
     */
    movecategory: function(req, res) {
        var id = req.param('id');
        var categoryId = req.param('categoryId');
        SqlLogsService.WriteLogs(req, 0, 'Move Outbox to Category,Id:' + id + ';NewCategroyId:' + categoryId);
        EOutbox.update({ id: id }, { categoryId: categoryId }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    },
    delete: function(req, res) {
        var id = req.param("id");
        SqlLogsService.WriteLogs(req, 0, 'Delete Outbox,Id:' + id);
        EOutbox.destroy({ id: id }).exec(function(err) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: 1, message: null });
        });
    },
    retry: function(req, res) {
        var id = req.param("id");
        SqlLogsService.WriteLogs(req, 0, 'Retry Send Mail,Id:' + id);
        EOutbox.update({ id: id }, { status: 0 }).then(function(entiy) {
            var outboxQueue = EOutboxQueue.create({ outboxId: id, fromEmail: entiy[0].fromEmail, fromName: entiy[0].fromName, recipient: entiy[0].recipient, subject: entiy[0].subject, contentType: entiy[0].contentType, content: entiy[0].content, sendTime: entiy[0].sendTime, isTime: entiy[0].isTime }).then(function(newQueue) {
                return newQueue;
            });
            return Promise.all([entiy, outboxQueue]);
        }).spread(function(entiyResult, outboxQueueResult) {
            RabbitMQService.SendToQueue({ queue: 'SM', id: outboxQueueResult.outboxId, fromEmail: outboxQueueResult.fromEmail, fromName: outboxQueueResult.fromName, recipient: outboxQueueResult.recipient, subject: outboxQueueResult.subject, contentType: outboxQueueResult.contentType, content: outboxQueueResult.content, isTime: outboxQueueResult.isTime, sendTime: (outboxQueueResult.sendTime == null ? null : moment(outboxQueueResult.sendTime).format("YYYY-MM-DD HH:mm:ss")) });
            return res.myJsonReponse({ result: 1, message: null });
        }).catch(function(err) {
            return res.myJsonReponse({ result: 0, message: err });
        });
    },
    /**************************
     * 发件根据类别获取模板
     */
    templateByCategory: function(req, res) {
        var categoryId = req.param("categoryId");
        ETemplate.find({ categoryId: categoryId }).exec(function(err, result) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            } else {
                return res.myJsonReponse({ result: result, message: null });
            }
        });

    },
    sendEmail: function(req, res) {
        var categoryId = req.param('categoryId', -1);
        var recipient = req.param('recipient');
        var subject = req.param('subject');
        var contentType = req.param('contentType');
        var content = req.param('content');
        var isTime = req.param('isTime');
        var sendTime = req.param('sendTime');
        SSetting.find().then(function(setting) {
            EOutbox.create({
                categoryId: categoryId,
                fromEmail: setting[0].fromAddress,
                fromName: setting[0].fromName,
                recipient: recipient,
                subject: subject,
                contentType: contentType,
                content: content,
                sendTime: moment((sendTime == "" ? new Date() : sendTime)).format("YYYY-MM-DD HH:mm:ss"),
                isTime: isTime,
                type: 0,
                userId: req.session.user.id
            }).then(function(entiy) {
                SqlLogsService.WriteLogs(req, 0, 'Send Mail,MailInfo:' + JSON.stringify(entiy));
                var outboxQueueEntiy = EOutboxQueue.create({
                    outboxId: entiy.id,
                    fromEmail: setting[0].fromAddress,
                    fromName: setting[0].fromName,
                    recipient: recipient,
                    subject: subject,
                    contentType: contentType,
                    content: content,
                    sendTime: moment((sendTime == "" ? new Date() : sendTime)).format("YYYY-MM-DD HH:mm:ss"),
                    isTime: isTime
                }).then(function(queueResult) {
                    return queueResult;
                });
                return Promise.all([entiy, outboxQueueEntiy]);
            }).spread(function(outboxEntiy, outboxQueueEntiy) {
                RabbitMQService.SendToQueue({ queue: 'SM', id: outboxEntiy.id, fromEmail: outboxEntiy.fromEmail, fromName: outboxEntiy.fromName, recipient: outboxEntiy.recipient, subject: outboxEntiy.subject, contentType: outboxEntiy.contentType, content: outboxEntiy.content, isTime: (outboxEntiy.isTime == "1" ? true : false), sendTime: moment(outboxEntiy.sendTime).format("YYYY-MM-DD HH:mm:ss") });
                return res.myJsonReponse({ result: result, message: null });
            }).catch(function(err) {
                return res.myJsonReponse({ result: 0, message: err });
            });

        }).catch(function(err) {
            return res.myJsonReponse({ result: 0, message: err });
        });
    }
};