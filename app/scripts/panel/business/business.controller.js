/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($scope, $mdDialog, $firebaseObject,
                                         $mdMedia, $firebaseArray, profile,
                                         businesses, methods, products){
      console.log(products[0].product_name);
      var authorizeRef = firebase.database().ref();
      var businessCtrl = this;
      $scope.query = {
        filter: '',
        order: 'mitbbsId',
        limit: 5,
        page: 1
      };
      $scope.businesses = businesses;
      $scope.selected = [];
      $scope.logItem = function (item) {
        console.log(item.$id, 'was selected');
      };
      var obj = $firebaseObject(authorizeRef.child('isDisabled'));
      obj.$bindTo($scope, 'isDisabled').then(function () {
        $scope.status = $scope.isDisabled.$value;
        $scope.toggledisableAdd = function () {
          if ($scope.isDisabled.$value === true){
            $scope.isDisabled.$value = false;
            $scope.status = false;
          }else{
            $scope.isDisabled.$value = true;
            $scope.status = true;
          }
        };
      });
      $scope.isadmin = profile.role === 'admin';
      $scope.isshenyi = profile.role === 'shenyi';
      var inventoryCtrl = function ($scope) {
        var createProductJson = function () {
          return {
            'mitbbsId': $scope.mitbbsId,
            'product': $scope.product,
            'price': $scope.price,
            'quantity': $scope.quantity,
            'location': $scope.location,
            'zipCode': $scope.zipCode,
            'paymentMethod': $scope.paymentMethod,
            'paid': false,
            'delivered': false
          };
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.mitbbsId= profile.mitbbsId;
        $scope.products = products;
        $scope.methods = methods;
        $scope.uploadProduct = function () {
          businesses.$add(createProductJson());
          $mdDialog.hide();
        };
        $scope.writePrice = function (product) {
          $scope.price = parseInt(product.product_price);
        };
      };
      var addProductCtrl = function ($scope, products) {
        var createProductKindJson = function () {
          return {
            'product_name': $scope.name,
            'product_price': $scope.price
          };
        };
        var updateFlag = false;
        console.log(products);
        $scope.products = products;
        $scope.modifyProduct = function (product) {
          $scope.updateProduct = product;
          $scope.name = product.product_name;
          $scope.price = product.product_price;
          updateFlag = true;
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.saveProduct = function () {
          if (updateFlag){
            products.$save($scope.updateProduct);
          }else{
            products.$add(createProductKindJson());
          }
          $mdDialog.hide();
        };
      };
      var paymentConfirmCtrl = function ($scope, $firebaseObject,
                                         selectedBusinesses, businesses) {
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
            if (item.$value === null){
              $scope.error = 'Invalid Secret.';
            }else{
              selectedBusinesses.forEach(confirmPayment);
              $mdDialog.cancel();
            }
          }else{
            $scope.error = 'You need at least select one record.';
          }
        }
        function error(){
          $scope.error = 'Invalid Secret.';
        }
        $scope.authorizeUser = function() {
          $firebaseObject(authorizeRef.child(
            $scope.secret)).$loaded().then(success, error);
        };
      };
      var deliveryConfirmCtrl = function ($scope, $firebaseObject,
                                          selectedBusinesses, businesses) {
        $scope.cancel = function () {
          $mdDialog.cancel();
        };

        function confirmDelivery(business){
          if (!business.delivered){
            business.delivered = new Date().toDateString();
            businesses.$save(business);
          }
        }
        function success(item){
          console.debug(item);
          if (selectedBusinesses.length > 0){
            if (item.$value === null){
              $scope.error = 'Invalid Secret.';
            }else{
              selectedBusinesses.forEach(confirmDelivery);
              $mdDialog.cancel();
            }
          }else{
            $scope.error = 'You need at least select one record.';
          }

        }
        function error(){
          $scope.error = 'Invalid Secret.';
        }
        $scope.authorizeUser = function() {
          $firebaseObject(authorizeRef.child(
            $scope.secret)).$loaded().then(success, error);
        };
      };
      businessCtrl.showDialogInventory = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: inventoryCtrl,
          templateUrl: 'templates/panel/business/business.create.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: useFullScreen
        });
      };
      businessCtrl.showDialogAddProduct = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: addProductCtrl,
          templateUrl: 'templates/panel/business/business.product.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses, products: products},
          fullscreen: useFullScreen
        });
      };
      businessCtrl.showDialogPaymentConfirmation = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: paymentConfirmCtrl,
          templateUrl: 'templates/panel/business/business.payment.confirm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses},
          fullscreen: useFullScreen
        });
      };
      businessCtrl.showDialogDeliveredConfirmation = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: deliveryConfirmCtrl,
          templateUrl: 'templates/panel/business/business.delivery.confirm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses},
          fullscreen: useFullScreen
        });
      };
    });
