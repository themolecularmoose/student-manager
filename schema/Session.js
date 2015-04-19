'use strict';

exports = module.exports = function(app, mongoose) {
  var sessionSchema = new mongoose.Schema({
    _id: {type: String},
    session: {type: String}
  });
  app.db.model('Session', sessionSchema);
};
