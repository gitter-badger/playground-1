/// <reference path="google.maps.d.ts" />

interface googleMap {
	instance: google.maps.Map;
	options: google.maps.MapOptions;
}

declare module GoogleMaps {
	function loaded(): void;
	function load(): void;
	function ready(map: string, cb: (map: googleMap) => void): void;
	// var maps: google.maps.;
	
	module maps {
		module map {
			var instance;
		}
	}
}
