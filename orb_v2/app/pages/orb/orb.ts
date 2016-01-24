import {Page, NavController, Platform, DomUtil} from 'ionic-framework/ionic'; // DomUtil not found..

/*
http://ionicframework.com/docs/v2/platform/push-notifications/
not working yet..

import {Geolocation, DeviceOrientation} from 'ngcordova';
*/

@Page({
    templateUrl: 'build/pages/orb/orb.html'
})
export class OrbPage {
    constructor(nav: NavController, platform: Platform) {
        this.nav = nav;
        this.platform = platform;

        this.compassAngle=0;
        this.watchPositionParams = { timeout: 1000, enableHighAccuracy: true , maximumAge:1000};  
        this.currentAngle = 0;
        this.pauseDraw=false;
        this.previousUpdate=undefined;
        this.orbs = [];
        this.coordinates = { lon: 0, lat: 0};
        this.initializePage();
    }

    initializePage(){
        this.platform.ready().then(() => {
            console.log('Platform ready');
            // var locationWatchId = Geolocation.watchPosition(geolocationSuccess, onError, watchPositionParams);
            // var compassWatchID  = DeviceOrientation.watchHeading(compassSuccess, onError);
     
            this.draw();
        });
    }

    compassSuccess(heading) {        
        this.compass = heading;
        var treshold = 3;
        var difference = Math.abs(this.compassAngle*180/Math.PI-heading.magneticHeading);
        if (pauseDraw == false && difference>treshold) {
            this.compassAngle=parseInt(heading.magneticHeading)*Math.PI/180;
        };
    }

    geolocationSuccess(position) {
        this.coordinates={
            lon: position.coords.longitude,
            lat: position.coords.latitude
        };
    }

    onError(error) {
        console.log("Failed to fetch location");
        console.log(error);
    }

    draw(){
        this.pauseDraw = true;

        let currentTime = Date.now();
        let delta= currentTime - this.previousUpdte;
        let step = 0.02*delta/20;
        let target = Math.atan2(Math.sin((this.compassAngle - this.currentAngle)), Math.cos((this.compassAngle - this.currentAngle)));

        if (target < 0 && Math.abs(target) > step) {
            this.currentAngle -= step;
        }else if (target >= 0 && Math.abs(target) > step) {
            this.currentAngle += step;
        };

        let canvas = document.getElementById("myCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let origon = {x: window.innerWidth/2, y:window.innerHeight/2};
        let ctx = canvas.getContext("2d");

        let maxSize = 20;
        let maxOpacity=1;

        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(-this.currentAngle);

        this.orbs.forEach(function(orb) {
            let distance = Math.sqrt( (orb.x-origon.x)*(orb.x-origon.x) + (orb.y-origon.y)*(orb.y-origon.x) );
            this.drawCircle(ctx, orb.x, orb.y, scaleToDistance(maxSize,distance), scaleToDistance(maxOpacity,distance));
        });

        this.previousUpdte = currentTime;
        //DomUtil.requestAnimationFrame(draw); // TODO: fix this
        this.pauseDraw=false;
    }

    drawCircle(ctx, x, y, radius, opacity){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.lineWidth=3;
        ctx.strokeStyle='rgba(255,255,255,'+opacity+')';
        ctx.stroke();
    }

    refreshOrbs(){
        //this.orbs = orbLocationService.getNeighbourOrbs(this.coordinates);
        this.orbs = getNeighbourOrbs(this.coordinates);   
    }

    getNeighbourOrbs(location){
        let orbs = [];
        orbs.push(new Orb(50,100));
        orbs.push(new Orb(-100,80));
        return orbs;
    }

//    $interval(refreshOrbs, 5000);
    
}
