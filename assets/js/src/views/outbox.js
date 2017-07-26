'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'moment',
    'jquery_ui',
    'tinymce'
], function(_, $, Backbone, _commonObject, moment) {


    var object = {};
    /***********************
     * 分类点击
     */
    object.handleCategoryClick = function() {
        var CategoryClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '.filter-market-item',
            handleClick: function(evt) {
                var action = $(evt.currentTarget).attr("data-action");
                $(".filter-market-item").removeClass("active");
                $(evt.currentTarget).addClass("active");
                if (action) {
                    $("#newCategoryId").val($(evt.currentTarget).attr("data"));
                } else {
                    $("#categoryHidden").val($(evt.currentTarget).attr("data"));
                    $("#pageHidden").val('1');
                    object.doSearch();
                }
            }
        });
        return new CategoryClick();
    };
    /**
     * Status状态点击方法; 
     */
    object.handleStatusClick = function() {
        var StatusClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },

            el: '.filter-order-item',

            handleClick: function(evt) {
                var type = $(evt.currentTarget).attr("data-type");
                $("#pageHidden").val('1');
                switch (type) {
                    case "status":
                        $("#enableHidden").val($(evt.currentTarget).attr("data"));
                        $("a[data-type='status']").removeClass('active');
                        break;
                    case "sort":
                        $("#sortHidden").val($(evt.currentTarget).attr("data"));
                        $("a[data-type='sort']").removeClass('active');
                        break;
                }
                $(evt.currentTarget).addClass("active");
                object.doSearch();
            }
        });
        return new StatusClick();
    };
    /*****************
     * 分页点击方法
     */
    object.handlePageClick = function() {
        var PageClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '.filter-page-item',
            handleClick: function(evt) {
                $("#pageHidden").val($(evt.currentTarget).attr("data"));
                object.doSearch();
            }
        });
        return new PageClick();
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
                var action = $(evt.currentTarget).attr("data-action");
                if (action == "DELETE") {
                    object.doDelete($(evt.currentTarget));
                } else if (action == "MOVE") {
                    _commonObject.ccdConfirm("REMOVE OUTBOX '" + $(evt.currentTarget).attr("data-name") + "' TO NEW CATEGORY?", function() {
                        $("#window-remove-category").addClass("active");
                        $("#newCategoryId").val($(evt.currentTarget).attr("data-category"));
                        $("#outboxId").val($(evt.currentTarget).attr("data-value"));
                        $("a[data-attr='CATEGORY_REMOVE']").each(function(item) {
                            if ($(this).attr("data") == $(evt.currentTarget).attr("data-category")) {
                                $(this).addClass("active");
                            }
                        });

                    }, function() {});
                } else if (action == "RETRY") {
                    _commonObject.ccdConfirm("RETRY SEND '" + $(evt.currentTarget).attr("data-name") + "' EMAIL AGAIN?", function() {

                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: '/outbox/retry',
                            data: { id: $(evt.currentTarget).attr("data-value") },
                            success: function(data, status) {

                                if (status == 'success') {
                                    if (data.result) {
                                        _commonObject.ccdAlert("Email Send Ok.", function() {
                                            window.location.href = '/outbox';
                                        });
                                    }
                                } else {
                                    _commonObject.ccdAlert("Server Error.");
                                }
                            },
                            error: function(err) {
                                _commonObject.ccdAlert("Server Error.");
                            }
                        });

                    }, function() {});
                }
            }
        });
        return new UpdateStatusClick();
    };
    object.handleSubmitClick = function() {
        var SubmitClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },

            el: '#btn-remove-category-submit',

            handleClick: function(evt) {
                var categoryId = $("#newCategoryId").val();
                var outboxId = $("#outboxId").val();
                if (categoryId) {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: '/outbox/movecategory',
                        data: { id: outboxId, categoryId: categoryId },
                        success: function(data, status) {

                            if (status == 'success') {
                                if (data.result) {
                                    $("#window-remove-category").removeClass("active");
                                    $("#newCategoryId").val("");
                                    $("#outboxId").val("");
                                    window.location.href = '/outbox';
                                }
                            } else {
                                _commonObject.ccdAlert("Server Error.");
                            }
                        },
                        error: function(err) {
                            _commonObject.ccdAlert("Server Error.");
                        }
                    });
                } else {
                    _commonObject.ccdAlert("New Category can not be null.");
                }
            }
        });
        return new SubmitClick();
    };
    object.handleCancleClick = function() {
        var CancleClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },

            el: '#btn-remove-category-cancel',

            handleClick: function(evt) {
                $("#window-remove-category").removeClass("active");
            }
        });
        return new CancleClick();
    };
    object.doDelete = function(obj) {
        _commonObject.ccdConfirm("DELETE TEMPLATE '" + obj.attr("data-name") + "'?", function() {

            $.ajax({
                type: 'POST',
                async: true,
                url: '/outbox/delete',
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
            url: "/searchOutBox",
            dataType: 'json',
            data: { searchKey: searchKey, categoryId: categoryId, status: status, order: sort, page: page },
            success: function(data, status) {

                if (status == 'success') {
                    if (data.result) {
                        $("#list>li").not(":eq(0)").remove();
                        if (data.result.pageInfo.PageCount > 1) {
                            $("#pageContent").html("");
                            $("#pageContent").html(window.JST['assets/templates/pagelist.html']({ pageCount: data.result.pageInfo.PageCount }));
                            $(".filter-page-item").removeClass("active");
                            $(".filter-page-item-" + data.result.pageInfo.PageIndex).addClass("active");
                            $("#pageContainer").show();
                        } else {
                            $("#pageContainer").hide();
                        }
                        object.handlePageClick();

                        $("#list").append(window.JST['assets/templates/outboxlist.html']({
                            list: data.result,
                            moment: moment
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
        object.handleCategoryClick();
        //object.handleStatusClick();
        object.handlePageClick();
        object.handleSearchClick();
        object.handleUpdateStatusClick();
        object.handleSubmitClick();
        object.handleCancleClick();
    }


    return object;

});