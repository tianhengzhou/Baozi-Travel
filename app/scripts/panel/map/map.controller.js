/**
 * Created by tianheng on 6/24/16.
 */
"use strict";

angular.module('baoziApp')
    .controller('MapCtrl', function($scope, profile, businesses){
        var mapCtrl = this,
            myLatlng = new google.maps.LatLng(39, -95);
        var b_marks = [];
        var onMarkerClicked = function (marker) {
          console.log('click');
          marker.showWindow = false;
          $scope.$apply();
          // window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
        };
        for (var i = 0; i < businesses.length; i++){
          b_marks.push({
            'id': i,
            'latitude': businesses[i].detailLoc[0],
            'longitude': businesses[i].detailLoc[1],
            'showWindow': false
          })
        }
        console.log(b_marks);
        _.each(b_marks, function (marker) {
            marker.closeClick = function () {
              marker.showWindow = false;
              $scope.$apply();
            };
            marker.mitbbsId = businesses[marker.id].mitbbsId;
            marker.product = businesses[marker.id].product;
            marker.quantity = businesses[marker.id].quantity;
            marker.location = businesses[marker.id].location;
            marker.onClicked = function () {
              onMarkerClicked(marker);
            };
          });
        $scope.markers = b_marks;
        $scope.map = {
            center: myLatlng,
            zoom: 5
          };
    });