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
                $("#categoryHidden").val($(evt.currentTarget).attr("data"));
                $(".filter-market-item").removeClass("active");
                $(evt.currentTarget).addClass("active");
                $("#pageHidden").val('1');
                object.doSearch();
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
        object.handleCategoryClick();
        object.handleStatusClick();
        object.handlePageClick();
        object.handleSearchClick();
        object.handleUpdateStatusClick();
    }


    return object;

});