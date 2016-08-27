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
    var blogCtrl = this;
    blogCtrl.blogs = blogs;
    console.log(blogCtrl.blogs);

    blogCtrl.host = profile.displayName;
    var typesCollection = {
      'Main Thread': [
        'Job',
        'Stock',
        'Ebiz',
        'Second Hand',
        'Immigration'
      ],
      'Shuati': [
        'LeetCode',
        '面经'
      ],
      'Travel': [
        '美国： 走遍美国',
        '中国： 大好河山'
      ],
      'Contact Developer': [
        'Bug Report',
        'Feature Request'
      ]
    };
    blogCtrl.types = Object.keys(typesCollection);
    console.debug(blogCtrl.types);
    var DialogCtrl = function ($scope) {
      var createBlogJson = function () {
        var content = (typeof $scope.content === 'undefined') ?
          '' : $scope.content;
        return {
          'title': $scope.title,
          'type': $scope.type,
          'subtype': $scope.subtype,
          'content': content,
          'createDate': (new Date()).getTime(),
          'createBy': profile
        };
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.host= profile.displayName;
      $scope.createPost = function () {
        Blogs.all.push(createBlogJson());
        $mdDialog.hide();
      };
      $scope.subtypeChooser = function (type) {
        return $scope.typesCollection[type];
      };
    };
    blogCtrl.showDialogPost = function (event) {
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
