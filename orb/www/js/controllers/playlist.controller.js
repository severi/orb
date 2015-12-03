'use strict';

angular.module('app').controller('PlaylistController', ['$scope',
  function($scope) {
    let tmp =1;
    $scope.test = "moi";
    $scope.geo = navigator.geolocation.watchPosition(function(position){
      tmp++;
      $scope.test={
        index: tmp,
        lon: position.coords.longitude,
        lat: position.coords.latitude
      };
    },function(){
      $scope.test="GAY";
    },{ timeout: 1000, enableHighAccuracy: true , maximumAge:1000});
  }
]);
