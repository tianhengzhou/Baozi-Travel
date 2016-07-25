/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($scope, $mdDialog, $firebaseObject,
                                         $mdMedia, $firebaseArray, profile,
                                         businesses, methods){
      var businessCtrl = this;
      businessCtrl.businesses = businesses;
      console.log(businessCtrl.businesses);
      businessCtrl.host = profile.displayName;
      var InventoryCtrl = function ($scope) {
        var createProductJson = function () {
          return {
            'mitbbsId': $scope.mitbbsId,
            'product': $scope.product,
            'price': $scope.price,
            'quantity': $scope.quantity,
            'location': $scope.location,
            'zipCode': $scope.zipCode,
            'paid': false
          };
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.host= profile.displayName;
        $scope.uploadProduct = function () {
          businesses.$add(createProductJson());
          $mdDialog.hide();
        };
        $scope.products = [
          'Dell Inspiron 13 i7359-8408SLV  (-Adorama-)',
          'Lenovo G50 80KR0015US Laptop (-Ebay-)',
          'HP 15-ac143dx Laptop (-Bestbuy-)',
          'Lenovo Ideapad 100s 80R90004US (-Bestbuy-)',
          'DELL i5759-2012SLV Laptop (-DELL-)',
          'Toshiba S55-C5274 Laptop (-Staepls-)'
        ];
        $scope.methods = methods;
      };
      var MethodCtrl = function ($scope) {
        var updateFlag = false;
        $scope.methods = methods;
        $scope.writeMethod = function (method) {
          $scope.paymentMethod = method;
          updateFlag = true;
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.savePaymentMethod = function () {
          if (updateFlag){
            methods.$save($scope.paymentMethod);
          }else{
            methods.$add($scope.paymentMethod);
          }
          $mdDialog.hide();
        };
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
      businessCtrl.showDialogPaymentMethod = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: MethodCtrl,
          templateUrl: 'templates/panel/business/business.payment.method.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
      // $scope.gridOptions = {
      //   enableSorting: true,
      //   columnDefs: [
      //     {field: 'mitbbsId'},
      //     {field: 'product'},
      //     {field: 'price'},
      //     {field: 'quantity'},
      //     {field: 'location'},
      //     {field: 'zipCode'},
      //     {field: 'paid'}
      //   ],
      //   onRegisterApi: function( gridApi ) {
      //     $scope.grid1Api = gridApi;
      //   }
      // };
      // $scope.gridOptions.data = businessCtrl.businesses
    });
