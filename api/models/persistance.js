module.exports = {
  find: function(models, sessionId, callback) {
    models.Session
      .findOne({_id: sessionId})
      .exec(function(err, session){
        if(err) return callback(err);
        if(!session) return callback('Session not found');
        session = JSON.parse(session.session);
        models.User.findOne({
          _id: session.passport.user
        })
        .populate('roles.student')
        .exec(function(err, user){
          if(err) return callback(err);
          callback(null, user.roles.student.persistance);
        });
      });
  },
  create: function(models, sessionId, state, callback) {
    models.Session
      .findOne({_id: sessionId})
      .exec(function(err, session){
        if(err) return callback(err);
        if(!session) return callback('Session not found');
        session = JSON.parse(session.session);
        models.User
          .findOne({
            _id: session.passport.user
          })
          .populate('roles.student')
          .exec(function(err, user){
            if(err) return callback(err);
            models.Student.update(
              {_id: user.roles.student._id}, 
              {persistance: state}, 
              function(err) {callback(err);}
            );
          });
      });
  }
}
