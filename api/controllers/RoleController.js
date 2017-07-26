/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird');
var tag = "ROLE";
module.exports = {

    /**
     * `RoleController.index()`
     *  角色管理路由
     */
    index: function(req, res) {

        /** 列表查询的条件 */
        var _condition = {
            isDelete: {"!": true}
        }
        _condition.sort = "createTime desc";

        MenuService.Menus(req.session.user.id).then(function(menusResult) {


                  /**  重新查询列表和分页信息 */
                  return SearchService.SearchRole(_condition, 1).spread(function (roleListResult, totalCountResult) {

                        var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                        /** 写入日志 */
                        SqlLogsService.WriteLogs(req, 0, 'roleIndex');


                        return res.view('role',{tag: tag, menus: menusResult, roleList: roleListResult, pageInfo: pageInfo});
                  })


        }).catch(function(err) {
            console.log("s_role查询失败(s_role is error):"+err);
            res.send(500, { error: "DB Error" });
        });

    },
    /**
     * `RoleController.addRolePost()`
     *  添加角色路由
     */
    addRolePost: function(req, res) {

        /** 获取所有得参数 */
        var _allParams = req.allParams();

        /** 列表查询的条件 */
        var _condition = {
            isDelete: {"!": true}
        }
        _condition.sort = "createTime desc";

        SRole.create(_allParams).then(function (status) {

            /**  重新查询列表和分页信息 */
            return SearchService.SearchRole(_condition, 1).spread(function (roleListResult, totalCountResult) {

                var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                /** 写入日志 */
                SqlLogsService.WriteLogs(req, 0, 'addRole');

                return res.myJsonReponse({ result: {roleListResult : roleListResult, pageInfo: pageInfo}});
            })


        }).catch(function(err) {
            console.log("添加角色时候数据库出错( create new role db error)");
            res.send(500, { error: "DB Error" });
        });

    },
    /**
    * `RoleController.deleteRolePost()`
    *  添加角色路由-------注意由于是s_role表是基础数据，所以不对数据表进行删除，只是对isDelete进行更改;
    */
    deleteRolePost: function (req, res) {

        var _roleID = req.param('id');

        /** 列表查询的条件 */
        var _condition = {
            isDelete: {"!": true}
        }
        _condition.sort = "createTime desc";

        SRole.update({id: _roleID}, {isDelete: 1}).then(function (status) {

            /**  重新查询列表和分页信息 */
            return SearchService.SearchRole(_condition, 1).spread(function (roleListResult, totalCountResult) {

                var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                /** 写入日志 */
                SqlLogsService.WriteLogs(req, 0, 'deleteRole');

                return res.myJsonReponse({ result: {roleListResult : roleListResult, pageInfo: pageInfo}});
            })

        }).catch(function(err) {
            console.log("更新isDelete时候发生错误( update isDelete error!)");
            res.send(500, { error: "DB Error" });
        });
   },
  /**
   * `RoleController.updateRolePost()`
   *  编辑角色路由
   */
    updateRolePost:function (req, res) {

        var _roleID = req.param('id');
        var _name  = req.param('name');
        var _description  = req.param('description');

          /** 列表查询的条件 */
          var _condition = {
              isDelete: {"!": true}
          }
          _condition.sort = "createTime desc";

        SRole.update({id: _roleID}, {name: _name, description: _description}).then(function (status) {

               /**  重新查询列表和分页信息 */
               return SearchService.SearchRole(_condition, 1).spread(function (roleListResult, totalCountResult) {

                   var pageInfo = PageService.PageData(1, totalCountResult, sails.config.PageInfo.PageSize);

                   /** 写入日志 */
                   SqlLogsService.WriteLogs(req, 0, 'updateRole');

                   return res.myJsonReponse({ result: {roleListResult : roleListResult, pageInfo: pageInfo}});
               })

        }).catch(function(err) {
            console.log("编辑角色时候发生数据库错误( update role error!)");
            res.send(500, { error: "DB Error" });
        })
    },
    /**
     * `RoleController.updateRoleStatePost()`
     *  编辑角色状态路由
     */
    updateRoleStatePost: function(req, res) {

        var _roleID = req.param('id');
        var _roleState   = parseInt(req.param('state'));
        var _state;

        /** _state状态取反更新 */
        if(_roleState){
            _state = false;
        }else{
            _state = true;
        }

        SRole.update({id: _roleID}, {state: _state}).exec(function (err, status) {
            if(err){
                console.log("更新角色状态时候发生错误( update role state error!)");
                res.send(500, { error: "DB Error" });
            }else{

                /** 返回角色的state状态到客户端告诉客户端需要改变状态 */
                if(status[0].state){

                    /** 写入日志 */
                    SqlLogsService.WriteLogs(req, 0, 'updateRoleState');

                    res.myJsonReponse({ result: 1 });
                }else{
                    res.myJsonReponse({ result: 0 });
                }

            }
        })
    },
   /**
   * `RoleController.deleteRoleJurisdictionPost()`
   *  删除角色权限路由
   */
  deleteRoleJurisdictionPost: function (req, res) {

         var  _id        = parseInt(req.param('id'));
         var  _roleID = parseInt(req.param('roleID'));

         SRoleAction.destroy({action_id : _id, role_id: _roleID}).exec(function (err, status) {

               if(err){
                 console.log("删除角色权限状态时候发生错误( delete role Jurisdiction error!)");
                 res.send(500, { error: "DB Error" });
               }else{

                     /** 返回角色权限的checkbox状态到客户端告诉客户端需要改变状态 */
                     if(status){

                         /** 写入日志 */
                         SqlLogsService.WriteLogs(req, 0, 'deleteRoleJurisdiction');

                         res.myJsonReponse({ result: {type: 'delete',id: status[0].id}});

                     }else{
                         res.myJsonReponse({ result: {type: 'error'}});
                         console.log('删除s_role_action操作错误！')
                     }

               }

         })
   },
   /**
    * `RoleController.addRoleJurisdictionPost()`
    *  添加角色权限路由
   */
  addRoleJurisdictionPost: function (req, res) {

        var _id = parseInt(req.param('id'));
        var _roleId = parseInt(req.param('roleId'));


        SRoleAction.create({role_id:_roleId, action_id : _id}).exec(function (err, status) {

                if(err){
                  console.log("添加角色权限状态时候发生错误( add role Jurisdiction error!)");
                  res.send(500, { error: "DB Error" });
                }else{

                      /** 返回角色权限的checkbox状态到客户端告诉客户端需要改变状态 */
                      if(status.id){

                       /** 写入日志 */
                       SqlLogsService.WriteLogs(req, 0, 'addRoleJurisdiction');

                        res.myJsonReponse({ result: {type: 'add',id: status.id}});
                      }else{
                        res.myJsonReponse({ result: {type: 'error'}});
                        console.log('添加s_role_action操作错误！')
                      }

                }

        })
  },
  /**
   * `RoleController.searchRolePost()`
   *  搜索角色列表路由
   */
  searchRolePost: function (req,res) {

      var _pageIndex    = req.param('pageIndex');
      var _searchValue = req.param('searchValue');
      var _roleState      = parseInt(req.param('state'));
      var _orderBy        = req.param('orderBy');
      var _condition = {};

      if(_pageIndex ==''){
          _pageIndex = 1;
      }

         /** 当有输入搜索关键词的时候 */
         if(_searchValue != ""){

              /** 当并不是选择all的时候 */
              if(_roleState != -3){

                _condition.state = _roleState;
                _condition.isDelete =   {"!": true};
                _condition.or = [
                    {name: { 'like' : '%'+_searchValue+'%'}},
                    {code: {'like': '%'+_searchValue+'%'}}
                ];
                _condition.sort = _orderBy+" asc";

              /** 当是选择all的时候 */
              }else{

                  _condition.isDelete ={"!": true}
                  _condition.or = [
                    {name: { 'like' : '%'+_searchValue+'%'}},
                    {code: {'like': '%'+_searchValue+'%'}}
                  ]
                  _condition.sort = _orderBy+" asc";
              }

          /** 当没有输入搜索关键词的时候 */
          }else{

              /** 当并不是选择all的时候 */
              if(_roleState != -3){

                _condition.state = _roleState;
                _condition.isDelete = {"!": true};
                _condition.sort = _orderBy+" asc";

              /** 当是选择all的时候 */
              }else{

                  _condition.isDelete ={"!": true};
                  _condition.sort = _orderBy+" asc";

              }
          }


      /**  重新查询列表和分页信息 */
      SearchService.SearchRole(_condition, _pageIndex).spread(function (roleListResult, totalCountResult) {

          var pageInfo = PageService.PageData(_pageIndex, totalCountResult, sails.config.PageInfo.PageSize);

          /** 写入日志 */
          SqlLogsService.WriteLogs(req, 0, 'searchRole');

          return res.myJsonReponse({ result: {roleListResult : roleListResult, pageInfo: pageInfo}});

      })

  },
  /**
     * `RoleController.searchRoleJurisdictionPost()`
     *  搜索角色权限列表路由
     */
    searchRoleJurisdictionPost: function (req,res) {

          var _roleID           = parseInt(req.param('id'));
          var _pageIndex    = req.param('pageIndex');
          var _searchValue = req.param('searchValue');
          var _orderBy        = req.param('orderBy');
          var _condition     = {};

          if(_pageIndex ==''){
              _pageIndex = 1;
          }

          /** 当有输入搜索关键词的时候 */
          if(_searchValue != ""){

                _condition.or = [
                  { name: { 'like':  '%'+_searchValue+'%' }},
                  { code: { 'like':  '%'+_searchValue+'%' }},
                  { actionName: { 'like':  '%'+_searchValue+'%'}},
                  { controllerName: {'like': '%'+_searchValue+'%'}},
                ]
                _condition.isDelete = {"!": true};
                _condition.sort = _orderBy+" asc";


          /** 当没有输入搜索关键词的时候 */
          }else{

                 _condition.isDelete = {"!": true};
                 _condition.sort = _orderBy+" asc";

          }


          return SearchService.SearchJurisdiction(_roleID, _condition, _pageIndex).spread(function (roleActionListResult, actionListResult, totalCountResult) {

              var pageInfo = PageService.PageData(_pageIndex, totalCountResult, sails.config.PageInfo.PageSize);

              /** 写入日志 */
              SqlLogsService.WriteLogs(req, 0, 'searchRoleJurisdiction');

              return res.myJsonReponse({ result: {roleActionList: roleActionListResult , actionList: actionListResult, pageInfo: pageInfo}});

          });

    }

};
