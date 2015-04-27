
var params;
//var map;
$(document).ready(function(){
	
	if( $('#map_canvas').length > 0){ //only init Map if there is a map-canvas.
            if (typeof google === "undefined") {
                lazyLoadGoogleMap();
            } else {
                // Map script is already loaded
                initializeMap();
            }
	}
	
});

function initializeMap() {
	var mapCanv = $('#map_canvas');
//        var mapCenter = getMapCenter(mapCanv);
//        mapCenter = '39.50561353673269, 2.751646041870117';
	var mapOptions = {
		center: getMapCenter(mapCanv),
		zoom: getMapZoom(mapCanv),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};        
        
	var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
       
}

/**
 * Load Map API (v3) asynchronously
 */
function lazyLoadGoogleMap() {
	$.getScript("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=initializeMap")
	
	.done(function (script, textStatus) {            
	//	alert("Google map script loaded successfully");
	})
	.fail(function (jqxhr, settings, ex) {
	//	alert("Could not load Google Map script: " + jqxhr);
	});
}


/**
 * get the initial map center
 */
function getMapCenter(mapCanv){    
    var cpt = mapCanv.data('center').split(',');
    cpt = new google.maps.LatLng(cpt[0],cpt[1]);
    return cpt;
}

/**
 * get the initial Zoom
 */
function getMapZoom(mapCanv){
    return mapCanv.data('zoom');
} 