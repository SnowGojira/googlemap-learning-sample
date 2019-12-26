let model = {
    API_KEY: "AIzaSyB9cFpEapXB_PkLQ4eLW5I5IzIJCJ-HSiQ",
    enablePoly: false,
    currentPoly:null,
    currentLoc:null,
    distanceResponse:null,
    center:{
        lat: 40.7413549, lng: -73.9980244
    },
    zoom: 13,
    locations:[
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ],
    map: null,
    markers:[],
    placesMarkers:[],
    style:[
        {
            "featureType": "administrative.locality",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#2c2e33"
                },
                {
                    "saturation": 7
                },
                {
                    "lightness": 19
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ffffff"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#ffffff"
                },
                {
                    "saturation": -100
                },
                {
                    "lightness": 100
                },
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#bbc0c4"
                },
                {
                    "saturation": -93
                },
                {
                    "lightness": 31
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "hue": "#bbc0c4"
                },
                {
                    "saturation": -93
                },
                {
                    "lightness": 31
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
                {
                    "hue": "#bbc0c4"
                },
                {
                    "saturation": -93
                },
                {
                    "lightness": -2
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#e9ebed"
                },
                {
                    "saturation": -90
                },
                {
                    "lightness": -8
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#e9ebed"
                },
                {
                    "saturation": 10
                },
                {
                    "lightness": 69
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "hue": "#e9ebed"
                },
                {
                    "saturation": -78
                },
                {
                    "lightness": 67
                },
                {
                    "visibility": "simplified"
                }
            ]
        }
    ],
    infowindows: []
};

let octopus = {
    init: function () {
        MapView.init();
        ListView.init()
    },
    getPoly:function(){
        return model.currentPoly;
    },
    setPoly:function(poly){
        model.currentPoly = poly;
    },
    getInfowindows:function(){
        return model.infowindows;
    },
    resetInfowindows:function(){
        model.infowindows = [];
    },
    setInfowindow:function(infowindow){
        model.infowindows.push(infowindow);
    },
    toggleLabel: function(){
        let map = octopus.getCurrentMap();
        let polygon = octopus.getPoly();
        if(model.enablePoly){
            //
            ListView.toggleManager(null);
            if (polygon !== null) {
                polygon.setMap(null);
                octopus.setPoly(polygon);
            }
            model.enablePoly = false;
        }else{
            //
            ListView.toggleManager(map);
            model.enablePoly =true;
        }
    },
    getCurrentMap: function () {
        return model.map;
    },
    getStyle: function () {
        return model.style;
    },
    setMarker: function (marker) {
        model.markers.push(marker);
    },
    getMarkers: function () {
        return model.markers;
    },
    setPlacesMarker: function (marker) {
        model.placesMarkers.push(marker);
    },
    getPlacesMarkers: function () {
        return model.placesMarkers;
    },
    setDistanceResponse: function (response) {
        model.distanceResponse=response;
    },
    getDistanceResponse: function () {
        return model.distanceResponse;
    },
    setCurrentMap: function (map) {
        model.map = map;
    },

    getTitle: function () {
        return model.title;
    },
    getCenter: function () {
        return model.center;
    },
    getZoom: function () {
        return model.zoom;
    },
    getLocations: function () {
        return model.locations;
    },

};

