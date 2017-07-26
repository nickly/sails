/**********************************String扩展应用包*********************************/
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('String', function() {
            return factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.String = factory();
    }
}(this, function() {
    //字符串替换
    String.prototype.ReplaceWith = function(obj) {
        var tpl = this.replace(/%7B/gi, '{').replace(/%7D/gi, '}');
        return tpl.replace(/\{\$(\w+)\}/g, function(str, match) {
            if (match in obj) {
                return obj[match];
            } else {
                return str;
            }
        });
    };
    // 给string增加个len ()方法，计算string的字节数
    String.prototype.Len = function() {
        return this.replace(/[^\x00-\xff]/g, "xx").length;
    };
    //数字转换中文
    String.prototype.ConvertToChinese = function() {
        var num = this;
        var N = [
            "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
        ];
        var str = num.toString();
        var len = num.toString().length;
        var C_Num = [];
        for (var i = 0; i < len; i++) {
            C_Num.push(N[str.charAt(i)]);
        }
        return C_Num.join('');
    };
    //数字转换中文
    String.prototype.ConvertToPk10Chinese = function() {
        var num = this;
        var N = ["冠  军", "亚  军", "第三名", "第四名", "第五名", "第六名", "第七名", "第八名", "第九名", "第十名"];
        var str = num.toString();
        return N[parseInt(str) - 1];
    };
    //时间大小对比
    String.prototype.CompareDate = function(endDate) {
        var startDate = this;
        var arr = startDate.split("-");
        var starttime = new Date(arr[0], arr[1], arr[2]);
        var starttimes = starttime.getTime();

        var arrs = endDate.split("-");
        var lktime = new Date(arrs[0], arrs[1], arrs[2]);
        var lktimes = lktime.getTime();

        if (starttimes >= lktimes) {
            return false;
        } else
            return true;
    };
    //时间字符串格式化
    String.prototype.DateFormat = function(format) {
        var dateStr = this;
        /*
         * eg:format="YYYY-MM-dd hh:mm:ss";
         */
        if (typeof dateStr == "string") {
            dateStr = dateStr.replace("T", " ").replace(/-/g, "/");
        }
        var obj = new Date(dateStr);
        var o = {
            "M+": obj.getMonth() + 1, // month
            "d+": obj.getDate(), // day
            "h+": obj.getHours(), // hour
            "m+": obj.getMinutes(), // minute
            "s+": obj.getSeconds(), // second
            "q+": Math.floor((obj.getMonth() + 3) / 3), // quarter
            "S": obj.getMilliseconds()
        }

        if (/(Y+)/.test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? obj.getFullYear() : (obj.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    //字符截取操作 str被截取字符串，len截取长度
    String.prototype.Substring = function(len) {
        var str = this;
        if (str != null && str.length > 0) {
            str = str.replace(/<[^>]+>/g, ""); //去掉所有的html标记
            if (str.length > len) {
                return str.substring(0, len) + "..";
            }
        }
        return str;
    };
    //字符串截取
    String.prototype.Substr = function(len) {
        var str = this;
        var char_length = 0;
        for (var i = 0; i < str.length; i++) {
            var son_str = str.charAt(i);
            encodeURI(son_str).length > 2 ? char_length += 1 : char_length += 0.5;
            if (char_length > len) {
                var sub_len = char_length == len ? i + 1 : i;
                return str.substr(0, sub_len) + "..";
                break;
            }
        }
        return str;
    };
    //首字母转大写
    String.prototype.UpperFirstLetter = function() {
        return this.replace(/\b\w+\b/g, function(word) {
            return word.substring(0, 1).toUpperCase() + word.substring(1);
        });
    };
    String.prototype.SecondsFomartTime = function(formatName) {
        var totalSeconds = parseInt(this);
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
        seconds = Math.round(seconds * 100) / 100;
        var result = "";
        if (hours > 0) {
            result += (hours < 10 ? "0" + hours : hours) + ":";
        }
        result += (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    };
    //将秒数转为时间格式
    String.prototype.SecondsTohhmmss = function() {
        var totalSeconds = parseInt(this);
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
        seconds = Math.round(seconds * 100) / 100;
        var result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    };
    //将秒数转为时间格式
    String.prototype.SecondsTommss = function() {
        var totalSeconds = parseInt(this);
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
        seconds = Math.round(seconds * 100) / 100;
        var result = "";
        result = (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    };
    //时间格式字符串转秒数
    String.prototype.DateToSeconds = function() {
        var d = new Date(this);
        return d.getTime();
    };
    //将数字字符串转为01格式
    String.prototype.FormatInt = function() {
        var num = parseInt(this, 10);
        if (num < 10) {
            return "0" + num;
        }
        return num;
    };
    //字符串转JSON
    String.prototype.FormatJson = function() {
        JSON.parse(this);
    }


    //时间加减
    String.prototype.addDay = function(time, day) {
            var a = new Date(time)
            a = a.valueOf()
            a = a + time * 24 * 60 * 60 * 1000
            a = new Date(a)
            return a;
        }
        //补齐0
    if (!String.prototype.zfill) {
        String.prototype.zfill = function(len) {
            if (len == undefined || typeof len != 'number' || this.length >= len) { return this.toString() }
            return Array(len - this.length + 1).join('0') + this;
        }
    }

    return String;
}));