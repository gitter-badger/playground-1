Meteor.publish('sharepoints', function () {
  return SharePoints.find();
});

Meteor.publish(null, function () {
  return Meteor.roles.find({});
});
