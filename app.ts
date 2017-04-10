/// <reference path="typings/index.d.ts" />

require([
    "dojo/dom-construct",
    "dojo/on",
    "esri/Map",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/layers/TileLayer",
    "dojo/domReady!"
], (domConstruct, on, Map, WebMap, MapView, Point, TileLayer) => {

    var highResImagery = new TileLayer({
        url: "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
    });

    var mainMap = new Map({
        layers: [highResImagery]
    });
	
    var randomLocation = getRandomLocation();

    if(locations){
	    randomLocation = locations[Math.floor(Math.random()*locations.length)];
    }
    
    var point = new Point({
        latitude: randomLocation[0],
        longitude: randomLocation[1]
    });

    var mainView = new MapView({
        container: "viewDiv",
        map: mainMap
    });

    var randomIcon = domConstruct.create("img", {
        src: "icons/shuffleEarth.png",
        id: "randomIcon",
        title: "randomIcon",
        class: "random-location"
    });

    mainView.ui.add(randomIcon, "top-left");

    on(randomIcon, "click", () => {
        let randomLocation = getRandomLocation();

        mainView.goTo({
            center: [randomLocation[1], randomLocation[0]],
            scale: 15000,
            heading: 0,
            tilt: 0
        });
    });
    
    mainView.then(() => {
        mainView.goTo({
            center: [point.longitude, point.latitude],
            scale: 15000,
            heading: 0,
            tilt: 0
        });
    });
});

function getRandomLocation(){
    if(!locations){
        return [21.26842, -11.109281];
    }

	return locations[Math.floor(Math.random()*locations.length)];
}