/**
 * Created by tianhengzhou on 8/24/16.
 */
/**
 * Created by tianheng on 6/24/16.
 */
"use strict";
angular.module('baoziApp')
  .controller('BlogCtrl', function($scope, $mdDialog, $firebaseObject, $mdMedia,
                                   profile, Blogs){
    var blogCtrl = this;
    blogCtrl.blogs = '';
    blogCtrl.profile = profile;
    // console.log(blogCtrl.blogs);

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
    blogCtrl.changeContent = function (type) {
      Blogs.forBlog(type.replace(' ', '').toLowerCase()).$loaded().then(
        function (blogs) {
          blogCtrl.blogs = blogs;
      })
    };
    function loadContent(){
      Blogs.forBlog('mainthread').$loaded().then(
        function (blogs) {
          blogCtrl.blogs = blogs;
          console.log(blogCtrl.blogs);
        })
    }
    loadContent();
    blogCtrl.types = Object.keys(typesCollection);
    console.debug(blogCtrl.types);
    var DialogCtrl = function ($scope, types, typesCollection, post) {
      $scope.types = types;
      $scope.title = post !== '' ? post.title : $scope.title;
      $scope.content = post !== '' ? post.content : $scope.content;
      var createBlogJson = function () {
        var content = (typeof $scope.content === 'undefined') ?
          '' : $scope.content;
        return {
          'title': $scope.title,
          'type': $scope.type,
          'subtype': $scope.subtype,
          'content': content,
          'createDate': (new Date()).getTime(),
          'createBy': profile.displayName
        };
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.host= profile.displayName;
      $scope.createPost = function () {
        console.log($scope.type.replace(' ', '').toLowerCase());
        Blogs.all.child($scope.type.replace(' ', '').toLowerCase()).push(createBlogJson());
        $mdDialog.hide();
      };
      $scope.updatePost = function () {
        console.log(post);
        post.title = $scope.title;
        post.content = $scope.content;
        blogCtrl.blogs.$save(post);
        $mdDialog.hide();
      };
      $scope.subtypeChooser = function (type) {
        $scope.subtypes = typesCollection[type];
      };
    };
    blogCtrl.showDialogEditPost = function (event, post) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: DialogCtrl,
        templateUrl: 'templates/panel/blog/blog.edit.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        locals: {
          types: blogCtrl.types,
          typesCollection: typesCollection,
          post: post
        },
        fullscreen: useFullScreen
      });
    };
    blogCtrl.showDialogAddPost = function (event) {
      var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
      $mdDialog.show({
        controller: DialogCtrl,
        templateUrl: 'templates/panel/blog/blog.create.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        locals: {
          types: blogCtrl.types,
          typesCollection: typesCollection,
          post: ''
        },
        fullscreen: useFullScreen
      });
    };
  });
