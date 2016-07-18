/**
 * Created by tianhengzhou on 6/1/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('ProfileCtrl', function ($state, md5, auth, profile) {
      var profileCtrl = this;
      profileCtrl.profile = profile;
      profileCtrl.updateProfile = function () {
        profileCtrl.profile.emailHash = md5.createHash(auth.email);
        profileCtrl.profile.$save();
      };
  });
