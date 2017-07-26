'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'jquery_ui'
], function(_, $, Backbone, _commonObject) {


    var object = {};
    /****************
     * 是否禁用点击事件
     */
    object.handleStatusClick = function() {
        var StatusClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },

            el: '.pd-data-radio',

            handleClick: function(evt) {
                var type = $(evt.currentTarget).attr("data-type");
                switch (type) {
                    case "status":
                        $("#txtEnable").val($(evt.currentTarget).attr("data-value"));
                        $("a[data-type='status']").removeClass('active');
                        break;
                }
                $(evt.currentTarget).addClass("active");
            }
        });
        return new StatusClick();
    };
    object.handleSaveClick = function() {
        var SaveClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },

            el: '#saveBtn',

            handleClick: function(evt) {
                var txtEnabled = $("#txtEnable").val();
                var txtDomain = $("#txtDomain").val();
                var txtIP = $("#txtIP").val();
                var txtAPPID = $("#txtAPPID").val();
                var txtAPPSecret = $("#txtAPPSecret").val();
                var txtName = $("#txtName").val();
                if (txtDomain == "" && txtIP == "") {
                    _commonObject.ccdAlert("Domain or IP must be fill in at least one item .");
                    return;
                }
                if (txtName == "") {
                    _commonObject.ccdAlert("Partner Name can not be null.");
                    return;
                }
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/oauth/save',
                    data: { enabled: txtEnabled, name: txtName, domain: txtDomain, ip: txtIP, appid: txtAPPID, appsecret: txtAPPSecret },
                    success: function(data, status) {

                        if (status == 'success') {
                            if (data.result) {
                                window.location.href = '/oauth';
                            }
                        } else {
                            _commonObject.ccdAlert("Server Error.");
                        }
                    },
                    error: function(err) {
                        _commonObject.ccdAlert("Server Error.");
                    }
                });
            }
        });
        return new SaveClick();
    };
    /**
     * 构造函数; 
     */
    object.constructor = function() {
        object.handleStatusClick();
        object.handleSaveClick();
    }


    return object;

});