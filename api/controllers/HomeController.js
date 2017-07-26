/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var moment = require('moment');
var actionCode = "";
module.exports = {

    /**
     * `HomeController.index()`
     *  首页
     */
    index: function(req, res) {
        // var q = 'tasks';
        // var open = require('amqplib').connect('amqp://emailSystem:emailSystem@119.29.7.237:5672');
        // open.then(function(conn) {
        //     return conn.createChannel();
        // }).then(function(ch) {
        //     return ch.assertQueue(q).then(function(ok) {
        //         return ch.sendToQueue(q, new Buffer('some'));
        //     });
        // }).catch(function(err) {
        //     console.log(err);
        // });
        //RabbitMQService.SendToQueue({ queue: 'SM', id: '1', fromEmail: 'noreply@gzshuomai.cn', fromName: 'VANS', recipient: 'tongzw@gzshuomai.cn', subject: 'test', contentType: 0, content: '123', isTime: true, sendTime: moment().add(1, 'minute').format("YYYY-MM-DD HH:mm:ss") });
        // RabbitMQService.GetToQueue(function(msg) {
        //     console.log(msg);
        // });
        //LogsService.error('test');
        actionCode = "homeindex";
        SqlLogsService.WriteLogs(req, 0, 'Overview');
        MenuService.Menus(req.session.user.id).then(function(result) {
            PolicyService.check(req, actionCode).then(function(list) {
                if (list.length > 0) {
                    ETemplateCategory.find({})
                    return res.view('home', { menus: result, tag: "" });
                } else {
                    return res.forbidden("Sorry,You don't have access.");
                }
            }).catch(function(err) {
                return res.forbidden("Sorry,You don't have access.");
            });

        }).catch(function(err) {
            LogsService.error(err);
        });




    }
};