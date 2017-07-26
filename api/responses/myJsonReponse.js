/*******************自定义JSON返回格式********************/
module.exports = function(jsonMsg) {
    var req = this.req;
    var res = this.res;
    var statusCode = 200;

    var result = {
        status: statusCode
    };
    if (jsonMsg) {
        result.result = jsonMsg.result;
        result.message = jsonMsg.message;
    }
    return res.status(result.status).json(result);
};