/// <reference path="../.typescript/all-definitions.d.ts" />
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
  // waitOn: function() { return Meteor.subscribe("posts"); }
});

// Router.route("/", {onBeforeAction: function() { Router.go("/playground"); }});
Router.route('/', function() {
  Router.go('/playground');
});

Router.route('/playground', function () {
  this.render('home');
});

Router.route('/blog', function () {
  this.render('blog');
});

Router.route("/shoogle", function () {
  this.render('shoogle');
});

Router.route('settings', function () {
  this.render('settings');
});

Router.route('chat', function () {
  this.render('chat');
});
