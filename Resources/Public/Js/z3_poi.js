/**
 * Javascript for tx_z3map
 * @type Array
 */
$.fn.extend({
	animateMap : function(mapid, begin, end, duration, fps){
		var $this = $(this);
		function easeInCubic (t, b, c, d) {
			return c*(t/=d)*t*t + b;
		}
		function easeOutCubic (t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		}

		var change = end - begin,
		interval = Math.ceil(1000/fps),
		totalFrames = Math.ceil(duration/interval),
		i = 0,
		timer = null;

		function countFrames(frame) {
			timer = setTimeout(function() {
				var height = easeInCubic(frame, begin, change, totalFrames);
				$this.height( height+'px');
				if (height == end) resizeMap(mapid);
			}, interval * frame);
		}
		while (++i <= totalFrames) {
			countFrames(i);
		}
	}
	
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
$('#map_canvas').bind("loadmap", function(){
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
//	//MarkerOptions
//	console.log( $this.attr['data-markeroptions']);
//	markerOptions[_id] = $.parseJSON( $this.data['markeroptions'] );
//	console.log(markerOptions[_id]);
	
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
	console.log(mapOptions[_id]);
	maps[_id] = new google.maps.Map(this, mapOptions[_id]);
	markers[_id] = [];
	mgr[_id] = new MarkerManager(maps[_id]);
	infoWindows[_id] = new google.maps.InfoWindow();
	
	//Listeners
	google.maps.event.addListener(mgr[_id], 'loaded', function(){
		if($('#'+_id).data('url') !== 'undefined'){
			setupMarkers(_id);
		}
		if( $('#'+_id).data('usecluster') > 0 ){
			clusters[_id] = new MarkerClusterer(maps[_id], markers[_id], clusterOptions[_id]);
		}
	});
	
	/**
	 * Drawing in Map
	 * */
	if($('#'+_id).hasClass('edittable')){
		// DOKU:
		//   https://developers.google.com/maps/documentation/javascript/drawing?hl=de
		
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
			drawingControl: false,
		});
		drawingManager.setMap(maps[_id]);
					
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		//	var path = event.overlay.getPath();
			var newPos = event.overlay.getPosition();
			console.log(newPos.lat());
			$("input[name='tx_skcpois_pois[newPoi][lat]']").val( newPos.lat() );
			console.log(newPos.lng());
			$("input[name='tx_skcpois_pois[newPoi][lng]']").val( newPos.lng() );
		});
		
	}
	
	
//	$('#cityfilter').change( function(){
//		reloadMarkers( _id );
//	});
	
	if( $('[data-id='+ _id +']').hasClass('map-is-overlay') ){
		$(this).animateMap(_id, 0, 396, 800, 30);
	}
	
}).bind("unloadmap", function(){
	$(this).empty().removeClass("maploaded").addClass("mapready");
});


$(document).ready(function(){
$('div.onload-init').trigger('loadmap');
	
//	$('form.listfilter').find('select').change(function(){
//		$(this).parents('form').submit();
//	});
});


/**
 *	
 */
//function getIcon(images) {
//	var icon = false;
//	if (images) {
//		if (icons[images[0]]) {
//			icon = icons[images[0]];
//		} else {
//			var iconImage = new google.maps.MarkerImage('images/' + images[0] + '.png',
//			new google.maps.Size(iconData[images[0]].width, iconData[images[0]].height),
//			new google.maps.Point(0,0),
//			new google.maps.Point(0, 32));
//			var iconShadow = new google.maps.MarkerImage('images/' + images[1] + '.png',
//			new google.maps.Size(iconData[images[1]].width, iconData[images[1]].height),
//			new google.maps.Point(0,0),
//			new google.maps.Point(0, 32));
//			var iconShape = {
//				coord: [1, 1, 1, 32, 32, 32, 32, 1],
//				type: 'poly'
//			};
//			icons[images[0]] = {
//				icon : iconImage,
//				shadow: iconShadow,
//				shape : iconShape
//			};
//		}
//	}
//	return icon;
//}

function setupMarkers(id) {
	//setup the markers
	var i = 0;
	$.ajax({
		url: $('#'+id).attr('data-url'),
		method: 'get',
		dataType: 'json',
		complete: function(data){
			var mapLayer = $.parseJSON(data.responseText);
			if(mapLayer !== null){
				while ( mapLayer.length > i ) {
					markers[id][i] = createMarker(id, mapLayer[i]) ;
					i++;
				}
			}
			
			mgr[id].addMarkers(markers[id], 0, 16);
			
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
	});
}




/**
 * 
 */
function createMarker(id, item) {
//	return false;
		//console.log(id, item, icon, type)

        markerOptions[id] = {
                position: new google.maps.LatLng(item['lat'], item['lng']),
                title: item['name'],
                //icon: markOpts_temp['icon']['url'],
                //anchor: new google.maps.Point( parseInt(markOpts_temp['icon']['anchor']['x']), parseInt(markOpts_temp['icon']['anchor']['y']) ),
        };
		
	
        var marker = new google.maps.Marker(markerOptions[id]);

//        google.maps.event.addListener(marker, 'click', function() {
//                //loadMapContent(id, marker, item['uid'], type);
//				//jump to the corresponding list entry
//				location.hash = "#partner-list-" +  item['uid'];
//        });
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

function loadMapContent(id, marker, uid, type){
	var $url = 'http://typo3.p212623.webspaceconfig.de/index.php?id=3&type=800000&tx_kchumbaurpartnersearch_partnersearch[json]=1'
	var op = '?';
	if($url.indexOf('?') > -1) op = '&';
	$url += op+'type=60000&no_cache=1&tx_fathaddresses_fathaddresses['+type+']='+uid+'&tx_fathaddresses_fathaddresses[action]=show&tx_fathaddresses_fathaddresses[controller]='+capitalize(type);

	$.ajax({
		url: $url,
		method: 'get',
		dataType: 'html',
		complete: function(data){
			//infoWindows[id].setContent(data.responseText);
			infoWindows[id].setContent('FOO');
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
//
//function resize() {
//  
//  var w = parseInt(mapdiv.style.width);
//  if ((isNaN(w)) || (w < 90)) {
//    animate(mapdiv, 79, 99, 300, 30);
//  }
//  else {
//    animate(mapdiv, 99, 79, 300, 30);
//  } 
//}
