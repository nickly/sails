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
    var htmlContentObj = null;
    var txtContentObj = null;
    object.initTinymce = function(contentType) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/variables',
            success: function(data, status) {
                if (status == 'success') {
                    if (data.result) {
                        var list = [];
                        list.push({ text: 'Template Variables', value: '' });
                        for (var i = 0; i < data.result.length; i++) {
                            list.push({ text: '[$' + data.result[i].code + ']' + '(' + data.result[i].description + ')', value: '[$' + data.result[i].code + "]" });
                        }
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
                            ],
                            setup: function(editor) {
                                editor.addButton('Variables', {
                                    type: 'listbox',
                                    text: 'Template Variables',
                                    icon: false,
                                    onselect: function(e) {
                                        editor.insertContent(this.value());
                                    },
                                    values: list
                                });
                            }
                        });
                        txtContentObj = tinymce.init({
                            selector: '#txtTextContent',
                            height: 500,
                            menubar: false,
                            plugins: [],
                            toolbar: 'Variables',
                            content_css: [
                                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                                '//www.tinymce.com/css/codepen.min.css'
                            ],
                            setup: function(editor) {
                                editor.addButton('Variables', {
                                    type: 'listbox',
                                    text: 'Template Variables',
                                    icon: false,
                                    onselect: function(e) {
                                        editor.insertContent(this.value());
                                    },
                                    values: list
                                });
                            }
                        });
                    }

                } else {
                    _commonObject.ccdAlert("GET TEMPLATE VARIABLES Error.");
                }
            },
            error: function(err) {
                _commonObject.ccdAlert("Server Error.");
            }
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
                    case "status":
                        $('a[data-action="status"]').removeClass('active');
                        $(evt.currentTarget).addClass('active');
                        $("#txtEnable").val($(evt.currentTarget).attr("data-value"));
                        break;
                    case "category":
                        $('a[data-action="category"]').removeClass('active');
                        $(evt.currentTarget).addClass('active');
                        $("#txtCategoryId").val($(evt.currentTarget).attr("data-value"));
                        break;
                    case "contentType":
                        $('a[data-action="contentType"]').removeClass('active');
                        $(evt.currentTarget).addClass('active');
                        $("#txtContentType").val($(evt.currentTarget).attr("data-value"));
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
                }
            }
        });
        return new RadioClick();
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
        var enabled = $("#txtEnable").val();
        var categoryId = $("#txtCategoryId").val();
        var name = $("#txtName").val();
        var contentType = $("#txtContentType").val();
        var subject = $("#txtSubject").val();
        var id = $("#templateId").val();
        var content = "";
        if (contentType == "0") {
            var activeEditor = tinymce.activeEditor;
            var editBody = activeEditor.getBody();
            activeEditor.selection.select(editBody);
            content = activeEditor.selection.getContent({ 'format': 'text' });
        } else {
            content = tinyMCE.activeEditor.getContent();
        }
        if (categoryId == "") {
            _commonObject.ccdAlert("Category must be checked.");
            return;
        }
        if (name == "") {
            _commonObject.ccdAlert("Template Name can not be null.");
            return;
        }
        if (subject == "") {
            _commonObject.ccdAlert("Subject can not be null.");
            return;
        }
        if (content == "") {
            _commonObject.ccdAlert("Content can not be null.");
            return;
        }
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/template/addPost',
            data: {
                id: id,
                enabled: enabled,
                categoryId: categoryId,
                name: name,
                contentType: contentType,
                subject: subject,
                content: content
            },
            success: function(data, status) {
                if (status == 'success') {
                    window.location.href = '/template';
                } else {
                    _commonObject.ccdAlert("Server Error.");
                }
            },
            error: function(err) {
                _commonObject.ccdAlert("Server Error.");
            }
        });
    };
    object.handleSearchClick = function() {
        var SearchClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '#data-filter-search-item',
            handleClick: function(evt) {
                object.doSearch();
            }
        });
        return new SearchClick();
    };
    /********
     * 点击更新状态
     */
    object.handleUpdateStatusClick = function() {
        var UpdateStatusClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '.list-btn',
            handleClick: function(evt) {
                if ($(evt.currentTarget).attr("data-action") == "DELETE") {
                    object.doDelete($(evt.currentTarget));
                } else object.doUpdateStatus($(evt.currentTarget));
            }
        });
        return new UpdateStatusClick();
    };
    object.doDelete = function(obj) {
        _commonObject.ccdConfirm("DELETE TEMPLATE '" + obj.attr("data-name") + "'?", function() {

            $.ajax({
                type: 'POST',
                async: true,
                url: '/deleteTemplate',
                dataType: 'json',
                data: { id: obj.attr("data-value") },
                success: function(data, status) {
                    if (status == 'success') {
                        object.doSearch();
                    } else {
                        _commonObject.ccdAlert("Server Error.");
                    }
                },
                error: function(err) {
                    _commonObject.ccdAlert("Server Error.");
                }
            });
        }, function() {});

    };
    object.doUpdateStatus = function(obj) {
            $.ajax({
                type: "POST",
                async: true,
                url: "/updateTemplateStatus",
                dataType: 'json',
                data: { id: obj.attr("data-value"), status: obj.attr("data-type") == "0" ? 1 : 0 },
                success: function(data, status) {

                    if (status == 'success') {
                        if (data.result) {
                            switch (obj.attr("data-type")) {
                                case "0":
                                    obj.removeClass().addClass("list-btn status check active");
                                    obj.children(0).removeClass().addClass("fa fa-check");
                                    obj.attr("data-type", "1");
                                    break;
                                case "1":
                                    obj.removeClass().addClass("list-btn status cross");
                                    obj.children(0).removeClass().addClass("fa fa-times");
                                    obj.attr("data-type", "0");
                                    break;
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
        }
        /**
         * 查询方法
         */
    object.doSearch = function() {

        var searchKey = $("#data-filter-search-input").val();
        var categoryId = $("#categoryHidden").val();
        var status = $("#enableHidden").val();
        var sort = $("#sortHidden").val();
        var page = $("#pageHidden").val();

        $.ajax({
            type: "POST",
            async: true,
            url: "/searchTemplate",
            dataType: 'json',
            data: { searchKey: searchKey, categoryId: categoryId, status: status, order: sort, page: page },
            success: function(data, status) {

                if (status == 'success') {
                    if (data.result) {
                        $("#list>li").not(":eq(0)").remove();
                        $("#pageContent").html("");
                        $("#pageContent").html(window.JST['assets/templates/pagelist.html']({ pageCount: data.result.pageInfo.PageCount }));
                        $(".filter-page-item").removeClass("active");
                        $(".filter-page-item-" + data.result.pageInfo.PageIndex).addClass("active");
                        object.handlePageClick();

                        $("#list").append(window.JST['assets/templates/templatelist.html']({
                            list: data.result
                        }));
                        object.handleUpdateStatusClick();
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


    /**
     * 构造函数; 
     */
    object.constructor = function() {
        object.handleRadioClick();
        object.handleSaveClick();
    }


    return object;

});