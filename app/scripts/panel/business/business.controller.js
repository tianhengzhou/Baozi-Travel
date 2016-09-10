/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
    .controller('BusinessCtrl', function($element, $scope, $mdDialog, $firebaseObject,
                                         $mdMedia, $firebaseArray, $window, profile,
                                         businesses, methods, products){
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
      // $scope.logItem = function (item) {
      //   console.debug(item.$id, 'was selected');
      // };
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
      var DialogCtrl = function ($scope, $firebaseObject, selectedBusinesses,
                                 businesses, confirmTarget) {
        var createProductJson = function () {
          return {
            'mitbbsId': $scope.mitbbsId,
            'product': $scope.product,
            'price': $scope.price,
            'quantity': $scope.quantity,
            'location': $scope.location,
            'detailLoc': $scope.detailLoc,
            'zipCode': $scope.zipCode,
            'paymentMethod': $scope.paymentMethod,
            'paid': false,
            'delivered': false
          };
        };
        var createProductKindJson = function () {
          return {
            'product_name': $scope.name,
            'product_price': $scope.price
          };
        };
        var updateFlag = false;
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.mitbbsId= profile.mitbbsId;
        $scope.products = products;
        $scope.methods = methods;
        $scope.confirmTarget = confirmTarget;
        $scope.uploadProduct = function () {
          businesses.$add(createProductJson());
          $mdDialog.hide();
        };
        $scope.writePrice = function (product) {
          $scope.price = parseInt(product.product_price);
        };
        $scope.modifyProduct = function (product) {
          $scope.updateProduct = product;
          $scope.name = product.product_name;
          $scope.price = product.product_price;
          updateFlag = true;
        };
        $scope.saveProduct = function () {
          if (updateFlag){
            $scope.updateProduct.product_name = $scope.name;
            $scope.updateProduct.product_price = $scope.price;
            products.$save($scope.updateProduct);
          }else{
            products.$add(createProductKindJson());
          }
          $mdDialog.hide();
        };
        function Confirm(business) {
          if ($scope.confirmTarget === 'payment'){
            if (!business.paid){
              business.paid = new Date().toDateString();
              businesses.$save(business);
            }
          }else if ($scope.confirmTarget === 'delivery'){
            if (!business.delivered){
              business.delivered = new Date().toDateString();
              businesses.$save(business);
            }
          }
        }
        function success(item){
          if (selectedBusinesses.length > 0){
            if (item.$value === null){
              $scope.error = 'Invalid Secret.';
            }else{
              selectedBusinesses.forEach(Confirm);
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
      function onResize() {
        businessCtrl.listStyle.height = ($window.innerHeight * 0.6) + 'px';
        if (!$scope.$root.$$phase){
          $scope.$digest();
        }
      }
      businessCtrl.showDialogInventory = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: DialogCtrl,
          templateUrl: 'templates/panel/business/business.create.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses, products: products, confirmTarget: ''},
          fullscreen: useFullScreen
        });
      };
      businessCtrl.showDialogAddProduct = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: DialogCtrl,
          templateUrl: 'templates/panel/business/business.product.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses, products: products, confirmTarget: ''},
          fullscreen: useFullScreen
        });
      };
      businessCtrl.showDialogPaymentConfirmation = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: DialogCtrl,
          templateUrl: 'templates/panel/business/business.payment.confirm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses, confirmTarget: 'payment'},
          fullscreen: useFullScreen
        });
      };
      businessCtrl.showDialogDeliveredConfirmation = function (event) {
        var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
        $mdDialog.show({
          controller: DialogCtrl,
          templateUrl: 'templates/panel/business/business.delivery.confirm.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          locals: { selectedBusinesses: $scope.selected ,
            businesses: $scope.businesses, confirmTarget: 'delivery'},
          fullscreen: useFullScreen
        });
      };
      businessCtrl.createDummyData = function (amount) {
        for (var i = 0; i < amount; i++){
          businesses.$add({
            'mitbbsId': 'DummyID',
            'product': 'Dummy IPad',
            'price': '100',
            'quantity': 1,
            'location': 'Dummy Place',
            'detailLoc': [-79.893168 + Math.random()*10, 177.177594 + Math.random()*10],
            'zipCode': '00000',
            'paymentMethod': 'Dummy method',
            'paid': false,
            'delivered': false
          });
        }
      };
      businessCtrl.listStyle = {
        height: ($window.innerHeight * 0.6) + 'px'
      };
      $window.addEventListener('resize', onResize);
    });
