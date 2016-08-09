/**
 * Created by test on 8/7/16.
 */
"use strict";
angular.module('baoziApp')
  .directive('indicatorDonut', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      controller: function ($scope, $element, $attrs) {
        var diff = ($scope.expected - $scope.actual)/$scope.expected;
        $scope.raduis = $element.find('circle')[0].r.baseVal.value;
        $scope.canvasWidth = $element.attr('width');
        $scope.canvasHeight = $element.attr('height');
        $scope.spacing = 0.9;
        function convertToRads(angle) {
          return angle*(Math.PI/180);
        }
        function findDegress(percentage) {
          return 360*percentage;
        }
        function getArcValues(index, radius, spacing) {
          return {
            innerRadius: (index)
          }
        }
      }
    };

  });