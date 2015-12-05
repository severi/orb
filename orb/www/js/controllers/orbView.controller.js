'use strict';

angular.module('app').controller('OrbViewController', OrbViewController);

function OrbViewController($scope, $ionicPlatform) {
  var vm = this;

  let watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};
  let compassAngle=0;
  let currentAngle = 0;
  let pauseDraw=false;

  let orbs = [];
  orbs.push(new Orb(50,100));
  orbs.push(new Orb(-100,80));

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
      compassAngle=parseInt(heading.magneticHeading)*Math.PI/180;
      // if (pauseDraw==false){
      //   compassAngle=parseInt(heading.magneticHeading);
      //   pauseDraw=true;
        //draw();
      //}
    });
  }

  function geolocationSuccess(position) {
    // $scope.$apply(function() {
    //   vm.coordinates={
    //     lon: position.coords.longitude,
    //     lat: position.coords.latitude
    //   };
    // });
  }

  function onError(error) {
    console.log("Failed to fetch location");
    console.log(error);
  }

  function draw() {
    //canvas initialization
    //let currentAngle = -parseInt(compassAngle)*Math.PI/180;
    $scope.$apply(function() {
      vm.coordinates={
        lon: currentAngle,
        lat: "jee"
      };
    });

    
    let CCV = 2*Math.PI - compassAngle + currentAngle;
    let CV = compassAngle - currentAngle;
    let step = 0.01;

    if(CCV > CV){
      currentAngle -= step;
    }else{
      currentAngle += step;
    }

    if (Math.abs(currentAngle - compassAngle) < 1.5*step) {
      currentAngle = compassAngle;
      console.log("eka");
    };

    if (Math.abs(compassAngle - currentAngle) < 1.5*step) {
      currentAngle = compassAngle;
      console.log("toka");
    };
    // if (currentAngle < -2*Math.PI) {
    //   currentAngle += 2*Math.PI;
    // };

    // if (currentAngle > 0) {
    //   currentAngle -= 2*Math.PI;
    // };

    let canvas = document.getElementById("myCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let origon = {x: window.innerWidth/2, y:window.innerHeight/2};
    let ctx = canvas.getContext("2d");

    let maxSize = 20;
    let maxOpacity=1;
    

    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(-currentAngle);

    orbs.forEach(function(orb) {
      let distance = Math.sqrt( (orb.x-origon.x)*(orb.x-origon.x) + (orb.y-origon.y)*(orb.y-origon.x) );
      drawCircle(ctx, orb.x, orb.y, scaleToDistance(maxSize,distance), scaleToDistance(maxOpacity,distance));
    });

    //drawCircle(ctx, 0, 0, 20, 100);
    //drawCircle(ctx, 200, 20, 20, 100);
    //drawCircle(ctx, 300, 10, 20, 100);


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
}
