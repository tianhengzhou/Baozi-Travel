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
        var diff = ($scope.expected - $scope.actual)/$scope.expected,
            canvasWidth = $element.attr('width'),
            canvasHeight = $element.attr('height'),
            circle = $element.find('circle')[0],
            baseRadius = circle.r.baseVal.value;
      }
    };

  });