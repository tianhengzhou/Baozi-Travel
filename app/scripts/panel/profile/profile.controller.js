/**
 * Created by tianhengzhou on 6/1/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('ProfileCtrl', function ($state, $mdDialog, $mdMedia, md5, auth,
                                       profile) {
      var profileCtrl = this;
      var MethodCtrl = function ($scope, profile) {
        console.log(profile);
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.savePaymentMethod = function () {
          if (profile.paymentMethods == ''){
            profile.paymentMethods = [];
          }
          console.log(profile.paymentMethods);
          profile.paymentMethods.push($scope.paymentMethod);
          console.log(profile.paymentMethods);
          profile.$save();
          $mdDialog.hide();
        };
      };
      profileCtrl.profile = profile;
      profileCtrl.updateProfile = function () {
        profileCtrl.profile.emailHash = md5.createHash(auth.email);
        profileCtrl.profile.$save();
      };
      profileCtrl.updateMethod = function ($index, method) {
        profileCtrl.profile.paymentMethod[$index] = method;
        profileCtrl.profile.$save();
      };
      profileCtrl.deleteMethod = function ($index){
        profileCtrl.profile.paymentMethod.splice($index, 1);
        profileCtrl.profile.$save();
      };
      profileCtrl.showDialogPaymentMethod = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: MethodCtrl,
          templateUrl: 'templates/panel/profile/profile.payment.method.html',
          parent: angular.element(document.body),
          targetEvent: event,
          locals: {profile: profile},
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
  });
