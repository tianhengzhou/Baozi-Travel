/**
 * Created by tianheng on 7/6/16.
 */
"use strict";
angular.module('baoziApp')
  .factory('Meetups', function ($firebaseArray) {
    var ref = firebase.database().ref().child('meetups');
    var meetups = $firebaseArray(ref);
    return meetups;
  });