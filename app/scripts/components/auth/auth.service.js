/**
 * Created by tianhengzhou on 6/1/16.
 */
"use strict";
angular.module('baoziApp')
  .factory('Auth', function ($firebaseAuth) {
    return $firebaseAuth();
  });
