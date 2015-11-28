'use strict';

angular.module('starter.controllers').controller('OrbViewCtrl', ['$scope',
  function($scope) {
    let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};

    $scope.coordinates={
      lon: "position.coords.longitude",
      lat: "position.coords.latitude"
    };

    function onError(error) {
      console.log("Failed to fetch location");
      console.log(error);
    }

    var onSuccess = function(position) {
      $scope.$apply(function() {
        $scope.coordinates={
          lon: position.coords.longitude,
          lat: position.coords.latitude
        };
      });
    };

    let watchId = navigator.geolocation.watchPosition(onSuccess, onError, watchPositionParams);
  }

]);
