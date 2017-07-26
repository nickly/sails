/**************************
 * 请求服务
 */
module.exports = {
    //获取请求IP
    getClientIp: function(req) {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    ///获取Access-Control-Allow-Origin
    getOrigin: function(req) {
        return req.headers.origin;
    }
}