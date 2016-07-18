/**
 * Created by tianheng on 7/16/16.
 */
"use strict";
angular
  .module('baoziApp')
  .controller('ErrorCtrl', function ($scope, errorObj) {
    var errorCtrl = this;
    errorCtrl.error = errorObj;
  });