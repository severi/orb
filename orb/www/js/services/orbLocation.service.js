'use strict';

angular.module('app').factory('orbLocationService', orbLocationService);

orbLocationService.$inject = ['$http'];
function orbLocationService($http){
  var service = {
    getNeighbourOrbs: getNeighbourOrbs
  }

  return service;

  function getNeighbourOrbs(location){
    let orbs = [];
    orbs.push(new Orb(50,100));
    orbs.push(new Orb(-100,80));
    return orbs;
  }

}
