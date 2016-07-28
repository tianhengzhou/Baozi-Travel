/**
 * Created by tianhengzhou on 6/1/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('ProfileCtrl', function ($state, $mdDialog, $mdMedia,
                                       $firebaseArray, md5, auth, profile, methods) {
      var profileCtrl = this;
      profileCtrl.methods = methods;
      var MethodCtrl = function ($scope) {
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.savePaymentMethod = function () {
          console.log(methods);
          methods.$add({paymentMethods: $scope.paymentMethod});
          $mdDialog.hide();
        };
      };
      profileCtrl.profile = profile;
      profileCtrl.updateProfile = function () {
        profileCtrl.profile.emailHash = md5.createHash(auth.email);
        profileCtrl.profile.$save();
      };
      profileCtrl.updateMethod = function (method) {
        profileCtrl.methods.$save(method);
      };
      profileCtrl.deleteMethod = function (method){
        profileCtrl.methods.$remove(method);
      };
      profileCtrl.showDialogPaymentMethod = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: MethodCtrl,
          templateUrl: 'templates/panel/profile/profile.payment.method.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
  });
