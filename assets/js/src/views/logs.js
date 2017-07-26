'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    '../../extensions/String',
    'jquery_ui',
], function(_, $, Backbone, _commonObject) {

    var object = {};


    /**
     *   导航导出execl
     */
    object.exportExecl = function(){

        _commonObject.navHandleClick('#exportBtn',function(){

                 var _action = '/exportExeclPost';

                 var _data = {};

                _commonObject.AsyncRequestPost(_action, _data, function (_result) {

                       console.log(_result);

                });

        });
    }


  /**
   * 点击分页按钮函数方法;
  *  分页对象（String）
  */
  object.pageHandle = function (_objectString) {

      var PageHandle  = Backbone.View.extend({
          events:{
              'click a': 'handleClick'
          },
          el: _objectString,
          handleClick: function (evt) {

              var _this = $(evt.currentTarget);

              $('#pageContent a').removeClass('active');
              _this.addClass('active');

              $('#pageHidden').val(_this.attr('data'));

              var _stateValue      = $('#categoryHidden').val();
              var _orderByValue = $('#orderByHidden').val();

              object.doSearchForLogs(parseInt(_this.attr('data')), _stateValue, _orderByValue);

          }
      })

      return new PageHandle();
  }



  /**
   *  分页函数方法(用于搜索角色列表);
   *  @param: 需要读取第几页的内容;
   *  @param: 筛选得状态;
   */
   object.doSearchForLogs = function(_pageIndex, _state, _orderBy){

         if(_pageIndex == undefined){
             console.log('分页id不能为空, 分页的类型不能为空！');
             return;
         }else{

             var _searchValue = $("input[name='search']").val();

             var _data = {
                 pageIndex: _pageIndex,
                 searchValue: _searchValue,
                 category: _state,
                 orderBy: _orderBy
             }
             var _action='/searchLogsPost';

             _commonObject.AsyncRequestPost(_action, _data, function (_result) {

                 /**  重新渲染表格 */
                 object.bindList('#logsList', _result.logsListResult );

                 /** 绑定分页 */
                 object.bindPage('#pageContent', _pageIndex , _result.pageInfo.PageCount);

             })

         }

   }

   /**
    *  切换筛选状态;
    *  @param: 对象(String);
   */
   object.filterSort = function (_objectString) {

       var FilterSort = Backbone.View.extend({
           events:{
               'click a': 'handleClick'
           },
           el: _objectString,
           handleClick: function (evt) {

               var _this = $(evt.currentTarget);

               /** 修改当前选中状态 */
               _this.parent().find('a').removeClass('active');
               _this.addClass('active');

               /** 判断当前切换是状态切换还是排序切换 */
               if(_this.attr('data-type') == 'category'){
                   $('#categoryHidden').val(_this.attr('data-state'));
               }else if(_this.attr('data-type') == 'order'){
                   $('#orderByHidden').val(_this.attr('data-state'));
               }

               /** 获取筛选条件得值 */
               var _stateValue =$('#categoryHidden').val();
               var _orderByValue = $('#orderByHidden').val();

               /**  搜索输入框内得内容，搜索角色列表 */
              object.doSearchForLogs(1,_stateValue, _orderByValue);
              $("#pageHidden").attr('data-type', 'searchLogs');

           }
       })

       return new FilterSort();
   }


  /**
   * 点击搜索函数方法;
   * 搜索按钮对象（String）
   */
  object.searchLogs = function (_objectString) {

       var SearchLogs = Backbone.View.extend({
          events:{
             'click': 'handleClick'
          },
          el:_objectString,
          handleClick: function (evt) {

               var _this = $(evt.currentTarget);
               var _searchValue = $("input[name='search']").val();

               var _stateValue =$('#categoryHidden').val();
               var _orderByValue = $('#orderByHidden').val();

                /**  搜索输入框内得内容，搜索角色列表 */
               object.doSearchForLogs(1,_stateValue, _orderByValue);
               $("#pageHidden").attr('data-type', 'searchLogs');
           }
       })

       return new SearchLogs();

  }

  /**
   *  删除其中一条日志信息;
   *  @param: 对象;
   */
  object.deleteLogs = function (_objectString) {

        var DeleteLogs = Backbone.View.extend({

            events:{
               'click a': 'handleClick'
            },
            el: _objectString,
            handleClick: function (evt) {

                 var _this = $(evt.currentTarget);

                 var _logsID = _this.parent().parent().attr('data-id');


                  _commonObject.ccdConfirm("are you sure delete this logs ?", function () {

                          var _action = '/deleteLogsPost';
                          var _data    ={
                            id: _logsID
                          }

                          _commonObject.AsyncRequestPost(_action, _data, function (_result) {

                                /**  重新渲染表格 */
                                object.bindList('#logsList', _result.logsListResult );

                                /** 绑定分页 */
                                object.bindPage('#pageContent', _pageIndex , _result.pageInfo.PageCount);

                          })

                  }, function () {

                       return;

                  })


             }
        })

        return new DeleteLogs();

  }


    /**
     * 绑定分页;
     * @param: 分页对象;
     * @param: 当前是第几页;
     * @param: 总共多少页;
     */
     object.bindPage = function (_objectString, _pageIndex, _pageCount) {

          if(_objectString == undefined || _pageIndex == undefined || _pageCount==undefined){
               console.log("分页的条件不能为空");
               return;
          }else{

              var _pageString = "";

              for(var i=1; i<= _pageCount; i++){
                  if(i == parseInt(_pageIndex)){
                      _pageString += '<a class="filter-page-item filter-page-item-1  active" data="'+i+'">'+i+'</a>'
                  }else{
                      _pageString += '<a class="filter-page-item filter-page-item-1" data="'+i+'">'+i+'</a>';
                  }
              }

              $(''+_objectString).html('').append(_pageString);
          }
     }


   /**
   * 绑定日志列表;
    * @param: 表格对象;
    * @param: 需要绑定得数据对象;
   */
    object.bindList = function (_tableObject, _dateObject) {

          if(_dateObject){

             var _objectString = '';
             var _headerString = '<tr class="head">' +
                 '<td class="user-item" width="10%">ID</td>' +
                 '<td class="user-item" width="30%">ACTION</td>' +
                 '<td class="user-item" width="25%">IP</td>' +
                 '<td class="user-item" width="25%">CREATE  TIME</td>' +
                 '<td class="user-item"  width="10%"></td></tr>'


             var _stateString  ="";

              _dateObject.map(function (item, index) {

                   _objectString+='<tr data-id="'+item.id+'">';
                   _objectString+='<td  class="user-item  logs-id" valign="middle" width="10%">'+item.id+'</td>';
                   _objectString+='<td class="user-item   logs-action" valign="middle" width="30%">'+ object.substrString(item.action, 0 , 20) +'</td>';
                   _objectString+='<td class="user-item   logs-ip" valign="middle" width="25%">'+ item.ip +'</td>';
                   _objectString+='<td class="user-item   logs-createTime" valign="middle"   width="25%" >'+object.dateFormat(item.createTime, 'YY/MM hh:mm:ss')+'</td>';
                   _objectString+='<td class="user-item  align-left" valign="middle" width="10%">';
                   _objectString+='<a class="btn-city btn-delete">Del</a>';
                   _objectString +='</tr>';

              });

              $(''+_tableObject+" table").html('');
              $(''+_tableObject+" table").append(_headerString);
              $(''+_tableObject+" table").append(_objectString);

          }else{
              console.log("绑定得对象_dateObject不能为空!");
              return;
          }
    }


  /**
   * 时间字符串格式化
   */

  object.dateFormat = function(string, format) {
          var dateStr = string;
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

  /**
   *  截取字符串
   */
   object.substrString = function (_string, _start, _length) {
       return  _string.substr(_start, _length)
   }


  /**
     * 构造函数;
     */
    object.constructor = function() {

        /** 导航选择添加角色 */
        object.exportExecl();

        /** 搜索角色列表 */
        object.searchLogs('#searchBtn');

        /** 点击分页 */
        object.pageHandle('#pageContent');

        /** 删除user列表中得其中一列 */
        object.deleteLogs('#logsList');

        /** 切换状态筛选列表 */
        object.filterSort('#filter-category');

        /** 切换正倒序 */
        object.filterSort('#filter-orderBy');

    }

    return object;

});
