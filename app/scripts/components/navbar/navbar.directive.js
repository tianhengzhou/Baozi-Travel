/**
 * Created by tianhengzhou on 4/2/16.
 */
"use strict";

angular.module('baoziApp')
  .directive('navBar', function () {
    return {
      templateUrl: 'templates/components/navbar/navbar.html',
      restrict: 'E',
      controller: 'NavbarController',
      controllerAs: 'navbar',
      replace: true
    };
  });
