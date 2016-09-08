/**
 * Created by tianheng on 7/20/16.
 */

"use strict";
angular.module('baoziApp')
    .directive('businessVirtualList', function () {
      return {
        scope: {
          businessDataProvider: '='
        },
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'templates/panel/business/business.virtual.list.html',
        link: function (scope, elem, attrs, ngModelCtrl) {
          var rowHeight = 20;

        }
      }
    });