/// <reference path="../.typescript/all-definitions.d.ts" />
/// <reference path="../lib/collections.ts" />
Meteor.publish('sharepoints', function () {
  return SharePoints.find();
});

// Meteor.publish(null, function () {
//   return Meteor.roles.find({});
// });
