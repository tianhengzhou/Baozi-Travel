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
    'ui.router',
    'md.data.table',
    'uiGmapgoogle-maps'
  ])
  .config(function () {
    var config = {
      apiKey: "AIzaSyAI4HCemOw16WDwFWhjN7k443LF6PufuRM",
      authDomain: "zhenling-project.firebaseapp.com",
      databaseURL: "https://zhenling-project.firebaseio.com",
      storageBucket: ""
    };
    firebase.initializeApp(config);
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      event.preventDefault();
      $state.get('error').error = { code: error.code };
      return $state.go('error');
    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/weather/weather.html',
        controller: 'WeatherCtrl as weather',
        resolve: {
          requireNoAuth: function ($state, Auth) {
            return Auth.$requireSignIn()
              .then(function () {
              $state.go('panel.profile');
              }).catch(function (error) {
                console.error(error);
            });
          }
        }
      })
      .state('error', {
        url: '/error',
        resolve: {
          errorObj: [function () {
            return this.self.error;
          }]
        },
        controller: 'ErrorCtrl as errorCtrl',
        templateUrl: 'views/error.html' // displays an error message
      })
      .state('panel', {
        abstract: true,
        templateUrl: 'templates/panel/panel.html',
        controller: 'PanelCtrl as panel',
        resolve:{
          auth: function ($state, Users, Auth) {
            // $requireAuth() resolve a promise successfully when a user is
            // authenticated and reject otherwise. promise.catch will catch the
            // rejection. catch is a shorthand for us if we don't want to
            // process the success handler.
            return Auth.$requireSignIn().catch(function () {
              $state.go('home');
              console.error('No User');
            });
          }
        }
      })
      .state('panel.chat', {
        url: '/chat',
        templateUrl: 'templates/panel/chat/chat.html',
        controller: 'ChatCtrl as chatCtrl',
        resolve:{
          channels: function (Channels) {
            return Channels.$loaded();
          },
          profile: function ($state, Auth, Users) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Users.getProfile(firebaseUser.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              console.error(error);
              $state.go('home');
            });
          }
        }
      })
      .state('panel.chat.create', {
        url: '/create',
        templateUrl: 'templates/panel/chat/create.html',
        controller: 'ChatCtrl as chatCtrl'
      })
      .state('panel.chat.messages', {
        url: '/{channelId}/messages',
        templateUrl: 'templates/panel/chat/messages.html',
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
        templateUrl: 'templates/panel/chat/messages.html',
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
        templateUrl: 'templates/panel/map/map.html',
        controller: 'MapCtrl as mapCtrl',
        resolve:{
          profile: function ($state, Auth, Users) {
            return Auth.$requireSignIn().then(function (auth) {
              return Users.getProfile(auth.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              console.error(error);
              $state.go('home');
            });
          },
          businesses: function (Businesses) {
            return Businesses.forBusiness().$loaded();
          }
        }
      })
      .state('panel.meetup', {
        url: '/meetup',
        templateUrl: 'templates/panel/meetup/meetup.html',
        controller: 'MeetupCtrl as meetupCtrl',
        resolve:{
          profile: function ($state, Auth, Users) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Users.getProfile(firebaseUser.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              console.error(error);
              $state.go('home');
            });
          },
          meetups: function (Meetups) {
            return Meetups.forMeetup().$loaded();
          }
        }
      })

      .state('panel.business', {
        url: '/business',
        templateUrl: 'templates/panel/business/business.html',
        controller: 'BusinessCtrl as businessCtrl',
        resolve:{
          profile: function ($state, Auth, Users) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Users.getProfile(firebaseUser.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              console.log(error);
              $state.go('home');
            });
          },
          businesses: function (Businesses) {
            return Businesses.forBusiness().$loaded();
          },
          methods: function (Methods, Auth) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Methods.forMethod(firebaseUser.uid).$loaded();
            });
          },
          products: function (Products) {
            return Products.forProduct().$loaded();
          }
        }
      })
      .state('panel.blog', {
        url: '/blog',
        templateUrl: 'templates/panel/blog/blog.html',
        controller: 'BlogCtrl as blogCtrl',
        parent: 'panel',
        resolve:{
          profile: function ($state, Auth, Users) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Users.getProfile(firebaseUser.uid).$loaded().then(function (profile) {
                if (profile.displayName){
                  return profile;
                }else{
                  $state.go('panel.profile');
                }
              });
            }, function (error) {
              console.error(error);
              $state.go('home');
            });
          }
        }
      })
      .state('panel.profile', {
        url: '/profile',
        controller: 'ProfileCtrl as profileCtrl',
        templateUrl: 'templates/panel/profile/profile.html',
        parent: 'panel',
        resolve: {
          auth: function ($state, Auth) {
            // $requireAuth() resolve a promise successfully when a user is
            // authenticated and reject otherwise. promise.catch will catch the
            // rejection. catch is a shorthand for us if we don't want to
            // process the success handler.
            return Auth.$requireSignIn().catch(function () {
              $state.go('home');
              console.log('No User');
            });
          },
          profile: function (Users, Auth) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Users.getProfile(firebaseUser.uid).$loaded();
            });
          },
          methods: function (Methods, Auth) {
            return Auth.$requireSignIn().then(function (firebaseUser) {
              return Methods.forMethod(firebaseUser.uid).$loaded();
            });
          }
          //methods: function (Methods) {
          //  return Methods.forMethod().$loaded();
          //}
        }
      });
  });
