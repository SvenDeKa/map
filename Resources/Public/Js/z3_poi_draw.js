
	function replaceAll(f, r, s) {
		console.log(f);
		return s.replace(new RegExp(f, 'g'), r);
	}
	var map;
	var drawingManager;
	function initialize() {
		var mapOptions = {
			center: new google.maps.LatLng(39.50561353673269, 2.751646041870117),
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('map_canvas'),mapOptions);
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYLINE,
			drawingControl: false,
			circleOptions: {
				fillColor: '#ffff00',
				fillOpacity: 1,
				strokeWeight: 5,
				clickable: false,
				editable: true,
				zIndex: 1
			}
		});
		drawingManager.setMap(map);
					
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		//	var path = event.overlay.getPath();
			var pathstr = event.overlay.getPath().b.toString();
			pathstr = replaceAll('\\\)\\\,\\\(',';', pathstr);
		//	pathstr = pathstr.replace( new RegExp(/\)\,\(/g,';') );
			pathstr = pathstr.replace(')','').replace('(','');
			
			$('#out').text(pathstr);
		});
	}
	google.maps.event.addDomListener(window, 'load', initialize);