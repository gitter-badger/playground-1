/// <reference path="../../.typescript/all-definitions.d.ts" />
/// <reference path="../../lib/collections.ts" />

declare interface addId { id: string; }
declare interface Marker {} ;

// define and instanciate marker factory
class MarkerFactory {
  static create (docId: string, lat: number, lng: number, draggable: boolean, icon: any, map: google.maps.Map) {
    var options: google.maps.MarkerOptions & addId = {
      draggable: draggable,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      map: map,
      icon: icon,
      id: docId
    };
    var marker = <google.maps.Marker & addId>new google.maps.Marker(options);
    
    return marker;
  }
};

class Shoogle {
  private markers: (google.maps.Marker & addId)[];
  private infoWindows: google.maps.InfoWindow[];
  constructor (public map: google.maps.Map, public ownId: string) {
    this.markers = [];
    this.infoWindows = [];
  }

  updateOwnMarkers (userId: string) {
    // user is logged in
    if (userId) {
      this.ownId = userId;
      SharePoints.find({owner: this.ownId}).forEach(function (doc) {
        this.markers[doc._id].setMap(null);
        this.markers[doc._id] = this.createMarker(doc._id, this.ownId, doc.latitude, doc.longitude);
        this.infoWindows[doc._id] = this.createInfo(doc._id, this.markers[doc._id]);
      });
    // user is logged out
    } else {
      SharePoints.find({owner: this.ownId}).forEach(function (doc) {
        this.markers[doc._id].setMap(null);
        this.markers[doc._id] = this.createMarker(doc._id, this.ownId, doc.latitude, doc.longitude);
        this.infoWindows[doc._id] = this.createInfo(doc._id, this.markers[doc._id]);
        this.ownId = {};
      });
    }
  };

  getMap() { return this.map; };

  // Create a marker for given document
  private createMarker (docId: string, owner: string, lat: number, lng: number) {
    var pin_icon = {url: '/red_pin.png'};
    var drag_pin = false;
    if (owner === Meteor.userId()) {
      pin_icon = {url: '/green_pin.png'};
      drag_pin = true;
    }

    var marker = MarkerFactory.create(docId, lat, lng, drag_pin, pin_icon, this.map);

    // This listener lets us drag markers on the map and update their corresponding document.
    google.maps.event.addListener(marker, 'drag', function(event) {
      SharePoints.update(marker.id, {$set: {latitude: event.latLng.lat(), longitude: event.latLng.lng()} });
    });

    return marker;
  };

  saveName (id) {
    var doc = SharePoints.findOne(id);
    doc.name = $('#' + id).val();
    doc.save();

    this.infoWindows[id].setContent(doc.name);
  };

  // Create an info window
  // if the marker is the own marker and is already named, just print the content
  // if not named, print a form to give a name
  // else print the first 3 items of the sharepoint
  private createInfo (doc, marker: google.maps.Marker & addId) {
    // doc._id, doc.name, doc.owner, doc.latitude, doc.longitude
    var content = '';
    var formInserted = false;



    if (doc.owner == Meteor.userId()) {
      if (doc.name) {
        content = doc.name;
      } else {
        content = '<form class="form-inline"><input type="text" id="' + doc._id + '" value="Home" class="form-control" /><div class="btn btn-default" onclick="shoogle.saveName(\'' + doc._id + '\')">Save</div></form>';
        formInserted = true;
      }
    } else {
      if (doc.items) {
        if (doc.items[0].name)
          content += doc.items[0].name + '<br>';
        if (doc.items[1].name)
          content += doc.items[1].name + '<br>';
        if (doc.items[2].name)
          content += doc.items[2].name + '<br>';
      }
    }
    
    var infowindow = new google.maps.InfoWindow({
      content: content,
      maxWidth: 400
    });
    infowindow.open(GoogleMaps.maps.map.instance, marker);

    return infowindow;
  };

  // add a marker on the map
  // owner: the person who inserted the marker
  // lat and lng: position on the map
  addMarker (doc) {
    // doc._id, doc.name, doc.owner, doc.latitude, doc.longitude
    this.markers[doc._id] = this.createMarker(doc._id, doc.owner, doc.latitude, doc.longitude);
    this.infoWindows[doc._id] = this.createInfo(doc, this.markers[doc._id]);
  };

  // delete marker from map and from array
  deleteMarker (id) {
    // Remove the marker from the map
    this.markers[id].setMap(null);

    // Clear the event listener
    google.maps.event.clearInstanceListeners(this.markers[id]);

    // Remove the reference to this marker instance
    delete this.infoWindows[id];
    delete this.markers[id];
  };

