var users = [
      {name:"andre", email: 'andre.heber@gmx.net', password: 'andreheber', roles:['mdblog-author', 'admin']}
    ];

_.each(users, function (user) {
  var id = Meteor.users.findOne({username: user.name});

  // if the user does not exist, create an account
  if (id === undefined) {
    id = Accounts.createUser({
      username: user.name,
      email: user.email,
      password: user.password
    });
  }

  // if there are roles for the user
  if (user.roles.length > 0) {
    Roles.addUsersToRoles(id, user.roles, Roles.GLOBAL_GROUP);
  }
});
