/*******************自定义接口JSON返回格式********************/
module.exports = function(jsonMsg) {
    var req = this.req;
    var res = this.res;
    var statusCode = 200;

    var result = {
        statusCode: statusCode
    };
    if (jsonMsg) {
        result.result = jsonMsg.result;
        result.message = jsonMsg.message;
        result.info = jsonMsg.info;
    }
    return res.json(result);
};