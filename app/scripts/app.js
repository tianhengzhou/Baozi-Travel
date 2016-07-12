'use strict';

/**
 * @ngdoc overview
 * @name baoziApp
 * @description
 * # baoziApp
 *
 * Main module of the application.
 */
angular
  .module('baoziApp', [
    'ngMaterial',
    'ngMessages',
    'ngSanitize',
    'angular-md5',
    'firebase',
    'ui.router'
  ])
  .constant('FirebaseUrl', 'https://popping-heat-9212.firebaseio.com/')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'scripts/weather/weather.html',
        controller: 'WeatherCtrl as weather',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireAuth().then(function (auth) {
              $state.go('panel.profile');
            }, function (error) {
              console.log(error);
            });
          }
        }
      })
      .state('panel', {
        abstract: true,
        templateUrl: 'scripts/panel/panel.html',
        controller: 'PanelCtrl as panel',
        resolve:{
          auth: function ($state, Users, Auth) {
            // $requireAuth() resolve a promise successfully when a user is
            // authenticated and reject otherwise. promise.catch will catch the
            // rejection. catch is a shorthand for us if we don't want to
            // process the success handler.
            return Auth.$requireAuth().catch(function () {
              $state.go('home');
              console.log('No User');
            });
          }
        }
      })
      .state('panel.chat', {
        url: '/chat',
        templateUrl: 'scripts/panel/chat/chat.html',
        controller: 'ChatCtrl as chatCtrl',
        resolve:{
          channels: function (Channels) {
            return Channels.$loaded();
          },
          profile: function ($state, Auth, Users) {
            return Auth.$requireAuth().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              $state.go('home');
            });
          }
        }
      })
      .state('panel.chat.create', {
        url: '/create',
        templateUrl: 'scripts/panel/chat/create.html',
        controller: 'ChatCtrl as chatCtrl'
      })
      .state('panel.chat.messages', {
        url: '/{channelId}/messages',
        templateUrl: 'scripts/panel/chat/messages.html',
        controller: 'MessageCtrl as messageCtrl',
        resolve: {
          messages: function ($stateParams, Messages) {
            return Messages.forChannel($stateParams.channelId).$loaded();
          },
          channelName: function ($stateParams, channels) {
            return '#' + channels.$getRecord($stateParams.channelId).name;
          },
          isChannel: function () {
            return true;
          }
        }
      })
      .state('panel.chat.direct', {
        url: '/{uid}/messages/direct',
        templateUrl: 'scripts/panel/chat/messages.html',
        controller: 'MessageCtrl as messageCtrl',
        resolve: {
          messages: function ($stateParams, Messages, profile) {
            return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
          },
          channelName: function ($stateParams, Users) {
            return Users.all.$loaded().then(function () {
              return '@' + Users.getDisplayName($stateParams.uid);
            });
          },
          isChannel: function () {
            return false;
          }
        }
      })
      .state('panel.map', {
        url: '/map',
        templateUrl: 'scripts/panel/map/map.html',
        controller: 'MapCtrl as mapCtrl',
        resolve:{
          profile: function ($state, Auth, Users) {
            return Auth.$requireAuth().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              $state.go('home');
            });
          }
        }
      })
      .state('panel.meetup', {
        url: '/meetup',
        templateUrl: 'scripts/panel/meetup/meetup.html',
        controller: 'MeetupCtrl as meetupCtrl',
        resolve:{
          profile: function ($state, Auth, Users) {
            return Auth.$requireAuth().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              $state.go('home');
            });
          }
        }
      })
      .state('panel.blog', {
        url: '/blog',
        templateUrl: 'scripts/panel/chat/blog.html',
        controller: 'PanelCtrl as panel',
        parent: 'panel'
      })
      .state('panel.profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'scripts/panel/profile/profile.html',
        parent: 'panel',
        resolve: {
          auth: function ($state, Users, Auth) {
            // $requireAuth() resolve a promise successfully when a user is
            // authenticated and reject otherwise. promise.catch will catch the
            // rejection. catch is a shorthand for us if we don't want to
            // process the success handler.
            return Auth.$requireAuth().catch(function () {
              $state.go('home');
              console.log('No User');
            });
          },
          profile: function (Users, Auth) {
            return Auth.$requireAuth().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded();
            });
          }
        }
      });
  });
