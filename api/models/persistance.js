module.exports = {
  find: function(models, sessionId, callback) {
    models.Session
      .findOne({_id: sessionId})
      .exec(function(err, session){
        session = JSON.parse(session.session);
        if(err) return callback(err);
        models.User.findOne({
          _id: session.passport.user
        })
        .populate('roles.student')
        .exec(function(err, user){
          if(err) return callback(err);
          callback(null, user.roles.student.persistance);
        });
      });
  }
}
