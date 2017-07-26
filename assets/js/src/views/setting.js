'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'jquery_ui',
    'tinymce'
], function(_, $, Backbone, _commonObject) {


    var object = {};
    object.handleSubmitClick = function() {
        var SubmitClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '#saveBtn',
            handleClick: function(evt) {
                object.doSetting();
            }
        });
        return new SubmitClick();
    };
    object.doSetting = function() {
        var oldPwd = $("#txtOldPassword").val();
        var newPwd = $("#txtNewPassword").val();
        var confirmPwd = $("#txtConfimPassword").val();
        if (oldPwd == "") {
            _commonObject.ccdAlert('Old Password can not be Null.');
            return;
        }
        if (newPwd == "") {
            _commonObject.ccdAlert('New Password can not be Null.');
            return;
        }
        if (newPwd != confirmPwd) {
            _commonObject.ccdAlert('Confirm Password must be equals New Password.');
            return;
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/settingPost',
            data: { old: oldPwd, new: confirmPwd },
            success: function(data, status) {
                if (status == 'success') {
                    if (data.result) {
                        $("#txtOldPassword").val("");
                        $("#txtNewPassword").val("");
                        $("#txtConfimPassword").val("");
                        window.location.href = '/login';
                    } else {
                        _commonObject.ccdAlert(data.message);

                    }
                } else {
                    _commonObject.ccdAlert("Server Error.");
                }
            },
            error: function(err) {
                _commonObject.ccdAlert("Server Error.");
            }
        });
    };


    /**
     * 构造函数; 
     */
    object.constructor = function() {
        object.handleSubmitClick();
    }


    return object;

});