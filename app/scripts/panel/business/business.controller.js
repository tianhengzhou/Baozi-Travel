/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($scope, $mdDialog, $firebaseObject,
                                         $mdMedia, $firebaseArray, profile,
                                         businesses, methods){
      var authorizeRef = firebase.database().ref();
      var businessCtrl = this;
      $scope.query = {
        filter: '',
        order: 'mitbbsId',
        limit: 5,
        page: 1
      };
      $scope.businesses = businesses;
      console.log(businesses);
      $scope.selected = [];
      $scope.logItem = function (item) {
        console.log(item.$id, 'was selected');
      };
      console.log($scope.selected);
      var InventoryCtrl = function ($scope) {
        var createProductJson = function () {
          return {
            'mitbbsId': $scope.mitbbsId,
            'product': $scope.product,
            'price': $scope.price,
            'quantity': $scope.quantity,
            'location': $scope.location,
            'zipCode': $scope.zipCode,
            'paymentMethod': $scope.paymentMethod,
            'paid': false
          };
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.mitbbsId= profile.mitbbsId;
        $scope.uploadProduct = function () {
          businesses.$add(createProductJson());
          console.log(businesses);
          $mdDialog.hide();
        };
        $scope.products = [
          'Dell Inspiron 13 i7359-8408SLV  (-Adorama-)',
          'Lenovo G50 80KR0015US Laptop (-Ebay-)',
          'HP 15-ac143dx Laptop (-Bestbuy-)',
          'Lenovo Ideapad 100s 80R90004US (-Bestbuy-)',
          'DELL i5759-2012SLV Laptop (-DELL-)',
          'Toshiba S55-C5274 Laptop (-Staples-)'
        ];
        console.log(methods);
        $scope.methods = methods;
      };
      var ConfirmCtrl = function ($scope, $firebaseObject, selectedBusinesses,
                                  businesses) {
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        function confirmPayment(business) {
          console.debug(business);
          if (!business.paid){
            business.paid = new Date().toDateString();
            businesses.$save(business);
            console.debug(business);
          }
        }
        function success(item){
          console.debug(item);
          if (selectedBusinesses.length > 0){
            if (item.$value == null){
              $scope.error = 'Invalid Secret.'
            }else{
              selectedBusinesses.forEach(confirmPayment);
              $mdDialog.cancel();
            }
          }else{
            $scope.error = 'You need at least select one record.'
          }

        }
        function error(){
          $scope.error = 'Invalid Secret.'
        }
        $scope.authorizeUser = function() {
          $firebaseObject(authorizeRef.child(
            $scope.secret)).$loaded().then(success, error);
        }
      };
      businessCtrl.showDialogInventory = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: InventoryCtrl,
          templateUrl: 'templates/panel/business/business.create.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };

      businessCtrl.showDialogPaymentConfirmation = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: ConfirmCtrl,
          templateUrl: 'templates/panel/business/business.payment.confirm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses},
          fullscreen: useFullScreen
        });
      };
    });
