/**
 * Created by tianhengzhou on 6/1/16.
 */
"use strict";
angular.module('baoziApp')
  .factory('Users', function ($firebaseArray, $firebaseObject) {
      var usersRef = firebase.database().ref().child('users');
      var connectedRef = firebase.database().ref().child('.info/connected');
      var users = $firebaseArray(usersRef);
    return {
      getProfile: function (uid) {
        return $firebaseObject(usersRef.child(uid));
      },
      getDisplayName: function (uid) {
        return users.$getRecord(uid).displayName;
      },
      getGravatar: function (uid) {
        return 'http://www.gravatar.com/avatar/'+ users.$getRecord(uid).emailHash;
      },
      setOnline: function (uid) {
        var connected = $firebaseObject(connectedRef);
        var online = $firebaseArray(usersRef.child(uid+'/online'));
        connected.$watch(function () {
            if(connected.$value === true){
                online.$add(true).then(function (connectedRef) {
                    connectedRef.onDisconnect().remove();
                });
            }
        });
      },
      all: users
    };
  });
