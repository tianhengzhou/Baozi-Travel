/**
 * Created by tianheng on 7/20/16.
 */

"use strict";
angular.module('baoziApp')
    .directive('businessVirtualList', function () {
      return {
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'templates/panel/business/business.virtual.list.html'
      }
    });