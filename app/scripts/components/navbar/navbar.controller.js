/**
 * Created by tianhengzhou on 4/2/16.
 */
"use strict";

angular
  .module('baoziApp')
  .controller('NavbarController', ['$scope', '$mdMedia', '$mdSidenav',
    function ($scope, $mdMedia, $mdSidenav){
    $scope.$mdMedia = $mdMedia;
    $scope.$mdSidenav = $mdSidenav;
  }]);
