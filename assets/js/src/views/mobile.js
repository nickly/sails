'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    'jquery_ui',
    './common'
], function(_, $, Backbone) {


    var mobile = {};
     /**
     * 手机下菜单切换; 
     */
    mobile.initMobileMenu=function(){
        var CheckFocus=Backbone.View.extend({
            events:{
                'click':'menuClick'
            },
            el:"#nav-btn",
            menuClick:function(evt){
                if( $("#nav-menu").hasClass("active") ){
                        $("#nav-menu").removeClass("active");
                    }
                    else{
                        $("#nav-menu").addClass("active");
                    }
            }
        });
        return new CheckFocus();
    };   
    return mobile;

});