/**
 * Created by tianheng on 6/24/16.
 */
angular.module('baoziApp')
    .controller('MapCtrl', function($scope, profile, businesses){
        var mapCtrl = this,
            myLatlng = new google.maps.LatLng(37.352886, -122.012384),
            mapOptions = {
                zoom: 12,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false
            };
        $scope.map = {
          center: myLatlng,
          zoom: 8
        }
    });