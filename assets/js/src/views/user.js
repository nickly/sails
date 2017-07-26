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
     *   导航选择添加用户
     */
    object.addNewUser = function() {
        _commonObject.navHandleClick('#openBtn', function() {

            object.moduleShow('addNewUser');

        });
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

                object.moduleShow('userList');

                var _stateValue = $('#stateHidden').val();
                var _orderByValue = $('#orderByHidden').val();

                /** 回退的时候清掉搜索栏内的内容 */
                $("input[name='search']").val('');

                /** 返回列表第一页 */
                object.doSearchForUser(1, _stateValue, _orderByValue);

                $("#pageHidden").attr('data-type', 'searchUser');
            }
        })
        return new BackHandle();
    }


    /**
     *  板块隐藏显示
     *  @param: 板块的dom的id (String)
     */
    object.moduleShow = function(_domId) {

        if (_domId == undefined) {
            console.log('板块id值不能为空');
            return;
        } else if (_domId == 'userList') {

            $("#userList").show();
            $("#addNewUser").hide();
            $("#editUser").hide();
            $("#selectUserList").hide();

            $('#search-bar').show();
            $('#page-bar').show();

            $('#title').html('USER ADMIN');
            $('#openBtn').show();
            $('#back_Btn').hide();

            $('#filter-status').show();
            $('#filter-orderBy').show();

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色列表得内容 */
            $("#searchBtn").attr('data-type', 'searchUser');

        } else if (_domId == 'addNewUser') {

            $("#userList").hide();
            $("#addNewUser").show();
            $("#editUser").hide();
            $("#selectUserList").hide();

            $('#search-bar').hide();
            $('#page-bar').hide();

            $('#title').html('ADD  NEW  USER');
            $('#openBtn').hide();
            $('#back_Btn').show();

            $('#filter-status').hide();
            $('#filter-orderBy').hide();

            /** 清空表单内的内容 */
            $('#addNewUser input').val('');
            $('#addNewUser input[name="sex"]').val(0);
            $('#addNewUser .data_sex a').removeClass('active').eq(0).addClass('active');

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色列表得内容 */
            $("#searchBtn").attr('data-type', 'searchUser');

        } else if (_domId == 'editUser') {

            $("#userList").hide();
            $("#addNewUser").hide();
            $("#editUser").show();
            $("#selectUserList").hide();

            $('#search-bar').hide();
            $('#page-bar').hide();

            $('#title').html('EDIT  USER');
            $('#openBtn').hide();
            $('#back_Btn').show();

            $('#filter-status').hide();
            $('#filter-orderBy').hide();

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色列表得内容 */
            $("#searchBtn").attr('data-type', 'searchUser');

        } else if (_domId == 'selectUserList') {

            $("#userList").hide();
            $("#addNewUser").hide();
            $("#editUser").hide();
            $("#selectUserList").show();

            $('#search-bar').show();
            $('#page-bar').show();

            $('#title').html('SELECT  ROLE');
            $('#openBtn').hide();
            $('#back_Btn').show();

            $('#filter-status').hide();
            $('#filter-orderBy').show();

            /** 因为搜索栏是固定在头部只有一条，所以要告诉程序当前我要搜索那种数据，这里告诉程序搜索得是角色权限得内容 */
            $("#searchBtn").attr('data-type', 'selectUserList');
        }
    }

    /**
     *   切换性别方法;
     *   @param: 切换对象 （String）
     */
    object.changeSex = function(_objectString) {
        var ChangeSex = Backbone.View.extend({
            events: {
                'click a': 'handleClick',
            },
            el: _objectString,
            handleClick: function(evt) {

                var _this = $(evt.currentTarget);
                var _thisParent = $(evt.currentTarget).parent();
                _thisParent.find('a').removeClass('active');
                _this.addClass('active');
                _thisParent.find('input').val(_this.attr('data-type'));

            }
        });
        return new ChangeSex();
    }

    /**
     * 点击编辑用户方法;
     * @param: 对象;
     */
    object.editUser = function(_objectString) {
        var EditUser = Backbone.View.extend({
            events: {
                'click .btn-edit': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                /** 让编辑模块现实 */
                object.moduleShow('editUser');

                var parentElement = $(evt.currentTarget).parent().parent();
                var _id = parentElement.attr('data-id');

                var _loginName = parentElement.find(".user-loginName").html();
                var _realName = parentElement.find(".user-realName").html();
                var _sex = parseInt(parentElement.find(".user-sex input").val());
                var _mobile = parentElement.find(".user-mobile").html();
                var _email = parentElement.find(".user-email").html();

                $("#editUser  ul").attr('user-id', _id);
                $("#editUser  input[name='loginName']").val(_loginName);
                $("#editUser  input[name='loginPassword']").val('');
                $("#editUser  input[name='realName']").val(_realName);
                $("#editUser  input[name='mobile']").val(_mobile);
                $("#editUser  input[name='email']").val(_email);

                $("#editUser .data_sex a").removeClass('active');
                if (_sex) {
                    $("#editUser .data_sex a").eq(1).addClass('active');
                } else {
                    $("#editUser .data_sex a").eq(0).addClass('active');
                }
                $("#editUser  input[name='sex']").val(_sex);

            }
        })

        return new EditUser();
    }


    /**
     * 点击删除用户方法;
     * @param: 对象;
     */
    object.deleteUser = function(_objectString) {

        var DeleteUser = Backbone.View.extend({

            events: {
                'click .btn-delete': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                _commonObject.ccdConfirm("are you sore delete this user?", function() {
                    /** 删除用户 */
                    object.doDeleteUser(parseInt($(evt.currentTarget).parent().parent().attr('data-id')));

                }, function() {
                    return;
                })

            }
        });
        return new DeleteUser();
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
                } else if (_this.attr('data-type') == 'group') {
                    $('#groupHidden').val(_this.attr('data-state'));
                }

                /** 获取筛选条件得值 */
                var _stateValue = $('#stateHidden').val();
                var _orderByValue = $('#orderByHidden').val();

                /**
                 *   搜索有两种情况
                 *   第一种情况是当前是在搜索后的角色列表状态中（searchRole）;
                 *   第四种情况是当前是在搜索后的角色权限列表中（searchJurisdiction）
                 */
                if ($("#searchBtn").attr('data-type') == 'searchUser') {

                    /**  搜索输入框内得内容，搜索角色列表 */
                    object.doSearchForUser(1, _stateValue, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchUser');

                } else if ($("#searchBtn").attr('data-type') == 'searchUserList') {

                    /**  搜索输入框内得内容，搜索角色权限列表 */
                    object.doSearchForJurisdiction(parseInt($('#actionList').attr('role-id')), 1, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchUserList');

                }
            }
        })

        return new FilterSort();
    }


    /**
     * 点击搜索函数方法;
     * 搜索按钮对象（String）
     */
    object.searchUser = function(_objectString) {

        var SearchUser = Backbone.View.extend({
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
                 *   第一种情况是当前是在搜索后的角色列表状态中（searchUser）;
                 *   第四种情况是当前是在搜索后的角色权限列表中（searchUserList）;
                 */
                if (_this.attr('data-type') == 'searchUser') {

                    /**  搜索输入框内得内容，搜索角色列表 */
                    object.doSearchForUser(1, _stateValue, _orderByValue);
                    $("#pageHidden").attr('data-type', 'searchUser');

                } else if (_this.attr('data-type') == 'searchUserList') {

                    var usrID = parseInt($('#selectUserList').attr('user-id'));

                    /**  搜索输入框内得内容，搜索角色权限列表 */
                    object.doSearchUserList(usrID, 1);
                    $("#pageHidden").attr('data-type', 'searchUserList');

                }
            }
        })

        return new SearchUser();

    }


    /**
     * 更新User状态;
     * @param: 需要操作的对象;
     * @param: 需要更新得数据得id;
     * @param: 需要更新数据得状态;
     */
    object.updateUserState = function(_domElement, _id, _state) {

        if (_domElement == undefined || _id == undefined || _state == undefined) {

            console.log('对象或者id或者state为空');
            return;

        } else {

            var _data = {
                id: _id,
                state: _state
            };
            var _action = '/updateUserStatePost';

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
                 *   第一种情况是当前是在搜索后的角色列表状态中（searchUser）;
                 *   第二种情况是当前是在搜索后的角色权限列表中（searchUserList）
                 */
                if ($('#pageHidden').attr('data-type') == 'searchUser') {

                    object.doSearchForUser(parseInt(_this.attr('data')), _stateValue, _orderByValue);

                } else if ($('#pageHidden').attr('data-type') == 'searchUserList') {

                    var _userID = parseInt($('#selectUserList').attr('user-id'));
                    var _pageIndex = parseInt(_this.attr('data'));

                    object.doSearchUserList(_userID, _pageIndex);

                }
            }
        })

        return new PageHandle();
    }


    /**
     *  分页函数方法(用于搜索用户列表);
     *  @param: 需要读取第几页的内容;
     */
    object.doSearchForUser = function(_pageIndex, _state, _orderBy) {

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

            var _action = '/searchUserPost';

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                object.moduleShow('userList');

                /**  重新渲染表格 */
                object.bindList('#userList', _result.userListResult);

                /** 绑定分页 */
                object.bindPage('#pageContent', _pageIndex, _result.pageInfo.PageCount);

            })

        }

    }

    /**
     * 设置用户角色
     */
    object.settingRole = function() {

        /** 关闭窗体 */
        $('#btn-remove-category-cancel').click(function() {
            $('#window-group').removeClass('active');
        })

        /** setting按钮点击出现窗体 */
        $('#userList').on('click', '.btn-power', function() {

            /** 获取setting时候本用户的id */
            var userID = $(this).parent().parent().attr('data-id');

            /** 把id赋给窗口中的列表 */
            $('#userId').attr('user-id', userID);
            $("#userId").val(userID);
            var _action = "/userGroupPost";

            var _data = {
                id: userID,
                state: ''
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/getRoleByUser',
                data: { userId: userID },
                success: function(data) {
                    if (data.result) {
                        $('[data-action="Role"]').removeClass("active");
                        var roleIDA = [];
                        for (var i = 0; i < data.result.length; i++) {

                            $('[data-action="Role"]').each(function(item) {
                                var roleId = $(this).attr("data");
                                if (roleId == data.result[i].role_id.id) {
                                    $(this).addClass("active");
                                    roleIDA.push(roleId);
                                }
                            });

                        }
                        $("#newRoleId").val(roleIDA.join(','));

                    }
                }
            });
            /** 请求接口拿用户角色列表的信息 */
            // _commonObject.AsyncRequestPost(_action, _data, function(_result) {

            //     /**  重新渲染表格 */
            //     object.bindRoleList('#selectUserList', _result.roleListResult, _result.roleList, '');

            // })

            /** 让窗体显示 */
            $('#window-group').addClass('active');
        })


        /**  点击筛选按钮 */
        $("#screenChange a").click(function() {

            $("#screenChange a").removeClass('active');
            $(this).addClass('active');
            $('#screenHidden').val($(this).attr('data-state'));

            var _action = "/userGroupPost";

            var _data = {
                id: userID
            }

            /** 请求接口拿用户角色列表的信息 */
            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                var _state = $('#screenHidden').val();

                /**  重新渲染表格 */
                object.bindRoleList('#selectUserList', _result.roleListResult, _result.roleList, _state);

            })

        })


        $("#window-group").on('click', '#selectUserList a', function() {

            var _roleID = $(this).parent().parent().attr('role-id');
            var _userID = $("#selectUserList").attr('user-id');

            var _this = $(this);
            var _action = "";

            var _data = {
                roleID: _roleID,
                userID: _userID
            }

            if ($(this).attr('data-state') == '1') {
                _action = "/deleteRoleStatePost";
            } else {
                _action = "/createRoleStatePost";
            }

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                if (_result.type != 'error') {

                    if (_result.type == 'delete') {

                        /**  当为删除的时候 */
                        _this.attr('data-state', 0);
                        _this.removeClass('check active');
                        _this.addClass('cross');
                        _this.find('i').removeClass('fa-check').addClass('fa-times');

                    } else if (_result.type == 'add') {

                        /**  当为添加的时候 */
                        _this.attr('data-state', 1);
                        _this.removeClass('cross');
                        _this.addClass('check active');
                        _this.find('i').removeClass('fa-times').addClass('fa-check');
                    }
                }

            })

        })

        $('[data-action="Role"]').click(function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
            var roleIDArr = [];
            $('[data-action="Role"]').each(function() {
                if ($(this).hasClass("active")) {
                    roleIDArr.push($(this).attr("data"));
                }
                $("#newRoleId").val(roleIDArr.join(','));
            });
        });
        $("#btn-remove-category-submit").click(function() {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/setuserrole',
                data: { userId: $("#userId").val(), roleId: $("#newRoleId").val() },
                success: function() {
                    $("#userId").val("");
                    $("#newRoleId").val("");
                    $('#window-group').removeClass('active');
                }
            });
        });
    }



    /**
     * 绑定角色列表;
     * @param: 表格对象;
     * @param: 需要绑定得数据对象;
     */
    object.bindRoleList = function(_tableObject, _dateObject, _roleResult, _state) {

        if (_dateObject) {

            var _objectString = '';
            var _headerString = '<tr class="head_small">' +
                '<td class="user-item" width="10%"></td>' +
                '<td class="user-item" width="30%">ROLENAME</td>' +
                '<td class="user-item" width="15%">CODE</td>' +
                '<td class="user-item" width="45%">description</td>' +
                '</tr>';

            var _stateString = "";

            _dateObject.map(function(item, index) {

                /** 判断当前得状态 */

                if (_roleResult.length > 0) {

                    for (var i = 0; i < _roleResult.length; i++) {
                        if (_roleResult[i].role_id == item.id) {
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
                    _objectString += '<tr role-id="' + item.id + '">';
                    _objectString += '<td class="user-item   user-state" valign="middle" width="10%">' + _stateString + '</td>';
                    _objectString += '<td  class="user-item  user-name" valign="middle" width="30%">' + item.name + '</td>';
                    _objectString += '<td class="user-item   user-code" valign="middle" width="15%">' + item.code + '</td>';
                    _objectString += '<td class="user-item   user-description" valign="middle"   width="45%">' + item.description + '</td>';
                    _objectString += '</tr>';
                }

            });

            $('' + _tableObject + " table").html('');
            $('' + _tableObject + " table").append(_headerString);
            $('' + _tableObject + " table").append(_objectString);


            if (_state == '-3') {
                $('' + _tableObject + " table").html('');
                $('' + _tableObject + " table").append(_headerString);
                $('' + _tableObject + " table").append(_objectString);
            } else if (_state == "0") {
                $('' + _tableObject + " table a.active").parent().parent().remove();
            } else if (_state == "1") {
                $('' + _tableObject + " table a:not(.active)").parent().parent().remove();
            }


        } else {
            console.log("绑定得对象_dateObject不能为空!");
            return;
        }
    }




    /**
     *  删除角色方法;
     *  @param: 角色id
     */
    object.doDeleteUser = function(_userID) {

        if (_userID != undefined) {

            var _data = { id: _userID }
            var _action = '/deleteUserPost';

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                /**  重新渲染表格 */
                object.bindList('#userList', _result.userListResult);

                /** 绑定分页 */
                object.bindPage('#pageContent', 1, _result.pageInfo.PageCount);

            })

        } else {
            console.log("用户id为空!");
            return;
        }

    }


    /**
     *  submit提交
     */
    object.submitUser = function(_objectString) {
        var SubmitUser = Backbone.View.extend({
            events: {
                'click': 'handleClick'
            },
            el: _objectString,
            handleClick: function(evt) {

                if ($(evt.currentTarget).attr('action') == 'add') {
                    object.doUser('#addNewUser', 'add')
                } else if ($(evt.currentTarget).attr('action') == 'edit') {
                    object.doUser('#editUser', 'edit')
                }

            }
        })
        return new SubmitUser();
    }


    /**
     *  添加或者更新用户submit提交执行部分;
     * @param: 对象 ( String );
     * @param: 类型  用于判断是添加还是编辑（String）;
     */
    object.doUser = function(_objectString, _type) {

        var _userId = $(_objectString + " ul").attr('user-id');
        var _loginName = $(_objectString + " input[name='loginName']").val();
        var _loginPassword = $(_objectString + " input[name='loginPassword']").val();
        var _realName = $(_objectString + " input[name='realName']").val();
        var _sex = $(_objectString + " input[name='sex']").val();
        var _mobile = $(_objectString + " input[name='mobile']").val();
        var _email = $(_objectString + " input[name='email']").val();

        /** 判断邮箱正则 */
        var _emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

        if (_loginName == "") {
            _commonObject.ccdAlert("login name is Incorrect.");
            return;
        } else if (_loginPassword == "") {
            _commonObject.ccdAlert("login password is Incorrect.");
            return;
        } else if (_realName == "") {
            _commonObject.ccdAlert("real name is Incorrect.");
            return;
        } else if (_mobile == "" || _mobile.length != 11 || isNaN(_mobile)) {
            _commonObject.ccdAlert("moblie is Incorrect.");
            return;
        } else if (_email == "" || !_emailReg.test(_email)) {
            _commonObject.ccdAlert("email is Incorrect.");
            return;
        }

        var _data = {};
        var _action = '';
        var _tips = "";

        if (_type == 'add') {

            _action = '/addUserPost';
            _data.loginName = _loginName;
            _data.loginPwd = _loginPassword;
            _data.realName = _realName;
            _data.sex = _sex;
            _data.mobile = _mobile;
            _data.email = _email;

            _tips = 'Are you Sure add new user?';

        } else if (_type == 'edit') {

            _action = '/updateUserPost';
            _data.id = _userId;
            _data.loginName = _loginName;
            _data.loginPwd = _loginPassword;
            _data.realName = _realName;
            _data.sex = _sex;
            _data.mobile = _mobile;
            _data.email = _email;

            _tips = "Are you Sure Change this user? "

        }


        _commonObject.ccdConfirm(_tips, function() {

            _commonObject.AsyncRequestPost(_action, _data, function(_result) {

                /** 让角色列表显示 */
                object.moduleShow('userList');

                /**  重新渲染表格 */
                object.bindList('#userList', _result.userListResult);

                /** 绑定分页 */
                object.bindPage('#pageContent', 1, _result.pageInfo.PageCount);

            })

        }, function() {
            return;
        });


    }


    /**
     * 绑定用户列表;
     * @param: 表格对象;
     * @param: 需要绑定得数据对象;
     */
    object.bindList = function(_tableObject, _dateObject) {

        if (_dateObject) {


            var _objectString = '';
            var _stateString = "";
            var _sexString = "";

            var _headerString = '<tr class="head">' +
                '<td class="user-item" width="15%">LOGINNAME</td>' +
                '<td class="user-item" width="15%">REALNAME</td>' +
                '<td class="user-item" width="5%">SEX</td>' +
                '<td class="user-item" width="15%">MOBILE</td>' +
                '<td class="user-item" width="15%">EMAIL</td>' +
                '<td class="user-item"  width="35%">STATUS</td></tr>';

            _dateObject.map(function(item, index) {

                /** 判断当前得状态 */
                if (item.state) {
                    _stateString = '<a class="list-btnMargin  list-btn status check active" data-state="1"><i class="fa fa-check" aria-hidden="true"></i></a>';
                } else {
                    _stateString = '<a class="list-btnMargin  list-btn status cross" data-state="0"><i class="fa fa-times" aria-hidden="true"></i></a>';
                }

                if (item.sex) {
                    _sexString = "FEMALE";
                } else {
                    _sexString = "MALE";
                }

                _objectString += '<tr data-id="' + item.id + '">';
                _objectString += '<td  class="user-item  user-loginName" valign="middle" width="15%">' + item.loginName + '</td>';
                _objectString += '<td class="user-item   user-realName" valign="middle" width="15%">' + item.realName + '</td>';
                _objectString += '<td class="user-item   user-sex" valign="middle" width="5%">' + _sexString + '<input name="sex" type="hidden" value="' + item.sex + '" class="input_text"/></td>';
                _objectString += '<td class="user-item   user-mobile" valign="middle" width="15%">' + item.mobile + '</td>';
                _objectString += '<td class="user-item   user-email" valign="middle" width="15%">' + item.email + '</td>';
                _objectString += '<td class="user-item" valign="middle" width="35%">';
                _objectString += _stateString;
                _objectString += '<a class="btn-city btn-edit">Edit</a>';
                _objectString += '<a class="btn-city btn-delete">Del</a>';
                _objectString += '<a class="btn-city btn-power">Setting</a></td>';
                _objectString += '</tr>';


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
     * 构造函数;
     */
    object.constructor = function() {

        /** 角色列表中得状态切换 */
        _commonObject.handleClickForCheck('#userList', object.updateUserState);

        /** 导航选择添加用户 */
        object.addNewUser();

        /** 返回列表 */
        object.backHandle("#back_Btn");

        /** 切换性别 */
        object.changeSex('.data_sex');

        /** 提交添加用户 */
        object.submitUser('#add_submit');

        /** 提交编辑用户 */
        object.submitUser('#edit_submit');

        /** 编辑user列表中得其中一列 */
        object.editUser('#userList');

        /** 删除user列表中得其中一列 */
        object.deleteUser('#userList');

        /** 管理role列表中得其中一列的权限 */
        object.settingRole();

        /** 搜索用户列表 */
        object.searchUser('#searchBtn');

        /** 点击分页 */
        object.pageHandle('#pageContent');

        /** 切换状态筛选列表 */
        object.filterSort('#filter-status');

        /** 切换正倒序 */
        object.filterSort('#filter-orderBy');

        /** 切换正倒序 */
        object.filterSort('#filter-group');

    }

    return object
})