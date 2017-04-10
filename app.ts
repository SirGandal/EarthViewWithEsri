/// <reference path="typings/index.d.ts" />

require([
    "dojo/dom-construct",
    "dojo/on",
    "esri/widgets/Print",
    "esri/tasks/PrintTask",
    "esri/tasks/support/PrintTemplate",
    "esri/tasks/support/PrintParameters",
    "esri/Map",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/geometry/Point",
    "esri/layers/TileLayer",
    "dojo/domReady!"
], (domConstruct, on, Print, PrintTask, PrintTemplate, PrintParameters, Map, WebMap, MapView, Point, TileLayer) => {

    const randomIconAnimationDuration = 560; // animation duration is 7 frames x 80 ms per frame

    const exportOptionDetectedResolution = {
        width: window.screen.availWidth,
        height: window.screen.availHeight,
        dpi: 96
    };

    const export4K = {
        width: 3840,
        height: 2160,
        dpi: 96
    };

    console.debug(`Screen resolution detected is ${exportOptionDetectedResolution.width} x ${exportOptionDetectedResolution.height}`);

    var highResImagery = new TileLayer({
        url: "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer"
    });

    var mainMap = new Map({
        layers: [highResImagery]
    });

    var randomLocation = getRandomLocation();

    if (locations) {
        randomLocation = locations[Math.floor(Math.random() * locations.length)];
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
        class: "random-location-image"
    });

    var downloadIcon = domConstruct.create("img", {
        src: "icons/downloadEarth.png",
        id: "downloadIcon",
        title: "downloadIcon",
        class: "download-image"
    });

    mainView.ui.add(randomIcon, "top-left");
    mainView.ui.add(downloadIcon, "top-left");

    on(randomIcon, "click", () => {
        let randomLocation = getRandomLocation();

        randomIcon.src = "icons/shuffleEarth_animation.gif";
        setTimeout(()=>{
            randomIcon.src = "icons/shuffleEarth.png";  
        }, randomIconAnimationDuration);

        mainView.goTo({
            center: [randomLocation[1], randomLocation[0]],
            scale: 15000,
            heading: 0,
            tilt: 0
        });
    });

    // alternatively: http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task
    var printServiceUrl = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";

    var print = new Print({
        view: mainView,
        printServiceUrl: printServiceUrl
    });

    var printTask = new PrintTask({
        url: printServiceUrl
    });

    //https://developers.arcgis.com/javascript/latest/api-reference/esri-tasks-support-PrintTemplate.html
    var template = new PrintTemplate({
        format: "png32",
        exportOptions: export4K,
        layout: "map-only",
        preserveScale: true
    });

    var params = new PrintParameters({
        view: mainView,
        template: template
    });

    var isDownloading = false;

    on(downloadIcon, "click", () => {
        if (isDownloading) {
            return;
        }
        var downloadInDetectedScreenResolution = confirm(`Download image in detected screen resolution (${exportOptionDetectedResolution.width} x ${exportOptionDetectedResolution.height})? 4K (${export4K.width} x ${export4K.height}) otherwise.`);

        if (downloadInDetectedScreenResolution) {
            template.exportOptions = exportOptionDetectedResolution;
        } else {
            template.exportOptions = export4K;
        }

        downloadIcon.src = "icons/downloadEarth_animation.gif";

        printTask.execute(params).then((printResult) => {
            isDownloading = false;
            downloadIcon.src = "icons/downloadEarth.png";
            console.log(printResult.url);
            downloadURI(printResult.url, `${point.longitude},${point.latitude}`);
        }, (printError) => {
            isDownloading = false;
            downloadIcon.src = "icons/downloadEarth.png";
            console.log(printError);
        });

        isDownloading = true;
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

function getRandomLocation() {
    if (!locations) {
        return [21.26842, -11.109281];
    }

    return locations[Math.floor(Math.random() * locations.length)];
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    // Note that changing the name of the download only happens on same origin URLs
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}