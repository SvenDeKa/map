/**
 * Javascript for tx_z3map
 * @type Array
 */
$.fn.extend({
	
});

$(document).ready(function(){
	$('div.map_canvas').trigger('loadmap');
});

var maps = [];
var mgr = [];
var markers = [];
var clusters = [];
var clusterOptions = [];
var cOpt_temp = [];
var markerOptions = [];
var mapOptions = [];
var infoWindows = [];

$('.map_canvas').bind("loadmap", function(){
	$(this).removeClass("mapready").addClass("maploaded");
	
	var $this = $(this);
	var _id = $this.attr('id');
	var center = new google.maps.LatLng($this.data('clat'), $this.data('clng'));
	var maptype;
	var mapcontrols = [];
	
	// Maptype
	if( $this.data('maptype') == 'satellite'){
		maptype = google.maps.MapTypeId.SATELLITE;
	}else if( $this.data('maptype') == 'roadmap'){
		maptype = google.maps.MapTypeId.ROADMAP;
	}else if( $this.data('maptype') == 'terrain'){
		maptype = google.maps.MapTypeId.TERRAIN;
	}else{
		maptype = google.maps.MapTypeId.HYBRID;
	}
	// Mapcontrols
	if($this.data('mapcontrols') == 'small'){
		mapcontrols['zoomSize'] = google.maps.ZoomControlStyle.SMALL;
	}else if($this.data('mapcontrols') == 'large'){
		mapcontrols['zoomSize'] = google.maps.ZoomControlStyle.LARGE;
	}else{
		mapcontrols['zoomSize'] = google.maps.ZoomControlStyle.DEFAULT;
	}
	
	// MapOptions
	mapOptions[_id] = {
		zoom: $this.data('initzoom'),
		minZoom: 0,//$this.data('minzoom'),
		maxZoom: 18,//$this.data('maxzoom'),
		center: center,
		streetViewControl: false,
		mapTypeControl: false,
		mapTypeId: maptype,
		zoomControls: true,
		zoomControlOptions: {
			style: mapcontrols['zoomSize'],
		}
	};
	if($this.data('scrollwheel') == 0){
		mapOptions[_id]['scrollwheel'] = false;
	}
	
	// use clustering or not
	if( $this.data('usecluster') > 0 ){
		cOpt_temp[_id] = $this.data('clusteroptions');
		clusterOptions[_id] = {
			gridSize: parseInt(cOpt_temp[_id]['gridSize']),
			styles: [{
				url: cOpt_temp[_id]['icon']['url'],
				height: parseInt(cOpt_temp[_id]['icon']['size']['height']),
				width:  parseInt(cOpt_temp[_id]['icon']['size']['width'])
			}]
		};
	}
	maps[_id] = new google.maps.Map(this, mapOptions[_id]);
	markers[_id] = [];
	mgr[_id] = new MarkerManager(maps[_id]);
	
	infoWindows[_id] = new google.maps.InfoWindow();
	
	//Listeners
	google.maps.event.addListener(mgr[_id], 'loaded', function(){
		
		setupMarkers(_id);

		if( $this.data('usecluster') > 0 ){
			clusters[_id] = new MarkerClusterer(maps[_id], markers[_id], clusterOptions[_id]);
		}
	});
	
	$(window).resize(function(){
		
	});
	
}).bind("unloadmap", function(){
	$(this).empty().removeClass("maploaded").addClass("mapready");
});




function setupMarkers(id) {
	//setup the markers	
	var dataUrl = $('#'+id).attr('data-url');
	var dataSrc = $('#'+id).attr('data-src');
	
	if(typeof dataSrc !== 'undefined' && dataSrc !== false){
		buildMarkers(id, dataSrc);
	}else{
		$.ajax({
			url: $('#'+id).attr('data-url'),
			method: 'get',
			dataType: 'json',
			complete: function(data){
				buildMarkers(id, data.responseText);
			}
		});
	}
}

