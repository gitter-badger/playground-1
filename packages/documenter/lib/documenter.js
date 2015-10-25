Documentations = new Mongo.Collection("documentations");
Documentations.allow({
  insert: function(){
    if ( !Roles.userIsInRole(Meteor.user(), 'admin') )
      return false;
    return true;
  },
  update: function(){
    if ( !Roles.userIsInRole(Meteor.user(), 'admin') )
      return false;
    return true;
  },
  remove: function(){
    if ( !Roles.userIsInRole(Meteor.user(), 'admin') )
      return false;
    return true;
  }
});
Documentations.deny({
  insert: function(){
    if ( Roles.userIsInRole(Meteor.user(), 'admin') )
      return false;
    return true;
  },
  update: function(){
    if ( Roles.userIsInRole(Meteor.user(), 'admin') )
      return false;
    return true;
  },
  remove: function(){
    if ( Roles.userIsInRole(Meteor.user(), 'admin') )
      return false;
    return true;
  }
});

Meteor.methods({
  createDocumentation: function (projectname) {
    if ( !Roles.userIsInRole(Meteor.user(), 'admin') ) {
      console.log("Sry, you can't create the documentation!");
      return;
    }

    var projectData = Documentations.findOne({project: projectname});

    if (projectData === undefined) {
      Documentations.insert({
          project: projectname,
          description: 'Description for ' + projectname
      });
    }
  }
});
