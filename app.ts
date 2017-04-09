/// <reference path="typings/index.d.ts" />

require([
    "esri/Map",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/layers/TileLayer",
    "dojo/domReady!"
], function (Map, WebMap, MapView, Point, TileLayer) {

    var highResImagery = new TileLayer({
        url: "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
    });

    var mainMap = new Map({
        layers: [highResImagery]
    });
	
    var randomLocation = [21.26842, -11.109281];

    var point = new Point({
        latitude: randomLocation[0],
        longitude: randomLocation[1]
    });

    var mainView = new MapView({
        container: "viewDiv",
        map: mainMap
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