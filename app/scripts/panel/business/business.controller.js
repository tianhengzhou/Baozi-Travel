/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($scope, $mdDialog, $firebaseObject,
                                         $mdMedia, $firebaseArray, profile,
                                         businesses, inventories){
      var businessCtrl = this;
      businessCtrl.businesses = businesses;
      businessCtrl.host = profile.displayName;
      var DialogCtrl = function ($scope) {
        var createBusinessJson = function () {
          // var description = (typeof $scope.description === 'undefined') ?
          //   '' : $scope.description;
          // $scope.guest = $scope.guest.replace(/(^,)|(,$)/g, '');
          // $scope.guests = $scope.guest.split(',');
          return {
            'buyer_name': $scope.buyerName,
            'seller_name': $scope.sellerName,
            'inventory_id': ""
          };
        };
        var createInventoryJson = function () {
          return {
            'p_name': '',
            'p_price_buy': '',
            'p_price_sell': '',
            'p_payment_paid': '',
            'p_payment_received': '',
            'p_shipment_send': '',
            'p_order_complete': ''
          };
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.host= profile.displayName;
        $scope.createEvent = function () {
          businesses.$add(createBusinessJson()).then(function (ref) {
            console.log(ref.path.o[1]);
            // var id = [];
            if (profile.businesses.length === 0){
              profile.businesses = [ref.path.o[1]];
            }else{
              profile.businesses.push(ref.path.o[1]);
            }
            profile.$save();
          });
          inventories.$add(createInventoryJson()).then(function (ref) {
            console.log(ref.path.o[1]);
          });
          $mdDialog.hide();
        };
        $scope.types = [
          '小护士',
          '神医'
        ];
      };
      businessCtrl.showDialog = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: DialogCtrl,
          templateUrl: 'templates/panel/business/business.create.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
    });
