'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'jquery_ui'
], function(_, $, Backbone, _commonObject) {


    var object = {};

    object.initTextFocus = function() {
        var InputFocus = Backbone.View.extend({
            events: {
                'focus': 'focusClick'
            },
            el: '#username,#password',
            focusClick: function(evt) {
                if ($(evt.currentTarget).val() == "username")
                    $(evt.currentTarget).val('');
                if ($(evt.currentTarget).val() == "password")
                    $(evt.currentTarget).val('');
            }
        });
        return new InputFocus();
    };
    object.initMobileMenu = function() {
        var CheckFocus = Backbone.View.extend({
            events: {
                'click': 'menuClick'
            },
            el: "#nav-btn",
            menuClick: function(evt) {
                if ($(evt.currentTarget).hasClass("active")) {
                    $(evt.currentTarget).removeClass("active");
                } else {
                    $(evt.currentTarget).addClass("active");
                }
            }
        });
    };
    /**
     * 登录按钮方法;
     */
    object.handleLogin = function(_objectString, _callBack) {
        var BtnLogin = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },

            el: _objectString,

            handleClick: function() {
                object.doLogin();
                _callBack();
            }
        });
        return new BtnLogin();
    }

  /**
   *  按回车键登录
   *  @param: 提交按钮得对象 (String)
   */
  object.enterHandleClick = function (_objectString) {

      $('body').keydown(function(e){
        var curKey = e.which;
        if(curKey == 13){
          $(""+_objectString).click();
          return false;
        }
      });

  }


  /**
     * 点了登录时候执行得方法
     */
    object.doLogin = function() {

        var username = $("#username").val();
        var password = $("#password").val();

        if (username && password) {

            var data = {
                username: username,
                password: password
            }

            $.ajax({
                type: "POST",
                async: true,
                url: "/loginPost",
                dataType: 'json',
                data: data,
                success: function(data, status) {

                    if (status == 'success') {
                        if (data.result) {
                            window.location.href = "/home";
                        } else {
                            _commonObject.ccdAlert("Username or Password Incorrect.");
                        }
                    } else {
                        _commonObject.ccdAlert("Server Error.");
                    }
                },
                error: function(err) {
                    _commonObject.ccdAlert("Username or Password Incorrect.");
                }
            });

        } else {
            _commonObject.ccdAlert("Username && Password CANNOT be Null.");
        }
    }


    /**
     * 构造函数;
     */
    object.constructor = function() {

        object.handleLogin('#btn-login', function() {});
        object.enterHandleClick('#btn-login');
        object.initTextFocus();
        object.initMobileMenu();
    }


    return object;

});
