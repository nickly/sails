/*********************加解密服务*********************/
var crypto = require('crypto');
module.exports = {
    Md5: function(str) {
        var decipher = crypto.createHash('md5');
        return decipher.update(str).digest('hex');
    }
};