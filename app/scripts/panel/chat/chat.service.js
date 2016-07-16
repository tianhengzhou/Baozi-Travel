/**
 * Created by tianhengzhou on 6/8/16.
 */
"use strict";
angular.module('baoziApp')
  .factory('Channels', function ($firebaseArray) {
    var ref = firebase.database().ref().child('channels');
    var channels = $firebaseArray(ref);
    return channels;
  })
  .factory('Messages', function ($firebaseArray) {
    var channelMessagesRef = firebase.database().ref().child('channelMessages');
    var userMessagesRef = firebase.database().ref().child('userMessages');
    return {
      forChannel: function (channelId) {
        return $firebaseArray(channelMessagesRef.child(channelId));
      },
      forUsers: function (uid1, uid2) {
        var path = uid1 < uid2 ? uid1 + '/' + uid2 : uid2 + '/' + uid1;
        return $firebaseArray(userMessagesRef.child(path));
      }
    };
  });

