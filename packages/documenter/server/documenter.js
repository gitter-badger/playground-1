Meteor.publish('documentations', function (projectname) {
  return Documentations.find();
});
