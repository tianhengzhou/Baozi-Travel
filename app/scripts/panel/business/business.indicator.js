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
      controller: function ($scope, $element) {
        $scope.radius = $element.find('circle')[0].r.baseVal.value;
        $scope.canvasWidth = $element.attr('width');
        $scope.canvasHeight = $element.attr('height');
        $scope.spacing = 0.9;
        function convertToRads(angle) {
          return angle*(Math.PI/180);
        }
        function findDegree(percentage) {
          return 360*percentage;
        }
        function getArcValues(index, radius, spacing) {
          return {
            innerRadius: (index + spacing)* radius,
            outerRadius: (index + spacing)* radius
          };
        }
        // console.log($scope.submitCount);
        //
        // $scope.$watch('deliveryCount', function () {
        //   console.log('deliver increase');
        //   $scope.drawArc()
        // });
        // $scope.$watch('paidCount', function () {
        //   console.log('paid increase');
        //
        //   $scope.drawArc()
        // });
        $scope.drawArc = function () {
          return d3
                  .svg
                  .arc()
                  .innerRadius(function (d) {
                      return d.innerRadius;
                  })
                  .outerRadius(function (d) {
                    return d.outerRadius;
                  })
                  .startAngle(0)
                  .endAngle(function (d) {
                    return d.endAngle;
                  });
        };
        $scope.pathColor = function (percentage) {
          if (percentage < 0.25){
            return 'red';
          }else if (percentage >= 0.25 && percentage < 0.5){
            return 'orange';
          }else{
            return 'green';
          }
        };
        $scope.getArcInfo = function (index, value, radius, spacing) {
          var end = findDegree(value),
              arcValues = getArcValues(index, radius, spacing);
          return {
            innerRadius: arcValues.innerRadius,
            outerRadius: arcValues.outerRadius,
            startAngle: 0,
            endAngle: convertToRads(end)
          };
        };
        $scope.tweenArc = function (b, arc) {
          return function (a) {
            var i = d3.interpolate(a, b);
            for (var key in b){
              a[key] = b[key];
            }
            return function (t) {
              return arc(i(t));
            };
          };
        };
      },
      templateUrl: 'templates/panel/business/business.indicator.html',
      scope: {
        submitCount: '@',
        deliveryCount: '@',
        paidCount: '@',
        expected: '@',
        name: '@'
      }
    };
  })
  .directive('pathGroup', function () {
    return {
      requires: '^indicatorDonut',
      link: function (scope, element) {
        scope.deliveryCount =
        element.attr("transform", "translate(" + scope.canvasWidth/2 + "," +
          scope.canvasHeight/2 + ")");
      }
    };
  })
  .directive('deliveryPath', function(){
    return {
      restrict: 'A',
      transclude: true,
      requires: '^pathGroup',
      scope: {
        percentage: '@'
      },
      link: function(scope, element){
        var arc = d3.select(element[0]),
            arcObject = scope.$parent.drawArc(),
            innerArc = scope.$parent.getArcInfo(
              1.1, scope.percentage, scope.$parent.radius, 0.05),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
          .datum(innerArc)
          .attr('d', arcObject)
          .transition()
          .delay(100)
          .duration(2000)
          .attrTween("d", scope.$parent.tweenArc({
            endAngle: end
          }, arcObject));
        var classList;
        scope.$watch('percentage', function () {
          var classList = element.attr('class').split(/\s+/);
          arc
            .transition()
            .delay(100)
            .duration(2000)
            .attrTween("d", scope.$parent.tweenArc({
              endAngle: (360*scope.percentage)*(Math.PI/180)
            }, arcObject));
          if (classList.indexOf('green') == -1 &&
            classList.indexOf('red') == -1 && classList.indexOf('orange') ){
            element.addClass(scope.$parent.pathColor(scope.percentage));
          }else{
            if (classList.indexOf('green') > -1){
              element.removeClass('green')
            }
            if (classList.indexOf('red') > -1){
              element.removeClass('red')
            }
            if (classList.indexOf('orange') > -1){
              element.removeClass('orange')
            }
            element.addClass(scope.$parent.pathColor(scope.percentage));
          }
        });
      }
    };
  })
  .directive('paidPath', function(){
    return {
      restrict: 'A',
      transclude: true,
      requires: '^pathGroup',
      scope: {
        percentage: '@'
      },
      link: function(scope, element){
        var arc = d3.select(element[0]),
            arcObject = scope.$parent.drawArc(),
            innerArc = scope.$parent.getArcInfo(
              1.2, scope.percentage, scope.$parent.radius, 0.1),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
          .datum(innerArc)
          .attr('d', arcObject)
          .transition()
          .delay(100)
          .duration(2000)
          .attrTween("d", scope.$parent.tweenArc({
            endAngle: end
          }, arcObject));
        scope.$watch('percentage', function () {
          var classList = element.attr('class').split(/\s+/);
          arc
            .transition()
            .delay(100)
            .duration(2000)
            .attrTween("d", scope.$parent.tweenArc({
              endAngle: (360*scope.percentage)*(Math.PI/180)
            }, arcObject));
          if (classList.indexOf('green') == -1 &&
            classList.indexOf('red') == -1 && classList.indexOf('orange') ){
            element.addClass(scope.$parent.pathColor(scope.percentage));
          }else{
            if (classList.indexOf('green') > -1){
              element.removeClass('green')
            }
            if (classList.indexOf('red') > -1){
              element.removeClass('red')
            }
            if (classList.indexOf('orange') > -1){
              element.removeClass('orange')
            }
            element.addClass(scope.$parent.pathColor(scope.percentage));
          }
        });
      }
    };
  })
  .directive('generalPath', function(){
    return {
      restrict: 'A',
      transclude: true,
      requires: '^pathGroup',
      scope: {
        percentage: '@'
      },
      link: function(scope, element){
        var arc = d3.select(element[0]),
            arcObject = scope.$parent.drawArc(),
            innerArc = scope.$parent.getArcInfo(
              1.3, scope.percentage, scope.$parent.radius, 0.15),
            end = innerArc.endAngle;
        innerArc.endAngle = 0;
        arc
          .datum(innerArc)
          .attr('d', arcObject)
          .transition()
          .delay(100)
          .duration(2000)
          .attrTween("d", scope.$parent.tweenArc({
            endAngle: end
          }, arcObject));
        scope.$watch('percentage', function () {
          var classList = element.attr('class').split(/\s+/);

          arc
            .transition()
            .delay(100)
            .duration(2000)
            .attrTween("d", scope.$parent.tweenArc({
              endAngle: (360*scope.percentage)*(Math.PI/180)
            }, arcObject));
          if (classList.indexOf('green') == -1 &&
            classList.indexOf('red') == -1 && classList.indexOf('orange') ){
            element.addClass(scope.$parent.pathColor(scope.percentage));
          }else{
            if (classList.indexOf('green') > -1){
              element.removeClass('green')
            }
            if (classList.indexOf('red') > -1){
              element.removeClass('red')
            }
            if (classList.indexOf('orange') > -1){
              element.removeClass('orange')
            }
            element.addClass(scope.$parent.pathColor(scope.percentage));
          }
        });
      }
    };
  });
