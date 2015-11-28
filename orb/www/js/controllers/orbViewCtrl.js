'use strict';

angular.module('starter.controllers').controller('OrbViewCtrl', ['$scope','$ionicPlatform',
  function($scope, $ionicPlatform) {
    let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};

    $scope.coordinates={
      lon: "position.coords.longitude",
      lat: "position.coords.latitude"
    };

    function onError(error) {
      console.log("Failed to fetch location");
      console.log(error);
    }

    var geolocationSuccess = function(position) {
      $scope.$apply(function() {
        $scope.coordinates={
          lon: position.coords.longitude,
          lat: position.coords.latitude
        };
      });
    };

    var compassSuccess = function(heading) {
      $scope.$apply(function() {
        $scope.compass = heading;
      });
    };

    $ionicPlatform.ready(function() {
      console.log("orbViewCtrl.js: device ready - getting compass");
      var compassWatchID  = navigator.compass.watchHeading(compassSuccess, onError);
    });
    let locationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, onError, watchPositionParams);
  }

]);
