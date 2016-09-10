/**
 * Created by tianheng on 7/20/16.
 */

"use strict";
angular.module('baoziApp')
    .directive('businessVirtualList',function () {
      return {
        scope: {
          businessDataProvider: '='
        },
        replace: true,
        restrict: 'A',
        templateUrl: 'templates/panel/business/business.virtual.list.html',
        link: function (scope, elem) {
          var rowHeight = 30;
          scope.height = 200;
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
              height: 500 + 'px'
            };
            scope.updateList();
          };
          scope.updateList = function () {
            var firstCell = Math.max(
                Math.floor(scope.scrollTop / rowHeight) - scope.cellsPerPage, 0);
            var cellsToCreate = Math.min(
              firstCell + scope.numberofCells, scope.numberofCells);
            scope.visibleProvider = scope.businessDataProvider.slice(
              firstCell, firstCell + cellsToCreate);
            for (var i = 0; i < scope.visibleProvider.length;i++){
              scope.visibleProvider[i].style = {
                'top': ((firstCell + i))*rowHeight + 'px'
              };
            }
          };
          scope.onScroll = function () {
            scope.scrollTop = elem.prop('scrollTop');
            scope.updateList();
            scope.$apply();
          };
          scope.init();
        }
      };
    });