  changeMarker (markerId, lat, lng) {
    this.markers[markerId].setPosition({ lat: lat, lng: lng });
  };

  updateMarkers (userId) {
    SharePoints.find({ owner: userId }).forEach( function (doc) {

      // Remove the marker from the map
      this.markers[doc._id].setMap(null);

      this.markers[doc._id] = this.createMarker(doc._id, doc.owner, doc.latitude, doc.longitude);
      this.infoWindows[doc._id] = this.createInfo(doc._id, this.markers[doc._id]);
    });
  };
};

var shoogle: Shoogle;


SharePoints.find().observe({
  added: function (doc) {
    shoogle.addMarker(doc);
  },
  changed: function (doc) {
    shoogle.changeMarker(doc._id, doc.latitude, doc.longitude);
  },
  removed: function (doc) {
    shoogle.deleteMarker(doc._id);
  }
});

Template['shoogle'].onCreated(function() {
  GoogleMaps.ready('map', function (map) {

    // adds an isOpen function to every InfoWindow
    // function google.maps.InfoWindow.prototype.isOpen() {
    //     var map = shoogle.getMap();
    //     return (map !== null && typeof map !== "undefined");
    // };

    shoogle = new Shoogle(map.instance, Meteor.userId());

    // Get the data
    Meteor.subscribe("sharepoints");

    var loggedIn = false;
    Tracker.autorun(function(){
      if (Meteor.userId()) {
        if (loggedIn === false) {
          shoogle.ownId = Meteor.userId();
          loggedIn = true;

          // show the markers
          shoogle.updateOwnMarkers(shoogle.ownId);

          // can click on the map
          google.maps.event.addListener(map, 'click', function(event) {
            SharePoints.insert({ owner: shoogle.ownId, latitude: event.latLng.lat(), longitude: event.latLng.lng() });
          });
        }
      } else {
        if (loggedIn === true) {
          google.maps.event.clearListeners(map, 'click');
          loggedIn = false;

          // show the markers
          shoogle.updateOwnMarkers(shoogle.ownId);
          
        }

      }
    });
  });
});

Meteor.startup(function() {
  GoogleMaps.load();
});

Template['item'].rendered = function () {
  var editor = this.$('.edit-itemname');

  editor.editable({
    editInPopup: true
  });
  Meteor.setTimeout(function(){
    this.$('.edit-itemname').on('editable.contentChanged', function (e, editor) {
      var name = editor.getHTML();
      console.log("content changed");
    });
  }, 10000);

};

Template['shoogle'].events({
  "click .delete": function (event) {
     SharePoints.remove(this._id);
  },

  "click .goto": function (event) {
    shoogle.getMap().setCenter(new google.maps.LatLng(this.latitude, this.longitude));
  },

  "click .rename": function (event) {
    var node = $(event.target.parentNode).find('.itemname');
    var name = node.html();
    node.html('<form class="form-inline"><input type="text" id="' + this._id + '" value="Home" class="form-control" /><div class="btn btn-default" onclick="shoogle.saveName(\'' + this._id + '\')">Save</div></form>');
    console.log("rename");
  },

  "click .add-item": function (event) {
    if (!this.items) {
      this.items = [];
    }
    this.items.push({});
    this.save();
  },

  "click .search-item": function (event) {
    console.log("search-item");
  },

  "click .search-address": function (event) {
    var geocoder = new google.maps.Geocoder();
    var address = event.target.parentNode.children[0].children[0].children[0].value;
    console.log("address: " + address);
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            shoogle.getMap().setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
  }
});

Template['shoogle'].helpers({

  locations: function () {
    return SharePoints.find({owner: Meteor.userId()});
  },

  items: function () {
    return this.items;
  },

  mapOptions: function(){
    // Make sure the map api has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        panControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        center: new google.maps.LatLng(49.45203, 11.076),
      };
    }
  }
});

Template['item'].events({
  "submit form": function (event) {
    event.preventDefault();
    var doc = <ISharePoints & UniDoc>Template.parentData();
    this.name = event.target.itemname.value;
    this.description = $($(event.target).find('.froala-view')[0]).html();
    doc.save();
  },

  "click .edit-item": function (event) {
    var doc = Template.parentData();
  },

  "click .delete-item": function (event) {
    var doc = <ISharePoints & UniDoc>Template.parentData();
    var index = jQuery.inArray(this, doc.items);
    doc.items.splice(index, 1);
    doc.save();
  }
});
