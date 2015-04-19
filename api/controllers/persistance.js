var persistanceModel = require('../models/persistance')

module.exports = {
  find: function(req, res) {
    persistanceModel.find(req.app.db.models, req.query.session_id, function(err, data) {
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
  }
}