let MapView = {
    init:function () {
        let map = new google.maps.Map(document.getElementById('map'), {
            center: octopus.getCenter(),
            zoom: octopus.getZoom(),
            styles:octopus.getStyle(),
            mapTypeControl: false
        });
        octopus.setCurrentMap(map);
        this.renderMarkers();
    },
    renderMarkers:function () {
        let self = MapView;
        //弹窗
        let infowindow = new google.maps.InfoWindow();

        const defaultIcon = self.markerIcon('6bb5f9'),
          highlightedIcon = self.markerIcon('ec7f27');

        locations = octopus.getLocations();
        locations.forEach((element)=>{
            let marker = new google.maps.Marker({
                position:element.location,
                title:element.title,
                icon:defaultIcon,
                animation: google.maps.Animation.DROP
            });
            marker.addListener('click',function () {
                self.popInfo(marker,infowindow);
            });

            marker.addListener('mouseover', function() {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
            });

            octopus.setMarker(marker);
        });

    },
    popInfo:function(marker,info){
        // Check to make sure the infowindow is not already opened on this marker.
        if (info.marker !== marker) {
            info.setContent('');
            info.marker = marker;

            MapView.streetService(info,marker.position,marker.title);

            info.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            info.addListener('closeclick',function(){
                info.setMarker = null;
            });
        }
    },
    markerIcon:function (color) {
        return new google.maps.MarkerImage(
            `http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|${color}|40|_|%E2%80%A2`,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
    },
    streetService: function(infowindow,position,title){

        let streetViewService = new google.maps.StreetViewService();
        let radius = 50;

        function getStreetView(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                let nowLocation = data.location.latLng;
                var panoramaOptions = {
                    position: nowLocation,
                    pov: {
                        heading: google.maps.geometry.spherical.computeHeading(nowLocation, position),
                        pitch: 30
                    }
                };

                infowindow.setContent('<div>' + title + '</div><div id="pano"></div>');
                var panorama = new google.maps.StreetViewPanorama( document.getElementById('pano')
                    , panoramaOptions);
            } else {
                infowindow.setContent('<div>' + title + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }

        streetViewService.getPanoramaByLocation(position, radius, getStreetView);
    }
};

let ListView = {
    init:function () {
        //init dom element
        this.showListBtn = document.getElementById("show-listings");
        this.hideListBtn = document.getElementById("hide-listings");
        this.toggleDrawBtn = document.getElementById("toggle-drawing");
        this.zoomBtn = document.getElementById('zoom-to-area');
        this.zoomInput = document.getElementById('zoom-to-area-text');
        this.searchDistanceBtn = document.getElementById('search-within-time');
        this.searchDistanceInput = document.getElementById('search-within-time-text');
        this.modeSelector=document.getElementById('mode');
        this.maxDuration = document.getElementById('max-duration');

        //get lint to the model
        this.markers = octopus.getMarkers();
        this.map = octopus.getCurrentMap();
        //init the service
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT,
                drawingModes: [
                    google.maps.drawing.OverlayType.POLYGON
                ]
            }
        });
        this.geocoder = new google.maps.Geocoder();
        this.distanceMatrixService = new google.maps.DistanceMatrixService;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            polylineOptions: {
                strokeColor: 'green'
            }
        });
        // autocomplete service
        if(this.map !== null) {
            let timeAutocomplete = new google.maps.places.Autocomplete(this.searchDistanceInput);
            let zoomAutocomplete = new google.maps.places.Autocomplete(this.zoomInput);
            timeAutocomplete.bindTo('bounds', this.map);
            zoomAutocomplete.bindTo('bounds', this.map);
        }
        //search box
        this.searchBox = new google.maps.places.SearchBox(
            document.getElementById('places-search'));
        // Bias the searchbox to within the bounds of the map.
        //todo 12-25-2019
        // the hideList need to change
        this.searchBox.bindTo('bounds', this.map);
        this.searchBox.setBounds(this.map.getBounds());
        this.searchBox.addListener('places_changed', function() {
            ListView.searchBoxPlaces();
        });

        this.handleEvent();

    },
    searchBoxPlaces:function () {
        let searchBox = ListView.searchBox;
        //hideMarkers(placeMarkers);
        var places = searchBox.getPlaces();
        // For each place, get the icon, name and location.
        ListView.createMarkersForPlaces(places);
        if (places.length === 0) {
            window.alert('We did not find any places matching that search!');
        }
    },
    textSearchPlaces:function () {
        let map = octopus.getCurrentMap();
        var bounds = map.getBounds();
        //hideMarkers(placeMarkers);
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
            query: document.getElementById('places-search').value,
            bounds: bounds
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                ListView.createMarkersForPlaces(results);
            }
        });
    },
    createMarkersForPlaces:function (places) {
        let map = octopus.getCurrentMap();
        var bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < places.length; i++) {
            let place = places[i];
            let icon = {
                url: place.icon,
                size: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                id: place.id
            });
            // If a marker is clicked, do a place details search on it in the next function.
            marker.addListener('click', function() {
                ListView.getPlacesDetails(this, place);
            });
            octopus.setPlacesMarker(marker);
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        }
        map.fitBounds(bounds);
    },
    getPlacesDetails:function (marker, infowindow) {
        let map = octopus.getCurrentMap();
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: marker.id
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Set the marker property on this infowindow so it isn't created again.
                infowindow.marker = marker;
                var innerHTML = '<div>';
                if (place.name) {
                    innerHTML += '<strong>' + place.name + '</strong>';
                }
                if (place.formatted_address) {
                    innerHTML += '<br>' + place.formatted_address;
                }
                if (place.formatted_phone_number) {
                    innerHTML += '<br>' + place.formatted_phone_number;
                }
                if (place.opening_hours) {
                    innerHTML += '<br><br><strong>Hours:</strong><br>' +
                        place.opening_hours.weekday_text[0] + '<br>' +
                        place.opening_hours.weekday_text[1] + '<br>' +
                        place.opening_hours.weekday_text[2] + '<br>' +
                        place.opening_hours.weekday_text[3] + '<br>' +
                        place.opening_hours.weekday_text[4] + '<br>' +
                        place.opening_hours.weekday_text[5] + '<br>' +
                        place.opening_hours.weekday_text[6];
                }
                if (place.photos) {
                    innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                    {maxHeight: 100, maxWidth: 200}) + '">';
                }
                innerHTML += '</div>';
                infowindow.setContent(innerHTML);
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
            }
        });
    },
    handleEvent:function(){
        this.showListBtn.addEventListener('click',ListView.showList);
        this.hideListBtn.addEventListener('click', ListView.hideList);

        this.toggleDrawBtn.addEventListener('click',function () {
            octopus.toggleLabel();
        });

        this.zoomBtn.addEventListener('click', function() {
            ListView.zoomToArea();
        });

        this.searchDistanceBtn.addEventListener('click', function() {
            let infowindowArr = octopus.getInfowindows() || null;

            console.log(infowindowArr);

            if(infowindowArr !== null && infowindowArr !== [] &&infowindowArr !==undefined){
                console.log("not empty");
                infowindowArr.forEach(window =>{
                    window.close();
                });
                octopus.resetInfowindows();
            }

            ListView.searchWithinDistance();
        });

        document.getElementById('go-places').addEventListener('click', ListView.textSearchPlaces);

    },
    showList:function(){
        let markers = octopus.getMarkers();
        let map = octopus.getCurrentMap();

        markers.forEach(element =>{
            element.setMap(map);
        });
    },
    hideList:function(){

        let markers = octopus.getMarkers();
        markers.forEach((element) =>{
            element.setMap(null);
        });
    },
    toggleManager:function(map){

        let polygon = octopus.getPoly();
        let drawingManager = this.drawingManager;

        drawingManager.setMap(map);

        drawingManager.addListener('overlaycomplete', function(event) {

            drawingManager.setDrawingMode(null);

            polygon = event.overlay;
            polygon.setEditable(true);
            octopus.setPoly(polygon);

            // Searching within the polygon.
            ListView.searchPolyMatchPoints();
            polygon.getPath().addListener('set_at', ListView.searchMatchPoints);
            polygon.getPath().addListener('insert_at', ListView.searchMatchPoints);

        });

    },
    searchPolyMatchPoints:function(){
        let map = octopus.getCurrentMap();
        let markers = octopus.getMarkers();
        let polygon = octopus.getPoly();

        markers.forEach((element)=>{
            if (google.maps.geometry.poly.containsLocation(element.position, polygon)) {
                element.setMap(map);
            } else {
                element.setMap(null);
            }
        });

        octopus.setPoly(polygon);
    },
    calculateAreaWithPoly:function(polygon){
        let area = google.maps.geometry.spherical.computeArea(polygon.getPath());

        console.log("area",area);
    },
    zoomToArea:function () {
        let map = this.map;
        let geocoder = this.geocoder;
        // Get the address or place that the user entered.
        let address = this.zoomInput.value;
        // Make sure the address isn't blank.
        if (address == '') {
            window.alert('You must enter an area, or address.');
        } else {
            // Geocode the address/area entered to get the center. Then, center the map
            // on it and zoom in
            geocoder.geocode(
                {
                    address: address,
                    componentRestrictions: {locality: 'New York'}
                }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        //results[0]一串结果中最match的结果
                        map.setCenter(results[0].geometry.location);
                        map.setZoom(15);

                        octopus.setCurrentMap(map);
                    } else {
                        window.alert('We could not find that location - try entering a more' +
                            ' specific place.');
                    }
                });
        }
    },
    searchWithinDistance:function () {
       //Initialize the distance matrix service.
        let distanceMatrixService = this.distanceMatrixService;
        let address = this.searchDistanceInput.value;
        let markers = this.markers;

        // Check to make sure the place entered isn't blank.
        if (address === '') {
            window.alert('You must enter an address.');
        } else {
            ListView.hideList();
            // Use the distance matrix service to calculate the duration of the
            // routes between all our markers, and the destination address entered
            // by the user. Then put all the origins into an origin matrix.
            var origins = markers.map(element => element.position);

            var destination = address;
            // var mode = document.getElementById('mode').value;
            var mode = this.modeSelector.value;
            // Now that both the origins and destination are defined, get all the
            // info for the distances between them.
            distanceMatrixService.getDistanceMatrix({
                origins: origins,
                destinations: [destination],
                travelMode: google.maps.TravelMode[mode],
                unitSystem: google.maps.UnitSystem.IMPERIAL,
            }, function(response, status) {
                octopus.setDistanceResponse(response);
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    window.alert('Error was: ' + status);
                } else {
                    ListView.displayMarkersWithinDistance();
                }
            });
        }
    },
    displayMarkersWithinDistance:function () {
        let response = octopus.getDistanceResponse();
        let maxDuration = this.maxDuration.value;
        let origins = response.originAddresses;
        let map = this.map;
        let markers = this.markers;


        // Parse through the results, and get the distance and duration of each.
        // Because there might be  multiple origins and destinations we have a nested loop
        // Then, make sure at least 1 result was found.
        let atLeastOne = false;


        origins.forEach((origin,i)=>{
            let results = response.rows[i].elements;
            // let object = {};
            results.forEach( element =>{
                if (element.status === "OK") {
                    // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
                    // the function to show markers within a user-entered DISTANCE, we would need the
                    // value for distance, but for now we only need the text.
                    var distanceText = element.distance.text;
                    // Duration value is given in seconds so we make it MINUTES. We need both the value
                    // and the text.
                    var duration = element.duration.value / 60;
                    var durationText = element.duration.text;


                    if (duration <= maxDuration) {
                        atLeastOne = true;
                        //octopus.setInfoLabel(false);

                        // object.index = i;

                        let infowindow =  new google.maps.InfoWindow();
                        infowindow.setContent(
                            `${durationText} away, ${distanceText}`+
                            '<div><input type=\"button\" value=\"View Route\" onclick =' +
                            '\"ListView.displayDirections(&quot;' + origin + '&quot;);\"></input></div>'
                        );

                        markers[i].setMap(map);
                        // Create a mini infowindow to open immediately and contain the
                        // distance and duration

                        infowindow.open(map, markers[i]);
                        // Put this in so that this small window closes if the user clicks
                        // the marker, when the big infowindow opens

                        //this sentence maybe has no function
                        markers[i].infowindow = infowindow;
                        google.maps.event.addListener(markers[i], 'click', function () {
                            this.infowindow.close();
                        });

                        octopus.setInfowindow(infowindow);
                    }
                }
            });
        });

        if (!atLeastOne) {
            window.alert('We could not find any locations within that distance!');
        }
    },

    displayDirections:function (origin) {
        ListView.hideList();
        let directionsDisplay = this.directionsDisplay;


        let map = this.map;
        let directionsService = this.directionsService;
        // Get the destination address from the user entered value.
        var destinationAddress = this.searchDistanceInput.value;
        // Get mode again from the user entered value.
        var mode = this.modeSelector.value;
        directionsService.route({
        // The origin is the passed in marker's position.
        origin: origin,
        // The destination is user entered address.
        destination: destinationAddress,
        travelMode: google.maps.TravelMode[mode]
    }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setMap(map);
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

}




function initMap() {
    octopus.init();

}
