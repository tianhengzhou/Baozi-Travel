/**
 * Created by tianheng on 7/6/16.
 */
"use strict";
angular.module('baoziApp')
    .factory('Businesses', function (ArrayWithSum) {
      var businessRef = firebase.database().ref().child('businesses');
      return {
        forBusiness: function () {
          return ArrayWithSum(businessRef);
        },
        all: businessRef
      };
    })
    .factory('Products', function ($firebaseArray) {
      var productRef = firebase.database().ref().child('products');
      return {
        forProduct: function () {
          return $firebaseArray(productRef);
        },
        all: productRef
      };
    })
    .factory("ArrayWithSum", function($firebaseArray) {
      return $firebaseArray.$extend({
        sum: function() {
          var total = 0;
          angular.forEach(this.$list, function() {
            total += 1;
          });
          return total;
        }
      });
    });