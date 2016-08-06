/**
 * Created by tianheng on 7/20/16.
 */

"use strict";
angular.module('baoziApp')
  .directive('meetupCreate',function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/panel/business/business.create.html'
    };
  })
  .directive('donutChart', function () {
    return{
      scope:{
        
      },
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/panel/business/donut.html'
    }
  });
    