function buildMarkers(id, jsonPois){

	var mapLayer = $.parseJSON(jsonPois);
	var i = 0;
	
	if(mapLayer !== null){
		while ( mapLayer.length > i ) {
			markers[id][i] = createMarker(id, mapLayer[i]) ;
			i++;
		}
	}

	mgr[id].addMarkers(markers[id], 0);

	//zoom map so all markers can be seen
	if (markers[id].length > 0) {
		var bounds = new google.maps.LatLngBounds();
		for (var j = 0; j < markers[id].length; j++) {
			bounds.extend (markers[id][j].position);
		}
		maps[id].fitBounds (bounds);
	}
	mgr[id].refresh();
	
}


/**
 * 
 */
function createMarker(id, item) {
	
        markerOptions[id] = {
                position: new google.maps.LatLng(item['lat'], item['lng']),
                title: item['name'],
				icon: new google.maps.MarkerImage('/typo3conf/ext/z3_map/Resources/Public/Icons/map_marker_53x77.png'),
				width: 53,
				height: 77,
                anchor: new google.maps.Point( 53, 77 ),
        };
	
        var marker = new google.maps.Marker(markerOptions[id]);
		
		var markerOnClick = $('#'+id).data('markeronclick');
		if(markerOnClick ==='infoWindow'){
			google.maps.event.addListener(marker, 'click', function() {
				console.log('clicked on marker!');
				loadMapContent(id, marker, item['uid']);
			});
		}
		if(markerOnClick ==='jumpTo'){
			google.maps.event.addListener(marker, 'click', function() {
				location.hash = "#poi-list-" +  item['uid'];
			});
		}
        return marker;
}


/**
 * 
 */
function showMarkers(id) {
	mgr[id].show();
//	updateStatus(mgr[id].getMarkerCount(maps[id].getZoom()));
}

/**
 * 
 */
function hideMarkers(id) {
	mgr[id].hide();
//	updateStatus(mgr[id].getMarkerCount(maps[id].getZoom()));
}

/**
 * 
 */
function deleteMarker(id) {
	var markerNum = parseInt(document.getElementById("markerNum").value);
	mgr[id].removeMarker(allmarkers[markerNum]);
//	updateStatus(mgr[id].getMarkerCount(map[id].getZoom()));
}

/**
 * 
 */
function clearMarkers(id) {
	mgr[id].clearMarkers();
//	updateStatus(mgr[id].getMarkerCount(maps[id].getZoom()));
}

/**
 * 
 */
function reloadMarkers(id) {
	
	//clear Markers
	for(var i=0; i < markers[id].length; i++) {
		markers[id][i].setMap(null);
	}
	markers[id] = [];
	mgr[id].clearMarkers();
	mgr[id] = new MarkerManager(maps[id]);
	
	//clear cluster
	if( $('#'+id).data('usecluster') > 0 ){ 
		clusters[id].clearMarkers();
	}
	//renew the map
	google.maps.event.addListener(mgr[id], 'loaded', function(){
		setupMarkers(id);
		
		
		if( $('#'+id).data('usecluster') > 0 ) {
			clusters[id] = new MarkerClusterer(maps[id], markers[id], clusterOptions[id]);
		}else{
			// fitBounds für Marker-Array
			var latlngbounds = new google.maps.LatLngBounds();
			for (var i = 0; i < markers[id].length; i++) {
			  latlngbounds.extend(markers[id][i]['position']);
			}
			if(markers[id].length > 0) maps[id].fitBounds(latlngbounds);
		}
		

	});
	

	
}

/**
 * 
 */
function updateStatus(html) {
	document.getElementById("status").innerHTML = html;
} 

/**
 * load the content for info-window
 */
function loadMapContent(id, marker, uid){
//	var $url = '/'
//	var op = '?';
//	if($url.indexOf('?') > -1) op = '&';
//	$url += op+'type=80001&no_cache=1&tx_z3map_map[poi]='+uid;
	console.log('loadMapContent');
	$.ajax({
		url: '/index.php',
		method: 'get',
		dataType: 'html',
		data: 'type=80001&tx_z3map_map[poi]='+uid,
		complete: function(data){
			infoWindows[id].setContent(data.responseText);
			infoWindows[id].open(maps[id], marker);
		}
	});
}

/**
 * uppercase the first letter
 */
function capitalize(string) {
	string = string.toLowerCase();
	return string.charAt(0).toUpperCase() + string.slice(1);
}


function resizeMap(id){
	var c = maps[id].getCenter();
	google.maps.event.trigger(maps[id], "resize");
	maps[id].setCenter(c); 
}
