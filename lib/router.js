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
}, {
  name: 'home'
});

Router.route('/blog', function () {
  this.render('blog');
}, {
  name: 'blog'
});

Router.route("/shoogle", function () {
  this.render('shoogle');
}, {
  name: 'shoogle'
});

Router.route('settings', function () {
  this.render('settings');
}, {
  name: 'settings'
});

Router.route('chat', function () {
  this.render('chat');
}, {
  name: 'chat'
});
