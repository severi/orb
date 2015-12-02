'use strict';

angular.module('starter.controllers').controller('OrbViewCtrl', ['$scope','$ionicPlatform','$interval',
  function($scope, $ionicPlatform, $interval) {

    let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};
    let compassAngle=0;
    let pauseDraw=false;

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
        if (Math.abs(parseInt(heading.magneticHeading)-compassAngle)>5 && pauseDraw==false){
          compassAngle=parseInt(heading.magneticHeading);
          pauseDraw=true;
          draw();
        }
      });
    };

    $ionicPlatform.ready(function() {
      console.log("orbViewCtrl.js: device ready - getting compass");
      var compassWatchID  = navigator.compass.watchHeading(compassSuccess, onError);
    });
    let locationWatchId = navigator.geolocation.watchPosition(geolocationSuccess, onError, watchPositionParams);


    function drawCircle(ctx, x, y, radius, opacity){
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2*Math.PI);
      ctx.lineWidth=3;
      ctx.strokeStyle='rgba(255,255,255,'+opacity+')';
      ctx.stroke();
    }

    function drawTest(ctx, canvas, longitude){
      //draw lines to canvas
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.strokeStyle="#FF0000";
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width, 0);
      ctx.lineTo(0, canvas.height);
      ctx.strokeStyle="#FF0000";
      ctx.stroke();

      //Other stuff
      ctx.font="30px Verdana";
      // Create gradient
      var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
      gradient.addColorStop("0","magenta");
      gradient.addColorStop("0.5","blue");
      gradient.addColorStop("1.0","red");
      // Fill with gradient
      ctx.strokeStyle=gradient;
      ctx.strokeText(longitude,10,50);
      pauseDraw=false;
    }

    function draw() {
      //canvas initialization
      let angleRadian = parseInt(compassAngle)*Math.PI/180;
      let canvas = document.getElementById("myCanvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      let origon = {x: window.innerWidth/2, y:window.innerHeight/2};
      let ctx = canvas.getContext("2d");

      drawTest(ctx, canvas, $scope.coordinates.lon);
      let distance = 140;
      let x = origon.x+Math.cos(angleRadian)*distance;
      let y= origon.y+Math.sin(angleRadian)*distance;
      drawCircle(ctx, x, y,20, 1);
      drawCircle(ctx, origon.x,origon.y, 20, 0.5);
    }
  }


]);
