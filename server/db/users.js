var db = require('./config.js');


var User = db.Model.extend({
  tableName: 'users'
});

var Users = db.Collection.extend({
  model: User
});

