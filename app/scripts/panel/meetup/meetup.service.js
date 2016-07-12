/**
 * Created by tianheng on 7/6/16.
 */
"use strict";
angular.module('baoziApp')
  .factory('Meetups', function ($firebaseArray, FirebaseUrl) {
    var ref = new Firebase(FirebaseUrl+'meetups');
    var meetups = $firebaseArray(ref);
    return meetups;
  });