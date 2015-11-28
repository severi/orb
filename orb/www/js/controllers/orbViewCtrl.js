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

    var compassSuccess = function(heading) {
      $scope.$apply(function() {
        $scope.compass = heading;
      });
    };


    let locationWatchId = navigator.geolocation.watchPosition(onSuccess, onError, watchPositionParams);
    let compassWatchID  = navigator.compass.watchHeading(compassSuccess, onError);
//    navigator.compass.getCurrentHeading(compassSuccess, onError);
    // document.addEventListener("deviceready", onDeviceReady, false);
    // function onDeviceReady() {
    //   console.log("tsajajajjaja");
    //   console.log(navigator.compass);
    // }
  }

]);
