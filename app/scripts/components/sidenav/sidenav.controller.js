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
  //   $scope.toggleLeft = buildDelayedToggler('left');
  //   $scope.toggleRight = buildToggler('right');
  //   $scope.isOpenRight = function(){
  //     return $mdSidenav('right').isOpen();
  //   };
  //
  //   /**
  //    * Supplies a function that will continue to operate until the
  //    * time is up.
  //    */
  //   function debounce(func, wait, context) {
  //     var timer;
  //
  //     return function debounced() {
  //       var context = $scope,
  //         args = Array.prototype.slice.call(arguments);
  //       $timeout.cancel(timer);
  //       timer = $timeout(function() {
  //         timer = undefined;
  //         func.apply(context, args);
  //       }, wait || 10);
  //     };
  //   }
  //
  //   /**
  //    * Build handler to open/close a SideNav; when animation finishes
  //    * report completion in console
  //    */
  //   function buildDelayedToggler(navID) {
  //     return debounce(function() {
  //       $mdSidenav(navID)
  //         .toggle()
  //         .then(function () {
  //           $log.debug("toggle " + navID + " is done");
  //         });
  //     }, 200);
  //   }
  //
  //   function buildToggler(navID) {
  //     return function() {
  //       $mdSidenav(navID)
  //         .toggle()
  //         .then(function () {
  //           $log.debug("toggle " + navID + " is done");
  //         });
  //     }
  //   }
  }]);
  // .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  //   $scope.close = function () {
  //     $mdSidenav('left').close()
  //       .then(function () {
  //         $log.debug("close LEFT is done");
  //       });
  //
  //   };
  // });

