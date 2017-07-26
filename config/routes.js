/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    /** 登录页路由 */
    '/': 'LoginController.login',
    '/login': 'LoginController.login',
    'POST /loginPost': 'LoginController.loginPost',
    '/logout': 'LoginController.logout',

    /** 首页路由 */
    '/home': 'HomeController.index',
    '/overview': 'HomeController.index',

    /** ======权限管理路由 =====*/
    /****** 角色管理模块 *****/
    //角色管理路由
    '/role': 'RoleController.index',
    //添加角色路由
    'POST /addRolePost': 'RoleController.addRolePost',
    //删除角色路由
    'POST /deleteRolePost': 'RoleController.deleteRolePost',
    //修改角色路由
    'POST /updateRolePost': 'RoleController.updateRolePost',
    //修改角色状态路由
    'POST /updateRoleStatePost': 'RoleController.updateRoleStatePost',
    //删除角色权限路由
    'POST /deleteRoleJurisdictionPost': 'RoleController.deleteRoleJurisdictionPost',
    //添加角色权限路由
    'POST /addRoleJurisdictionPost': 'RoleController.addRoleJurisdictionPost',
    //搜索角色权限路由
    'POST /searchRoleJurisdictionPost': 'RoleController.searchRoleJurisdictionPost',
    //搜索角色列表路由
    'POST /searchRolePost': 'RoleController.searchRolePost',

    /****** 用户管理模块 *****/
    '/useradmin': 'UserController.index',
    //添加用户路由
    'POST /addUserPost': 'UserController.addUserPost',
    //修改用户路由
    'POST /updateUserPost': 'UserController.updateUserPost',
    //删除用户路由
    'POST /deleteUserPost': 'UserController.deleteUserPost',
    //搜索用户列表路由
    'POST /searchUserPost': 'UserController.searchUserPost',
    //修改用户状态路由
    'POST /updateUserStatePost': 'UserController.updateUserStatePost',
    //获取用户组路由
    'POST /userGroupPost': 'UserController.userGroupPost',
    //修改用户角色状态路由
    'POST /createRoleStatePost': 'UserController.createRoleStatePost',
    //修改用户角色状态路由
    'POST /deleteRoleStatePost': 'UserController.deleteRoleStatePost',
    'POST /getRoleByUser': 'UserController.getRoleByUser',
    'POST /setuserrole': 'UserController.setUserRole',

    /****** 日志管理模块 *****/
    '/logs': 'logsController.index',
    //搜索日志路由;
    'POST /searchLogsPost': 'LogsController.searchLogsPost',
    //删除日志路由;
    'POST /deleteLogsPost': 'LogsController.deleteLogsPost',
    //导出execl路由;
    'POST /exportExeclPost': 'LogsController.exportExeclPost',


    /**邮件模板管理路由 */
    //模板管理路由
    '/variables': 'TemplateController.variables',
    '/template': 'TemplateController.index',
    '/searchTemplate': 'TemplateController.search',
    'post /updateTemplateStatus': 'TemplateController.updateStatus',
    'post /deleteTemplate': 'TemplateController.delete',
    'post /template/addPost': 'TemplateController.addPost',
    '/template/category': 'TemplateController.category',
    '/template/new': 'TemplateController.new',
    'post /template/category/update': 'TemplateController.categoryUpdate',
    'post /template/category/new': 'TemplateController.categoryNew',
    'post /template/category/delete': 'TemplateController.categoryDelete',
    'post /template/category/search': 'TemplateController.categorySearch',
    'post /template/templateInfo': 'TemplateController.templateInfo',

    /**************
     * 收件箱路由
     */
    '/outbox': 'OutBoxController.index',
    'post /searchOutBox': 'OutBoxController.search',
    'post /movecategory': 'OutBoxController.movecategory',
    '/outbox/delete': 'OutBoxController.delete',
    '/outbox/retry': 'OutBoxController.retry',
    '/outbox/compose': 'OutBoxController.compose',
    '/outbox/templateByCategory': 'OutBoxController.templateByCategory',
    '/outbox/send': 'OutBoxController.sendEmail',


    /**************
     * OAuth认证管理
     */
    '/oauth': 'OAuthController.index',
    'post /searchOAuth': 'OAuthController.search',
    'post /oauth/delete': 'OAuthController.delete',
    'post /oauth/save': 'OAuthController.save',



    /***************
     * 日志管理
     */
    '/logs': 'LogsController.index',
    /***************
     * 统计中心路由
     */
    '/report': 'ReportController.index',
    /************
     * 系统设置路由
     */
    '/setting': 'SettingController.index',
    'post /settingPost': 'SettingController.save',


    /***********
     * 第三方调用API
     */
    '/api/gettoken': 'ApiController.gettoken',
    '/api/refreshtoken': 'ApiController.refreshtoken',
    '/api/mail/sendtemplate': 'ApiController.sendTemplate',
    '/api/mail/sendtemplatelist/:list': 'ApiController.sendtemplatelist',
    '/api/mail/updateEmail': 'ApiController.updateEmail',
    '/api/mail/cancelEmail': 'ApiController.cancelEmail',
    '/api/template/list': 'ApiController.templatelist',
    '/api/data/emailStatus': 'ApiController.emailStatus',
    /***************************************************************************
     *

     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};