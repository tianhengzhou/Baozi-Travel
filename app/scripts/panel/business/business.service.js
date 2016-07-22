/**
 * Created by tianheng on 7/6/16.
 */
"use strict";
angular.module('baoziApp')
    .factory('Businesses', function ($firebaseArray) {
      var businessRef = firebase.database().ref().child('businesses');
      // var meetups = $firebaseArray(ref);
      return {
        forBusiness: function () {
          return $firebaseArray(businessRef);
        },
        all: businessRef
      };
    })
    .factory('Inventories', function ($firebaseArray) {
      var inventoryRef = firebase.database().ref().child('inventories');
      return {
        forInventory: function () {
          return $firebaseArray(inventoryRef);
        },
        all: inventoryRef
      }

    });