SharePoints = new UniCollection('sharepoints');
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

SharePoints.setSchema(new SimpleSchema({
  'name': {
    type: String,
    optional: true
  },
  'owner': {
    type: SimpleSchema.RegEx.Id
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
