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
  })
  .directive('googleplace', function () {
    return {
      require: "ngModel",
      link: function (scope, element, attrs, model) {
        var options = {
          types: [],
          componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
        scope.gPlace.addListener('place_changed', function () {
          var geoComponents = scope.gPlace.getPlace();
          var lat = geoComponents.geometry.location.lat();
          var lng = geoComponents.geometry.location.lng();
          var detailLoc = [];
          detailLoc.push(lat, lng);
          scope.detailLoc = detailLoc;
          scope.$apply(function () {
            model.$setViewValue(element.val());
          });
        });
      }
    };
  });