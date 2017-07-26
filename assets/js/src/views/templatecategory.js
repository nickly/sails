'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'jquery_ui'
], function(_, $, Backbone, _commonObject) {


    var object = {};

    /***********************
     * 分类编辑
     */
    object.handleEditClick = function() {
        var CategoryClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '.btn-city',
            handleClick: function(evt) {
                switch ($(evt.currentTarget).attr("data-type")) {
                    case "DELETE":
                        object.doDelete($(evt.currentTarget));
                        break;
                    case "EDIT":
                        object.doUpdate($(evt.currentTarget));
                        break;
                }
            }
        });
        return new CategoryClick();
    };
    object.handleAddClick = function() {
        var AddClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '#btn-new-category',
            handleClick: function(evt) {
                $("#window-new-category span").html("Create New Category");
                $("#new-category-name").val("");
                $("#new-category-description").val("");
                $("#categoryId").val("");
                $("#window-new-category").addClass("active");
            }
        });
        return new AddClick();
    };
    object.handleSubmitActionClick = function() {
        var SubmitClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '#btn-new-category-submit',
            handleClick: function(evt) {
                var categoryId = $("#categoryId").val();
                var categoryName = $("#new-category-name").val();
                var description = $("#new-category-description").val();
                if (categoryName == "") {
                    _commonObject.ccdAlert('Category Name can not be Null.');
                    return;
                }
                if (categoryId) //更新
                {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: '/template/category/update',
                        data: { id: categoryId, categoryName: categoryName, description: description },
                        success: function(data, status) {
                            if (status == 'success') {
                                $("#categoryId").val("");
                                $("#new-category-name").val("");
                                $("#new-category-description").val("");
                                $("#window-new-category").removeClass("active");
                                object.doSearch();
                            } else {
                                _commonObject.ccdAlert("Server Error.");
                            }
                        },
                        error: function(err) {
                            _commonObject.ccdAlert("Server Error.");
                        }
                    });
                } else {
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: '/template/category/new',
                        data: { categoryName: categoryName, description: description },
                        success: function(data, status) {
                            if (status == 'success') {
                                $("#categoryId").val("");
                                $("#new-category-name").val("");
                                $("#new-category-description").val("");
                                $("#window-new-category").removeClass("active");
                                object.doSearch();
                            } else {
                                _commonObject.ccdAlert("Server Error.");
                            }
                        },
                        error: function(err) {
                            _commonObject.ccdAlert("Server Error.");
                        }
                    });
                }
            }
        });
        return new SubmitClick();
    };
    object.handleCancleActionClick = function() {
        var CancleClick = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: '#btn-new-category-cancel',
            handleClick: function(evt) {
                $("#categoryId").val("");
                $("#new-category-name").val("");
                $("#new-category-description").val("");
                $("#window-new-category").removeClass("active");
            }
        });
        return new CancleClick();
    };
    object.doDelete = function(obj) {
        _commonObject.ccdConfirm("DELETE TEMPLATE '" + obj.attr("data-name") + "'?", function() {

            $.ajax({
                type: 'POST',
                async: true,
                url: '/template/category/delete',
                dataType: 'json',
                data: { id: obj.attr("data-value") },
                success: function(data, status) {
                    if (status == 'success') {
                        $("#categoryId").val("");
                        $("#new-category-name").val("");
                        $("#new-category-description").val("");
                        $("#window-new-category").removeClass("active");
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
    object.doUpdate = function(obj) {
        $("#window-new-category span").html("Update Info for Category '" + obj.attr("data-name") + "'");
        $("#new-category-name").val(obj.attr("data-name"));
        $("#new-category-description").val(obj.attr("data-description"));
        $("#categoryId").val(obj.attr("data-value"));
        $("#window-new-category").addClass("active");
    };
    /**
     * 查询方法
     */
    object.doSearch = function() {
        $.ajax({
            type: "POST",
            async: true,
            url: "/template/category/search",
            dataType: 'json',
            success: function(data, status) {

                if (status == 'success') {
                    if (data.result) {
                        $("#list>li").not(":eq(0)").remove();
                        $("#list").append(window.JST['assets/templates/templatecategory.html']({
                            list: data.result
                        }));
                        object.handleEditClick();
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
        object.handleEditClick();
        object.handleAddClick();
        object.handleSubmitActionClick();
        object.handleCancleActionClick();
    }


    return object;

});