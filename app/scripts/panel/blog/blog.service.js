/**
 * Created by tianhengzhou on 8/24/16.
 */
"use strict";
angular.module('baoziApp')
  .factory('Blogs', function ($firebaseArray) {
    var blogRef = firebase.database().ref().child('blogs');
    return {
      forBlog: function () {
        return $firebaseArray(blogRef);
      },
      all: blogRef
    };
  });