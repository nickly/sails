/****************************
 * 第三方接口验证服务
 */
var Util = require('../../assets/js/extensions/Util');
var url = require('url');
var Redis = require('ioredis');
var redis = new Redis({
    port: 6389,
    host: '119.29.7.237',
    db: 1
});
module.exports = {
    OAuthInfo: function(req, default_token, callBack) {
        var appId = req.headers.appid;
        var appSecret = req.headers.appsecret;
        var callResult = {};
        try {
            EOAuth.findOne({ appId: appId, appSecret: appSecret, status: 1 }).then(function(result) {
                if (result != null && result.id > 0) {
                    var ip = RequestService.getClientIp(req);
                    var origin = RequestService.getOrigin(req);
                    var isValid = true;
                    if (result.domain) {
                        var domainArr = result.domain.split(';');
                        if (domainArr.length > 0 && domainArr.indexOf(origin) != -1) {
                            callResult.origin = origin;
                            callResult.result = true;
                            //res.header("Access-Control-Allow-Origin", origin);

                        } else {
                            isValid = false;
                            callResult.origin = null;
                            callResult.statusCode = 40001;
                            callResult.result = false;
                            callResult.message = "Access-Control-Allow-Origin not valid";
                        }
                    }
                    if (result.ip) {
                        var ipArr = result.ip.split(';');
                        if (ipArr.length > 0 && ipArr.indexOf(ip) != -1) {
                            isValid = isValid & true;
                            callResult.ip = true;
                            callResult.result = callResult.result & true;
                        } else {
                            isValid = false;
                            callResult.ip = false;
                            callResult.result = false;
                            callResult.statusCode = 40001;
                            callResult.message = "IP not valid";
                        }
                    }
                    if (isValid) {
                        if (default_token) {
                            callResult.result = true;
                            callResult.statusCode = 200;
                            callBack(callResult);
                            return;
                        } else {
                            if (req.headers.token == undefined || req.headers.token == "") {
                                callResult.result = false;
                                callResult.statusCode = 40003;
                                callResult.message = "token can not be null";
                                callBack(callResult);
                                return;
                            }
                            if (req.headers.timestamp == undefined || req.headers.timestamp == "") {
                                callResult.result = false;
                                callResult.statusCode = 40003;
                                callResult.message = "timestamp can not be null";
                                callBack(callResult);
                                return;
                            }
                            if (req.headers.signature == undefined || req.headers.signature == "") {
                                callResult.result = false;
                                callResult.statusCode = 40003;
                                callResult.message = "signature can not be null";
                                callBack(callResult);
                                return;
                            } else {
                                var timestamp = req.headers.timestamp;
                                if (!isNaN(timestamp)) {
                                    if ((new Date()).getTime() - timestamp > 1 * 60 * 60 * 1000) {
                                        callResult.result = false;
                                        callResult.statusCode = 40004;
                                        callResult.message = "timestamp expire,default timeout is 3600s.";
                                        callBack(callResult);
                                        return;
                                        //return res.myOAuthReponse({ result: false, statusCode: 40005, message: 'timestamp expire,default timeout is 3600s.' });
                                    } else {
                                        OAuthService.GetCacheToken(req, function(token) {
                                            if (token == undefined || token == null) {
                                                callResult.result = false;
                                                callResult.statusCode = 40005;
                                                callResult.message = "token expire,default timeout is 3600s.";
                                                callBack(callResult);
                                                return;
                                                //return res.myOAuthReponse({ result: false, statusCode: 40007, message: 'token expire,default timeout is 3600s.' });
                                            } else if (token != req.headers.token) {
                                                callResult.result = false;
                                                callResult.statusCode = 40005;
                                                callResult.message = "token error.";
                                                callBack(callResult);
                                                return;
                                                //return res.myOAuthReponse({ result: false, statusCode: 40008, message: 'token error.' });
                                            } else {
                                                var signature = OAuthService.GetSignature(timestamp, req.headers.nonce, req.headers.appid, req.headers.appsecret, token);

                                                if (signature != req.headers.signature) {
                                                    callResult.result = false;
                                                    callResult.statusCode = 40006;
                                                    callResult.message = "signature error.";
                                                    callBack(callResult);
                                                    return;
                                                    // return res.myOAuthReponse({ result: false, statusCode: 40009, message: 'signature error.' });
                                                } else {
                                                    callResult.result = true;
                                                    callResult.statusCode = 200;
                                                    callBack(callResult);
                                                    return;
                                                }
                                            }
                                        });

                                    }
                                } else {
                                    callResult.result = false;
                                    callResult.statusCode = 40006;
                                    callResult.message = "timestamp valid failed";
                                    //return res.myOAuthReponse({ result: false, statusCode: 40006, message: 'timestamp valid failed' });
                                }
                            }
                        }

                    } else {
                        //callResult.result = false;
                        callResult.statusCode = 40001;
                        callBack(callResult);
                        return;
                        //callResult.message = "access valid failed";
                        //return res.myOAuthReponse({ result: false, statusCode: 40002, message: 'access valid failed' });
                    }
                } else {
                    callResult.result = false;
                    callResult.statusCode = 40002;
                    callResult.message = "appid is valid failed";
                    callBack(callResult);
                    return;
                }

            }).catch(function(err) {
                callBack({ result: false, statusCode: 504, message: err });
            });
        } catch (ex) {}
    },
    //获取Token
    GetToken: function(req, callBack) {
        redis.get('tokens-' + req.headers.appid, function(err, result) {
            if (result == undefined || result == null) {
                var token = Util.createGuid();
                var appId = req.headers.appid;
                redis.set('tokens-' + req.headers.appid, token);
                callBack(token);
            } else {
                callBack(result);
            }
        });
        // if (req.session.tokens == undefined || req.session.tokens == null) {
        //     var token = Util.createGuid();
        //     var appId = req.headers.appid;
        //     req.session.tokens = [];
        //     req.session.tokens.push({ appId: req.headers.appid, token: token });
        //     return token;
        // } else {
        //     var filterValue = req.session.tokens.filter(function(item) {
        //         return item.appId == req.headers.appid;
        //     });
        //     if (filterValue.lenth = 0) {
        //         req.session.tokens.push({ appId: req.headers.appid, token: Util.createGuid() });
        //     } else
        //         return filterValue[0].token;
        // }
    },
    RefreshToken: function(req, callBack) {
        redis.get('tokens-' + req.headers.appid, function(err, result) {
            var token = Util.createGuid();
            var appId = req.headers.appid;
            redis.set('tokens-' + req.headers.appid, token);
            callBack(token);
        });
        // var token = Util.createGuid();
        // if (req.session.tokens) {
        //     var appId = req.headers.appid;
        //     req.session.tokens = [];
        //     req.session.tokens.push({ appId: req.headers.appid, token: token });
        //     return token;
        // } else {
        //     var filterValue = req.session.tokens.filter(function(item) {
        //         return item.appId == req.headers.appid;
        //     });
        //     if (filterValue.lenth = 0) {
        //         req.session.tokens.push({ appId: req.headers.appid, token: token });
        //     } else
        //         filterValue[0].token = token;
        // }
        // return token;
    },
    GetCacheToken: function(req, callBack) {
        redis.get('tokens-' + req.headers.appid, function(err, result) {
            callBack(result);
        });
        // if (req.session.token) {
        //     return null;
        // } else {
        //     var filterValue = req.session.tokens.filter(function(item) {
        //         return item.appId == req.headers.appid;
        //     });
        //     if (filterValue.lenth > 0) {
        //         return filterValue[0].token;
        //     } else
        //         null;
        // }
    },
    GetSignature: function(timestamp, nonce, appId, appSecret, token) {
        var paramArg = [];
        paramArg.push({ key: timestamp, value: timestamp });
        paramArg.push({ key: nonce, value: nonce });
        paramArg.push({ key: appId, value: appId });
        paramArg.push({ key: appSecret, value: appSecret });
        paramArg.push({ key: token, value: token });
        var sortArr = paramArg.sort(function(a, b) {
            return a.key + "" > b.key + "";
        });
        var data = "";
        for (var i = 0; i < sortArr.length; i++) {
            data += sortArr[i].key;
        }

        console.log(data);
        return CryptoService.Md5(data);
    }
}