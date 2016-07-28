/**
 * Created by tianhengzhou on 6/1/16.
 */
"use strict";
angular.module('baoziApp')
.factory('Methods', function ($firebaseArray) {
  var methodRef = firebase.database().ref().child('methods');
  return {
    forMethod: function (uid) {
      return $firebaseArray(methodRef.child(uid));
    },
    all: methodRef
  }

});
