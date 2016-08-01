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
    });

//     var list = new ArrayWithSum(ref);
// list.$loaded().then(function() {
//   console.log("List has " + list.sum() + " items");
// });