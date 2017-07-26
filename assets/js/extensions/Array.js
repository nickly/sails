/**********************************Array扩展应用包*********************************/
'use strict'
define(function(){

    //扩展Array移出元素方法
    Array.prototype.Remove = function(dx) {
        if (isNaN(dx) || dx > this.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    };
    // 判断数组中包含element元素
    Array.prototype.Contains = function(element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == element) {
                return true;
            }
        }
        return false;
    };
    //获取元素索引
    Array.prototype.Index = function(element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == element) {
                return i;
            }
        }
    };
    //数组去重
    Array.prototype.Unique = function() {
        var n = {},
            r = []; //n为hash表，r为临时数组
        for (var i = 0; i < this.length; i++) //遍历当前数组
        {
            if (!n[this[i]]) //如果hash表中没有当前项
            {
                n[this[i]] = true; //存入hash表
                r.push(this[i]); //把当前数组的当前项push到临时数组里面
            }
        }
        return r;
    };
    //Json数据排序
    Array.prototype.SortJson = function(order, sortBy) {
        var ordAlpah = (order == 'asc') ? '>' : '<';
        var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
        return this.sort(sortFun);
    };

    /*
     *  方法:Array.remove(dx)
     *  功能:根据元素值删除数组元素.
     *  参数:元素值
     *  返回:在原数组上修改数组
     *  作者：pxp
     */
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    };
    Array.prototype.removevalue = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    //求和(推荐计划)
    Array.prototype.PlanSum = function() {
        var sum = 0;
        for (var i = 0; i < this.length; i++)
            sum += parseInt(this[i].CurMaxScore);
        return sum
    };
    //求最大值
    Array.prototype.PlanMax = function() {
        for (var i = 0, maxValue = 0; i < this.length; i++)
            parseInt(this[i].TotalWinLoss) > maxValue && (maxValue = this[i].TotalWinLoss);
        return maxValue
    };

    /*
     *  方法:Array.RemoveItem(item)
     *  功能:删除数组对象中的元素项.
     *  参数:元素
     *  返回:返回一个新的数组对象
     *  作者：zzd
     */
    Array.prototype.RemoveItem = function(item) {
        var newThis = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i] != item) {
                newThis.push(this[i]);
            }
        }
        return newThis;
    }

    return Array;
})