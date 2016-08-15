"use strict";

angular.module('baoziApp')
  .service('menu', function () {
    var sections = [];
    sections.push(
      {
        name: 'My Profile',
        link: 'panel.profile',
        icon: '&#xE55B;',
        awesome_icon: 'fa fa-user'
      },
      {
        name: 'Inventory Map',
        link: 'panel.map',
        icon: '&#xE55B;',
        awesome_icon: 'fa fa-map'
      },
      // {
      //   name: 'Meet Up',
      //   link: 'panel.meetup',
      //   icon: '&#xE8CB;',
      //   awesome_icon: 'fa fa-calendar'
      // },
      {
        name: 'Business',
        link: 'panel.business',
        icon: '&#xEB3F;',
        awesome_icon: 'fa fa-briefcase'
      },
      // {
      //   name: 'Travel Blog',
      //   link: 'panel.blog',
      //   icon: '&#xE87A;',
      //   awesome_icon: 'fa fa-suitcase'
      // },
      {
        name: 'Happy Chat',
        link: 'panel.chat',
        icon: '&#xE0B7;',
        awesome_icon: 'fa fa-comments'
      });
    return sections;
  })
  .directive('menuLink', function (menu) {
    return {
      scope:{
        section: '='
      },
      templateUrl: 'templates/components/menulink/menulink.html',
      restrict: 'E',
      controller: 'MenulinkController',
      controllerAs: 'menulink',
      replace: true,
      link: function (scope) {
        scope.menu = menu;
      }
    };
  })
  .directive('isActiveLink', function ($state) {
  return {
    restrict: 'A', //use as attribute
    replace: false,
    link: function (scope, elem) {
      var isActive = function () {
        var hrefs = ['#/' + $state.current.name.split('.')[1],
          '#' + $state.current.name.split('.')[1], //html5: false
          $state.current.name.split('.')[1]]; //html5: true
        //console.log(hrefs);
        angular.forEach(elem.find('a'), function (a) {
          a = angular.element(a);
          var kids = a.children();
          if (-1 !== hrefs.indexOf(a.attr('href'))) {
            kids.addClass('mdl-color-text--green-400').removeClass('mdl-color-text--blue-grey-400');
          } else {
            kids.removeClass('mdl-color-text--green-400').addClass('mdl-color-text--blue-grey-400');
          }
        });
      };
      scope.init = isActive;
      scope.init();
      //after the route has changed
      scope.$on("$stateChangeSuccess", isActive);
    }
  };
  });


