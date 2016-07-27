/**
 * Created by tianhengzhou on 4/2/16.
 */
"use strict";

angular
  .module('baoziApp')
  .controller('SidenavController',['$scope', '$state', '$timeout', '$mdSidenav',
    '$log', 'Users', 'Auth', function ($scope, $state, $timeout, $mdSidenav,
                                       $log, Users, Auth) {
      // var sidenavController = this;
      var profile = function (Users, Auth) {
        return Auth.$requireSignIn().then(function (firebaseUser) {
          return Users.getProfile(firebaseUser.uid).$loaded();
        });
      }(Users, Auth);
      profile.then(function (data) {
        $scope.emailHash = data.emailHash;
        $scope.name = data.displayName;
        return data;
      }, function (error) {
        console.log(error);
      });
      $scope.logout = function () {
        profile.then(function (data) {
          Auth.$signOut();
          data.online = null;
          data.$save().then(function () {
            $state.go('home');
          });
        });
      };
      $scope.close = function () {
        $mdSidenav('left').close();
      };
  }]);


