/**
 * 文件依赖
 */

require.config({
    baseUrl: '/', //依赖相对路径
    paths: {
        jquery: 'js/dependencies/jquery-1.12.4.min',
        underscore: 'js/dependencies/underscore-min',
        backbone: 'js/dependencies/backbone-min',
        jquery_ui: 'js/dependencies/jquery-ui.min',
        tinymce: 'plugins/tinymce/tinymce.min',
        moment: 'js/dependencies/moment-with-locales.min',
        Util: 'js/extensions/Util',
        String: 'js/extensions/String',
        'jquery-mousewheel': 'plugins/datetimepicker/jquery.mousewheel.min',
        datetimepicker: 'plugins/datetimepicker/jquery.datetimepicker.full.min',
        highcharts: 'js/dependencies/highcharts'
    },
    shim: { //引入没有使用requirejs模块写法的类库。backbone依赖underscore
        'underscore': {
            exports: '_'
        },
        'jquery': {
            exports: '$'
        },
        'highcharts': {
            deps: ['jquery']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'Util': {
            exports: 'Util'
        },
        'String': {
            exports: 'String'
        },
        'jquery-mousewheel': ['jquery'],
        'datetimepicker': ['jquery', 'jquery-mousewheel']
    },
    urlArgs: "r=" + Math.random() //利用版本号解决缓存问题;
});