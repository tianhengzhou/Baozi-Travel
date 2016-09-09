/**
 * Created by tianheng on 7/20/16.
 */

"use strict";
angular.module('baoziApp')
    .directive('businessVirtualList',[ '$window' ,function ($window) {
      return {
        scope: {
          businessDataProvider: '='
        },
        restrict: 'E',
        require: 'ngModel',
        templateUrl: 'templates/panel/business/business.virtual.list.html',
        link: function (scope, elem, attrs, ngModelCtrl) {
          var rowHeight = 20;
          scope.height = $window.innerHeight * 0.6;
          scope.scrollTop = 0;
          scope.visibleProvider = [];
          scope.cellsPerPage = 0;
          scope.numberofCells = 0;
          scope.canvasHeight = 0;
          scope.init = function () {
            elem[0].addEventListener('scroll', scope.onScroll);
            scope.cellsPerPage = Math.round(scope.height / rowHeight);
            scope.numberofCells = 3 * scope.cellsPerPage;
            scope.canvasHeight = {
              height: ($window.innerHeight * 0.6) + 'px'
            };
            scope.updateList();
          }
          scope.updateList = function () {
            var firstCell = Math.max(
                Math.floor(scope.scrollTop / rowHeight) - scope.cellsPerPage, 0);
            var cellsToCreate = Math.min(firstCell + scope.numberofCells, scope.numberofCells);
          }
        }
      }
    }]);