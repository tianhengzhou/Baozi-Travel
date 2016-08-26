/**
 * Created by tianhengzhou on 8/24/16.
 */
/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('BlogCtrl', function($scope, $mdDialog, $firebaseObject, $mdMedia,
                                   profile, blogs, Blogs){
    var meetupCtrl = this;
    meetupCtrl.blogs = blogs;
    console.log(meetupCtrl.blogs);

    meetupCtrl.host = profile.displayName;
    var DialogCtrl = function ($scope) {
      var createBlogJson = function () {
        var content = (typeof $scope.content === 'undefined') ?
          '' : $scope.content;
        return {
          'name': $scope.name,
          'host': $scope.host,
          'content': content,
          'createDate': (new Date()).getTime(),
          'createBy': profile.displayName
        };
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.host= profile.displayName;
      $scope.createEvent = function () {
        Blogs.all.push(createBlogJson());
        $mdDialog.hide();
      };
    };
    meetupCtrl.showDialog = function (event) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: DialogCtrl,
        templateUrl: 'templates/panel/blog/blog.create.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: useFullScreen
      });
    };
  });
