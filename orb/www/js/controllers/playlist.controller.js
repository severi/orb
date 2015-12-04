'use strict';

angular.module('app').controller('PlaylistController', PlaylistController);

function PlaylistController() {
  var vm = this;
  let tmp =1;
  vm.test = "moi";
  vm.geo = navigator.geolocation.watchPosition(function(position){
    tmp++;
    vm.test={
      index: tmp,
      lon: position.coords.longitude,
      lat: position.coords.latitude
    };
  },function(){
    vm.test="GAY";
  },{ timeout: 1000, enableHighAccuracy: true , maximumAge:1000});
}
