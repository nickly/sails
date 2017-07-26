/**
 * ApiController
 *
 * @description ::第三方接口调用
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var moment = require('moment');
module.exports = {
    /************
     * 获取Token
     */
    gettoken: function(req, res) {
        SqlLogsService.WriteLogs(req, 1, 'Get Token');
        OAuthService.OAuthInfo(req, true, function(callResult) {
            if (callResult.origin != undefined) {
                if (callResult.origin != null) {
                    req.headers['Access-Control-Allow-Origin'] = callResult.origin;
                }
            }
            if (callResult.ip != undefined && !callResult.ip) {
                return res.myOAuthReponse(callResult);
            }
            if (callResult.result) {
                var token = OAuthService.GetToken(req, function(token) {
                    LogsService.info('【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】Create Token,Appid:' + req.headers.appid + ';token:' + token);
                    return res.myOAuthReponse({ result: true, statusCode: 200, message: '', info: { token: token } });
                });

            } else {
                return res.myOAuthReponse(callResult);
            }
        });

    },
    /******************
     * 刷新Token
     */
    refreshtoken: function(req, res) {
        OAuthService.OAuthInfo(req, true, function(callResult) {
            if (callResult.origin != undefined) {
                if (callResult.origin != null) {
                    req.headers['Access-Control-Allow-Origin'] = callResult.origin;
                }
            }
            if (callResult.ip != undefined && !callResult.ip) {
                return res.myOAuthReponse(callResult);
            }
            if (callResult.result) {
                var token = OAuthService.RefreshToken(req);
                SqlLogsService.WriteLogs(req, 1, 'Refresh Token');
                LogsService.info('【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】Refresh Token, Appid:' + req.headers.appid + ';token:' + token);
                return res.myOAuthReponse({ result: true, statusCode: 200, message: '', info: { token: token } });

            } else {
                return res.myOAuthReponse(callResult);
            }
        });

    },
    /****************
     * 发送邮件
     */
    sendTemplate: function(req, res) {
        OAuthService.OAuthInfo(req, false, function(callResult) {
            if (callResult.origin != undefined) {
                if (callResult.origin != null) {
                    req.headers['Access-Control-Allow-Origin'] = callResult.origin;
                }
            }
            if (callResult.ip != undefined) {
                return res.myOAuthReponse(callResult);
            }
            if (callResult.result) {
                var recipient = req.param('to');
                var templateId = req.param('templateInvokeId');
                var paramArrJson = req.param('params');
                var sendTime = req.param('sendTime');
                LogsService.info('【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】Send Email,Appid:' + req.headers.appid + ';token:' + req.headers.token + ';templateId:' + templateId + ';params:' + paramArrJson + ';recipient:' + recipient + ';sendTime:' + sendTime);
                SqlLogsService.WriteLogs(req, 1, 'Send Email,params:' + paramArrJson + ";templateId:" + templateId);
                if (recipient == "") {
                    return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'recipient param error' });
                }
                if (templateId == "") {
                    return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'templateId param error' });
                }
                if (sendTime == "") {
                    return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'sendTime param error' });
                }
                if (paramArrJson == "") {
                    return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'param error' });
                }
                try {
                    var paramJson = JSON.parse(paramArrJson);
                    var subject = paramJson["SUBJECT"];
                    paramJson.DATE = moment().format("YYYY-MM-DD");
                    paramJson.TIME = moment().format('HH:mm:ss');
                    ETemplate.findOne({ id: templateId }).then(function(emailEntiy) {
                        if (emailEntiy == null) {
                            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'can not find template by id' + templateId });
                        }
                        emailEntiy.subject = emailEntiy.subject.replace('[$SUBJECT]', subject);
                        ETemplateVariable.find({ status: 1 }).then(function(variables) {
                            if (variables.length > 0) {
                                (variables).forEach(function(item) {
                                    if (paramJson.hasOwnProperty(item.code) != undefined) {
                                        if (paramJson[item.code] != undefined) {
                                            emailEntiy.content = emailEntiy.content.replace('[$' + item.code + ']', paramJson[item.code]);
                                        }
                                    }
                                }, this);
                            }
                            LogsService.info('【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】Send Email,Appid:' + req.headers.appid + ';token:' + req.headers.token + ';templateId:' + templateId + ';params:' + paramArrJson + ';recipient:' + recipient + ';sendTime:' + sendTime + ';emailContent:' + emailEntiy.content);
                            SSetting.find().then(function(setting) {
                                emailEntiy.content = emailEntiy.content.replace('[$DATE]', moment().format("YYYY-MM-DD"));
                                emailEntiy.content = emailEntiy.content.replace('[$TIME]', moment().format("HH:mm:ss"));
                                emailEntiy.content = emailEntiy.content.replace('[$FROMNAME]', setting.formName);
                                emailEntiy.content = emailEntiy.content.replace('[$FROMADDR]', setting.formAddress)
                                EOutbox.create({ appId: req.headers.appid, categoryId: emailEntiy.categoryId, fromEmail: setting.fromAddress, fromName: fromName, recipient: recipient, subject: subject, contentType: emailEntiy.contentType, content: emailEntiy.content, createTime: moment().format("YYYY-MM-DD HH:mm:ss"), status: 0, isTime: true, type: 1, sendTime: moment(sendTime).format("YYYY-MM-DD HH:mm:ss") }).then(function(newoutbox) {
                                    var setting = settings[0];
                                    emailEntiy.content = emailEntiy.content.replace('[$FROMNAME]', setting.fromName);
                                    emailEntiy.content = emailEntiy.content.replace('[$FROMADDR]', setting.fromAddress);
                                    var outboxQueue = EOutboxQueue.create({ outboxId: newoutbox.id, fromEmail: newoutbox.fromEmail, fromName: newoutbox.fromName, recipient: newoutbox.recipient, subject: newoutbox.subject, contentType: newoutbox.contentType, content: newoutbox.content, sendTime: newoutbox.sendTime, isTime: newoutbox.isTime }).then(function(queue) {
                                        return queue;
                                    });
                                    return Promise.all([newoutbox, outboxQueue]);
                                }).spread(function(newoutboxResult, outboxQueueResult) {
                                    RabbitMQService.SendToQueue({ queue: 'SM', id: newoutboxResult.id, fromEmail: setting.fromAddress, fromName: setting.fromName, recipient: newoutboxResult, recipient, subject: newoutboxResult.subject, contentType: newoutboxResult.contentType, content: newoutboxResult.content, isTime: newoutboxResult.isTime, sendTime: moment(newoutboxResult.sendTime).format("YYYY-MM-DD HH:mm:ss") });
                                    return res.myOAuthReponse({ result: true, statusCode: 200, info: { emailId: newoutboxResult.id }, message: 'success' });
                                }).catch(function(err) {
                                    return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'param exception.' + err });
                                });


                            });
                        });
                    });
                } catch (ex) {
                    return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'param exception.' + ex });
                }
            } else {

                return res.myOAuthReponse(callResult);
            }
        });

    },
    /****************
     * 批量发送邮件
     */
    sendtemplatelist: function(req, res) {
        var list = req.param('list');
        if (list) {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'list param error' });
        }
        try {
            var sendList = JSON.parse(list);
            for (var i = 0; i < sendList.length; i++) {

            }

        } catch (e) {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'param exception.' + e });
        }
    },
    /*************
     * 更新邮件任务
     */
    updateEmail: function(req, res) {
        var emailS = req.param('emailIds');
        var sendTime = req.param('sendTime');
        SqlLogsService.WriteLogs(req, 1, 'Update Email Status,EmailIDs::' + emailS + ";SendTime:" + sendTime);
        if (emailS == "") {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'email id param error' });
        }
        if (sendTime == "") {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'sendtime param error' });
        }
        try {
            var emailArr = emailS.split(';');
            var idArr = [];
            var outbotIdArr = [];
            for (var i = 0; i < emailArr.length; i++) {
                //idArr.push(emailArr[i]);
                EOutbox.update({ id: parseInt(emailArr[i]) }, { sendTime: moment(sendTime).format("YYYY-MM-DD HH:mm:ss") }).exec(function(err, result) {
                    if (err) {} else {
                        var newoutboxResult = result[0];
                        RabbitMQService.SendToQueue({ queue: 'US', id: newoutboxResult.id, fromEmail: newoutboxResult.fromEmail, fromName: newoutboxResult.fromName, recipient: newoutboxResult.recipient, subject: newoutboxResult.subject, contentType: newoutboxResult.contentType, content: newoutboxResult.content, isTime: newoutboxResult.isTime, sendTime: moment(newoutboxResult.sendTime).format("YYYY-MM-DD HH:mm:ss"), UpdateTime: true });
                    }


                });
            }
            return res.myOAuthReponse({ result: true, statusCode: 200, info: {}, message: 'success' });
            //var outboxUpdateSql = "UPDATE e_outbox set sendTime='" + moment(sendTime) + "' where id in (" + idArr.join(',') + ")";

            // EOutbox.query(outboxUpdateSql).exec(function(err, result) {
            //     var a = err;
            // });
            // EOutbox.query(outboxUpdateSql).then(function(outbox) {
            //     var queue = EOutboxQueue.query(outboxQueueUpdateSql, [moment(sendTime).format("YYYY-MM-DD HH:mm:ss"), idArr.join(',')]).then(function(queue) {
            //         return queue;
            //     });
            //     return Promise.all([outbox, queue]);
            // }).spread(function(newoutboxResult, outboxQueueResult) {
            //     RabbitMQService.SendToQueue({ queue: 'US', id: newoutboxResult.id, fromEmail: newoutboxResult.fromEmail, fromName: newoutboxResult.fromName, recipient: newoutboxResult, recipient, subject: newoutboxResult.subject, contentType: newoutboxResult.contentType, content: newoutboxResult.content, isTime: newoutboxResult.isTime, sendTime: moment(newoutboxResult.sendTime).format("YYYY-MM-DD HH:mm:ss"), UpdateTime: true });
            //     return res.myOAuthReponse({ result: true, statusCode: 200, info: {}, message: 'success' });
            // }).catch(function(err) {
            //     return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'param exception.' + err });
            // });;
        } catch (e) {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'param exception.' + e });
        }
    },
    cancelEmail: function(req, res) {
        var emailS = req.param('emailIds');
        if (emailS == "") {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'email id param error' });
        }
        SqlLogsService.WriteLogs(req, 1, 'Cancle Email Send,EmailIDs::' + emailS);
        var emailArr = emailS.split(';');
        for (var i = 0; i < emailArr.length; i++) {
            RabbitMQService.SendToQueue({ queue: 'US', id: emailArr[i], UpdateTime: false });
        }
        return res.myOAuthReponse({ result: true, statusCode: 200, info: {}, message: 'success' });

    },
    templateList: function(req, res) {
        SqlLogsService.WriteLogs(req, 1, 'Get TemplateList');
        OAuthService.OAuthInfo(req, false, function(callResult) {
            if (callResult.origin != undefined) {
                if (callResult.origin != null) {
                    req.headers['Access-Control-Allow-Origin'] = callResult.origin;
                }
            }
            if (callResult.ip != undefined) {
                return res.myOAuthReponse(callResult);
            }
            if (callResult.result) {
                ETemplateCategory.find({ sort: 'id desc' }).populate('templates').then(function(result) {
                    return res.myOAuthReponse({ result: true, statusCode: 200, info: { dataList: result }, message: 'success' });
                }).catch(function(err) {
                    return res.myOAuthReponse({ result: false, statusCode: 40010, message: 'get error:' + err });
                });
            } else {

                return res.myOAuthReponse(callResult);
            }
        });

    },
    emailStatus: function(req, res) {
        var emailS = req.param('emailIds');
        if (emailS) {
            return res.myOAuthReponse({ result: false, statusCode: 40004, message: 'email id param error' });
        }
        SqlLogsService.WriteLogs(req, 1, 'Get Email Status,EmailIDs::' + emailS);
        var emailArr = emailS.split(';');
        var idArr = [];
        for (var i = 0; i < emailArr.length; i++) {
            idArr.push(emailArr[i]);
        }
        EOutbox.find({ id: idArr }).exec(function(err, result) {
            if (err) {
                return res.myOAuthReponse({ result: false, statusCode: 40010, message: 'get error:' + err });
            }
            var voList = [];
            for (var i = 0; i < result.length; i++) {
                voList.push({ emailId: result[i].id, emailStatusCode: result[i].status, requestTime: result[i].createTime, modifiedTime: result[i].actualSendTime });
            }
            return res.myOAuthReponse({ result: true, statusCode: 200, info: { total: result.length, voList: voList }, message: 'success' });
        });
    }
};