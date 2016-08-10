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
          var map = {};
          angular.forEach(this.$list, function(entry) {
            if (entry.product in map){
              map[entry.product] += entry.quantity;
            }else{
              map[entry.product] = entry.quantity;
            }
          });
          return map;
        },
        sumP: function() {
          var map = {};
          angular.forEach(this.$list, function(entry) {
            if (entry.product in map){
              if (entry.paid){
                map[entry.product] += entry.quantity;
              }
            }else{
              if (entry.paid){
                map[entry.product] = entry.quantity;
              }
            }
          });
          return map;
        },
        sumD: function() {
          var map = {};
          angular.forEach(this.$list, function(entry) {
            if (entry.product in map){
              if (entry.delivered){
                map[entry.product] += entry.quantity;
              }
            }else{
              if (entry.delivered){
                map[entry.product] = entry.quantity;
              }
            }
          });
          return map;
        }
      });
    });