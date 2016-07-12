/**
 * Created by tianhengzhou on 6/11/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('MessageCtrl', function ($mdMedia, profile, channelName,
                                       messages, isChannel) {
    var messageCtrl = this;
    messageCtrl.$mdMedia = $mdMedia;
    messageCtrl.messages = messages;
    messageCtrl.channelName = channelName;
    messageCtrl.message = '';
    messageCtrl.profile = profile;
    messageCtrl.isChannel = isChannel;
    messageCtrl.sendMessage = function () {
      if(messageCtrl.message.length > 0){
        messageCtrl.messages.$add({
          uid: profile.$id,
          body: messageCtrl.message,
          timestamp: Firebase.ServerValue.TIMESTAMP
        }).then(function () {
          messageCtrl.message = '';
        });
      }
      
    };
  });
