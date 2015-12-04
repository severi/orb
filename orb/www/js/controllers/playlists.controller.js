'use strict';

angular.module('app').controller('PlaylistsController', PlaylistsController);

function PlaylistsController($scope) {
  var vm = this;
  // This provides Authentication context.
  vm.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  let tmp =1;
  vm.test={
    index: tmp,
    lon: "position.coords.longitude",
    lat: "position.coords.latitude"
  };

  function onError(error) {
    vm.test="GAY";
  }

  var onSuccess = function(position) {
    tmp++;
    $scope.$apply(function() {
      vm.test={
        index: tmp,
        lon: position.coords.longitude,
        lat: position.coords.latitude
      };
    });
  };

  let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};
  let watchId = navigator.geolocation.watchPosition(onSuccess, onError, watchPositionParams);
}
