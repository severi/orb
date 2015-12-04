'use strict';

angular.module('app').controller('OrbViewController', OrbViewController);

function OrbViewController($scope, $ionicPlatform) {
  var vm = this;

  let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};
  let compassAngle=0;
  let pauseDraw=false;

  let orbs = [];
  orbs.push(new Orb(100,200));
  orbs.push(new Orb(100,600));

  vm.coordinates={
    lon: 0,
    lat: 0
  };

  $ionicPlatform.ready(function() {
    console.log("orbViewCtrl.js: device ready - getting compass");
    var locationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, onError, watchPositionParams);
    var compassWatchID  = navigator.compass.watchHeading(compassSuccess, onError);
  });

  function compassSuccess(heading) {
    $scope.$apply(function() {
      vm.compass = heading;
      if (pauseDraw==false){
        compassAngle=parseInt(heading.magneticHeading);
        pauseDraw=true;
        draw();
      }
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
    //canvas initialization
    let angleRadian = -parseInt(compassAngle)*Math.PI/180;
    let canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let origon = {x: window.innerWidth/2, y:window.innerHeight/2};
    let ctx = canvas.getContext("2d");

    let maxSize = 20;
    let maxOpacity=1;
    orbs.forEach(function(orb) {
      let x = origon.x + (orb.x-origon.x)*Math.cos(angleRadian) - (orb.y-origon.y)*Math.sin(angleRadian);
      let y = origon.y + (orb.x-origon.x)*Math.sin(angleRadian) + (orb.y-origon.y)*Math.cos(angleRadian);
      let distance = Math.sqrt( (orb.x-origon.x)*(orb.x-origon.x) + (orb.y-origon.y)*(orb.y-origon.x) );
      drawCircle(ctx, x, y, scaleToDistance(maxSize,distance), scaleToDistance(maxOpacity,distance));
    });

    //    requestAnimationFrame(draw);
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
}
