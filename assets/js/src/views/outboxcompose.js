'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'jquery-mousewheel',
    'datetimepicker',
    'moment',
    'jquery_ui',
    'tinymce'
], function(_, $, Backbone, _commonObject, mousewheel, datetimepicker, moment) {


    var object = {};
    var htmlContentObj = null;
    var txtContentObj = null;
    $.datetimepicker.setLocale('en');
    object.initTinymce = function(contentType) {
        $('#txtTime').datetimepicker();
        htmlContentObj = tinymce.init({
            selector: '#txtHtmlContent',
            height: 500,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code'
            ],
            toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | Variables',
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css'
            ]
        });
        txtContentObj = tinymce.init({
            selector: '#txtTextContent',
            height: 500,
            menubar: false,
            plugins: [],
            toolbar: 'undo redo',
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                '//www.tinymce.com/css/codepen.min.css'
            ]
        });

    };
    /***********************
     * 分类点击
     */
    object.handleRadioClick = function() {
        var RadioClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '.pd-data-radio',
            handleClick: function(evt) {
                switch ($(evt.currentTarget).attr("data-action")) {
                    case "category": //类别
                        $('a[data-action="category"]').removeClass('active');
                        $(evt.currentTarget).addClass('active');
                        $("#txtCategoryId").val($(evt.currentTarget).attr("data-value"));
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: '/outbox/templateByCategory',
                            data: { categoryId: $(evt.currentTarget).attr("data-value") },
                            success: function(data, status) {
                                var templateObj = $("#templateSelect");
                                if (status == 'success') {
                                    templateObj.empty();
                                    if (data.result) {
                                        templateObj.append('<option value="-1">==SELECTED CATEGORY==</option>');
                                        for (var i = 0; i < data.result.length; i++) {
                                            templateObj.append("<option value='" + data.result[i].id + "'>" + data.result[i].name + "</option>");
                                        }
                                    }
                                } else {
                                    _commonObject.ccdAlert("Server Error.");
                                }
                            },
                            error: function(err) {
                                _commonObject.ccdAlert("Server Error.");
                            }
                        });
                        break;
                    case "contentType":
                        $('a[data-action="contentType"]').removeClass('active');
                        $(evt.currentTarget).addClass('active');
                        $("#txtContentType").val($(evt.currentTarget).attr("data-value"));
                        console.log(tinyMCE.editors);
                        if ($(evt.currentTarget).attr("data-value") == "1") {
                            tinymce.get('txtHtmlContent').show();
                            tinymce.get('txtTextContent').hide();
                            $("#txtHtmlContent").hide();
                            $("#txtTextContent").hide();
                        } else {
                            tinymce.get('txtHtmlContent').hide();
                            tinymce.get('txtTextContent').show();
                            $("#txtHtmlContent").hide();
                            $("#txtTextContent").hide();
                        }
                        break;
                    case "isTime":
                        $('a[data-action="isTime"]').removeClass('active');
                        $(evt.currentTarget).addClass('active');
                        var isTime = $(evt.currentTarget).attr("data-value");
                        $("#txtIsTime").val($(evt.currentTarget).attr("data-value"));
                        if (isTime) {
                            $("#timeContainer").show();
                            $("#txtTime").attr("disabled", false);
                        } else {
                            $("#timeContainer").hide();
                            $("#txtTime").attr("disabled", true);
                        }
                        break;
                }
            }
        });
        return new RadioClick();
    };
    /***********
     * 选择模板
     */
    object.handleSelectClick = function() {
        var SaveClick = Backbone.View.extend({
            events: {
                'change': 'handleClick'
            },
            el: '#templateSelect',
            handleClick: function(evt) {
                var selectValue = $(evt.currentTarget).val();
                if (selectValue != "-1") {
                    $.ajax({
                        url: '/template/templateInfo',
                        dataType: 'json',
                        type: 'POST',
                        data: { id: selectValue },
                        success: function(data, status) {
                            if (status == 'success') {
                                if (data.result) {
                                    tinyMCE.editors["txtTextContent"].setContent("");
                                    tinyMCE.editors["txtHtmlContent"].setContent("");
                                    $("#txtSubject").val(data.result.subject);
                                    $("#txtContentType").val(data.result.contentType);
                                    $('a[data-action="contentType"]').removeClass("active");
                                    $('a[data-action="contentType"]').each(function(index, item) {
                                        if ($(item).attr("data-value") == data.result.contentType.toString()) {
                                            $(item).addClass("active");
                                        }
                                    });
                                    //console.log(tinyMCE.editors);
                                    switch (data.result.contentType) {
                                        case 0:
                                            tinymce.get('txtHtmlContent').hide();
                                            tinymce.get('txtTextContent').show();
                                            $("#txtHtmlContent").hide();
                                            $("#txtTextContent").hide();
                                            tinyMCE.editors["txtTextContent"].setContent(data.result.content);
                                            tinyMCE.editors["txtHtmlContent"].setContent(data.result.content);
                                            break;
                                        case 1:
                                            tinymce.get('txtHtmlContent').show();
                                            tinymce.get('txtTextContent').hide();
                                            $("#txtHtmlContent").hide();
                                            $("#txtTextContent").hide();
                                            tinyMCE.editors["txtTextContent"].setContent(data.result.content);
                                            tinyMCE.editors["txtHtmlContent"].setContent(data.result.content);
                                            break;
                                    }
                                }
                            } else {
                                _commonObject.ccdAlert("Can not find email template detail.");
                            }
                        },
                        error: function(err) {
                            _commonObject.ccdAlert("Server Error.");
                        }
                    });
                }
            }
        });
        return new SaveClick();
    };
    /*********************
     * 保存按钮点击
     */
    object.handleSaveClick = function() {
        var SaveClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '#saveBtn',
            handleClick: function(evt) {
                object.doAdd();
            }
        });
        return new SaveClick();
    };
    object.doAdd = function() {
        var categoryId = $("#txtCategoryId").val();
        var subject = $("#txtSubject").val();
        var recipient = $("#txtRecipient").val();
        var contentType = $("#txtContentType").val();
        var content = "";
        if (contentType) {
            content = tinyMCE.editors["txtHtmlContent"].getContent();
        } else {
            content = tinyMCE.editors["txtTxtContent"].getContent();
        }
        var isTime = $("#txtIsTime").val();
        var sendTime = $("#txtTime").datetimepicker('getValue');
        if (subject == "") {
            _commonObject.ccdAlert("Subject can not be null.");
            return;
        }
        if (recipient == "") {
            _commonObject.ccdAlert("Recipient can not be null.");
            return;
        }
        if (content == "") {
            _commonObject.ccdAlert("Contet can not be null.");
            return;
        }
        if (isTime) {
            if (sendTime == "") {
                _commonObject.ccdAlert("SendTime can not be null.");
                return;
            }
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/outbox/send',
            data: { categoryId: categoryId, subject: subject, recipient: recipient, contentType: contentType, content: content, isTime: isTime, sendTime: sendTime },
            success: function(data, status) {
                if (status == 'success') {
                    if (data.result) {
                        window.location.href = '/outbox';
                    }
                } else {
                    _commonObject.ccdAlert("Can not send the email.");
                }
            }
        });
    };

    /**
     * 构造函数; 
     */
    object.constructor = function() {
        object.handleRadioClick();
        object.handleSaveClick();
        object.handleSelectClick();
    }


    return object;

});