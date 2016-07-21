/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($scope, $mdDialog, $firebaseObject, $mdMedia, profile,
        Businesses, businesses){
      var businessCtrl = this;
      businessCtrl.businesses = businesses;
      console.log(businessCtrl.businesses);
      var createBusinessJson = function () {
        var description = (typeof $scope.description === 'undefined') ?
            '' : $scope.description;
        $scope.guest = $scope.guest.replace(/(^,)|(,$)/g, '');
        $scope.guests = $scope.guest.split(',');
        return {
          'name': $scope.name,
          'host': $scope.host,
          'type': $scope.type,
          'location': $scope.location,
          'detailLoc': $scope.detailLoc,
          'guests': $scope.guests,
          'startDateTime': new Date($scope.startDateTime).getTime(),
          'endDateTime': new Date($scope.endDateTime).getTime(),
          'description': description,
          'createDate': (new Date()).getTime(),
          'createBy': profile.displayName
        };
      };
      businessCtrl.host = profile.displayName;
      var DialogCtrl = function ($scope) {
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.host= profile.displayName;
        $scope.createEvent = function () {
          Businesses.all.push(createBusinessJson());
          $mdDialog.hide();
        };
        $scope.types = [
          'Conference',
          'Meeting',
          'Party',
          'Wedding',
          'Social Networking',
          'Birthday',
          'Family',
          'Sport',
          'Other'
        ];
      };
      businessCtrl.showDialog = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: DialogCtrl,
          templateUrl: 'templates/panel/meetup/meetup.create.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
    });
