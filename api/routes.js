var bodyParser = require('body-parser');
var persistance = require('./controllers/persistance');

module.exports = function(router) {
  router.use(bodyParser.json());
  router.route('/game-persistance')
    .get(persistance.find);

  return router;
}