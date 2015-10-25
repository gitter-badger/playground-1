Package.describe({
  name: 'andreheber:documenter',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Document the projects on site. Adds a button to the menu for reading and one for writing.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use('ecmascript');
  api.use('iron:router');
  api.use('froala:editor-reactive');
  api.use('alanning:roles');
  api.use('mongo');
  api.use('templating');
  api.addFiles('client/documenter.html', 'client');
  api.addFiles('client/documenter.js', 'client');
  api.addFiles('lib/documenter.js');
  api.addFiles('server/documenter.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('andreheber:documenter');
  api.addFiles('documenter-tests.js');
});
