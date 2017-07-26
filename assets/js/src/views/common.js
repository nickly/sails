'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
], function(_, $, Backbone) {


    var object = {};

    object.htmlEncode= function(_value){
      return $('<div/>').text(_value).html();
    }

    object.htmlEscape= function(_str){
        return _str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    object.getQueryString= function(_name){
        var reg = new RegExp("(^|&)" + _name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }


    object.ccdAlert= function(_text, _callback){

        $("#tip-alert-text").html( _text );
        $("#tip-alert").addClass("active");
        $("#tip-alert-layer").addClass("active");

        $("#tip-alert-btn").unbind("click");
        $("#tip-alert-btn").click(function(){

            $("#tip-alert").removeClass("active");
            $("#tip-alert-layer").removeClass("active");

            if( typeof(_callback) == 'function' ){
                _callback();
            }
        });
    }

    object.ccdInfo = function(_text){

        $("#tip-info-text").html(_text);
        $("#tip-info").addClass("active");
        $("#tip-info-layer").addClass("active");

    }

    object.ccdCloseInfo = function(){

        $("#tip-info").removeClass("active");
        $("#tip-info-layer").removeClass("active");

    }

    object.ccdConfirm = function(_text, _confirmed, _canceled){

        $("#tip-confirm-text").html( _text );
        $("#tip-confirm").addClass("active");
        $("#tip-confirm-layer").addClass("active");

        $("#tip-confirm-btn1").unbind("click");
        $("#tip-confirm-btn1").click(function(){

            $("#tip-confirm").removeClass("active");
            $("#tip-confirm-layer").removeClass("active");

            if( typeof(_confirmed) == 'function' ){
                _confirmed();
            }
        });

        $("#tip-confirm-btn2").unbind("click");
        $("#tip-confirm-btn2").click(function(){

            $("#tip-confirm").removeClass("active");
            $("#tip-confirm-layer").removeClass("active");
            if( typeof(_canceled) == 'function' ){
                _canceled();
            }
        });
    }

    /**
     *  封装ajax方法;
     *  @param: url(String);
     *  @param: 参数(Object);
     *  @param: 回调函数(Func)
     */
     object.AsyncRequestPost = function (_url, _data, _callback) {

         if(_url == undefined || _data ==undefined ){
              console.log("request param is undefined!");
              return;
         }else{

             $.ajax({
                 type: "POST",
                 async: true,
                 url: _url,
                 dataType: 'json',
                 data: _data,
                 success: function (data, status) {

                     if(status == 'success'){

                         if(data.result !=undefined){

                             if( typeof(_callback) == 'function' ){
                                 _callback(data.result);
                             }

                         }else{
                             object.ccdAlert("request  is  unsuccess! ");
                         }
                     }else{
                         object.ccdAlert("Server Error!");
                     }
                 },
                 error:function (err) {
                     object.ccdAlert("Request Error!");
                 }
             })

         }

     }

    /**
     *  自定义chackbox事件;
     *  @param: 对象(String);
     *  @param: 回调函数(Func);
     */
    object.handleClickForCheck = function(_objectString,_callBack){
       var HandleClienForCheck = Backbone.View.extend({
          events:{
            'click .list-btn':'handleClick'
          },
          el:_objectString,
          handleClick: function(evt){

             var _this   =  $(evt.currentTarget);
             var _id      =  _this.parent().parent().attr('data-id');
             var _state = _this.attr('data-state');

              if( typeof(_callBack) == 'function' ){
                  _callBack(_this,_id,_state);
              }
          }
       });
       return new HandleClienForCheck();
    }

    /**
     *  导航点击方法;
     *  @param: 对象(String);
     *  @param: 回调函数(func)
     */
    object.navHandleClick = function(_objectString,_callback){
        var NavHandleClick = Backbone.View.extend({
          events:{
            'click':'handleClick'
          },
          el:_objectString,
          handleClick: function(){

              if( typeof(_callback) == 'function' ){
                _callback();
            }
          }
        });
        return new NavHandleClick;
    }

return object;

});
