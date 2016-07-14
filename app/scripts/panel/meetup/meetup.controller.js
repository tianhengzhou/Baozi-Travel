/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('MeetupCtrl', function($scope, $mdDialog, $mdMedia, profile,
                                     Meetups){
    var meetupCtrl = this;
    meetupCtrl.profile = profile;
    var createMeetupJson = function () {
      var description = (typeof meetupCtrl.description === 'undefined') ?
        '' : meetupCtrl.description;
      meetupCtrl.guest = meetupCtrl.guest.replace(/(^,)|(,$)/g, '');
      meetupCtrl.guests = meetupCtrl.guest.split(',');
      return {
        'name': meetupCtrl.name,
        'host': meetupCtrl.host,
        'location': meetupCtrl.location,
        'detailLocation': $scope.detailLocation,
        'guests': meetupCtrl.guests,
        'startDateTime': meetupCtrl.startDateTime.getTime(),
        'endDateTime': meetupCtrl.endDateTime.getTime(),
        'description': description,
        'createDate': (new Date()).getTime(),
        'createBy': meetupCtrl.profile.displayName
      };
    };
    meetupCtrl.showDialog = function (event) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: DialogCtrl,
        templateUrl: 'templates/panel/meetup/meetup.create.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      })
    };
  });
  function DialogCtrl($scope, $mdDialog) {
    $scope.cancel = function () {
      $mdDialog.cancel();
    }
  }
