'use strict';

angular.module('app').controller('OrbViewController', OrbViewController);

orbLocationService.$inject = ['$scope', '$interval','$ionicPlatform', 'orbLocationService'];
function OrbViewController($scope, $interval, $ionicPlatform, orbLocationService) {
  var vm = this;

  let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};
  let compassAngle=0;
  let currentAngle = 0;
  let pauseDraw=false;
  vm.orbs = [];
  vm.coordinates={
    lon: 0,
    lat: 0
  };

  $ionicPlatform.ready(function() {
    console.log("orbViewCtrl.js: device ready - getting compass");
    var locationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, onError, watchPositionParams);
    var compassWatchID  = navigator.compass.watchHeading(compassSuccess, onError);
    draw();
  });

  function compassSuccess(heading) {
    $scope.$apply(function() {
      vm.compass = heading;
      if (pauseDraw == false) {
        compassAngle=parseInt(heading.magneticHeading)*Math.PI/180;
      };
    });
  }

  function geolocationSuccess(position) {
    $scope.$apply(function() {
      vm.coordinates={
        lon: position.coords.longitude,
        lat: position.coords.latitude
      };
    });
  }

  function onError(error) {
    console.log("Failed to fetch location");
    console.log(error);
  }

  function draw() {
    pauseDraw = true;
    let target = Math.atan2(Math.sin((compassAngle - currentAngle)), Math.cos((compassAngle - currentAngle)));

    if (target < 0 && Math.abs(target) > 0.01) {
      currentAngle -= 0.02;
    }else if (target >= 0 && Math.abs(target) > 0.01) {
      currentAngle += 0.02;
    };

    let canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let origon = {x: window.innerWidth/2, y:window.innerHeight/2};
    let ctx = canvas.getContext("2d");

    let maxSize = 20;
    let maxOpacity=1;

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-currentAngle);

    vm.orbs.forEach(function(orb) {
      let distance = Math.sqrt( (orb.x-origon.x)*(orb.x-origon.x) + (orb.y-origon.y)*(orb.y-origon.x) );
      drawCircle(ctx, orb.x, orb.y, scaleToDistance(maxSize,distance), scaleToDistance(maxOpacity,distance));
    });

    requestAnimationFrame(draw);
    pauseDraw=false;
  }

  function scaleToDistance(maxValue, distance){
    return maxValue-distance*(maxValue/window.innerHeight);
  }



  function drawCircle(ctx, x, y, radius, opacity){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.lineWidth=3;
    ctx.strokeStyle='rgba(255,255,255,'+opacity+')';
    ctx.stroke();
  }

  function refreshOrbs(){
    console.log("refreshing orbs");
    vm.orbs = orbLocationService.getNeighbourOrbs(vm.coordinates);
  }

  $interval(refreshOrbs, 5000);
}
