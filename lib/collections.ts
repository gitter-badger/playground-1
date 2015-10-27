/// <reference path="../.typescript/all-definitions.d.ts" />

interface IItem {
  name: string;
  description: string;
}

interface ISharePoints {
  name: string;
  owner: string;
  items: [IItem];
  latitude: number;
  longitude: number;
}

declare var SharePoints: UniCollection<ISharePoints>;
SharePoints = new UniCollection<ISharePoints>('sharepoints');
SharePoints.allow({
  insert: function(userId, doc){
    // if user is logged in
    if (userId == Meteor.userId())
      return true;
    return false;
  },
  update: function(userId, doc, fieldNames, modifier){
    if (doc.owner === Meteor.userId())
      return true;
    return false;
  },
  remove: function(userId, doc){
    if (doc.owner === Meteor.userId())
      return true;
    return false;
  }
});

SharePoints.setSchema(new SimpleSchema<ISharePoints>({
  'name': {
    type: String,
    optional: true
  },
  'owner': {
    type: String
  },
  'items': {
    type: [Object],
    optional: true
  },
  'items.$.name': {
    type: String,
    optional: true
  },
  'items.$.description': {
    type: String,
    optional: true
  },
  'latitude': {
    type: Number,
    decimal: true,
    min: -90,
    max: 90
  },
  'longitude': {
    type: Number,
    decimal: true,
    min: -180,
    max: 180
  },
}));
