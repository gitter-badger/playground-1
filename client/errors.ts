/// <reference path="../.typescript/all-definitions.d.ts" />

// Local (client-side) Collection
// declare var Errors: Mongo.Collection<string>;
// Errors = new Mongo.Collection<string>(null);

// declare var throwError: {(message: string): void};
// throwError = function(message) {
//   Errors.insert({message: message});
// };

// Template['errors'].helpers({
//   errors: function() {
//     return Errors.find();
//   }
// });

// Template['errors'].onRendered(function() {
//   var error = this.data;
//   Meteor.setTimeout(function(){
//      Errors.remove(error._id);
//   }, 3000);
// });
