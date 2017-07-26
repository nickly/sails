/**
 * Created by a123 on 2017/7/18.
 */

var Promise = require('bluebird');

module.exports = {

       /**  查询角色列表 */
      SearchRole: function (_condition, _page) {

          var totalCount = SRole.count(_condition).then(function(count) {
              return count;
          }).catch(function(err) {
              console.log("s_role查询失败(s_role is error):"+err);
              res.send(500, { error: "DB Error" });
          });

          /** 获取Role实体 */
          var roleList = SRole.find(_condition).paginate({ page: _page, limit: sails.config.PageInfo.PageSize }).then(function(list){
              return  list;
          }).catch(function(err) {
              console.log("s_role查询失败(s_role is error):"+err);
              res.send(500, { error: "DB Error" });
          });

          return Promise.all([roleList, totalCount])

      },
       /**  查询角色权限列表 */
      SearchJurisdiction: function (_roleID, _condition, _page) {

          /** 查询s_role_action表中roldid值的所有数据 */
          var roleActionList =  SRoleAction.find({role_id: _roleID}).then(function (roleActionList) {
              return roleActionList;
          }).catch(function(err) {
              console.log("s_role_action查询失败(s_role_action is error):"+err);
              res.send(500, { error: "DB Error" });
          });

           var totalCount = SAction.count(_condition).then(function(count) {
               return count;
           }).catch(function(err) {
               console.log("s_action查询失败(s_action is error):"+err);
               res.send(500, { error: "DB Error" });
           });

          /**  查询s_action表 */
          var actionList = SAction.find(_condition).paginate({ page: _page, limit: sails.config.PageInfo.PageSize }).then(function (actionList) {
              return  actionList;
          }).catch(function(err) {
              console.log("s_action查询失败(s_action is error):"+err);
              res.send(500, { error: "DB Error" });
          });

           return Promise.all([roleActionList, actionList, totalCount])

      },
    /**  查询角色列表 */
    SearchUser: function (_condition, _page) {

        var totalCount = SUser.count(_condition).then(function(count) {
            return count;
        }).catch(function(err) {
            console.log("s_user查询失败(s_user is error):"+err);
            res.send(500, { error: "DB Error" });
        });

        /** 获取Role实体 */
        var userList = SUser.find(_condition).paginate({ page: _page, limit: sails.config.PageInfo.PageSize }).then(function(list){
            return  list;
        }).catch(function(err) {
            console.log("s_user查询失败(s_user is error):"+err);
            res.send(500, { error: "DB Error" });
        });

        return Promise.all([userList, totalCount])

    },
    /**  查询日志列表 */
    SearchLogs: function (_condition, _page) {

      var totalCount = SLogs.count(_condition).then(function(count) {
        return count;
      }).catch(function(err) {
        console.log("s_logs查询失败(s_logs is error):"+err);
        res.send(500, { error: "DB Error" });
      });

      /** 获取Role实体 */
      var logsList = SLogs.find(_condition).paginate({ page: _page, limit: sails.config.PageInfo.PageSize }).then(function(list){
        return  list;
      }).catch(function(err) {
        console.log("s_logs查询失败(s_logs is error):"+err);
        res.send(500, { error: "DB Error" });
      });

      return Promise.all([logsList, totalCount])

    }


}
