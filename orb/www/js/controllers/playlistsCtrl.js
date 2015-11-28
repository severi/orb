'use strict';


angular.module('starter.controllers').controller('PlaylistsCtrl', ['$scope','$timeout','$interval',
  function($scope, $timeout, $interval) {
    // This provides Authentication context.
    $scope.playlists = [
      { title: 'Reggae', id: 1 },
      { title: 'Chill', id: 2 },
      { title: 'Dubstep', id: 3 },
      { title: 'Indie', id: 4 },
      { title: 'Rap', id: 5 },
      { title: 'Cowbell', id: 6 }
    ];
    let tmp =1;
    $scope.test={
      index: tmp,
      lon: "position.coords.longitude",
      lat: "position.coords.latitude"
    };
    let watchId = navigator.geolocation.watchPosition(function(position){
      tmp++;
      $scope.$apply(function() {


      $scope.test={
        index: tmp,
        lon: position.coords.longitude,
        lat: position.coords.latitude
      };
      });
    },function(){
      $scope.test="GAY";
    },{ timeout: 1000, enableHighAccuracy: true , maximumAge:1000});

    // $interval(function() {
    //   //tmp+=1;
    //   //$scope.playlists[0]={ title: 'Reggaeasdasdasdasd'+tmp, id: 7 };
    // }, 10);


  }

]);
