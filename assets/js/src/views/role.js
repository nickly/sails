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
     *   导航选择添加角色
     */
    object.addNewRole = function() {
        _commonObject.navHandleClick('#openBtn', function() {

            /** 显示添加模块 */
            object.moduleShow('addNewRole');

        });
    }

    /**
     *  板块隐藏显示
     *  @param: 板块的dom的id (String)
     */
    object.moduleShow = function(_domId) {

        if (_domId == undefined) {
            console.log('板块id值不能为空');
            return;
        } else if (_domId == 'roleList') {

            $("#roleList").show();
            $("#addNewRole").hide();
            $("#editRole").hide();
            $("#actionList").hide();

            $('#search-bar').show();
            $('#page-bar').show();

            $('#title').html('ROLE');
            $('#openBtn').show();
            $('#back_Btn').hide();

            $('#filter-status').show();
            $('#filter-orderBy').show();

            $('#actionList table tr:not(.head)').remove();

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色列表得内容 */
            $("#searchBtn").attr('data-type', 'searchRole');

        } else if (_domId == 'addNewRole') {

            $("#roleList").hide();
            $("#addNewRole").show();
            $("#editRole").hide();
            $("#actionList").hide();

            $('#search-bar').hide();
            $('#page-bar').hide();

            $('#title').html('ADD  NEW  ROLE');
            $('#openBtn').hide();
            $('#back_Btn').show();

            $('#filter-status').hide();
            $('#filter-orderBy').hide();

            /** 清空表单内的内容 */
            $('#addNewRole input, #addNewRole textarea').val('');

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色列表得内容 */
            $("#searchBtn").attr('data-type', 'searchRole');

        } else if (_domId == 'editRole') {

            $("#roleList").hide();
            $("#addNewRole").hide();
            $("#editRole").show();
            $("#actionList").hide();

            $('#search-bar').hide();
            $('#page-bar').hide();

            $('#title').html('EDIT  ROLE');
            $('#openBtn').hide();
            $('#back_Btn').show();

            $('#filter-status').hide();
            $('#filter-orderBy').hide();

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色列表得内容 */
            $("#searchBtn").attr('data-type', 'searchRole');

        } else if (_domId == 'actionList') {

            $("#roleList").hide();
            $("#addNewRole").hide();
            $("#editRole").hide();
            $("#actionList").show();

            $('#search-bar').show();
            $('#page-bar').show()

            $('#title').html("SETTING ROLE's ACTION");
            $('#openBtn').hide();
            $('#back_Btn').show();

            $('#filter-status').hide();
            $('#filter-orderBy').show();

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色权限得内容 */
            $("#searchBtn").attr('data-type', 'searchJurisdiction');
        }
    }


    /**
     *  submit提交
     */
    object.submitNewRole = function(_objectString) {
        var SubmitNewRole = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                if ($(evt.currentTarget).attr('action') == 'add') {
                    object.doRole('#addNewRole', 'add')
                } else if ($(evt.currentTarget).attr('action') == 'edit') {
                    object.doRole('#editRole', 'edit')
                }

            }
        })
        return new SubmitNewRole();
    }

    /**
     * 点击分页按钮函数方法;
     *  分页对象（String）
     */
    object.pageHandle = function(_objectString) {

        var PageHandle = Backbone.View.extend({
            events: {
                'click a': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                var _this = $(evt.currentTarget);
                $('#pageHidden').val(_this.attr('data'));

                var _stateValue = $('#stateHidden').val();
                var _orderByValue = $('#orderByHidden').val();

                /**
                 *   分页有四种情况
                 *   第一种情况是当前是在搜索后的角色列表状态中（searchRole）;
                 *   第二种情况是当前是在搜索后的角色权限列表中（searchJurisdiction）
                 */
                if ($('#pageHidden').attr('data-type') == 'searchRole') {

                    object.doSearchForRole(parseInt(_this.attr('data')), _stateValue, _orderByValue);

                } else if ($('#pageHidden').attr('data-type') == 'searchJurisdiction') {

                    var roleID = parseInt($('#actionList').attr('role-id'));
                    var pageIndex = parseInt(_this.attr('data'));

                    object.doSearchForJurisdiction(roleID, pageIndex, _orderByValue);

                }
            }
        })

        return new PageHandle();
    }


    /**
     *  分页函数方法(用于搜索角色权限列表);
     *   @param: 那个id用于在操作;
     *  @param: 需要读取第几页的内容;
     */
    object.doSearchForJurisdiction = function(_id, _pageIndex, _orderBy) {

        if (_pageIndex == undefined || _id == undefined) {
            console.log('权限分页id不能为空, 分页的类型不能为空！');
            return;
        } else {

            var _searchValue = $("input[name='search']").val();

            var _data = {
                id: _id,
                pageIndex: _pageIndex,
                searchValue: _searchValue,
                orderBy: _orderBy
            }
            var _action = '/searchRoleJurisdictionPost';

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                object.moduleShow('actionList');

                /**  把角色管理列表数据绑定到表格 */
                object.bindActionList('#actionList', _result, _id);

                /** 绑定分页 */
                object.bindPage('#pageContent', _pageIndex, _result.pageInfo.PageCount);

            })

        }

    }


    /**
     *  分页函数方法(用于搜索角色列表);
     *  @param: 需要读取第几页的内容;
     *  @param: 筛选得状态;
     */
    object.doSearchForRole = function(_pageIndex, _state, _orderBy) {

        if (_pageIndex == undefined) {
            console.log('分页id不能为空, 分页的类型不能为空！');
            return;
        } else {

            var _searchValue = $("input[name='search']").val();

            var _data = {
                pageIndex: _pageIndex,
                searchValue: _searchValue,
                state: _state,
                orderBy: _orderBy
            }
            var _action = '/searchRolePost';

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                object.moduleShow('roleList');

                /**  重新渲染表格 */
                object.bindList('#roleList', _result.roleListResult);

                /** 绑定分页 */
                object.bindPage('#pageContent', _pageIndex, _result.pageInfo.PageCount);

            })

        }

    }

    /**
     *  切换筛选状态;
     *  @param: 对象(String);
     */
    object.filterSort = function(_objectString) {

        var FilterSort = Backbone.View.extend({
            events: {
                'click a': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                var _this = $(evt.currentTarget);

                /** 修改当前选中状态 */
                _this.parent().find('a').removeClass('active');
                _this.addClass('active');

                /** 判断当前切换是状态切换还是排序切换 */
                if (_this.attr('data-type') == 'state') {
                    $('#stateHidden').val(_this.attr('data-state'));
                } else if (_this.attr('data-type') == 'order') {
                    $('#orderByHidden').val(_this.attr('data-state'));
                }

                /** 获取筛选条件得值 */
                var _stateValue = $('#stateHidden').val();
                var _orderByValue = $('#orderByHidden').val();

                /**
                 *   搜索有两种情况
                 *   第一种情况是当前是在搜索后的角色列表状态中（searchRole）;
                 *   第四种情况是当前是在搜索后的角色权限列表中（searchJurisdiction）
                 */
                if ($("#searchBtn").attr('data-type') == 'searchRole') {

                    /**  搜索输入框内得内容，搜索角色列表 */
                    object.doSearchForRole(1, _stateValue, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchRole');

                } else if ($("#searchBtn").attr('data-type') == 'searchJurisdiction') {

                    /**  搜索输入框内得内容，搜索角色权限列表 */
                    object.doSearchForJurisdiction(parseInt($('#actionList').attr('role-id')), 1, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchJurisdiction');

                }
            }
        })

        return new FilterSort();
    }


    /**
     * 点击搜索函数方法;
     * 搜索按钮对象（String）
     */
    object.searchRole = function(_objectString) {

        var SearchRole = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                var _this = $(evt.currentTarget);
                var _searchValue = $("input[name='search']").val();

                var _stateValue = $('#stateHidden').val();
                var _orderByValue = $('#orderByHidden').val();

                /**
                 *   搜索有两种情况
                 *   第一种情况是当前是在搜索后的角色列表状态中（searchRole）;
                 *   第四种情况是当前是在搜索后的角色权限列表中（searchJurisdiction）
                 */
                if (_this.attr('data-type') == 'searchRole') {

                    /**  搜索输入框内得内容，搜索角色列表 */
                    object.doSearchForRole(1, _stateValue, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchRole');

                } else if (_this.attr('data-type') == 'searchJurisdiction') {

                    /**  搜索输入框内得内容，搜索角色权限列表 */
                    object.doSearchForJurisdiction(parseInt($('#actionList').attr('role-id')), 1, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchJurisdiction');

                }
            }
        })

        return new SearchRole();

    }


    /**
     * 点击返回函数方法
     */
    object.backHandle = function(_objectString) {
        var BackHandle = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: _objectString,
            handleClick: function() {

                object.moduleShow('roleList');

                var _stateValue = $('#stateHidden').val();
                var _orderByValue = $('#orderByHidden').val();

                /** 回退的时候清掉搜索栏内的内容 */
                $("input[name='search']").val('');

                /** 返回列表第一页 */
                object.doSearchForRole(1, _stateValue, _orderByValue);
                $("#pageHidden").attr('data-type', 'searchRole');
            }
        })
        return new BackHandle();
    }

    /**
     * 点击删除角色方法;
     * @param: 对象;
     */
    object.deleteRole = function(_objectString) {

        var DeleteRole = Backbone.View.extend({

            events: {
                'click .btn-delete': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                _commonObject.ccdConfirm("are you sore delete this role?", function() {
                    /** 删除角色 */
                    object.doDeleteRole(parseInt($(evt.currentTarget).parent().parent().attr('data-id')));
                }, function() {
                    return;
                })

            }
        });
        return new DeleteRole();
    }


    /**
     * 点击编辑角色方法;
     * @param: 对象;
     */
    object.editRole = function(_objectString) {
        var EditRole = Backbone.View.extend({
            events: {
                'click .btn-edit': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                /** 让编辑模块现实 */
                object.moduleShow('editRole');

                var parentElement = $(evt.currentTarget).parent().parent();
                var _id = parentElement.attr('data-id');
                var _name = parentElement.find(".user-name").html();
                var _code = parentElement.find(".user-code").html();
                /** 需要处理从description中前后的空格问题，所以后面加上去除空格的正则 */
                var _description = parentElement.find(".user-description").html().replace(/(^\s*)|(\s*$)/g, "");

                $("#editRole  ul").attr('role-id', _id);
                $("#editRole  input[name='rolename']").val(_name);
                $("#editRole  input[name='rolecode']").val(_code);
                $("#editRole  textarea[name='description']").val(_description);

            }
        })

        return new EditRole();
    }

    /**
     * 点击角色管理权限方法;
     * @param: 对象;
     */
    object.roleJurisdiction = function(_objectString) {
        var RoleJurisdiction = Backbone.View.extend({
            events: {
                'click .btn-power': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                /** 让权限管理模块显示 */
                object.moduleShow('actionList');

                /** 回退的时候清掉搜索栏内的内容 */
                $("input[name='search']").val('');

                var parentElement = $(evt.currentTarget).parent().parent();
                var _id = parentElement.attr('data-id');
                var _orderBy = $("#orderByHidden").val();

                $('#actionList').attr('role-id', _id);
                $("#searchBtn").attr('data-type', 'searchJurisdiction');
                $("#pageHidden").attr('data-type', 'searchJurisdiction');

                object.doSearchForJurisdiction(_id, 1, _orderBy);

            }
        });
        return new RoleJurisdiction();
    }


    /**
     *  删除角色方法;
     *  @param: 角色id
     */
    object.doDeleteRole = function(_roleID) {

        if (_roleID != undefined) {

            var _data = { id: _roleID }
            var _action = '/deleteRolePost';

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                /**  重新渲染表格 */
                object.bindList('#roleList', _result.roleListResult);

                /** 绑定分页 */
                object.bindPage('#pageContent', 1, _result.pageInfo.PageCount);

            })

        } else {
            console.log("角色id为空!");
            return;
        }
    }

    /**
     *  切换角色权限checkbox得状态;
     * @param: 需要更新得数据得id;
     * @param: 需要更新数据得状态;
     */
    object.updateJurisdictionPost = function(_domElement, _id, _state) {

        if (_domElement == undefined || _id == undefined || _state == undefined) {

            console.log('对象或者id或者state为空');
            return;

        } else {

            var _data = {}
            var _action = "";
            var _roldID = $("#actionList").attr('role-id');

            /** 删除操作 */
            if (_state == "1") {
                _action = "/deleteRoleJurisdictionPost";
                _data.id = _id;
                _data.roleID = _roldID;

                /** 新加操作 */
            } else if (_state == '0') {
                _action = "/addRoleJurisdictionPost";
                /** 拿到table上得rold_id */
                _data.roleId = $("#actionList").attr('role-id');
                _data.id = _id;
            }

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                if (_result.type != 'error') {
                    if (_result.type == 'delete') {

                        /**  当为删除的时候 */
                        _domElement.attr('data-state', 0);
                        _domElement.removeClass('check active');
                        _domElement.addClass('cross');
                        _domElement.find('i').removeClass('fa-check').addClass('fa-times');

                    } else if (_result.type == 'add') {

                        /**  当为添加的时候 */
                        _domElement.attr('data-state', 1);
                        _domElement.removeClass('cross');
                        _domElement.addClass('check active');
                        _domElement.find('i').removeClass('fa-times').addClass('fa-check');
                    }
                }
            })

        }

    }

    /**
     * 更新role状态;
     * @param: 需要操作的对象;
     * @param: 需要更新得数据得id;
     * @param: 需要更新数据得状态;
     */
    object.updateRoleState = function(_domElement, _id, _state) {

        if (_domElement == undefined || _id == undefined || _state == undefined) {

            console.log('对象或者id或者state为空');
            return;

        } else {

            var _data = {
                id: _id,
                state: _state
            };
            var _action = '/updateRoleStatePost';

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                if (_result == 0) {

                    /**  当返回state为0的时候 */
                    _domElement.attr('data-state', 0);
                    _domElement.removeClass('check active');
                    _domElement.addClass('cross');
                    _domElement.find('i').removeClass('fa-check').addClass('fa-times');

                } else if (_result == 1) {

                    /**  当返回state为1的时候 */
                    _domElement.attr('data-state', 1);
                    _domElement.removeClass('cross');
                    _domElement.addClass('check active');
                    _domElement.find('i').removeClass('fa-times').addClass('fa-check');

                }
            })

        }
    }

    /**
     *  添加或者更新角色submit提交执行部分;
     * @param: 对象 ( String );
     * @param: 类型  用于判断是添加还是编辑（String）;
     */
    object.doRole = function(_objectString, _type) {

        var _roleId = $(_objectString + " ul").attr('role-id');
        var _rolename = $(_objectString + " input[name='rolename']").val();
        var _rolecode = $(_objectString + " input[name='rolecode']").val();
        var _description = $(_objectString + " textarea[name='description']").val();

        if (_rolename == "") {
            _commonObject.ccdAlert("rolename is Incorrect.");
            return;
        } else if (_rolecode == "") {
            _commonObject.ccdAlert("rolecode is Incorrect.");
            return;
        } else if (_description == "") {
            _commonObject.ccdAlert("description is Incorrect.");
            return;
        }


        var _data = {};
        var _action = '';
        var _tips = ""

        if (_type == 'add') {

            _action = '/addRolePost';
            _data.name = _rolename;
            _data.code = _rolecode;
            _data.description = _description;

            _tips = 'Are you Sure add new role? ';

        } else if (_type == 'edit') {

            _action = '/updateRolePost';
            _data.id = _roleId;
            _data.name = _rolename;
            _data.description = _description;

            _tips = "Are you Sure Change this role? "
        }


        _commonObject.ccdConfirm(_tips, function() {

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                /** 让角色列表显示 */
                object.moduleShow('roleList');

                /**  重新渲染表格 */
                object.bindList('#roleList', _result.roleListResult);

                /** 绑定分页 */
                object.bindPage('#pageContent', 1, _result.pageInfo.PageCount);

            })

        }, function() {
            return;
        });


    }


    /**
     * 绑定分页;
     * @param: 分页对象;
     * @param: 当前是第几页;
     * @param: 总共多少页;
     */
    object.bindPage = function(_objectString, _pageIndex, _pageCount) {

        if (_objectString == undefined || _pageIndex == undefined || _pageCount == undefined) {
            console.log("分页的条件不能为空");
            return;
        } else {

            var _pageString = "";

            for (var i = 1; i <= _pageCount; i++) {
                if (i == parseInt(_pageIndex)) {
                    _pageString += '<a class="filter-page-item filter-page-item-1  active" data="' + i + '">' + i + '</a>'
                } else {
                    _pageString += '<a class="filter-page-item filter-page-item-1" data="' + i + '">' + i + '</a>';
                }
            }

            $('' + _objectString).html('').append(_pageString);
        }
    }


    /**
     * 绑定角色权限列表;
     * @param: 表格对象;
     * @param: 需要绑定得数据对象;
     * @param: 当前得role得id;
     */
    object.bindActionList = function(_tableObject, _dateObject, _roldID) {

        if (_dateObject) {

            var _objectString = '';
            var _stateString = "";

            $('' + _tableObject + " table").html('<tr  class="loadingSec"><td align="center">Loading.....</td></tr>');

            var _headerString = '<tr class="head"><td class="user-item" width="5%"></td>';
            _headerString += '<td class="user-item" width="35%">Name</td>';
            _headerString += '<td class="user-item" width="20%">Code</td>';
            _headerString += '<td class="user-item" width="20%">ActionName</td>';
            _headerString += '<td class="user-item" width="20%">ControllerName</td></tr>';

            _dateObject.actionList.map(function(item, index) {

                /** 判断roleActionList数组中有没值 */
                if (_dateObject.roleActionList.length > 0) {

                    /** 从roleActionList中的action_id和actionList中的id进行配对，假如有相等的就把状态改为勾选 */
                    for (var i = 0; i < _dateObject.roleActionList.length; i++) {
                        if (_dateObject.roleActionList[i].action_id == item.id) {
                            _stateString = '<a class="list-btn status check active" data-state="1"><i class="fa fa-check" aria-hidden="true"></i></a>';
                            break;
                        } else {
                            _stateString = '<a class="list-btn status cross" data-state="0"><i class="fa fa-times" aria-hidden="true"></i></a>';
                        }
                    }
                } else {
                    _stateString = '<a class="list-btn status cross" data-state="0"><i class="fa fa-times" aria-hidden="true"></i></a>';
                }

                if (item.isDelete != 1) {
                    _objectString += '<tr  data-id="' + item.id + '"><td class="user-item" width="10%">';
                    _objectString += _stateString;
                    _objectString += '</td>';
                    _objectString += '<td class="user-item" width="30%">' + item.name + '</td>';
                    _objectString += '<td class="user-item" width="20%">' + item.code + '</td>';
                    _objectString += '<td class="user-item" width="20%">' + item.actionName + '</td>';
                    _objectString += '<td class="user-item" width="20%">' + item.controllerName + '</td></tr>';
                }

            })


            $('' + _tableObject + " table").html('');
            $('' + _tableObject + " table").append(_headerString);
            $('' + _tableObject + " table").append(_objectString);

        } else {
            console.log("绑定得对象_dateObject不能为空!");
            return;
        }

    }


    /**
     * 绑定角色列表;
     * @param: 表格对象;
     * @param: 需要绑定得数据对象;
     */
    object.bindList = function(_tableObject, _dateObject) {

        if (_dateObject) {

            var _objectString = '';
            var _headerString = '<tr class="head">' +
                '<td class="user-item" width="45%">ROLENAME</td>' +
                '<td class="user-item" width="15%">CODE</td>' +
                '<td class="user-item" width="10%">STATUS</td>' +
                '<td class="user-item" width="0%" style="display:none;">description</td>' +
                '<td class="user-item"  width="30%"></td></tr>';

            var _stateString = "";

            _dateObject.map(function(item, index) {

                /** 判断当前得状态 */
                if (item.state) {
                    _stateString = '<a class="list-btn status check active" data-state="1"><i class="fa fa-check" aria-hidden="true"></i></a>';
                } else {
                    _stateString = '<a class="list-btn status cross" data-state="0"><i class="fa fa-times" aria-hidden="true"></i></a>';
                }

                if (item.isDelete != 1) {
                    _objectString += '<tr data-id="' + item.id + '">';
                    _objectString += '<td  class="user-item  user-name" valign="middle" width="45%">' + item.name + '</td>';
                    _objectString += '<td class="user-item   user-code" valign="middle" width="15%">' + item.code + '</td>';
                    _objectString += '<td class="user-item   user-state" valign="middle" width="10%">' + _stateString + '</td>';
                    _objectString += '<td class="user-item   user-description" valign="middle"   width="0%" style="display:none;">' + item.description + '</td>';
                    _objectString += '<td class="user-item  align-left" valign="middle" width="30%">';
                    _objectString += '<a class="btn-city btn-edit">Edit</a>';
                    _objectString += '<a class="btn-city btn-delete">Del</a>';
                    _objectString += '<a class="btn-city btn-power">Power</a></td>';
                    _objectString += '</tr>';
                }

            });

            $('' + _tableObject + " table").html('');
            $('' + _tableObject + " table").append(_headerString);
            $('' + _tableObject + " table").append(_objectString);

        } else {
            console.log("绑定得对象_dateObject不能为空!");
            return;
        }
    }


    /**
     * 构造函数;
     */
    object.constructor = function() {

        /** 角色列表中得状态切换 */
        _commonObject.handleClickForCheck('#roleList', object.updateRoleState);

        /** 角色权限列表中得状态切换 */
        _commonObject.handleClickForCheck('#actionList', object.updateJurisdictionPost);

        /** 初始化时候是在role列表模块 */
        object.moduleShow('roleList');

        /** 导航选择添加角色 */
        object.addNewRole();

        /** 返回列表 */
        object.backHandle("#back_Btn");

        /** 提交sumit按钮 */
        object.submitNewRole('#add_submit');

        /** 提交编辑角色 */
        object.submitNewRole('#edit_submit');

        /** 删除role列表中得其中一列 */
        object.deleteRole('#roleList');

        /** 编辑role列表中得其中一列 */
        object.editRole('#roleList');

        /** 管理role列表中得其中一列的权限 */
        object.roleJurisdiction('#roleList');

        /** 搜索角色列表 */
        object.searchRole('#searchBtn');

        /** 点击分页 */
        object.pageHandle('#pageContent');

        /** 切换状态筛选列表 */
        object.filterSort('#filter-status');

        /** 切换正倒序 */
        object.filterSort('#filter-orderBy');
    }

    return object;

});