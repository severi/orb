'use strict';

angular.module('starter.controllers').controller('OrbViewCtrl', ['$scope','$ionicPlatform','$interval',
  function($scope, $ionicPlatform, $interval) {

    var tmpX =0;
    let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};

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

      draw(position.coords.longitude);
    };

    var compassSuccess = function(heading) {
      $scope.$apply(function() {
        $scope.compass = heading;
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
    }

    function draw() {
      //canvas initialization
      let canvas = document.getElementById("myCanvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      let ctx = canvas.getContext("2d");

      drawTest(ctx, canvas, $scope.coordinates.lon);
      drawCircle(ctx, tmpX,500,20, 1);
      drawCircle(ctx, 50,50,tmpX, 0.5);



    }
    $interval(function(){
      ++tmpX;
      draw();
      if (tmpX>window.innerWidth){
        tmpX=0;
      }
    }, 5);
  }


]);
