'use strict'
define([
    'underscore',
    'jquery',
    'backbone',
    './common',
    'highcharts',
    'jquery_ui'
], function(_, $, Backbone, _commonObject, highcharts) {


    var object = {};
    object.analyzed = function() {
        $('#container').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'SEND MAIL REPORT'
            },
            xAxis: {
                categories: ['VANS1', 'VANS2', 'VANS3']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'MAIL TOTAL'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: 'TOTAL',
                data: [5, 8, 15]
            }, {
                name: 'SUCCESS',
                data: [2, 4, 3]
            }, {
                name: 'FAIL',
                data: [3, 4, 12]
            }]
        });
    };

    /**
     * 构造函数; 
     */
    object.constructor = function() {
        object.analyzed();
    }


    return object;

});