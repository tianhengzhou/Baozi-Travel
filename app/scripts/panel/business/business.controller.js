/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($scope, $mdDialog, $firebaseObject,
                                         $mdMedia, $firebaseArray, profile,
                                         businesses, Inventories, Businesses){
      var businessCtrl = this;
      businessCtrl.businesses = businesses;
      businessCtrl.host = profile.displayName;
      var businessRef = Businesses.all;
      var inventoriesRef = Inventories.all;
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
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.host= profile.displayName;
        $scope.createEvent = function () {
          businesses.$add(createBusinessJson());
          $mdDialog.hide();
        };
        $scope.types = [
          '小护士',
          '神医'
        ];
      };
      function addInventories(idxSnap){
        var inventory = businessRef.child(idxSnap.key);
        var inventory_id;
        profile.$save();
        inventory_id = inventoriesRef.push(createInventoryJson());
        inventory.child('inventory_id').set(inventory_id.key);
      }
      function addBusinesses(idxSnap) {
        console.log(idxSnap);
        var inventory_id;
        if (profile.businesses === undefined || profile.businesses.length === 0){
          profile.businesses = [idxSnap.key];
          addInventories(idxSnap);
        }else{
          if (profile.businesses.indexOf(idxSnap.key) == -1){
            profile.businesses.push(idxSnap.key);
            addInventories(idxSnap);
          }
        }

      }
      function removBuesinesses(snap) {
        console.log(snap.key);
        var index = profile.businesses.indexOf(snap.key);
        if (index > -1){
          profile.businesses.splice(index, 1);
        }
        profile.$save();
      }
      businessRef.on('child_added', addBusinesses);
      businessRef.on('child_removed', removBuesinesses);
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
