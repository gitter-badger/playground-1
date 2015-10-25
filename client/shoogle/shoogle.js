/* global $ */
/* global jQuery */
/* global Tracker */
/* global Template */
/* global GoogleMaps */
/* global google */
/* global Meteor */
/* global Shoogle */
/* global SharePoints */
// define and instanciate marker factory
var MarkerFactory = {
  create: function(docId, lat, lng, draggable, icon, map) {
    var marker = new google.maps.Marker({
      draggable: draggable,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      map: map.instance,
      icon: icon,
      id: docId
    });
    return marker;
  }
};

Shoogle = function(googleMap, userId) {
  var map = googleMap;
  this.ownId = userId;
  var markers = {};
  var infoWindows = {};

  this.updateOwnMarkers = function(userId) {
    // user is logged in
    if (userId) {
      this.ownId = userId;
      SharePoints.find({owner: this.ownId}).forEach(function (doc) {
        markers[doc._id].setMap(null);
        markers[doc._id] = createMarker(doc._id, this.ownId, doc.latitude, doc.longitude);
        infoWindows[doc._id] = createInfo(doc._id, markers[doc._id]);
      });
    // user is logged out
    } else {
      SharePoints.find({owner: this.ownId}).forEach(function (doc) {
        markers[doc._id].setMap(null);
        markers[doc._id] = createMarker(doc._id, this.ownId, doc.latitude, doc.longitude);
        infoWindows[doc._id] = createInfo(doc._id, markers[doc._id]);
        this.ownId = {};
      });
    }
  };

  this.getMap = function () {
    return map;
  };

  // Create a marker for given document
  var createMarker = function(docId, owner, lat, lng) {
    var pin_icon = {url: '/red_pin.png'};
    var drag_pin = false;
    if (owner === Meteor.userId()) {
      pin_icon = {url: '/green_pin.png'};
      drag_pin = true;
    }

    var marker = MarkerFactory.create(docId, lat, lng, drag_pin, pin_icon, map);

    // This listener lets us drag markers on the map and update their corresponding document.
    google.maps.event.addListener(marker, 'drag', function(event) {
      SharePoints.update(marker.id, {$set: {latitude: event.latLng.lat(), longitude: event.latLng.lng()} });
    });

    return marker;
  };

  this.saveName = function(id) {
    var doc = SharePoints.findOne(id);
    doc.name = $('#' + id).val();
    doc.save();

    infoWindows[id].setContent(doc.name);
  };

  // Create an info window
  // if the marker is the own marker and is already named, just print the content
  // if not named, print a form to give a name
  // else print the first 3 items of the sharepoint
  var createInfo = function(doc, marker) {
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
      maxWidth: 400,
      id: doc._id
    });
    infowindow.open(GoogleMaps.maps.map.instance, marker);

    return infowindow;
  };

  // add a marker on the map
  // owner: the person who inserted the marker
  // lat and lng: position on the map
  this.addMarker = function(doc) {
    // doc._id, doc.name, doc.owner, doc.latitude, doc.longitude
    markers[doc._id] = createMarker(doc._id, doc.owner, doc.latitude, doc.longitude);
    infoWindows[doc._id] = createInfo(doc, markers[doc._id]);
  };

  // delete marker from map and from array
  this.deleteMarker = function(id) {
    // Remove the marker from the map
    markers[id].setMap(null);

    // Clear the event listener
    google.maps.event.clearInstanceListeners(markers[id]);

    // Remove the reference to this marker instance
    delete infoWindows[id];
    delete markers[id];
  };

  this.changeMarker = function(markerId, lat, lng) {
    markers[markerId].setPosition({ lat: lat, lng: lng });
  };

  this.updateMarkers = function(userId) {
    SharePoints.find({ owner: userId }).forEach( function (doc) {

      // Remove the marker from the map
      markers[doc._id].setMap(null);

      markers[doc._id] = createMarker(doc._id, doc.owner, doc.latitude, doc.longitude);
      infoWindows[doc._id] = createInfo(doc._id, markers[doc._id]);
    });
  };
};

var shoogle = {};


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

Template.shoogle.onCreated(function() {
  GoogleMaps.ready('map', function (map) {

    // adds an isOpen function to every InfoWindow
    google.maps.InfoWindow.prototype.isOpen = function() {
        var map = this.getMap();
        return (map !== null && typeof map !== "undefined");
    };

    shoogle = new Shoogle(map, Meteor.userId());

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
          google.maps.event.addListener(map.instance, 'click', function(event) {
            SharePoints.insert({ owner: shoogle.ownId, latitude: event.latLng.lat(), longitude: event.latLng.lng() });
          });
        }
      } else {
        if (loggedIn === true) {
          google.maps.event.clearListeners(map.instance, 'click');
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

Template.item.rendered = function () {
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

Template.shoogle.events({
  "click .delete": function (event) {
     SharePoints.remove(this._id);
  },

  "click .goto": function (event) {
    shoogle.getMap().instance.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
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
            shoogle.getMap().instance.setCenter(results[0].geometry.location);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
  }
});

Template.shoogle.helpers({

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

Template.item.events({
  "submit form": function (event) {
    event.preventDefault();
    var doc = Template.parentData();
    this.name = event.target.itemname.value;
    this.description = $($(event.target).find('.froala-view')[0]).html();
    doc.save();
  },

  "click .edit-item": function (event) {
    var doc = Template.parentData();
  },

  "click .delete-item": function (event) {
    var doc = Template.parentData();
    var index = jQuery.inArray(this, doc.items);
    doc.items.splice(index, 1);
    doc.save();
  }
});
