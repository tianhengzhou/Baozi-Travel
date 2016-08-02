/**
 * Created by tianhengzhou on 5/19/16.
 */
"use strict";

angular.module('baoziApp')
  .controller('AuthCtrl', function ($state, Auth, $firebaseAuth,
                                    $firebaseObject, md5) {
      var authCtrl = this;
      var ref =firebase.database().ref();
      authCtrl.user = {
        email: '',
        password: ''
      };
      authCtrl.login = function () {
        Auth.$signInWithEmailAndPassword(authCtrl.user.email,
          authCtrl.user.password).then(function (firebaseUser) {
          $state.go('panel.profile');

        }, function (err) {
          authCtrl.error = err;
        });
      };
      authCtrl.register = function () {
        Auth.$createUserWithEmailAndPassword(authCtrl.user.email,
          authCtrl.user.password).then(function (user) {
          ref.child('users').child(user.uid).set({
            displayName: authCtrl.user.email,
            emailHash: md5.createHash(authCtrl.user.email),
            mitbbsId: '',
            role: 'buyer'
          });
          ref.child('methods').child(user.uid).push().set({paymentMethods: ''});
         authCtrl.login();
        }).catch(function (error) {
          authCtrl.error = error;
        });
      };
  });
