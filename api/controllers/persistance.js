var persistanceModel = require('../models/persistance')

module.exports = {
  find: function(req, res) {
    persistanceModel.find(
      req.app.db.models, 
      req.query.session_id, 
      function(err, data) {

      var success = true;
      var message = '';
      if(err) {
        success = false;
        message = err;
      }
      if(!data) data = {};
      res.json({
        success: success,
        persistance: data,
        message: message
      });
    });
  },
  create: function(req, res) {
    persistanceModel.create(
      req.app.db.models, 
      req.body.session_id, 
      req.body.state, 
      function(err) {

      var success = true;
      var message = '';
      if(err) {
        success = false;
        message = err;
      }
      res.json({
        success: success,
        message: message
      });
    });
  }
}
