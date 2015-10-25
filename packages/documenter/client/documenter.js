// helper functions to get the project name and build the URLs for the documentation and the writing of it
getCurrentProject = function () { return window.location.pathname.split("/")[1]; };
getCurrentProjectUrl = function () { return '/' + window.location.pathname.split("/")[1]; };
getCurrentProjectDocumentationUrl = function () { return getCurrentProjectUrl() + '/documentation'; };
getCurrentProjectDocumentationEditUrl = function () { return getCurrentProjectDocumentationUrl() + '/edit'; };

saveDocumentation = function(id) {
  var newContent = $('.froala-view').html();

  if (!_.isEqual(newContent, this.description)) {
    Documentations.update(id, {$set: {description: newContent}});
  }
};

// register events for the templates to go to the right URLs
Template.readDocumentation.events({
  "click #readDocumentation": function(event) {
    event.preventDefault();
    Router.go(getCurrentProjectDocumentationUrl());
  }
});

Template.writeDocumentation.events({
  "click #writeDocumentation": function(event) {
    event.preventDefault();

    $('.froala-view').attr('style', 'line-height: 150%;');

    Meteor.call('createDocumentation', getCurrentProject(), function() {});
    var edit = getCurrentProjectDocumentationEditUrl();
    Router.go(edit);
  }
});

Template.writeDocumentation.onRendered(function () {
  $('.froala-view').attr('style', 'line-height: 150%;');
});

Template.documentationEdit.events({
  "submit form": function(event){
    event.preventDefault();
    saveDocumentation(this._id);
  }
});

// routes to show the site for reading
Router.route("/:project/documentation", function () {
  this.render('documentation', {data: Documentations.findOne({project: this.params.project}) } );
}, {
  name: 'documentation'
});

// routes to show the site for editing
Router.route("/:project/documentation/edit", function () {
  this.render('documentationEdit', {data: Documentations.findOne({project: this.params.project}) });
}, {
  name: 'documentationEdit'
});

Meteor.subscribe("documentations");

/* Register keybinding for saving the changed document */
Meteor.startup(function() {
  $(window).bind('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        var proj = getCurrentProject();
        var id = Documentations.findOne({project: proj})._id;
        saveDocumentation(id);
        break;
      }
    }
  });
});
