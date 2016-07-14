/**
 * Created by tianhengzhou on 5/19/16.
 */
"use strict";

angular.module('baoziApp')
  .directive('userAuth', function () {
    return {
      templateUrl: 'templates/components/auth/userauth.html',
      restrict: 'E',
      controller: 'AuthCtrl',
      controllerAs: 'authCtrl',
      replace: true,
      link: function (scope) {
        scope.isLogin = true;
        scope.toLoginPage = function () {
          scope.isLogin = true;
        };
        scope.toRegisterPage = function () {
          scope.isLogin = false;
        };
      }
    };
  });
