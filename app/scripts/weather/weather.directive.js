"use strict";

angular.module('baoziApp')
  .service('weatherService', function ($http) {
    var service = {
      curWeather: {},
      forecast: {},
      getWeather: function (location, units) {

        location = location || 'Sunnyvale,CA';
        if (service.curWeather[location]){
          return service.curWeather[location];
        }
        service.curWeather[location] = {
          temp : {},
          icon: "undefined"
        };
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+
          location + '&units=' + units + '&APPID=b253934bbcdd1b68251e3854cc389ca0')
          .success(function (data) {
            if (data){
              if (data.main) {
                service.curWeather[location].temp.current = data.main.temp;
                service.curWeather[location].temp.min = data.main.temp_min;
                service.curWeather[location].temp.max = data.main.temp_max;
              }
              service.curWeather[location].icon = data.weather[0].icon;
            }
          });
        return service.curWeather[location];
      },
      getForecast: function (location, units, days) {
        location = location || 'Sunnyvale, CA';
        if (service.forecast[location]){
          return service.forecast[location];
        }
        service.forecast[location] = {};
        $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' +
          location + '&units=' + units +
          '&cnt=' + days + '&APPID=b253934bbcdd1b68251e3854cc389ca0').success(
          function (data) {
          if (data) {
            angular.copy(data, service.forecast[location]);
          }
        });
        return service.forecast[location];
      }
    };
    return service;
  })
  .filter('temp', function ($filter) {
    return function (input, precision, units) {
      if (!precision){
        precision = 1;
      }
      var unitDisplay;
      switch (units) {
        case 'imperial':
          unitDisplay = 'F';
          input = 1.8*(input - 273)+32;
          break;
        case 'metric':
          unitDisplay = 'C';
          input = input - 273;
          break;
        default:
          unitDisplay = 'K';
          break;
      }
      var numfilter = $filter('number');
      return numfilter(input, precision) + '&deg;' + unitDisplay;
    };
  })
  .filter('temperature', function ($filter) {
    return function (input, precision, units) {
      if (!precision){
        precision = 1;
      }
      var unitDisplay;
      switch (units) {
        case 'imperial':
          unitDisplay = 'F';
          break;
        case 'metric':
          unitDisplay = 'C';
          break;
        default:
          unitDisplay = 'K';
          break;
      }
      var numfilter = $filter('number');
      return numfilter(input, precision) + '&deg;' + unitDisplay;
    };
  })
  .filter('daysNow', function () {
    return function (input) {
      return new moment().add(input, 'days').format('ddd MMM DD');
    };
  })
  .filter('daysInTheFuture', function () {
    return function (input) {
      return new moment().add(input, 'days').format('ddd');
    };
  })
  .directive('weatherForecast',function () {
    return {
      scope: {
        location: '@',
        units: '@?'
      },
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/weather/weatherForecast.tpl.html',
      link: function (scope) {
        scope.units = scope.units || 'metric';
      }
    };
  })
  .directive('weatherDisplayCard', function (weatherService) {
    return {
      scope: {
        location:'=',
        units: '='
      },
      restrict: 'E',
      replace: 'true',
      templateUrl: 'templates/weather/weatherDisplayCard.tpl.html',
      link: function (scope) {
        scope.findIndex = function (weatherObj) {
          return scope.forecast.list.indexOf(weatherObj);
        };
        scope.firstday = weatherService.getWeather(scope.location,
          scope.units);
        scope.forecast = weatherService.getForecast(scope.location,
          scope.units, '5');
      }
    };
  })
  .directive('weatherGoogleIcon', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        icon: '@',
        customSize: '@?'
      },
      link: function (scope) {
        scope.imgUrl = function () {
          var baseUrl = 'images/weathericon/';
          return baseUrl+ scope.icon+'.png';
        };
      },
      template: '<img style=\"height:{{customSize}}px;width:{{customSize}}px;\" class="md-card-image" ng-src=\"{{imgUrl()}}\">'
    };
  })
  .directive('weather', function () {
    return {
      templateUrl: 'templates/weather/weather.html',
      restrict: 'E',
      controller: 'WeatherController',
      controllerAs: 'weather',
      replace: true
    };
  });
