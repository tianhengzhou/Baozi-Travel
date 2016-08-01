/**
 * Created by tianheng on 7/6/16.
 */
"use strict";
angular.module('baoziApp')
    .factory('Businesses', function ($firebaseArray) {
      var businessRef = firebase.database().ref().child('businesses');
      return {
        forBusiness: function () {
          return $firebaseArray(businessRef);
        },
        all: businessRef
      };
    });
