/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
  .directive('meetupCreate',function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/panel/meetup/meetup.create.html'
    };
  });