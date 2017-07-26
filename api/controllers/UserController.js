/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var tag = "USER ADMIN";
module.exports = {

    /**
     *  `UserController.index()`
     *   用户管理页面
     */
    index: function(req, res) {

        /** 列表查询的条件 */
        // var _condition = {};
        // var _groupCondition = {};

        // _condition.sort = "id desc";
        // _groupCondition.sort = "id asc"
        MenuService.Menus(req.session.user.id).then(function(menus) {
            var totalCount = SUser.count().then(function(count) {
                return count;
            });
            var userList = SUser.find({ sort: 'id desc' }).paginate({ page: 1, limit: sails.config.PageInfo.PageSize }).then(function(list) {
                return list;
            });
            var condition = {};
            condition.state = 1;
            condition.isDelete = 0;
            condition.sort = "id desc";
            var roleList = SRole.find(condition).then(function(result) {
                return result;
            });
            return Promise.all([menus, totalCount, userList, roleList]);
        }).spread(function(menusResult, totalCountResult, userListResult, roleListResult) {
            return res.view('user', { tag: tag, menus: menusResult, userList: userListResult, pageInfo: PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize), roleList: roleListResult });

        }).catch(function(err) {

        });
        // MenuService.Menus(req.session.user.id).then(function(menusResult) {


        //     SUserGroup.find(_groupCondition).then(function (userGroupResult) {

        //           /**  重新查询列表和分页信息 */
        //           return SearchService.SearchUser(_condition, 1).spread(function(userListResult, totalCountResult) {

        //               var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

        //               /** 写入日志 */
        //               SqlLogsService.WriteLogs(req, 0, 'userIndex');

        //               return res.view('user', { tag: tag, menus: menusResult, userList: userListResult, pageInfo: pageInfo , group: userGroupResult});
        //           })

        //     }).catch(function(err) {
        //       console.log("s_usergroup查询失败(s_usergroup is error):"+err);
        //       res.send(500, { error: "DB Error" });
        //     });

        // }).catch(function(err) {
        //     console.log("s_user查询失败(s_user is error):" + err);
        //     res.send(500, { error: "DB Error" });
        // });

    },
    getRoleByUser: function(req, res) {
        var userId = req.param('userId');
        SUserRole.find({ user_id: userId }).populate('role_id').exec(function(err, roleList) {
            if (err) {
                return res.myJsonReponse({ result: 0, message: err });
            }
            return res.myJsonReponse({ result: roleList, message: null });
        });
    },
    setUserRole: function(req, res) {
        var userId = req.param("userId");
        var roleId = req.param("roleId");
        SUserRole.destroy({ user_id: userId }).then(function(result) {
            var promiseArr = [];
            promiseArr.push(result);
            var roleArr = roleId.split(',');
            for (var i = 0; i < roleArr.length; i++) {
                var roleNew = SUserRole.create({ user_id: userId, role_id: roleArr[i] }).then(function(newEntiy) {
                    return newEntiy;
                });
                promiseArr.push(roleNew);
            }
            return Promise.all(promiseArr);
        }).spread(function() {
            return res.myJsonReponse({ result: 1, message: null });
        }).catch(function(err) {
            return res.myJsonReponse({ result: 0, message: err });
        });
    },
    /**
     *  `UserController.addUserPost()`
     *   添加用户路由;
     */
    addUserPost: function(req, res) {

        /** 获取所有得参数 */
        var _allParams = req.allParams();

        /** sex字段是整型类型 */
        _allParams.sex = parseInt(req.param('sex'));
        /**  对密码进行md5加密 */
        _allParams.loginPwd = CryptoService.Md5(req.param('loginPwd'));

        /** 列表查询的条件 */
        var _condition = {}

        _condition.sort = "id desc";

        SUser.create(_allParams).then(function(status) {

            /**  重新查询列表和分页信息 */
            return SearchService.SearchUser(_condition, 1).spread(function(userListResult, totalCountResult) {

                var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                /** 写入日志 */
                SqlLogsService.WriteLogs(req, 0, 'addUser');

                return res.myJsonReponse({ result: { userListResult: userListResult, pageInfo: pageInfo } });
            })

        }).catch(function(err) {
            console.log("添加用户时候数据库出错( create new user db error)");
            res.send(500, { error: "DB Error" });
        });

    },
    /**
     *  `UserController.updateUserPost()`
     *   更新用户路由;
     */
    updateUserPost: function(req, res) {

        var _userID = req.param('id');
        var _loginName = req.param('loginName');
        var _loginPwd = req.param('loginPwd');
        var _realName = req.param('realName');
        var _sex = parseInt(req.param('sex'));
        var _mobile = req.param('mobile');
        var _email = req.param('email');

        var _allParams = {
            loginName: _loginName,
            loginPwd: _loginPwd,
            realName: _realName,
            sex: _sex,
            mobile: _mobile,
            email: _email
        }

        /** 列表查询的条件 */
        var _condition = {}

        _condition.sort = "id desc";

        SUser.update({ id: _userID }, _allParams).then(function(status) {

            /**  重新查询列表和分页信息 */
            return SearchService.SearchUser(_condition, 1).spread(function(userListResult, totalCountResult) {

                var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                /** 写入日志 */
                SqlLogsService.WriteLogs(req, 0, 'updateUser');

                return res.myJsonReponse({ result: { userListResult: userListResult, pageInfo: pageInfo } });
            })

        }).catch(function(err) {
            console.log("编辑角色时候发生数据库错误( update user error!)");
            res.send(500, { error: "DB Error" });
        })

    },
    /**
     *  `UserController.deleteUserPost()`
     *   删除用户路由;
     */
    deleteUserPost: function(req, res) {

        var _userID = req.param('id');

        /** 列表查询的条件 */
        var _condition = {

        };


        _condition.sort = "id desc";

        SUser.destroy({ id: _userID }).then(function(status) {

            /**  重新查询列表和分页信息 */
            return SearchService.SearchUser(_condition, 1).spread(function(userListResult, totalCountResult) {

                var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                /** 写入日志 */
                SqlLogsService.WriteLogs(req, 0, 'deleteUser');

                return res.myJsonReponse({ result: { userListResult: userListResult, pageInfo: pageInfo } });

            })

        }).catch(function(err) {
            console.log("删除用户时候发生数据库错误( delete user error!)");
            res.send(500, { error: "DB Error" });
        })

    },
    /**
     *  `UserController.searchUserPost()`
     *   搜索用户路由;
     */
    searchUserPost: function(req, res) {

        var _pageIndex = req.param('pageIndex');
        var _searchValue = req.param('searchValue');
        var _roleState = parseInt(req.param('state'));
        var _orderBy = req.param('orderBy');
        var _condition = {};
        _condition.sort = "id desc";
        if (_pageIndex == '') {
            _pageIndex = 1;
        }

        /** 当有输入搜索关键词的时候 */
        if (_searchValue != "") {

            /** 当并不是选择all的时候 */
            if (_roleState != -3) {

                _condition.state = _roleState;
                _condition.or = [
                    { loginName: { 'like': '%' + _searchValue + '%' } },
                    { realName: { 'like': '%' + _searchValue + '%' } },
                    { sex: { 'like': '%' + _searchValue + '%' } },
                    { mobile: { 'like': '%' + _searchValue + '%' } },
                    { email: { 'like': '%' + _searchValue + '%' } },
                ];
                _condition.sort = _orderBy + " asc";

                /** 当是选择all的时候 */
            } else {

                _condition.or = [
                    { loginName: { 'like': '%' + _searchValue + '%' } },
                    { realName: { 'like': '%' + _searchValue + '%' } },
                    { sex: { 'like': '%' + _searchValue + '%' } },
                    { mobile: { 'like': '%' + _searchValue + '%' } },
                    { email: { 'like': '%' + _searchValue + '%' } },
                ]
                _condition.sort = _orderBy + " asc";
            }

            /** 当没有输入搜索关键词的时候 */
        } else {

            /** 当并不是选择all的时候 */
            if (_roleState != -3) {

                _condition.state = _roleState;
                _condition.sort = _orderBy + " asc";

                /** 当是选择all的时候 */
            } else {

                _condition.sort = _orderBy + " asc";

            }
        }



        /**  重新查询列表和分页信息 */
        return SearchService.SearchUser(_condition, _pageIndex).spread(function(userListResult, totalCountResult) {

            var pageInfo = PageService.PageData(_pageIndex, totalCountResult, sails.config.PageInfo.PageSize);

            /** 写入日志 */
            SqlLogsService.WriteLogs(req, 0, 'searchUser');

            return res.myJsonReponse({ result: { userListResult: userListResult, pageInfo: pageInfo } });

        })
    },
    /**
     * `UserController.updateUserStatePost()`
     *  编辑用户状态路由
     */
    updateUserStatePost: function(req, res) {

        var _userID = req.param('id');
        var _userState = parseInt(req.param('state'));
        var _state;

        /** _state状态取反更新 */
        if (_userState) {
            _state = 0;
        } else {
            _state = 1;
        }


        SUser.update({ id: _userID }, { state: _state }).exec(function(err, status) {
            if (err) {
                console.log("更新用户状态时候发生错误( update user state error!)");
                res.send(500, { error: "DB Error" });
            } else {

                /** 返回用户的state状态到客户端告诉客户端需要改变状态 */
                if (status[0].state) {

                    /** 写入日志 */
                    SqlLogsService.WriteLogs(req, 0, 'updateUserStatePost');

                    res.myJsonReponse({ result: 1 });
                } else {
                    res.myJsonReponse({ result: 0 });
                }

            }
        })
    },
    /**
     * `UserController.userGroupPost()`
     *  获取用户角色路由
     */
    userGroupPost: function(req, res) {

        var _userID = req.param('id');

        /** 列表查询的条件 */
        var _condition = {
            isDelete: { "!": true }
        }
        _condition.sort = "createTime desc";

        return SUserRole.find({ user_id: _userID }).exec(function(err, status) {

            if (err) {
                console.log("查询s_user_role时候发生错误( select s_user_role  error!)");
                res.send(500, { error: "DB Error" });
            } else {

                /**  重新查询列表和分页信息 */
                return SearchService.SearchRole(_condition, 1).spread(function(roleListResult, totalCountResult) {

                    //var pageSize = sails.config.PageInfo.PageSize;
                    var pageSize = 1;
                    var pageInfo = PageService.PageData(1, totalCountResult, pageSize);

                    /** 写入日志 */
                    SqlLogsService.WriteLogs(req, 0, 'userGroupPost');

                    return res.myJsonReponse({ result: { roleList: status, roleListResult: roleListResult, pageInfo: pageInfo } });

                })

            }

        })

    },
    /**
     * `UserController.createRoleStatePost()`
     *  改变用户角色状态路由（添加）
     */
    createRoleStatePost: function(req, res) {

        var _roleID = parseInt(req.param('roleID'));
        var _userID = parseInt(req.param('userID'));

        SUserRole.create({ role_id: _roleID, user_id: _userID }).exec(function(err, status) {

            if (err) {
                console.log("添加角色状态时候发生错误( add s_user_role error!)");
                res.send(500, { error: "DB Error" });
            } else {

                /** 返回角色权限的checkbox状态到客户端告诉客户端需要改变状态 */
                if (status.id) {

                    /** 写入日志 */
                    SqlLogsService.WriteLogs(req, 0, 'createRoleStatePost');

                    res.myJsonReponse({ result: { type: 'add', id: status.id } });
                } else {
                    res.myJsonReponse({ result: { type: 'error' } });
                    console.log('添加s_user_role操作错误！')
                }

            }

        })

    },
    /**
     * `UserController.deleteRoleStatePost()`
     *  改变用户角色状态路由（删除）
     */
    deleteRoleStatePost: function(req, res) {

        var _roleID = parseInt(req.param('roleID'));
        var _userID = parseInt(req.param('userID'))

        SUserRole.destroy({ role_id: _roleID, user_id: _userID }).exec(function(err, status) {

            if (err) {
                console.log("删除角色权限状态时候发生错误( delete s_user_role error!)");
                res.send(500, { error: "DB Error" });
            } else {

                /** 返回角色权限的checkbox状态到客户端告诉客户端需要改变状态 */
                if (status) {
                    /** 写入日志 */
                    SqlLogsService.WriteLogs(req, 0, 'deleteRoleStatePost');
                    res.myJsonReponse({ result: { type: 'delete', id: status[0].id } });

                } else {
                    res.myJsonReponse({ result: { type: 'error' } });
                    console.log('删除s_user_role操作错误！')
                }

            }

        })

    }

};